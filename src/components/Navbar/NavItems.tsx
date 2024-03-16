import Link from "next/link";
import React from "react";

type Props = {};
import { getServerSession } from "next-auth";
import { options } from "../../app/api/auth/[...nextauth]/options";

const NavItems = async (props: Props) => {
  const session = await getServerSession(options);
  return (
    <div className="flex gap-4 h-full">
      <ul className="flex h-full items-center gap-6">
        <li>
          <Link
            className=" block font-medium text-gray-900 hover:text-blue-700"
            href="/"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className=" block font-medium text-gray-900 hover:text-blue-700"
            href="/about-us"
          >
            About
          </Link>
        </li>
        <li>
          <Link
            className=" block font-medium text-gray-900 hover:text-blue-700"
            href="/contact"
          >
            Contact
          </Link>
        </li>

        <li>
          <Link
            className=" block font-medium text-gray-900 hover:text-blue-700"
            href="/projects"
          >
            Projects
          </Link>
        </li>

        <li>
          {session ? (
            <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
          ) : (
            <Link href="/api/auth/signin">Login</Link>
          )}
        </li>
        <li>
          <p className="font-bold text-xl text-blue-700">
            {session ? `${session.user.name}` : "Guest"}
          </p>
        </li>
      </ul>
    </div>
  );
};

export default NavItems;
