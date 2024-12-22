"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (Component: React.ComponentType) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }, [router]);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    // Render nothing while checking authentication
    if (!token) return null;

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
