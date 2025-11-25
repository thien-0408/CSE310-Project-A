'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    
    if (isActive) {
      return "relative font-semibold px-6 py-2.5 text-blue-600 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-600 after:to-cyan-400 after:rounded-full";
    }
    
    return "relative font-medium px-6 py-2.5 text-gray-600 hover:text-blue-600 transition-all duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 hover:after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-600 after:to-cyan-400 after:rounded-full after:transition-all after:duration-300";
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-10 border-b border-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
         
          {/* Logo & Brand */}
          <div className="flex items-center shrink-0">
            <Link href={'/'} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur-sm opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
                <Image
                  src="/assets/logo.png"
                  alt="IELTS Sprint Logo"
                  width={40}
                  height={40}
                  quality={100}
                  className="object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  IELTS Sprint
                </h1>
                <p className="text-xs text-gray-500 font-medium -mt-1">Your Path to Success</p>
              </div>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-1">
                
              <li>
                <Link href="/" className={getLinkClassName('/')}>
                  Home
                </Link>
              </li>

              <li>
                <Link href="/reading" className={getLinkClassName('/reading')}>
                  Reading
                </Link>
              </li>

              <li>
                <Link href="/listening" className={getLinkClassName('/listening')}>
                  Listening
                </Link>
              </li>

              <li>
                <Link href="/about" className={getLinkClassName('/about')}>
                  About Us
                </Link>
              </li>

            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/login"
              className="hidden sm:block text-gray-700 font-medium px-5 py-2 rounded-full hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="relative font-semibold px-6 py-2.5 rounded-full text-white bg-gradient-to-r from-blue-600 to-cyan-500 overflow-hidden group transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-200"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}