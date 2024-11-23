import Link from "next/link";
import { LineChart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({className}: {className?: string}) {
  return (
    <Link className={cn("flex items-center", className)} href="/">
      <LineChart className="h-6 w-6 text-primary" />
      <span className="ml-2 text-2xl font-bold text-primary">Analyzer</span>
    </Link>
  );
}
