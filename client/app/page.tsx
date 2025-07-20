"use client";
import React from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  React.useEffect(() => {
    router.push("/login");
  }, [router]);
};

export default LandingPage;
