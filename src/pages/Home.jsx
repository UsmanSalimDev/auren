import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock3, Gift, Leaf } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fragrances } from '../data/fragrances.js'
import { pageContent } from '../data/pageContent.js'
import logo from '../assets/logo.png'
import ProductCard from '../components/ProductCard.jsx'
import CoupleOffer from '../components/CoupleOffer.jsx'
import Newsletter from '../components/Newsletter.jsx'
import bg from '../assets/bg.png'
gsap.registerPlugin(ScrollTrigger)

export default function Home({ onAdd, onAddPair }) {
  const heroCopy = useRef(null)

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.from('.hero-line', {
        y: 44,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.15,
      })
      gsap.from('.hero-background', {
        opacity: 0,
        scale: 1.04,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.1,
      })
      gsap.from('.signature-card', {
        scrollTrigger: { trigger: '.signature-grid', start: 'top 84%' },
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power2.out',
      })
    }, heroCopy)
    return () => context.revert()
  }, [])

  return (
    <>
      <main ref={heroCopy}>
        <section className="hero">
          <div className="hero-background">
            <img src={bg} alt="" fetchPriority="high" />
          </div>
          <div className="hero-grain" />
          <div className="hero-copy">
            <p className="hero-kicker hero-line"><span /> {pageContent.home.heroKicker} <span /></p>
            <h1 className="hero-line">{pageContent.home.heroTitle[0]}<br />{pageContent.home.heroTitle[1]} <em>{pageContent.home.heroTitle[2]}</em></h1>
            <p className="hero-description hero-line">
              {pageContent.home.heroDescription[0]}<br />
              {pageContent.home.heroDescription[1]}<br className="desktop-break" /> {pageContent.home.heroDescription[2]}
            </p>
            <div className="hero-actions hero-line">
              <Link className="button button-gold" to="/shop">Explore all fragrances <ArrowRight size={15} /></Link>
            </div>
          </div>
        </section>

        <CoupleOffer onAdd={onAdd} onAddPair={onAddPair} />

        <section className="signature section-shell" id="collection">
          <div className="section-heading">
            <span className="section-overline">THE</span>
            <h2><span />SIGNATURE COLLECTION<span /></h2>
          </div>
          <div className="signature-grid">
            {fragrances.slice(0, 2).map((fragrance) => (
              <article className="signature-card" key={fragrance.id}>
                <Link to={`/shop/${fragrance.id}`} className="signature-image">
                  <img src={fragrance.image} alt={`${fragrance.name} fragrance`} loading="lazy" />
                </Link>
                <div className="signature-copy">
                  <p className="eyebrow">{fragrance.note}</p>
                  <h3>{fragrance.name}</h3>
                  <p>{fragrance.description}</p>
                  <p className="signature-price">Rs{fragrance.price} <span>each</span></p>
                  <div className="signature-actions">
                    <Link className="text-link" to={`/shop/${fragrance.id}`}>View fragrance <ArrowRight size={14} /></Link>
                    <button className="button button-dark" onClick={() => onAdd(fragrance)}>Add to bag</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="promises">
            <div><Leaf /><span>Crafted to be<br />remembered</span></div>
            <i />
            <div><Clock3 /><span>Long-lasting<br />notes</span></div>
            <i />
            <div><Gift /><span>A gift worth<br />giving</span></div>
          </div>
        </section>

        <section className="story-strip">
          <img src={logo} alt="" className="w-96" />
          <div className="story-strip-copy">
            <p className="eyebrow">{pageContent.home.storyEyebrow}</p>
            <h2>{pageContent.home.storyTitle[0]}<br />{pageContent.home.storyTitle[1]}</h2>
            <p>{pageContent.home.storyDescription}</p>
            <Link to="/story" className="text-link">Discover our story <ArrowRight size={14} /></Link>
          </div>
        </section>

        <section className="featured section-shell">
          <div className="featured-heading">
            <div><p className="eyebrow">The art of being remembered</p><h2>Find your signature.</h2></div>
            <Link className="text-link" to="/shop">Explore all fragrances <ArrowRight size={14} /></Link>
          </div>
          <div className="product-grid">
            {fragrances.map((fragrance) => <ProductCard key={fragrance.id} fragrance={fragrance} onAdd={onAdd} />)}
          </div>
        </section>

        <section className="seo-content section-shell">
          <p className="eyebrow">{pageContent.home.seoLabel}</p>
          <h2>{pageContent.home.seoTitle}</h2>
          {pageContent.home.seoParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <Newsletter />
      </main>
    </>
  )
}
