import Hero from '@/components/client/Hero'
import Features from '@/components/client/Features'
import About from '@/components/client/About'
import Footer from '@/components/client/Footer'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scroller } from 'react-scroll'

export default function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      setTimeout(() => {
        scroller.scrollTo(id, {
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart',
          offset: -80,
        });
      }, 100);
    }
  }, [hash]);

  return (
    <div className='w-full bg-white overflow-hidden'>
      <section id="hero">
        <Hero />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="cta">
        <About />
      </section>
      <section id="footer">
        <Footer />
      </section>
    </div>
  )
}
