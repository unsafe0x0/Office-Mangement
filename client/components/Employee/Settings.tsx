"use client";
import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Upload,
  Eye,
  EyeOff,
  Building,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface SettingsProps {
  employee?: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    position?: string;
    department?: string;
    phone?: string;
    address?: string;
    dateOfJoining?: string;
    dateOfBirth?: string;
    salary?: string;
  };
}

interface EmployeeFormData {
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

const Settings: React.FC<SettingsProps> = ({ employee }) => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: employee?.name || "",
    email: employee?.email || "",
    password: "",
    position: employee?.position || "",
    department: employee?.department || "",
    phone: employee?.phone || "",
    address: employee?.address || "",
    dateOfJoining: employee?.dateOfJoining?.split("T")[0] || "",
    dateOfBirth: employee?.dateOfBirth?.split("T")[0] || "",
    salary: employee?.salary || "",
    profilePicture: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    employee?.profilePicture || null,
  );
  const queryClient = useQueryClient();

  const updateEmployeeMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      const token = GetCookie();
      const formDataToSend = new FormData();
      formDataToSend.append("employeeId", employee?.id || "");
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          if (key === "profilePicture" && value instanceof File) {
            formDataToSend.append("profilePicture", value);
          } else if (typeof value === "string") {
            formDataToSend.append(key, value);
          }
        }
      });

      const response = await fetch(`${API_URL}/employee/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employeeData"] });
    },
    onError: (error: any) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const handleInputChange = (
    field: keyof EmployeeFormData,
    value: string | File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployeeMutation.mutate(formData);
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
        Update Profile
      </h2>
      <p className="text-neutral-400 mb-6">Manage your profile information.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
            <Upload size={18} /> Profile Picture
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="employeeProfilePicture"
              />
              <label
                htmlFor="employeeProfilePicture"
                className="cursor-pointer bg-neutral-800/70 border border-neutral-700 rounded px-3 py-2 text-neutral-300 hover:bg-neutral-700/70 transition-colors flex items-center gap-2"
              >
                <Upload size={16} /> Choose File
              </label>
            </div>
            {previewImage && (
              <div className="w-16 h-16 rounded-md overflow-hidden border border-neutral-700">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <User size={18} /> Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter name"
              required
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <Mail size={18} /> Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email"
              required
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
            <Lock size={18} /> Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new password (leave blank to keep current)"
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

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <User size={18} /> Position
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
              <Building size={18} /> Department
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

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <Phone size={18} /> Phone
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
              <DollarSign size={18} /> Salary
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.salary}
              onChange={(e) => handleInputChange("salary", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter salary"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
            <MapPin size={18} /> Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter address"
            rows={3}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <Calendar size={18} /> Date of Joining
            </label>
            <input
              type="date"
              value={formData.dateOfJoining}
              onChange={(e) =>
                handleInputChange("dateOfJoining", e.target.value)
              }
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <Calendar size={18} /> Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            type="submit"
            disabled={updateEmployeeMutation.isPending}
            className="w-full"
          >
            {updateEmployeeMutation.isPending
              ? "Updating..."
              : "Update Profile"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
