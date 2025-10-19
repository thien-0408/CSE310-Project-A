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
    <header className="  w-full bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
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
                <Link href={'/homepage'}>IELTS Sprint</Link>
              </h1>
            </div>

            {/* Navigation Menu - flows naturally from logo */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex items-center space-x-1 text-sm">
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/homepage" 
                      className="text-gray-700 font-medium px-3 py-2 tracking-tighter rounded-full hover:p-4 hover:text-white hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] transition-all duration-300"
                    >
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

            
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/landingpage" 
                      className="text-gray-700 font-medium px-3 py-2 tracking-tighter rounded-full hover:p-4 hover:text-white hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] transition-all duration-300"
                    >
                      Practice
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/tests" 
                      className="text-gray-700 font-medium px-3 py-2 tracking-tighter rounded-full hover:p-4 hover:text-white hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] transition-all duration-300"
                    >
                      Tests
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/login" 
                      className="text-gray-700 font-medium px-3 py-2 tracking-tighter rounded-full hover:p-4 hover:text-white hover:bg-gradient-to-r from-[#00c6ff] to-[#0072ff] transition-all duration-300"
                    >
                      About Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            
          </div>

          <NavigationMenu className="flex md:pr-30 ">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/login" 
                      className="font-medium px-5 py-2 tracking-tighter rounded-full hover:py-3 text-white bg-gradient-to-r from-[#00c6ff] to-[#0072ff] transition-all duration-300"
                    >
                      Sign In
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link 
                      href="/register" 
                      className=" font-medium px-5 py-2 tracking-tighter rounded-full hover:py-3 text-gray-600 shadow-lg bg-white transition-all duration-300"
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
