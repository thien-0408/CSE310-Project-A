import { Button } from "@/components/ui/button";
import NavBarUser from "@/components/ui/navbarforuser";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function UserDashBoard() {
  return (
    <>
      <NavBarUser></NavBarUser>
      <main className="p-10 px-20">
        {/*First section */}
        <section>
          {/**Big div for text & button */}
          <div className="mb-10">
            {/*Text div */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold mb-4">
                Master IELTS with
                <span className=" bg-gradient-to-b from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">
                  {" "}
                  Confidence
                </span>
              </h1>
              <p className="">
                IELTS Sprint provides comprehensive practice tests, study
                materials, and <br /> personalized feedback to help you achieve
                your desired band score. Start your <br /> journey to global
                opportunities today!
              </p>
            </div>
            {/*Buttons div */}
            <div className="flex gap-4">
              <Button 
                type="submit"
                className=" bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md  "
              >
                Start Practicing
              </Button>
              <Button type="submit" className="bg-white border font-bold border-gray-400 text-black hover:bg-gray-100">
                Learn More
              </Button>
            </div>
          </div>
          <div></div>
        </section>

        {/*Second section*/}
        <section>
          {/*Big div */}
          <div className="flex items-center gap-10 text-center">
            <div>
              <Card className="bg-gray-50 rounded-md">
                <div className="flex items-center">
                    <Image
                  src="/demo/personal-learning.jpg"
                  alt="personal learning"
                  width={"300"}
                  height={200}
                  quality={100}
                />
                </div>
                <CardHeader>
                  <CardTitle>Personalized Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Tailored study plans and content based on your strengths and
                    weaknesses for maximum progress.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-gray-50 rounded-md">
                <Image
                  src="/demo/extensive-resource.jpg"
                  alt="personal learning"
                  width={200}
                  height={100}
                  
                />

                <CardHeader>
                  <CardTitle>Extensive Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Access a vast library of practice questions, mock tests, and
                    detailed explanations for all modules.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-gray-50 rounded-md">
                <Image
                  src="/demo/extensive-resource.jpg"
                  alt="personal learning"
                  width={200}
                  height={100}
                  
                />

                <CardHeader>
                  <CardTitle>Extensive Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Access a vast library of practice questions, mock tests, and
                    detailed explanations for all modules.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
