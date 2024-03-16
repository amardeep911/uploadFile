"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Upload } from "lucide-react";
import UploadButton from "@/components/UploadButton";
type Props = {};

const page = (props: Props) => {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("api/auth/signin?callbackUrl=/Dashboard");
    },
  });

  return (
    <div className="z-50 top-0 w-full  inset-x-0 h-screen flex justify-between">
      <MaxWidthWrapper className="w-full h-full border-4 border-black">
        <div className="bg-gray-300 sticky z-50 top-0 flex justify-end w-full align-middle items-center  inset-x-0 h-16 ">
          <UploadButton />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
