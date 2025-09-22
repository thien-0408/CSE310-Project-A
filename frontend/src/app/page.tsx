import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center ">
        <ul className="p-4">
          <li className="mb-3">
            <Button>
              <Link href={"/login"}>Login</Link>
            </Button>
          </li>
          <li className="mb-3">
            <Button>
              <Link href={"/register"}>Register</Link>
            </Button>
          </li>
          <li className="mb-3">
            <Button>
              <Link href={"/homepage"}>Home</Link>
            </Button>
          </li>
          <li className="mb-3">
            <Button>
              <Link href={"/practice"}>User Practice</Link>
            </Button>
          </li>
          <li className="mb-3">
            <Button>
              <Link href={"/landingpage"}>Landing Page</Link>
            </Button>
          </li>
          <li className="mb-3">
            <Button>
              <Link href={"/dashboard"}>DashBoard</Link>
            </Button>
          </li>
        </ul>
      </div>
    </main>
  );
}
