import React, { useRef } from "react"
import { UserPlus, LineChart, BarChartBig } from "lucide-react"
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
interface Step {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgGlow: string
  image:string
}

import { images } from "@/assets/images"



function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

export const steps: Step[] = [
  {
    id: 1,
    title: "Sign Up & Onboard",
    description:
      "Create your Venato account in minutes and access a dashboard built for farmers and agricultural investors.",
    icon: <UserPlus size={50} className="text-primary-venato" />,
    color: "from-green-500 to-green-600",
    bgGlow: "bg-green-500/10",
    image:images.onboarding
  },
  {
    id: 2,
    title: "View Real-Time Prices",
    description:
      "Track the latest market prices for crops and produce without relying on middlemen or third-party reports.",
    icon: <LineChart size={50} className="text-primary-venato" />,
    color: "from-yellow-500 to-yellow-600",
    bgGlow: "bg-yellow-500/10",
    image:images.market
  },
  {
    id: 3,
    title: "Gain Market Insights",
    description:
      "Analyze price trends, compare commodities, and make data-driven decisions for your investments or harvests.",
    icon: <BarChartBig size={50} className="text-primary-venato" />,
    color: "from-blue-500 to-blue-600",
    bgGlow: "bg-green-500/10",
    image:images.trend
  },
]

 function CTAButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Button className="px-5 py-6 text-lg font-semibold rounded-xl bg-primary-venato text-white shadow-lg hover:bg-primary-venato/90 ">
     <Link to={"/"}>

     Get Started  <ArrowRight size={24} className="text-white inline-block" />
     </Link>
        
      
      
      </Button>
    </motion.div>
  )
}


function AnimatedCard({ step }: { step: Step }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 .2", "1.2 1"], // when card enters/leaves viewport
  })
  const y = useParallax(scrollYProgress, 80) // 80px parallax shift

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className={`min-h-[550px] bg-${step.bgGlow} text-${step.color} my-5`}>
        <CardHeader>
          <div className="flex items-center justify-between ">
                <div> {step.icon}</div>
                <CTAButton/>

          </div>
    
          <CardTitle className="text-2xl my-5">
            {step.title}
          </CardTitle>
          <CardDescription className="text-lg text-black">
            {step.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
         <img
          src={step.image}
          
          className="w-full h-100 object-cover rounded-xl"
 
         />
        
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function Setup() {
  return (
    <section className="relative py-20">
      {/* Glassmorphism wrapper with #0D6449 tint */}
      <div className="py-26  rounded-2xl 
         /* green tint with transparency */
        backdrop-blur-xl 
        border border-white/20 
        shadow-lg">
        
        <h1 className="text-primary-venato text-center text-5xl mb-30 font-semibold">
          How Venato Works
        </h1>

        <div className="grid grid-cols-1 mx-auto gap-10 lg:grid-cols-1 items-center justify-center max-w-xl">
          {steps.map((val) => (
            <AnimatedCard key={val.id} step={val} />
          ))}
        </div>
      </div>
    </section>
  )
}
