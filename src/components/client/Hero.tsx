import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

export default function Hero() {
  return (
    <div className='flex  max-w-2xl  ml-12  py-32 sm:py-48 lg:py-40 mx-8 h-max'>
      <div className='flex-1 lg:pr-10 '>
          <h1 className='text-5xl text-primary-venato  font-bold mb-7 leading-[4rem]'>Track Food Prices in Real Time</h1>
     <p className='text-lg font-semibold mb-4 leading-loose'>Venato helps you stay informed with real-time updates on food prices from different markets around you. 
      Whether it’s rice, tomatoes, maize, or other everyday essentials, you can see today’s prices, track changes over time, 
      and compare across multiple markets — all in one place.</p>
      <div className="flex w-full max-w-sm items-center gap-5 mt-6">
      <Input type="text" placeholder="Search for product" className='p-4'  />
      <Button type="submit" className='bg-primary-venato px-6 cursor-pointer' >
       Search
      </Button>
    </div>
      </div>
      
    </div>
  )
}

