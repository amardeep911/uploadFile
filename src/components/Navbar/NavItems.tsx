import Link from "next/link";
import React from "react";

type Props = {};

const NavItems = (props: Props) => {
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
      </ul>
    </div>
  );
};

export default NavItems;
