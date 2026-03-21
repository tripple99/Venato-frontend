import React from 'react'
import { Outlet } from 'react-router-dom'
import Hero from '@/components/client/Hero'
import Features from '@/components/client/Features'
import Setup from '@/components/client/Setup'
import About from '@/components/client/About'
import Footer from '@/components/client/Footer'


export default function Home() {
  return (

    <div className='w-full'>
      <section id="hero">
        <Hero />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="setup">
        <Setup />
      </section>
      <section id="contact-us">
        <About />
      </section>
      <section id="footer">
        <Footer />
      </section>
    </div>
  )
}
