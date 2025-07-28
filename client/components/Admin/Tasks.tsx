"use client";
import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import AddTaskForm from "./AddTaskForm";
import EditTaskForm from "./EditTaskForm";
import TaskTable from "./TaskTable";
import Button from "../ui/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import GetCookie from "@/utils/GetCookie";

interface Task {
    id: string;
    title: string;
    description?: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
    dueDate?: string;
    employeeEmails: string[];
    createdAt: string;
    updatedAt: string;
}

interface TasksProps {
    tasks: Task[];
    employees: Array<{
        id: string;
        name: string;
        email: string;
    }>;
}

const Tasks = ({ tasks, employees }: TasksProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddTaskFormOpen, setIsAddTaskFormOpen] = useState(false);
    const [isEditTaskFormOpen, setIsEditTaskFormOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const queryClient = useQueryClient();

    const deleteTaskMutation = useMutation({
        mutationFn: async (id: string) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            if (!API_URL) throw new Error("API URL missing");

            const res = await fetch(`${API_URL}/task/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GetCookie()}`
                },
                body: JSON.stringify({ taskId: id })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to delete task");
            }
        },
        onSuccess: () => {
            toast.success("Task deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete task");
        }
    });

    const filteredTasks = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return tasks.filter(task =>
            task.title.toLowerCase().includes(term) ||
            task.description?.toLowerCase().includes(term)
        );
    }, [tasks, searchTerm]);

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setIsEditTaskFormOpen(true);
    };

    const handleDelete = (task: Task) => {
        deleteTaskMutation.mutate(task.id);
    };

    return (
        <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
            <div className="flex justify-between items-center mb-4 w-full">
                <div>
                    <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">Tasks</h2>
                    <p className="text-neutral-400">Manage and track all tasks</p>
                </div>
                <Button
                    onClick={() => setIsAddTaskFormOpen(true)}
                    icon={<Plus size={16} />}
                >
                    Add Task
                </Button>
            </div>

            <input
                type="text"
                placeholder="Search Tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
            />
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md overflow-hidden w-full">
                <TaskTable
                    tasks={filteredTasks}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <AddTaskForm
                isOpen={isAddTaskFormOpen}
                onClose={() => setIsAddTaskFormOpen(false)}
                employees={employees}
            />

            {selectedTask && (
                <EditTaskForm
                    isOpen={isEditTaskFormOpen}
                    onClose={() => {
                        setIsEditTaskFormOpen(false);
                        setSelectedTask(null);
                    }}
                    task={{
                        ...selectedTask,
                        employeeIds: employees
                            .filter(emp => selectedTask.employeeEmails.includes(emp.email))
                            .map(emp => emp.id)
                    }}
                    employees={employees}
                />
            )}
        </div>
    );
};

export default Tasks;
