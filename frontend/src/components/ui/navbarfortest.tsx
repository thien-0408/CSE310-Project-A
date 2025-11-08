'use client'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

import Image from "next/image";
import FullScreenButton from "@/components/ui/fullscreen";


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
                <Link href={'/dashboard'}>IELTSSprint</Link>
              </h1>
            </div>
            
            
          </div>

          {/* Right group */}
          <div className="flex items-center">
            
          </div>

        </div>
      </div>
    </header>
  );
}


    