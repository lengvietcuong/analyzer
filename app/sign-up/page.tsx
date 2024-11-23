import Link from "next/link";
import Logo from "@/components/logo";
import DataAnalytics from "@/components/icons/data-analytics";
import { FaGoogle as Google } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUp() {
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
          <h1 className="text-3xl text-center font-bold">Create an account</h1>
          <div className="grid gap-2.5">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div className="grid gap-2 mb-5">
              <Label htmlFor="password">Repeat Password</Label>
              <Input id="passwordAgain" type="password" required />
            </div>
            <Link href="/dashboard">
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <Google className="inline-block mr-2" />
                Continue with Google
              </Button>
            </Link>
          </div>
          <div className="mt-5 text-center text-sm">
            Already have an account?{" "}
            <Link href="/log-in" className="underline">
              Log in
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