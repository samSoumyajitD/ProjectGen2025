"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="  py-12 px-12 dark:bg-gray-900">
      <div className="flex flex-col justify-center items-center gap-1">
        <p className="text-sm text-default-400 dark:text-default-500">
          © 2025 SaarthiGenAi. All rights reserved.
        </p>
        <div className="flex items-center gap-1">
          <a
            className="relative inline-flex items-center tap-highlight-transparent outline-none text-medium text-primary dark:text-primary-400 no-underline hover:opacity-80 active:opacity-disabled transition-opacity p-1"
            aria-label="Discord"
            href="https://discord.gg/9b6yyZKmH4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="text-default-600 dark:text-default-400"
            >
              <path
                d="M14.82 4.26a10.14 10.14 0 0 0-.53 1.1 14.66 14.66 0 0 0-4.58 0 10.14 10.14 0 0 0-.53-1.1 16 16 0 0 0-4.13 1.3 17.33 17.33 0 0 0-3 11.59 16.6 16.6 0 0 0 5.07 2.59A12.89 12.89 0 0 0 8.23 18a9.65 9.65 0 0 1-1.71-.83 3.39 3.39 0 0 0 .42-.33 11.66 11.66 0 0 0 10.12 0q.21.18.42.33a10.84 10.84 0 0 1-1.71.84 12.41 12.41 0 0 0 1.08 1.78 16.44 16.44 0 0 0 5.06-2.59 17.22 17.22 0 0 0-3-11.59 16.09 16.09 0 0 0-4.09-1.35zM8.68 14.81a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.93 1.93 0 0 1 1.8 2 1.93 1.93 0 0 1-1.8 2zm6.64 0a1.94 1.94 0 0 1-1.8-2 1.93 1.93 0 0 1 1.8-2 1.92 1.92 0 0 1 1.8 2 1.92 1.92 0 0 1-1.8 2z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            className="relative inline-flex items-center tap-highlight-transparent outline-none text-medium text-primary dark:text-primary-400 no-underline hover:opacity-80 active:opacity-disabled transition-opacity p-1"
            aria-label="X"
            href="https://x.com/hero_ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              height="20"
              viewBox="0 0 24 24"
              width="20"
              className="text-default-600 dark:text-default-400"
            >
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            className="relative inline-flex items-center tap-highlight-transparent outline-none text-medium text-primary dark:text-primary-400 no-underline hover:opacity-80 active:opacity-disabled transition-opacity p-1"
            aria-label="Github"
            href="https://github.com/heroui-inc/heroui"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              height="24"
              viewBox="0 0 24 24"
              width="24"
              className="text-default-600 dark:text-default-400"
            >
              <path
                clipRule="evenodd"
                d="M12.026 2c-5.509 0-9.974 4.465-9.974 9.974 0 4.406 2.857 8.145 6.821 9.465.499.09.679-.217.679-.481 0-.237-.008-.865-.011-1.696-2.775.602-3.361-1.338-3.361-1.338-.452-1.152-1.107-1.459-1.107-1.459-.905-.619.069-.605.069-.605 1.002.07 1.527 1.028 1.527 1.028.89 1.524 2.336 1.084 2.902.829.091-.645.351-1.085.635-1.334-2.214-.251-4.542-1.107-4.542-4.93 0-1.087.389-1.979 1.024-2.675-.101-.253-.446-1.268.099-2.64 0 0 .837-.269 2.742 1.021a9.582 9.582 0 0 1 2.496-.336 9.554 9.554 0 0 1 2.496.336c1.906-1.291 2.742-1.021 2.742-1.021.545 1.372.203 2.387.099 2.64.64.696 1.024 1.587 1.024 2.675 0 3.833-2.33 4.675-4.552 4.922.355.308.675.916.675 1.846 0 1.334-.012 2.41-.012 2.737 0 .267.178.577.687.479C19.146 20.115 22 16.379 22 11.974 22 6.465 17.535 2 12.026 2z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}