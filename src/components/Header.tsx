'use client'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/ModeToggle"

export function Header() {
     const router = useRouter();

    const handleSubmit = async(e:React.FormEvent)=> {
    console.log("icon clicked")
    e.preventDefault();
    router.push('/login')
  }

  return (
    <header>
      <div className="flex justify-between items-center h-16 bg-[#0d0c0f] px-6">
        <h1 className="text-3xl font-semibold text-[#4269D7]">Bro Split</h1>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button className="text-white bg-[#4269D7]" onClick={handleSubmit}>Get Started</Button>
        </div>
      </div>
    </header>
  )
}
