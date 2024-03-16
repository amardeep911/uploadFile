import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <MaxWidthWrapper>
      <div className="py-32 mx-auto text-center flex flex-col items-center max-w-6xl">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          You can upload whatever type of file you{" "}
          <span className="text-blue-600">need</span>.
        </h1>
        <p className="mt-6 text-lg max-w-prose text-muted-foreground">
          Welcome to Uploadsx. We provie a simple and easy way to upload your
          files and share them with others. No need to sign up, just upload and
          share.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/products" className={buttonVariants()}>
            Contact Us
          </Link>
          <Button variant="ghost">
            <Link href="/logIn">Log in </Link> &rarr;
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
