"use client";
import React, { useState } from "react";
import { Mail, Lock, User, Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import SetCookie from "@/utils/SetCookie";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

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
      <div className="w-full max-w-md">
        <div className="bg-neutral-900 rounded-md border border-neutral-700/50 p-8 max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-100 font-heading">
              Office Management
            </h1>
            <p className="text-neutral-400 mt-2">Sign in to your account</p>
          </div>

          <div className="flex mb-6 bg-neutral-800/70 rounded-md p-1 border border-neutral-600/50">
            <button
              onClick={() => setLoginType("employee")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-all duration-200 font-normal ${
                loginType === "employee"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700/50"
              }`}
            >
              <User size={18} />
              Employee
            </button>
            <button
              onClick={() => setLoginType("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md transition-all duration-200 font-normal ${
                loginType === "admin"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700/50"
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
                className="flex items-center gap-2 text-sm font-normal text-neutral-300 mb-2"
              >
                <Mail size={16} />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-normal text-neutral-300 mb-2"
              >
                <Lock size={16} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors duration-200 p-1 rounded-md hover:bg-neutral-700/50"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
              icon={
                loginMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : null
              }
              disabled={loginMutation.isPending}
            >
              {`Sign in as ${loginType === "employee" ? "Employee" : "Admin"}`}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 underline hover:no-underline"
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
