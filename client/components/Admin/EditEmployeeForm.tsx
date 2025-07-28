"use client";
import React, { useState, useEffect } from "react";
import {
    User,
    Mail,
    Lock,
    Building,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    Upload,
    Eye,
    EyeOff,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EditEmployeeFormProps {
    isOpen: boolean;
    onClose: () => void;
    employee: {
        id: string;
        name: string;
        email: string;
        position?: string;
        department?: string;
        phone?: string;
        address?: string;
        dateOfJoining?: string;
        dateOfBirth?: string;
        salary?: number;
        profilePicture?: string;
    };
}

interface EmployeeFormData {
    employeeId: string;
    name: string;
    email: string;
    password: string;
    position: string;
    department: string;
    phone: string;
    address: string;
    dateOfJoining: string;
    dateOfBirth: string;
    salary: string;
    profilePicture: File | null;
}

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({ isOpen, onClose, employee }) => {
    const [formData, setFormData] = useState<EmployeeFormData>({
        employeeId: employee.id,
        name: "",
        email: "",
        password: "",
        position: "",
        department: "",
        phone: "",
        address: "",
        dateOfJoining: "",
        dateOfBirth: "",
        salary: "",
        profilePicture: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (employee) {
            setFormData({
                employeeId: employee.id || "",
                name: employee.name || "",
                email: employee.email || "",
                password: "",
                position: employee.position || "",
                department: employee.department || "",
                phone: employee.phone || "",
                address: employee.address || "",
                dateOfJoining: employee.dateOfJoining ? employee.dateOfJoining.slice(0, 10) : "",
                dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : "",
                salary: employee.salary ? employee.salary.toString() : "",
                profilePicture: null,
            });
            setPreviewImage(employee.profilePicture || null);
        }
    }, [employee]);

    const updateEmployeeMutation = useMutation({
        mutationFn: async (data: EmployeeFormData) => {
            if (!API_URL) {
                throw new Error("NEXT_PUBLIC_API_URL is not defined.");
            }

            const formDataToSend = new FormData();
            formDataToSend.append("employeeId", data.employeeId);
            formDataToSend.append("name", data.name);
            formDataToSend.append("email", data.email);
            if (data.password) {
                formDataToSend.append("password", data.password);
            }
            formDataToSend.append("position", data.position);
            formDataToSend.append("department", data.department);
            formDataToSend.append("phone", data.phone);
            formDataToSend.append("address", data.address);
            formDataToSend.append("dateOfJoining", data.dateOfJoining);
            formDataToSend.append("dateOfBirth", data.dateOfBirth);
            formDataToSend.append("salary", data.salary);

            if (data.profilePicture) {
                formDataToSend.append("profilePicture", data.profilePicture);
            }

            const response = await fetch(`${API_URL}/employee/update`, {
                headers: {
                    "Authorization": `Bearer ${GetCookie()}`,
                },
                method: "PUT",
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update employee");
            }

            return response.json();
        },
        onSuccess: () => {
            toast.success("Employee updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["employees"] });
            handleClose();
        },
        onError: (error) => {
            console.error("Update employee error:", error.message);
            toast.error(`Failed to update employee: ${error.message}`);
        },
    });

    const handleInputChange = (field: keyof EmployeeFormData, value: string | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            handleInputChange("profilePicture", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClose = () => {
        setFormData({
            employeeId: employee.id,
            name: "",
            email: "",
            password: "",
            position: "",
            department: "",
            phone: "",
            address: "",
            dateOfJoining: "",
            dateOfBirth: "",
            salary: "",
            profilePicture: null,
        });
        setPreviewImage(null);
        setShowPassword(false);
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateEmployeeMutation.mutate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-900 rounded-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-neutral-100">Edit Employee</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                            <Upload size={18} />
                            Profile Picture
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="profilePicture"
                                />
                                <label
                                    htmlFor="profilePicture"
                                    className="cursor-pointer bg-neutral-800/70 border border-neutral-700 rounded px-3 py-2 text-neutral-300 hover:bg-neutral-700/70 transition-colors flex items-center gap-2"
                                >
                                    <Upload size={16} />
                                    Choose File
                                </label>
                            </div>
                            {previewImage && (
                                <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-700">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                            <User size={18} />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                            <Mail size={18} />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                            <Lock size={18} />
                            Password (leave blank to keep current)
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter new password (optional)"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-300 hover:text-neutral-200 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                                <User size={18} />
                                Position
                            </label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => handleInputChange("position", e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter position"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                                <Building size={18} />
                                Department
                            </label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => handleInputChange("department", e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter department"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                                <Phone size={18} />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                                <DollarSign size={18} />
                                Salary
                            </label>
                            <input
                                type="number"
                                value={formData.salary}
                                onChange={(e) => handleInputChange("salary", e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter salary"
                                step="0.01"
                                min="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                            <MapPin size={18} />
                            Address
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Enter address"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                                <Calendar size={18} />
                                Date of Joining
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfJoining}
                                onChange={(e) => handleInputChange("dateOfJoining", e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                                <Calendar size={18} />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
                        <Button
                            type="submit"
                            disabled={updateEmployeeMutation.isPending}
                            className="w-full"
                        >
                            {updateEmployeeMutation.isPending ? "Updating Employee..." : "Update Employee"}
                        </Button>
                        <RedButton
                            type="button"
                            onClick={handleClose}
                            className="w-full"
                        >
                            Cancel
                        </RedButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEmployeeForm; 