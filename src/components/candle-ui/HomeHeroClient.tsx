"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/candle-ui/Hero";

export default function HomeHeroClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  return <Hero />;
}
