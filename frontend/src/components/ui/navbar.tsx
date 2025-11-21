'use client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation"; 

export default function NavBar() {
  const pathname = usePathname(); 

  const getLinkClassName = (href: string) => {
    const isActive = pathname === href;
    
    const baseClasses = "font-medium px-4 py-3 rounded-full transition-all duration-300";
      if (isActive) {
      return `${baseClasses} text-white bg-gradient-to-r from-[#00c6ff] to-[#0072ff] bg-blue-100 shadow-sm font-bold`;
    }
      return `${baseClasses} hover:text-white hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:bg-blue-100`;
  };

  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* 1. Left Side: Logo & Brand */}
          <div className="flex items-center shrink-0">
            <Link href={'/'} className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="IELTS Sprint Logo"
                width={32} 
                height={32}
                quality={100}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent hidden sm:block">
                IELTS Sprint
              </h1>
            </Link>
          </div>

          {/* 2. Center: Main Navigation Menu */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2">
            <NavigationMenu className=" p-3 px-12 shadow-lg rounded-full"> 
              <NavigationMenuList className="flex items-center space-x-1">
                
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/" 
                      className={getLinkClassName('/')}
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/reading" 
                      className={getLinkClassName('/reading')}
                    >
                      Reading
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/listening" 
                      className={getLinkClassName('/listening')}
                    >
                      Listening
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/about" 
                      className={getLinkClassName('/about')}
                    >
                      About Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* 3. Right Side: Auth Buttons */}
          <div className="flex items-center shrink-0">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center gap-3">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/login" 
                      className="text-gray-600 font-medium px-5 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/register" 
                      className="font-medium px-6 py-2.5 rounded-full text-white bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-0.5"
                    >
                      Sign Up
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

        </div>
      </div>
    </header>
  );
}