import Link from "next/link";
import Logo from "@/components/logo";
import DataAnalytics from "@/components/icons/data-analytics";
import { FaGoogle as Google } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  return (
    <div className="w-full min-h-svh lg:grid lg:grid-cols-2">
      <div className="relative flex items-center justify-center py-20">
        <Link href="/">
          <Button variant="ghost" className="absolute top-4 left-4">
            <ArrowLeft className="mr-2" />
            Home
          </Button>
        </Link>
        <Logo className="absolute top-4 right-4" />
        <div className="mx-auto grid w-[350px] gap-6">
          <h1 className="text-3xl text-center font-bold">Log in</h1>
          <div className="grid gap-2.5">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2 mb-5">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Link href="/dashboard">
              <Button type="submit" className="w-full">
                Log in
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <Google className="inline-block mr-2" />
                Log in with Google
              </Button>
            </Link>
          </div>
          <div className="mt-5 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <DataAnalytics className="w-full h-full" />
      </div>
    </div>
  );
}
