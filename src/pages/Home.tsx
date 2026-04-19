import Hero from '@/components/client/Hero'
import Features from '@/components/client/Features'
import About from '@/components/client/About'
import Footer from '@/components/client/Footer'


export default function Home() {
  return (
    <div className='w-full bg-white overflow-hidden'>
      <section id="hero">
        <Hero />
      </section>
      <section id="features-section">
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
