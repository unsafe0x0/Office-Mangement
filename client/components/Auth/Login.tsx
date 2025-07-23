"use client";
import React, { useState } from "react";
import { Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SetCookie from "@/utils/SetCookie";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LoginType = "employee" | "admin";

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<LoginType>("employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (credentials: {
      type: LoginType;
      email: string;
      password: string;
    }) => {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }
      const response = await fetch(`${API_URL}/${credentials.type}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success(`Welcome back, ${loginType}!`);
      SetCookie(data.token);
      router.push(`/${loginType}`);
    },
    onError: (error) => {
      console.error("Login error:", error.message);
      toast.error(`Login failed: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ type: loginType, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="lg:container w-full max-w-md">
        <div className="bg-neutral-900 rounded p-8 max-w-xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-100 text-center mb-8 font-heading">
            Office Management Login
          </h1>

          <div className="flex mb-6 bg-neutral-800/70 rounded p-1">
            <button
              onClick={() => setLoginType("employee")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${loginType === "employee"
                  ? "bg-blue-500 text-white"
                  : "text-neutral-300 hover:text-neutral-100"
                }`}
            >
              <User size={18} />
              Employee
            </button>
            <button
              onClick={() => setLoginType("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${loginType === "admin"
                  ? "bg-blue-500 text-white"
                  : "text-neutral-300 hover:text-neutral-100"
                }`}
            >
              <Shield size={18} />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-md font-medium text-neutral-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                  size={18}
                />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-md font-medium text-neutral-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
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

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-normal py-2 px-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-900 cursor-pointer"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending
                ? "Signing in..."
                : `Sign in as ${loginType === "employee" ? "Employee" : "Admin"
                }`}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
