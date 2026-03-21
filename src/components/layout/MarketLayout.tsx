

import React, { useEffect, useState} from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { motion, AnimatePresence } from "framer-motion";
import { Search,Menu,X } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { type MarketNames } from '@/types/market.types'
import {Link} from 'react-router-dom';



 interface SidebarItem{
   id:string,
   title:string,
   children?:SidebarItem[]
 }
 const categories: SidebarItem[] = Object.entries({
  Grains: "Grains",
  LegumesAndNuts: "Legumes",
  Vegetables: "Vegetables",
  OilsAndSeeds: "Oils & Seeds",
  Livestock: "Livestock",
  RootsAndTubers: "Roots and Tubers",
  Fruits: "Fruit",
  Others: "Others",
}).map(([id, title]) => ({
  id,
  title,
}))

const marketNames : SidebarItem[] = Object.entries({
  Charanci : "Charanci",
  Ajiwa:"Ajiwa",
  Dawanau:"Dawanau"
}).map(([id,title])=>({
   id,
   title
}))
 const sidebarItems: SidebarItem[] = [
  {
    id: "category",
    title: "Category",
    children: categories, // all the categories from ICategory
  },
  {
    id: "filter",
    title: "Filter By",
    children: [
      { id: "price", title: "Price" },
      { id: "location", title: "Location",children:marketNames},
    ],
  },
]


export default function MarketLayout() {
  const [isOpen,setIsopen] = useState<boolean>(false)
  useEffect(()=>{

  })
  // const onOpen = (e:ReactHTMLElement)=>
  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-rubik">
      {/*Desktop side bar */}

      <div className="hidden md:flex fixed inset-y-0 left-0 w-64 border-r border-gray-200 bg-background/90 backdrop-blur-lg shadow-lg flex-col z-40">
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-primary-venato" ><Link to={'/'}>Venato</Link></h1>
        </div>

        <ScrollArea className="p-3 ml-3 my-7 flex-1">
          <Accordion type="multiple" className="space-y-3">
            {sidebarItems.map((parent) => (
              <AccordionItem key={parent.id} value={parent.id}>
                <AccordionTrigger className="text-xl text-primary-venato cursor-pointer  font-medium hover:no-underline">
                  {parent.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="pl-4 space-y-2">
                    {parent.children?.map((child) =>
                      child.title !== "Location" ? (
                        <li
                          key={child.id}
                          className="text-primary-venato text-lg hover:text-primary-venato/80 cursor-pointer transition"
                        >
                          {child.title}
                        </li>
                      ) : (
                        <AccordionItem key={child.id} value={child.id}>
                          <AccordionTrigger className="text-xl cursor-pointer hover:no-underline text-primary-venato font-medium">
                            {child.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul>
                              {child.children?.map((sub) => (
                                <li
                                  key={sub.id}
                                  className="text-primary-venato no-underline text-lg hover:text-primary-venato/80 cursor-pointer transition"
                                >
                                  {sub.title}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black md:hidden z-30"
              onClick={() => setIsopen(false)}
            />

            {/* Sidebar itself */}
            <motion.aside
              key="sidebar"
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 bg-background/90 backdrop-blur-lg shadow-lg flex flex-col md:hidden"
            >
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h1 className="text-3xl font-semibold text-primary-venato">
                  Venato
                </h1>
                <motion.div
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer text-primary-venato"
                  onClick={() => setIsopen(false)}
                >
                  <X size={28} />
                </motion.div>
              </div>

              <ScrollArea className="p-3 ml-3 my-7 flex-1">
                <Accordion type="multiple" className="space-y-3">
                  {sidebarItems.map((parent) => (
                    <AccordionItem key={parent.id} value={parent.id}>
                      <AccordionTrigger className="text-xl text-primary-venato font-medium hover:no-underline">
                        {parent.title}
                      </AccordionTrigger>
                      <AccordionContent>
                       {parent.children?.map((child) =>
                      child.title !== "Location" ? (
                        <li
                          key={child.id}
                          className="text-primary-venato text-lg hover:text-primary-venato/80 cursor-pointer transition"
                        >
                          {child.title}
                        </li>
                      ) : (
                        <AccordionItem key={child.id} value={child.id}>
                          <AccordionTrigger className="text-xl cursor-pointer hover:no-underline text-primary-venato font-medium">
                            {child.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul>
                              {child.children?.map((sub) => (
                                <li
                                  key={sub.id}
                                  className="text-primary-venato no-underline text-lg hover:text-primary-venato/80 cursor-pointer transition"
                                >
                                  {sub.title}
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </motion.aside>
          </>
        )}
      </AnimatePresence>




      {/* <div className={`${isOpen ?'visible' :'hidden'} transition-all duration-300 ease-in-out  fixed inset-y-0 z-30 left-0 md:block w-64 border-r bg-background ` }>
           <div className="flex h-full flex-col">
          <div className="p-5 border-b">
            <div className="flex items-center ">

              <div className="flex items-center  relative">
            <h1 className='text-4xl text-primary-venato font-semibold'>Venato</h1>
           <AnimatePresence>
  {isOpen && (
    <motion.div
      key="close-icon"
      initial={{ opacity: 0, scale: 0.8, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotate: 45 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="absolute top-2 left-47 cursor-pointer text-primary-venato"
      onClick={() => setIsopen(false)}
    >
      <X size={34} />
    </motion.div>
  )}
</AnimatePresence>

              </div>
            </div>
          </div>


      <ScrollArea className="flex-1 p-3 ml-3 my-7">
  <Accordion type="multiple" className="space-y-3">
    {sidebarItems.map((parent) => (
      <AccordionItem key={parent.id} value={parent.id} className=''>
        <AccordionTrigger className="text-xl text-primary-venato font-medium hover:no-underline hover:border-transparent">
          {parent.title}
        </AccordionTrigger>
        <AccordionContent>
          <ul className="pl-4 space-y-2">
            {parent.children?.map((child) => (
            child.title !== "Location" ? <li key={child.id} className="text-primary-venato text-lg hover:text-primary-venato cursor-pointer">
                {child.title }
              </li>:(
                 <AccordionItem key={child.id} value={child.id} className=''>
                    <AccordionTrigger className="text-xl text-primary-venato font-medium hover:no-underline hover:border-transparent">{child.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul>
                      {child.children?.map((child)=>(
                         <li key={child.id} className="text-primary-venato text-lg hover:text-primary-venato cursor-pointer">
                {child.title }
              </li>
                      ))}  <li></li>
                      </ul>

                    </AccordionContent>
                 </AccordionItem>

              )
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</ScrollArea>
      </div>


      </div> */}
       {/* Mobile Navbar */}



      {/* {main Content} */}
      <div>
        <header className='sticky top-0 l z-10 flex justify-between h-19 items-center   gap-3 border-b bg-background/95 px-8 backdrop-blur'>
          <div className='flex gap-3 relative md:ml-80'>
           <Button  onClick={()=> setIsopen(!isOpen)} size="icon" className="md:hidden  bg-primary-venato" >
            <Menu className="h-5 w-5 bg-primary-venato" />
          </Button>
            <Input placeholder='Search For Product' className='py-4 px-8'/>
            <span><Search size={20} className='absolute top-2 left-14 md:top-2 md:left-2  text-gray-400'/></span>
            <Button className='bg-primary-venato ' >Search</Button>
          </div>
          <div className=''>
           <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <img
                    src="https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png"
                    alt="User avatar"
                    width={28}
                    height={28}
                    className="rounded-full ring-2 ring-primary_elra dark:ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-[280px] sm:w-80 bg-background border-border rounded-lg shadow-lg"
                >

                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </header>
      </div>
    </div>
  )
}
