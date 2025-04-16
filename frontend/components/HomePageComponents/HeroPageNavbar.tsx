"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { Moon, Sun } from "lucide-react"; // Icons for Dark/Light mode
import { useTheme } from "../../context/ThemeProvider"; // Import theme context

export const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M26.6482 7.0205L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 10.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const HeroPageNavbar: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme(); // Use theme context
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const menuItems = ["home", "demo", "features", "steps", "faq", "login"];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={`${
        darkMode
          ? "dark bg-[#0f1417] text-white backdrop-blur-xl bg-opacity-80"
          : "text-gray-800 backdrop-blur-lg bg-opacity-70"
      }`}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <AcmeLogo />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">SaarthiAI</p>
        </NavbarBrand>
        {["home", "demo", "features", "steps", "faq"].map((item) => (
          <NavbarItem key={item} className="group relative">
            <Link
              href={`#${item}`}
              className="transition-colors text-gray-800 dark:text-white group-hover:text-yellow-400"
              onPress={() => scrollToSection(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
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
        </NavbarItem>

        <NavbarItem className="lg:flex">
          <Link href="/auth?form=login">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            href="/auth?form=signup"
            variant="flat"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out"
          >
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item} className="group relative">
            <Link
              href={item === "login" ? "/auth?form=login" : `#${item}`}
              className={`w-full transition-colors text-gray-800 group-hover:text-yellow-400 ${
                item === "login" ? "text-blue-500 group-hover:text-blue-400" : "dark:text-black text-white"
              }`}
              onPress={() => {
                if (item !== "login") {
                  scrollToSection(item);
                  setIsMenuOpen(false);
                }
              }}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
            <div className={`absolute bottom-0 left-0 w-[100px] h-0.5 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform ${
                item === "login" ? "bg-blue-500" : "bg-yellow-400"
              }`}></div>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default HeroPageNavbar;
