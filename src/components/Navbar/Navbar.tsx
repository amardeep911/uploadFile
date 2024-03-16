import React from "react";
import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import NavItems from "./NavItems";
import Image from "next/image";
import Signature from "../../../public/Assets/signature-2.png";
import MobileNav from "./MobileNav";
type Props = {};

const Navbar = (props: Props) => {
  return (
    <div className="bg-white sticky z-50 top-0 inset-x-0 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              <MobileNav />
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <Image src={Signature} height={100} width={100} alt="LOGO" />
                </Link>
              </div>

              <div className="lg:block md:block hidden z-50 lg:ml-8   lg:self-stretch">
                <NavItems />
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
};

export default Navbar;
