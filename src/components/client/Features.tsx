import { TrendingUp, BarChart, Clock, MapPin } from "lucide-react"
import { Card,CardContent,CardTitle,CardHeader,CardDescription } from "@/components/ui/card"
import { motion } from "framer-motion"

export interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

export const features: Feature[] = [
  {
    id: "1",
    title: "Real-Time Price Updates",
    description: "Stay updated on daily food prices across markets near you, ensuring you never overpay.",
    icon: <TrendingUp className="w-8 h-8  mb-4 " />,
  },
  {
    id: "2",
    title: "Market Comparisons",
    description: "Easily compare prices across multiple markets to find the most affordable options.",
    icon: <BarChart className="w-8 h-8  mb-4 " />,
  },
  {
    id: "3",
    title: "Price History",
    description: "Track changes in food prices over time and identify seasonal patterns.",
    icon: <Clock className="w-8 h-8 mb-4 " />,
  },
  {
    id: "4",
    title: "Nearby Markets",
    description: "Discover price trends and availability in markets closest to your location.",
    icon: <MapPin className="w-8 h-8 mb-4 " />,
  },
]

export default function Features() {
  return (
    <div className="py-7 ">
      <h1 className="text-5xl mb-10 font-bold text-primary-venato  text-center">Features</h1>
      <div className="grid justify-between items-center mx-12 grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-5">
        {features.map((val) => (
          <motion.div
            key={val.id}
            className="py-5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: .5, delay: parseInt(val.id) * 0.1 }}
            whileHover={{ scale: 1.05 }}
            viewport={{ once: true }}
          >
            <Card className="bg-primary-venato text-white shadow-lg rounded-2xl">
              <CardHeader>
                {val.icon}
                <CardTitle className="text-xl mb-4">{val.title}</CardTitle>
                <CardDescription className="text-sm text-white">
                  {val.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
