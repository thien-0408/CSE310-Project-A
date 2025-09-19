import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      {/* Hero Banner Section */}
      <section className="w-full  bg-gradient-to-br from-[#dfe9fa] via-[#c8daf8] to-[#85acef] relative overflow-hidden p-40">
        <div className=" mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div className="flex flex-col space-y-8 text-left">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight">
                  <span className="text-gray-900">Master IELTS</span>
                  <br />
                  <span className="text-gray-900">with</span>
                  <br />
                  <span className="bg-gradient-to-r font-extrabold from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    Confidence
                  </span>
                </h1>

                <p className="text-gray-700 leading-relaxed max-w-2xl">
                  IELTS Sprint provides comprehensive practice tests, study
                  materials, and personalized feedback to help you achieve your
                  desired band score. Start your journey to global opportunities
                  today!
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href={'/login'}>Start Practicing</Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white bg-white/20 backdrop-blur-sm text-gray-800 hover:bg-white hover:text-gray-900 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl transform rotate-6"></div>
                <div className="relative bg-gradient-to-br from-[#2c3e50] to-[#3498db] rounded-3xl p-8 shadow-2xl">
                  <Image
                    src="/assets/banner-for-homepage.png"
                    alt="IELTS Learning Illustration - Student studying with digital learning tools"
                    width={600}
                    height={480}
                    quality={100}
                    className="w-full h-auto max-w-lg rounded-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-xl"></div>
      </section>

      <main >
        {/*Benefit section*/}
        <section className="py-20 px-40">
          <div className="container mx-auto px-6 lg:px-8 ">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900">
              What IELTS Sprint Offers
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div>
              <Card className="h-full text-center flex flex-col rounded-md border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <i className="fa-solid fa-book-open text-[#4b91e2] text-5xl"></i>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                    Full-Length Mock Tests
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600">
                    Practice with realistic mock tests designed to simulate the
                    actual IELTS exam environment for all modules.
                  </CardDescription>
                </div>
              </Card>
            </div>

            {/* Card 2 */}
            <div>
              <Card className="h-full text-center flex flex-col rounded-md border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <i className="fa-solid fa-award text-[#4b91e2] text-5xl"></i>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                    Comprehensive Study Materials
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600">
                    Access a rich library of study guides, vocabulary lists, and
                    grammar exercises tailored for IELTS success.
                  </CardDescription>
                </div>
              </Card>
            </div>

            {/* Card 3 */}
            <div>
              <Card className="h-full text-center flex flex-col rounded-md border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <i className="fa-solid fa-user-tie text-[#4b91e2] text-5xl"></i>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                    Personalized Feedback
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600">
                    Receive detailed, actionable feedback on your writing and
                    speaking to identify areas for improvement.
                  </CardDescription>
                </div>
              </Card>
            </div>

            {/* Card 4 */}
            <div>
              <Card className="h-full text-center flex flex-col rounded-md border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <i className="fa-solid fa-bullseye text-[#4b91e2] text-5xl"></i>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                    Progress Tracking & Analytics
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600">
                    Monitor your performance with insightful analytics and track
                    your progress across different skills over time.
                  </CardDescription>
                </div>
              </Card>
            </div>

            {/* Card 5 */}
            <div>
              <Card className="h-full text-center flex flex-col rounded-md border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <i className="fa-solid fa-graduation-cap text-[#4b91e2] text-5xl"></i>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                    Expert Tips & Strategies
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600">
                    Learn proven techniques and strategies from experienced
                    IELTS instructors to maximize your score.
                  </CardDescription>
                </div>
              </Card>
            </div>

            {/* Card 6 */}
            <div>
              <Card className="h-full text-center flex flex-col rounded-md border-0 shadow-sm hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-center items-center mb-6">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <i className="fa-solid fa-lightbulb text-[#4b91e2] text-5xl"></i>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                    Interactive Learning Modules
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-gray-600">
                    Engage with interactive lessons and quizzes that make
                    learning fun and effective for all levels.
                  </CardDescription>
                </div>
              </Card>
            </div>
          </div>
        </div>
        </section>

        {/*Success path*/}
        <section>
          <div className="w-full bg-gray-50 flex items-center px-70 py-30">
            <div className="flex-1">
              {/**Image section */}
              <Image src='/assets/success-path.jpg' alt="" width={450} height={350} quality={100} className="rounded-md"></Image>
            </div>

            <div className="flex-1">
              {/**Caption */}
              <div className="pb-4">
                <h1 className="text-3xl font-extrabold">Your Path to IELTS</h1>
                <span className="text-3xl font-extrabold">Success </span>
                <span className="text-3xl font-extrabold bg-gradient-to-r from-[#0b8ff4] to-[#02f0c8] bg-clip-text text-transparent">Starts Here</span>
              </div>

              <div>
                <p>
                  Prepare with the best resources, designed by experts, 
                  to ensure you are fully ready for every section of the IELTS exam. 
                  Our platform adapts to your learning style, providing a truly personalized experience.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
