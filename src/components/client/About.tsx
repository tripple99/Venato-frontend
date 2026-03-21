import React from 'react'
import { Card,CardContent,CardTitle,CardHeader,CardDescription } from "@/components/ui/card"
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Phone } from "lucide-react";
import { Mail } from "lucide-react";

export default function About() {
  return (
    <div className='my-10 flex items-center justify-center '>
      <Card className='p-5 rounded-2xl 
        backdrop-blur-xl 
        border border-white/20 
        shadow-lg w-xl'> 
     <CardHeader>
      <CardTitle>
       <h1 className='text-xl text-primary-venato flex items-center'> <Mail className='inline mr-4'/>Contact Us</h1>
      </CardTitle>
      <CardDescription>
         
      </CardDescription>

     </CardHeader>
     <CardContent>
      <Label className='  text-primary-venato  text-md '>Name</Label>
      <Input className='border-0 border-b-2 mb-5 border-[#0D6449] rounded-none text-lg  focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-2 focus:border-[#0D6449]'/>
      <Label className='  text-primary-venato  text-md'>Email</Label>
      <Input className=' border-0 border-b-2 mb-5 border-[#0D6449] rounded-none    text-lg  focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-2 focus:border-[#0D6449] '/>
        <Label className='  text-primary-venato  text-md'>Description</Label>
        <Textarea className='border-0 border-b-2 mb-5 border-[#0D6449] rounded-none    text-lg  focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-2 focus:border-[#0D6449] ' />
        <Button className='bg-primary-venato py-5'>Send Messages</Button>
     </CardContent>
      </Card>
    </div>
  )
}
