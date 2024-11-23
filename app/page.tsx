import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import Logo from "@/components/logo";

export default function Homepage() {
  return (
    <>
      <BackgroundGradientAnimation containerClassName="fixed -z-50" />
      <header className="px-4 md:px-12 lg:px-24 h-16 flex items-center">
        <nav className="flex w-full justify-between">
          <div className="flex items-center gap-12">
            <Logo />
            <Link
              href="/"
              className="hover:text-primary font-medium transition-colors "
            >
              Enterprise
            </Link>
            <Link
              href="/"
              className="hover:text-primary font-medium transition-colors "
            >
              Pricing
            </Link>
            <Link
              href="/"
              className="hover:text-primary font-medium transition-colors "
            >
              Docs
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/sign-up">
              <Button variant="outline">Sign Up</Button>
            </Link>
            <Link href="/log-in">
              <Button>Log In</Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex items-center justify-center">
        <section className="py-16 md:py-24 lg:py-32 xl:py-40 px-4 md:px-12 lg:px-24">
          <div className="container max-w-screen-md text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
              Unlock the power of{" "}
              <span className="text-primary">customer data</span>
            </h1>
            <p className="mt-6 mx-auto max-w-screen-sm text-muted-foreground md:text-xl">
              Transform raw data into actionable insights. Personalize your
              marketing, predict customer behavior, and drive growth with
              advanced analytics.
            </p>
            <div className="mt-12 space-x-3">
              <Link href="/sign-up">
                <Button size="lg">Get Started</Button>
              </Link>
              <Button size="lg" variant="outline">
                Request a Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
