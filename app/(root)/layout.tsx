"use client";

import { Navbar, Sidebar } from '@/components'
import React, { ReactNode, useState } from 'react'
import { usePathname } from "next/navigation"; // Import Next.js hook
import { ArrowRight } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
    const pathname = usePathname(); // Get current URL path
    const showRightSide = pathname === "/" || pathname === "/mypost";
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

    return (
        <main className="h-screen flex flex-col">
            <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex flex-1">
                <aside className="sidebar">
                    <Sidebar />
                </aside>

                {/* Mobile Sidebar (Right Slide-in) */}
                <div
                    className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                        } lg:hidden`}
                    onClick={() => setSidebarOpen(false)}
                >
                    <aside
                        className={`fixed top-0 right-0 h-full w-64 bg-[--green500] shadow-lg z-50 transform transition-transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"
                            }`}
                    >
                        <button
                            className="absolute top-4 left-4 p-2 rounded-md text-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            < ArrowRight size={24} />
                        </button>
                        <Sidebar />
                    </aside>
                </div>

                <section className="flex-1 flex">
                    <div className="children">
                        {children}
                    </div>
                </section>

                {showRightSide && <aside className="right-side"></aside>}
            </div>
        </main>
    )
}

export default Layout
