'use client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className=" mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left Side: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Image
                src="/assets/logo.png"
                alt="IELTSSprint Logo"
                width={30}
                height={30}
                quality={100}
                className="mr-2"
              />
              <h1 className="text-2xl font-bold italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
                <Link href={'/homepage'}>IELTSSprint</Link>
              </h1>
            </div>

            {/* Navigation Menu - flows naturally from logo */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex items-center space-x-1 text-sm">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/homepage" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 tracking-tighter"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

            
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/landingpage" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 tracking-tighter"
                    >
                      Practice
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/login" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 tracking-tighter"
                    >
                      Sign In
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/register" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 tracking-tighter"
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
