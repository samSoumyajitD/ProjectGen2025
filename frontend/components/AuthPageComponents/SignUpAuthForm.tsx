"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Button,
  Alert
} from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

interface FormData {
  name: string;
  email: string;
  role: "Student" | "Working Professional";
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface Errors {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function SignUPAuthForm() {
  const router = useRouter();
  const initialFormData: FormData = {
    name: "",
    email: "",
    role: "Student",
    password: "",
    confirmPassword: "",
    terms: false,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null);

  const getPasswordError = (value: string): string | null => {
    if (value.length < 4) return "Password must be at least 4 characters";
    if (!/[A-Z]/.test(value)) return "Password must contain at least 1 uppercase letter";
    if (!/[^a-zA-Z0-9]/.test(value)) return "Password must contain at least 1 symbol";
    return null;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, role, password, confirmPassword, terms } = formData;

    const newErrors: Errors = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (getPasswordError(password)) newErrors.password = getPasswordError(password);
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!terms) newErrors.terms = "Please accept the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlert({ type: "danger", message: "Please fix the errors before submitting." });
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, role, password }, { withCredentials: true });
      const loginResponse = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
      
      const { user, token } = loginResponse.data;
      Cookies.set("user", JSON.stringify(user), { secure: true, sameSite: "Strict" });
      Cookies.set("token", token, { secure: true, sameSite: "Strict" });
      Cookies.set("role", user.role, { secure: true, sameSite: "Strict" });

      setSubmitted(true);
      setAlert({ type: "success", message: "Signup successful! Redirecting..." });

      setTimeout(() => {
        router.push(role === "Student" ? "/welcome" : "/welcome");
      }, 2000);
    } catch (error: any) {
      console.error("Signup/Login failed", error.response?.data || error.message);
      setErrors({ email: error.response?.data?.message || "Signup failed" });
      setAlert({ type: "danger", message: "Signup failed. Please try again." });
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto dark:text-white">
      {/* Alert at the top */}
      {alert && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 w-96 z-50">
          <Alert color={alert.type} title={alert.message} />
        </div>
      )}

      <Form className="w-full space-y-1" onSubmit={handleSubmit}>
        <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" errorMessage={errors.name} required />
        <Input name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Enter your email" errorMessage={errors.email} required />
        <Select name="role" value={formData.role} onChange={handleChange} errorMessage={errors.role} required>
          <SelectItem key="Student" value="Student" className="dark:text-white">Student</SelectItem>
          <SelectItem key="Working Professional" value="Working Professional" className="dark:text-white">Working Professional</SelectItem>
        </Select>
        <Input name="password" value={formData.password} onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Enter your password" errorMessage={errors.password} required endContent={<button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>} />
        <Input name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" errorMessage={errors.confirmPassword} required endContent={<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>} />
        <Checkbox name="terms" checked={formData.terms} onChange={handleChange}>
          <p className="dark:text-white">I accept the terms and conditions</p>
        </Checkbox>
        {errors.terms && <p className="text-red-500">{errors.terms}</p>}
        <div className="flex gap-4">
          <Button type="submit" color="primary" className="w-full">Sign Up</Button>
          <Button type="reset" variant="bordered" className="w-full dark:text-white dark:bg-gray-500" onClick={() => setFormData(initialFormData)}>Reset</Button>
        </div>
      </Form>
    </div>
  );
}
