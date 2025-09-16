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
    <header className="w-full bg-white shadow-sm">
      <div className=" mx-auto px-4 py-3">
        <div className="flex items-center justify-baseline">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Image
              src="/assets/logo.png"
              alt="IELTSSprint Logo"
              width={40}
              height={40}
              quality={100}
              className="mr-2"
            />
            <h1 className="text-2xl font-bold italic bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent mr-4">
              <Link href={''}>IELTSSprint</Link>
            </h1>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-6">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    Practice
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/login" 
                    className="text-gray-700 hover:text-blue-600  transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link 
                    href="/register" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                  >
                    Sign Up
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>  
        </div>
      </div>
    </header>
  );
}
