import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
export default function FooterUser(){
    return(
        <>
        <footer className="mt-auto pb-8 bg-white px-40">
        <Separator className="mb-6" />
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6 text-sm text-gray-900 font-medium">
            <Link href={''}>Resources</Link>
            <Link href={''}>Company</Link>
            <Link href={''}>Support</Link>
          </div>
          <div className="flex items-center space-x-6 text-gray-500">
            <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" aria-label="Linkedin"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>
      </footer>
        </>
    )

}