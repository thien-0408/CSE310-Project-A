import NavBar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import ScrollTop from "@/components/ui/scroll-top";

export default function LandingPage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <NavBar></NavBar>
      </div>
      <header className="w">
        {/*Hero banner section*/}
        <section className="w-full bg-gradient-to-br from-[#dfe9fa] via-[#c8daf8] to-[#85acef] relative overflow-hidden lg:p-40 p-10">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Content Section */}
              <div className="flex flex-col space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight">
                    <span className="text-gray-900">
                      Master Your IELTS Exam with
                    </span>
                    <br />
                    <span className="bg-gradient-to-r font-extrabold from-blue-600 to-cyan-500 bg-clip-text text-transparent sm:text-center">
                      Confidence
                    </span>
                  </h1>

                  <p className="text-gray-700 leading-relaxed max-w-2xl tracking-tighter">
                    IELTS Sprint provides tailored practice, personalized
                    feedback, and expert resources to help you achieve your
                    desired band score. Start your journey to success today!
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={"/login"}>Start Your IELTS Journey</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white bg-white/20 backdrop-blur-sm text-gray-800 hover:bg-white hover:text-gray-900 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Explore Features
                  </Button>
                </div>
              </div>

              {/* Image Section */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-3xl blur-xl transform rotate-6"></div>
                  <div className="relative bg-gradient-to-br from-[#2c3e50] to-[#3498db] rounded-3xl p-8 shadow-2xl">
                    <Image
                      src="/assets/banner-for-landingpage.png"
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
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-xl"></div>
          </div>
        </section>
      </header>
      <main>
        {/*Reason section*/}
        <section className="reason-section py-20 px-10 lg:px-20 tracking-tight">
          <div className="container mx-auto px-6 lg:px-8">
            {/*Heading*/}
            <div className="heading-holder text-center mb-16">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                Why Choose IELTS Sprint?
              </h1>
              <h5 className="text-[18px] font-normal text-gray-700 pt-[20px] tracking-tighter">
                Our platform is engineered to deliver results, offering a unique
                blend of comprehensive practice and personalized support.
              </h5>
            </div>
            {/*Card holder*/}
            <div className="card-holder grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-8">
              {/*Card 1*/}
              <div className="hover:scale-105 transition-transform duration-300">
                <Card className="h-full text-center flex flex-col rounded-md border-1 border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-center items-center mb-6">
                    <div className="icon-holder w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-circle-check text-[#4b91e2] text-5xl"></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Comprehensive Practice Modules
                    </CardTitle>
                    <CardDescription className=" font-medium leading-relaxed text-gray-600">
                      Access a wide array of practice tests covering all
                      sections: Listening, Reading, Writing, and Speaking. Each
                      module is designed to mirror the actual IELTS exam format,
                      ensuring you are well-prepared for test day.
                    </CardDescription>
                  </div>
                </Card>
              </div>

              {/*Card 2*/}
              <div className="hover:scale-105 transition-transform duration-300">
                <Card className="h-full text-center flex flex-col rounded-md border-1 border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-center items-center mb-6">
                    <div className="icon-holder w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-flask text-[#4b91e2] text-5xl"></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Personalized Performance Analytics
                    </CardTitle>
                    <CardDescription className=" font-medium leading-relaxed text-gray-600">
                      Track your progress with detailed analytics that highlight
                      your strengths and pinpoint areas needing improvement. Our
                      intelligent system adapts to your learning pace, offering
                      tailored recommendations.
                    </CardDescription>
                  </div>
                </Card>
              </div>

              {/*Card 3*/}
              <div className="hover:scale-105 transition-transform duration-300">
                <Card className="h-full text-center flex flex-col rounded-md border-1 border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6">
                  <div className="flex justify-center items-center mb-6">
                    <div className="icon-holder w-16 h-16 flex items-center justify-center">
                      <i className="fa-solid fa-book-open text-[#4b91e2] text-5xl"></i>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <CardTitle className="text-2xl font-semibold mb-4 leading-tight text-gray-900">
                      Expert Study Resources & Tips
                    </CardTitle>
                    <CardDescription className=" font-medium leading-relaxed text-gray-600">
                      Dive into a rich library of expert-curated study
                      materials, grammar guides, vocabulary builders, and proven
                      strategies to maximize your score. Learn from the best, at
                      your own pace.
                    </CardDescription>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/*Student Opinion Section*/}
        <section className="student-opinion-section mt-20 bg-gray-100 py-20 px-10 lg:px-30 tracking-tight">
          <div className="container ml-auto mr-auto lg:px-8">
            {/*Heading*/}
            <div className="heading-holder text-center mb-16">
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
                What Our Students Say
              </h1>
              <h5 className="text-[18px] font-normal text-gray-700 pt-[20px] tracking-tighter">
                Hear what our successful students have to say about their IELTS
                Sprint experience.
              </h5>
            </div>
            {/*Card Holder*/}
            <div className="card-holder grid lg:grid-cols-2 sm:grid-cols-1 gap-10">
              {/*Card 1*/}
              <div>
                <Card className="h-full text-center flex flex-col gap-3 rounded-md border-1 border-gray-100 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="student-opinion px-10">
                    <p className="italic leading-relaxed font-medium">
                      “IELTS Sprint was instrumental in helping me achieve a
                      Band 8.0! The practice modules were incredibly realistic,
                      and the personalized feedback helped me fine-tune my
                      writing skills. Highly recommended for anyone serious
                      about their IELTS score.”
                    </p>
                  </div>
                  <br/>
                  <div className="flex justify-center">
                    <Separator className="w-1/2 mb-8"></Separator>
                  </div>
                  <div className="student-information-holder flex flex-row justify-center gap-3 mt-auto">
                    <div className="student-icon">
                      <Image
                        src="/assets/avatar-landing-page.jpg"
                        alt="User avatar"
                        width={60}
                        height={60}
                        className="inline-block rounded-full outline -outline-offset-1 outline-white/10"
                      />
                    </div>
                    <div className="student-information flex flex-col text-left mt-auto mb-auto">
                      <h5 className="name font-bold">Aisha Khan</h5>
                      <p>University Student, India</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/*Card 2*/}
              <div>
                <Card className="h-full text-center flex flex-col gap-3 rounded-md border-1 border-gray-100 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="student-opinion px-10">
                    <p className="italic leading-relaxed font-medium">
                      “As a working professional, time is precious. IELTS Sprint
                      allowed me to study efficiently with its well-structured
                      courses and flexible schedule. I improved my score
                      significantly and gained admission to my desired program
                      abroad.”
                    </p>
                  </div>
                  <br />
                  <div className="flex justify-center">
                    <Separator className="w-1/2 mb-8"></Separator>
                  </div>
                  <div className="student-information-holder flex flex-row justify-center gap-3 mt-auto">
                    <div className="student-icon">
                      <Image
                        src="/assets/avatar-landing-page.jpg"
                        alt="User avatar"
                        width={60}
                        height={60}
                        className="inline-block rounded-full outline -outline-offset-1 outline-white/10"
                      />
                    </div>
                    <div className="student-information flex flex-col text-left mt-auto mb-auto">
                      <h5 className="name font-bold">David Miller</h5>
                      <p>Working Professional, UK</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/*Card 3*/}
              <div>
                <Card className="h-full text-center flex flex-col gap-3 rounded-md border-1 border-gray-100 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="student-opinion px-10">
                    <p className="italic leading-relaxed font-medium">
                      “The speaking practice sessions on IELTS Sprint were a
                      game-changer. The detailed feedback and sample answers
                      helped me overcome my nervousness and speak confidently. I
                      scored Band 7.5 and am now ready for my immigration
                      journey!”
                    </p>
                  </div>
                  <br />
                  <div className="flex justify-center">
                    <Separator className="w-1/2 mb-8"></Separator>
                  </div>
                  <div className="student-information-holder flex flex-row justify-center gap-3 mt-auto">
                    <div className="student-icon">
                      <Image
                        src="/assets/avatar-landing-page.jpg"
                        alt="User avatar"
                        width={60}
                        height={60}
                        className="inline-block rounded-full outline -outline-offset-1 outline-white/10"
                      />
                    </div>
                    <div className="student-information flex flex-col text-left mt-auto mb-auto">
                      <h5 className="name font-bold">Chen Wei</h5>
                      <p>Aspiring Immigrant, China</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/*Card 4*/}
              <div>
                <Card className="h-full text-center flex flex-col gap-3 rounded-md border-1 border-gray-100 shadow-sm hover:shadow-lg hover:scale-105 transition-transform duration-300">
                  <div className="student-opinion px-10">
                    <p className="italic leading-relaxed font-medium">
                      “I needed to pass IELTS for a teaching position abroad.
                      IELTS Sprint&apos;s writing tutorials broke down complex
                      tasks into manageable steps, and the grammar resources
                      were invaluable. I passed with flying colors!”
                    </p>
                  </div>
                  <br />
                  <div className="flex justify-center">
                    <Separator className="w-1/2 mb-8"></Separator>
                  </div>
                  <div className="student-information-holder flex flex-row justify-center gap-3 mt-auto">
                    <div className="student-icon">
                      <Image
                        src="/assets/avatar-landing-page.jpg"
                        alt="User avatar"
                        width={60}
                        height={60}
                        className="inline-block rounded-full outline -outline-offset-1 outline-white/10"
                      />
                    </div>
                    <div className="student-information flex flex-col text-left mt-auto mb-auto">
                      <h5 className="name font-bold">Maria Rodriguez</h5>
                      <p>High School Teacher, Spain</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ScrollTop></ScrollTop>
    </>
  );
}
