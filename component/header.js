
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const navItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <header className="
            sticky top-0 z-50
            border-b border-white/30
            bg-gray-100/50
            backdrop-blur-2xl
            shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        ">
            <div className="
                container mx-auto
                flex items-center justify-between
                px-4 py-4
            ">

                {/* Logo */}
                <Link
                    href="/"
                    className="
                        text-2xl font-bold
                        tracking-tight text-gray-900
                    "
                >
                    Blog<span className="text-blue-600">.</span>
                </Link>


                {/* Glass Navigation */}
                <nav className="
                    flex items-center gap-1
                    rounded-full
                    border border-gray-300/40
                    bg-gray-300/30
                    p-1.5
                    shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]
                    backdrop-blur-2xl
                ">

                    {navItems.map((item) => {

                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    group relative
                                    rounded-full
                                    px-5 py-2.5
                                    text-sm font-bold
                                    transition-all duration-500 ease-out

                                    ${
                                        isActive
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg"
                                            : "text-gray-700 hover:bg-gray-400/20 hover:text-blue-600"
                                    }
                                `}
                            >
                                {item.name}

                                {/* Underline */}
                                <span
                                    className={`
                                        absolute bottom-1 left-1/2
                                        h-0.5
                                        -translate-x-1/2
                                        rounded-full
                                        bg-blue-500
                                        transition-all duration-500 ease-out

                                        ${
                                            isActive
                                                ? "w-6"
                                                : "w-0 group-hover:w-6"
                                        }
                                    `}
                                />
                            </Link>
                        );
                    })}

                </nav>
            </div>
        </header>
    );
}