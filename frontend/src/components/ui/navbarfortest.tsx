'use client'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

import Image from "next/image";
import FullScreenButton from "@/components/ui/fullscreen";


import { Button } from "@/components/ui/button";
export default function NavbarTest() {
  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
            {/*Left group*/}
          <div className="flex items-center space-x-8">
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
            
            
          </div>

          {/* Right group */}
          <div className="flex items-center">
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="flex space-x-5 text-sm">
                <NavigationMenuItem>
                  <FullScreenButton></FullScreenButton>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button className="rounded-3xl bg-[#336699] hover:bg-blue-700 transition-all duration-300">Submit</Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

        </div>
      </div>
    </header>
  );
}


    