import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Link as RouterLink } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useRef } from "react";
import { useEffect } from "react";
interface Components{
  title:string,
  href:string,
}

const components:Components[] = [
  {
    title:"Home",
    href:"hero"
  },
  {
    title:"Markets",
    href:"/markets"
  },
  {
    title:"Features",
    href:"features"
  },
  {
    title:"Contact Us",
    href:"contact-us"
  },
]


export default function Navbar() {
  const sideRef = useRef<HTMLDivElement>(null);

  const[isOpen,setIsOpen] = useState<boolean>(true)


  useEffect(()=>{
    const handleClick = (e:MouseEvent)=>{
       if (sideRef.current && !sideRef.current.contains(e.target as Node)) {
         setIsOpen(false);
    }
    }
    document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
  },[])
  return (
    <>
       {/* // large screens */}
  <div className="hidden sticky top-0 z-2 lg:flex justify-between items-center text-white bg-primary-venato py-5 px-6">
  {/* Logo */}
  <div className="mx-5">
    <h1 className="text-3xl font-bold mr-6">Venato</h1>

  </div>  

  {/* Nav links */}
  <div className="flex flex-1 justify-center mx-5">
    {components.map((val, index) => (
      <span
        key={index}
        className="text-lg font-semibold mx-3 hover:bg-white/5 p-3 rounded"
      >
      {val.title !== "Markets" ? <ScrollLink offset={-70}  to={val.href} className="cursor-pointer">{val.title}</ScrollLink>:<RouterLink to={val.href}  >{val.title}</RouterLink>}
      </span>
    ))}
  </div>

  {/* Buttons */}
  <div className="flex gap-2">
    <Button asChild className="bg-white text-black w-full hover:bg-white/20">
      <RouterLink to="/auth/register">Get Started</RouterLink>
    </Button>
  </div>
</div>
 {/* //Medium and small screens */}
 <div className="relative">
   <div className="lg:hidden  flex justify-between items-center w-full bg-primary-venato text-white py-5 px-6">
     {/* Logo */}
  <div className="mx-5">
    <h1 className="text-3xl font-bold mr-6">Venato</h1>
  </div>  
  <div className="">
  <Button onClick={()=>setIsOpen(true)} className="bg-transparent p-0 rounded-none  border-0 cursor-pointer">{<Menu/> }</Button> 
  </div>

 </div>
      {/* Sidebar */}
   <div
   ref={sideRef}
  className={`
    lg:hidden fixed top-0 right-0 bg-[#ffff] h-full w-[46%] rounded shadow-2xl z-50 
    transform transition-transform duration-300 ease-up-out
    ${isOpen ? "translate-x-0" : "translate-x-full"}
  `}
>
   <div className="mb-20"><X onClick={()=>setIsOpen(false)} size={32} className=" lg:hidden absolute m-3 text-primary-venato"/></div>  
     <div className="flex flex-col  justify-between space-y-9  mx-2 ">
      {components.map((val, index) => (
        <div>
              <span
        key={index}
        className="text-lg font-semibold mx-3 hover:bg-white/5 p-2 rounded "
      >
        {val.title !== "Markets" ? <ScrollLink offset={-70}  to={val.href} className="cursor-pointer">{val.title}</ScrollLink>:<RouterLink to={val.href}  >{val.title}</RouterLink>}
         
      </span>
     <span className="block border-b border-primary-venato mt-2"></span>
        </div>
        
     
    ))}
     <div className="flex flex-col gap-4">
    <Button asChild className="bg-primary-venato w-full text-white">
      <RouterLink to="/auth/register">Get Started</RouterLink>
    </Button>

  </div>
      </div> 
</div>

 </div>

    </>
 
 
     
  )
}
