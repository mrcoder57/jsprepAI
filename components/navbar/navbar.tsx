"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { UserDropdown } from "./userDropdown";

const Navbar = () => {
  const pathname = usePathname();
  if (pathname === "/auth") {
    return null;
  }
  return (
    <div className=" w-full flex items-center justify-between mx-auto">
      <div className=" flex p-3 flex-row  w-full items-center mx-auto justify-between">
        <div className="flex flex-row items-center">
          <SidebarTrigger />
          {/* <img src='/logo.png' alt='logo' className='h-8 w-8' /> */}
          <h1 className="text-2xl font-bold text-gray-900 ">JSPrep</h1>
        </div>
        <div className="flex flex-row items-center">
          <UserDropdown />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
