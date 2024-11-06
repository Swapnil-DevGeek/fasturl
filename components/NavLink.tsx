"use client";
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
    href : String,
    text : String
}

const NavLink : React.FC<NavLinkProps> = ({ href, text}) => {

    const pathname = usePathname();
    const isActive = pathname === href;

return (
    <li>
    <Link href={`${href}`}
      className={`block py-2 px-3 rounded ${
        isActive
          ? "text-white bg-blue-700 md:bg-transparent md:text-blue-400 hover:text-blue-500"
          : "text-gray-300 hover:text-white"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {text}
    </Link>
  </li>
  )
}

export default NavLink
