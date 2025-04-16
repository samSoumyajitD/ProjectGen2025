"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { Moon, Sun } from "lucide-react"; // Icons for Dark/Light mode
import { useTheme } from "../../context/ThemeProvider";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
}

interface CustomError {
  message: string;
  response?: {
    data: string;
  };
}

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M26.6482 7.0205L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 10.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function StuNavBar() {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useTheme(); // Use correct context
  const [user, setUser] = useState<User | null>(null); // State to store user profile data

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<User>(
          "http://localhost:5000/api/admin/profile",
          {
            withCredentials: true,
          }
        );
        setUser(response.data); // Set user data in state
      } catch (error) {
        const customError = error as CustomError; // Type assertion
        console.error("Error fetching profile:", customError.response?.data || customError.message);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      // Call backend logout API to clear HttpOnly cookies
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
  
      // Remove client-side cookies (if any)
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      Cookies.remove("role", { path: "/" });
  
      // Redirect to the root path ("/")
      router.push("/");
      router.refresh();
      window.location.reload(); // Ensures session is cleared
    } catch (error) {
      const customError = error as CustomError; // Type assertion
      console.error("Logout Error:", customError.response?.data || customError.message);
    }
  };


  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");

    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
     
    }
  };
  const scrollToDemo = () => {
    const demoSection = document.getElementById("demo");
    if (demoSection){
            demoSection.scrollIntoView({behavior: "smooth"});
    }
  };
  const scrollToSteps = () =>{
  
    const stepsSection = document.getElementById("steps");
    if (stepsSection) {
     
      stepsSection.scrollIntoView({ behavior: "smooth" });
    }
  
  };

  return (
    <Navbar
      className={`${
        darkMode
          ? "dark bg-[#0f1417] text-white backdrop-blur-xl bg-opacity-80"
          : "text-gray-800 backdrop-blur-lg bg-opacity-70"
      }`}
    >
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">SaarthiAI</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem className="group relative">
          <Link
            href="/welcome"
            className="transition-colors text-gray-800 dark:text-white group-hover:text-yellow-400"
          >
            Home
          </Link>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </NavbarItem>
        <NavbarItem className="group relative">
          <button
            onClick={scrollToDemo}
            className="transition-colors text-gray-800 dark:text-white group-hover:text-yellow-400"
          >
            Demo
          </button>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </NavbarItem>
        <NavbarItem className="group relative">
          <button
            onClick={scrollToFeatures}
            className="transition-colors text-gray-800 dark:text-white group-hover:text-yellow-400"
          >
            Features
          </button>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </NavbarItem>
        <NavbarItem className="group relative">
          <button
             onClick={ scrollToSteps}
            className="transition-colors text-gray-800 dark:text-white group-hover:text-yellow-400"
          >
            Steps
          </button>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent as="div" justify="end" className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? (
            <Sun size={20} className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon size={20} className="w-6 h-6 text-gray-800" />
          )}
        </button>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform text-[20px] font-[500]"
              color="primary"
              name={user ? user.name[0] : "U"} // Use user's name or fallback to "User"
              size="sm"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold dark:text-white">Signed in as</p>
              <p className="font-semibold dark:text-white">
                {user?.email || "zoey@example.com"}
              </p>{" "}
              {/* Use user's email or fallback */}
            </DropdownItem>
            <DropdownItem key="settings" className="dark:text-white">
              Profile Settings
            </DropdownItem>
            <DropdownItem key="team_settings" className="dark:text-white">
              <Link href="/welcome">Home</Link>
            </DropdownItem>
            <DropdownItem key="analytics" className="dark:text-white">
              <button onClick={scrollToFeatures}>Features</button>
            </DropdownItem>
            <DropdownItem key="help_and_feedback" className="dark:text-white">
              Help & Feedback
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onPress={handleLogout}
              className="font-bold dark:text-red-900"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}