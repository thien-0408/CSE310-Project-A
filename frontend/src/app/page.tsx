import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main>
     <h1 className="text-4xl">Main page</h1>
     <ul>
      <li>
        <Button><Link href={'/login'}>Login</Link></Button>
      </li>
      <li>
        <Button><Link href={'/register'}>Register</Link></Button>
      </li>
     </ul>
    </main>
  );
}
