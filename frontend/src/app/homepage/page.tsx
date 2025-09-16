import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <>
      <div className="sticky top-0 z-50">
        <NavBar />
      </div>
      {/* Hero Banner Section */}
      <section className="w-full  bg-gradient-to-br from-[#dfe9fa] via-[#c8daf8] to-[#85acef] relative overflow-hidden p-40">
        <div className="container mx-auto">
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
                
                <p className="text-gray-700  text-xl leading-relaxed max-w-2xl">
                  IELTS Sprint provides comprehensive practice tests, study materials, 
                  and personalized feedback to help you achieve your desired band score. 
                  Start your journey to global opportunities today!
                </p>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Practicing
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
    </>
  );
}
