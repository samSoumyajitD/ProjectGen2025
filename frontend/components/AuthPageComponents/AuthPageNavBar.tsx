"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { Moon, Sun, Home } from "lucide-react";
import { useTheme } from "../../context/ThemeProvider";

export const AcmeLogo: React.FC = () => {
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

const AuthPageNavbar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={`${
        darkMode
          ? "dark bg-[#0f1417] text-white "
          : "text-gray-800 backdrop-blur-lg bg-opacity-70"
      }`}
    >
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">SaarthiAI</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">SaarthiAI</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        {/* Toggle Dark Mode Button with Hover Popover */}
        <NavbarItem>
          <Popover triggerType="menu" placement="bottom" showArrow backdrop="transparent" offset={2} shadow="md">
            <PopoverTrigger>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-800" />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-2 text-sm text-white bg-gray-800 rounded-lg">
              {darkMode ? "Dark Theme" : "Light Theme"}
            </PopoverContent>
          </Popover>
        </NavbarItem>

        {/* Home Button with Hover Popover */}
        <NavbarItem>
          <Popover triggerType="menu" placement="bottom" showArrow backdrop="transparent" offset={2} shadow="md">
            <PopoverTrigger>
              <Link
                href="/"
                onPress={() => console.log("Navigating to home")}
                className="p-2 rounded-lg transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Home className="w-6 h-6 text-gray-800 dark:text-white" />
              </Link>
            </PopoverTrigger>
            <PopoverContent className="p-2 text-sm text-white bg-gray-800 rounded-lg">
              Return to Home
            </PopoverContent>
          </Popover>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default AuthPageNavbar;
