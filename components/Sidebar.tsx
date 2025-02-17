import React from "react";
import { Home, FileText } from "lucide-react"; // Using Lucide icons
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="flex flex-col space-y-4 mx-4 md:mx-0 mt-20 md:mt-0">
      <Link href="/" className="flex items-center space-x-3 md:text-[--green500] text-white p-3 md:hover:bg-[--green100] hover:bg-[--gray300] rounded-lg">
        <Home size={20} />
        <span>Home</span>
      </Link>
      <Link href="/mypost"  className="flex items-center space-x-3 md:text-[--green500] text-white p-3 md:hover:bg-[--green100] hover:bg-[--gray300] rounded-lg">
        <FileText size={20} />
        <span>Our Blog</span>
      </Link>
    </div>
  );
};

export default Sidebar;
