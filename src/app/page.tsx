import { Header } from "@/components/Header";
import Link from "next/link";


export default function Home() {
  

  return (
    <main className="bg-[#081a26] min-h-screen w-full">
      <Header />

      <div className="grid lg:grid-cols-2 gap-6 md:gap-8 px-6 py-16 items-center relative z-10">

        <div className="text-center lg:text-left text-white space-y-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-[#FBFAF9]">
            Split Expenses, Not Friendships
          </h1>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-purple-300">
            The Trip Sharing App
          </h3>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0">
            BroSplit makes it effortless to manage group expenses during trips.
            Whether you're exploring the mountains or relaxing on a beach, keep your spending fair and transparent with friends.
          </p>

          <div className="mt-6">
            <Link href="/login">
              <button className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-6 py-3 rounded-full text-lg transition-all duration-300 shadow-md">
                Get Started
              </button>
            </Link>
           
          </div>
        </div>


        <div className="relative flex justify-center items-center min-h-[600px] animate-fade-in-delay">
          <div className="relative flex gap-8 justify-center items-center perspective-1000">
            <img
              src="/images/image1.webp"
              alt="Mockup 1"
              className="transition-all duration-700 ease-in-out transform hover:scale-110 hover:rotate-0 hover:z-20 hover:shadow-2xl border-2 border-white/20 w-72 h-[500px] object-cover rounded-2xl shadow-xl backdrop-blur-sm -rotate-6 hover:-translate-y-4 cursor-pointer animate-crossing"
            />
            <img
              src="/images/image2.webp"
              alt="Mockup 2"
              className="transition-all duration-700 ease-in-out transform hover:scale-110 hover:rotate-0 hover:z-20 hover:shadow-2xl border-2 border-white/20 w-72 h-[500px] object-cover rounded-2xl shadow-xl backdrop-blur-sm rotate-6 hover:-translate-y-4 cursor-pointer animate-crossing-reverse"
            />
          </div>
        </div>
      </div>
      <div className="bg-[#0a1e2e] text-white py-20 px-6">
  <div className="max-w-7xl mx-auto space-y-12">
    <div className="text-center space-y-4">
      <h1 className="text-3xl md:text-4xl font-bold text-[#FBFAF9]">
        Group Expenses, Simplified in 3 Steps
      </h1>
      <p className="text-lg text-gray-300 max-w-2xl mx-auto">
        BroSplit transforms the hassle of group expenses into a fast and intelligent experience.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-[#132c42] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer ">
        <h3 className="text-xl font-semibold text-purple-400 mb-2">1. Create a Trip</h3>
        <p className="text-gray-300">Start by creating a shared trip with friends and set a budget or destination.</p>
      </div>

      <div className="bg-[#132c42] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
        <h3 className="text-xl font-semibold text-purple-400 mb-2">2. Add Expenses</h3>
        <p className="text-gray-300">Each person can easily log their expenses, categorize them, and keep things transparent.</p>
      </div>

      <div className="bg-[#132c42] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
        <h3 className="text-xl font-semibold text-purple-400 mb-2">3. Split & Settle</h3>
        <p className="text-gray-300">Get instant breakdowns of who owes what, and settle up with just a tap.</p>
      </div>
    </div>
  </div>
</div>

<footer>
  <div className="text-center text-black-600 text-sm mt-6">
    <h1 className=" text-5xl"> Experience the Bro trip, <br /> sharing Today! </h1>
    <h2 className="text-3xl text-red-300 bg-black">Its all about the</h2>
    <p className="bg-black"> BroSplit. All rights reserved.</p> 
  </div>
</footer>
    </main>

  );
}
