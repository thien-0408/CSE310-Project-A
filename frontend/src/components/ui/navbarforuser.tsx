'use client';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NavBarUser() {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className=" mx-auto px-4 py-2">
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
                <Link href={'/'}>IELTSSprint</Link>
              </h1>
            </div>

            {/* Navigation Menu - flows naturally from logo */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex items-center space-x-1 text-sm">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/practice" 
                      className=" font-medium px-3 py-2" 
                    >
                      Practice
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/tests" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2"
                    >
                      Tests
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/profile" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2"
                    >
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/settings" 
                      className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2"
                    >
                      Settings
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side: avatar */}
          <div className="flex items-center space-x-4">
            {/* Avatar */}
            <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 transition-all">
              <AvatarImage src="/demo/avatar.jpg" />
              <AvatarFallback className="bg-blue-100 text-blue-700">CN</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
