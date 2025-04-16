"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export const withAuth = (WrappedComponent: React.ComponentType, allowedRoles: string[]) => {
  const Wrapper = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const user = Cookies.get("user");
      const role = Cookies.get("role");

      // If user is not logged in, redirect to /auth
      if (!user) {
        router.push("/auth");
        return;
      }

      // If user's role is not in the allowedRoles array, redirect to /unauthorized
      if (!allowedRoles.includes(role as string)) {
        router.push("/unauthorized");
        return;
      }
    }, [router]);

    // Render the wrapped component if the user is authenticated and has an allowed role
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};
