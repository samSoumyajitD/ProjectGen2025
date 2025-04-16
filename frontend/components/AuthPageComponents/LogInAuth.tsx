"use client";

import React, { useState } from "react";
import { Form, Input, Button, Alert } from "@heroui/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string } | null>(null);
  const [alert, setAlert] = useState<{ type: "success" | "danger" | null; message: string | null }>({
    type: null,
    message: null,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);
    setAlert({ type: null, message: null });

    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Please enter your email";
    if (!password) newErrors.password = "Please enter your password";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { user, token } = response.data;

      Cookies.set("user", JSON.stringify(user), { secure: true, sameSite: "Strict" });
      Cookies.set("token", token, { secure: true, sameSite: "Strict" });
      Cookies.set("role", user.role, { secure: true, sameSite: "Strict" });

      setAlert({ type: "success", message: `Welcome, ${user.role}! Redirecting...` });

      setTimeout(() => {
        if (user.role === "Student" || user.role === "Working Professional") {
          router.push("/welcome");
        }
      }, 2000);
    } catch (error: any) {
      setAlert({ type: "danger", message: error.response?.data?.message || "Login failed! Please check your credentials." });
    }
  };

  return (
    <div className="dark:text-white mt-3 relative">
      {/* Alert Section at the Top */}
      {alert.type && alert.message && (
        <div className="fixed top-0 left-0 w-full flex justify-center z-50">
          <div className="w-full max-w-md">
            <Alert color={alert.type} title={alert.message} />
          </div>
        </div>
      )}

      {/* Login Form */}
      <Form
        className="w-full max-w-md space-y-1 mx-auto "
        onSubmit={onSubmit}
        onReset={() => {
          setEmail("");
          setPassword("");
          setErrors(null);
          setAlert({ type: null, message: null });
        }}
      >
        <Input
          isRequired
          name="email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onValueChange={setEmail}
          errorMessage={errors?.email}
        />

        <Input
          isRequired
          name="password"
          placeholder="Enter your password"
          type={showPassword ? "text" : "password"}
          value={password}
          onValueChange={setPassword}
          errorMessage={errors?.password}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <span className="ml-2">Show Password</span>
        </div>

        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit">
            Login
          </Button>
          <Button className="w-full dark:text-white dark:bg-gray-500" type="reset" variant="bordered">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
