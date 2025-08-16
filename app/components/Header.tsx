"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/reviews", label: "Reviews" },
  { href: "/closed-restaurants", label: "Closed Restaurants" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white border-b border-black/10 text-black">
      <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image 
              src="/logo.jpg" 
              alt="Gusmack Food Reviews Logo" 
              fill 
              className="object-cover rounded-full border-2 border-[var(--scot-accent)]/20"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-[var(--scot-deep)]" style={{ fontFamily: 'var(--font-playfair)' }}>
              Gusmack Food Reviews
            </h1>
            <p className="text-xs text-black/60">by GusMack1</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <ul className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={
                      "px-2 py-1 rounded-md transition-colors " +
                    (isActive
                        ? "underline underline-offset-4"
                        : "hover:underline underline-offset-4")
                  }
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          </ul>
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex flex-col items-center justify-center h-9 w-9 rounded-md border border-black/15 hover:bg-black/[0.03]"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="block w-5 h-0.5 bg-black rounded-sm mb-1" />
            <span className="block w-5 h-0.5 bg-black rounded-sm mb-1" />
            <span className="block w-5 h-0.5 bg-black rounded-sm" />
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-black/10 bg-white text-black">
          <div className="px-4 py-3 space-y-2">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={"block px-2 py-2 rounded-md " + (isActive ? "font-semibold" : "hover:bg-black/5")}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}


