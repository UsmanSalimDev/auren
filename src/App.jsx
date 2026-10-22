import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, Gift, Leaf, Minus, Plus, X } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar.jsx'
import './App.css'
import logo from './assets/logo.png'

import {fragrances} from './lib/fragrance.js'
import {getOrderPricing, pairOfferPrice} from './lib/promotions.js'
gsap.registerPlugin(ScrollTrigger)


function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])

  return null
}

function PageSEO() {
  const {pathname} = useLocation()
  const productId = pathname.startsWith('/shop/') ? pathname.split('/')[2] : undefined
  const product = fragrances.find((fragrance) => fragrance.id === productId)
  const isCheckout = pathname === '/checkout'
  const isNotFound = !product && !['/', '/shop', '/collections', '/story', '/checkout'].includes(pathname)
  const page = product
    ? {
        title: `${product.name} Perfume in Pakistan | AUREN`,
        description: `Discover AUREN ${product.name} Eau de Parfum. ${product.description} Rs${product.price} each, or choose any two fragrances for Rs${pairOfferPrice}.`,
        image: product.image,
      }
    : pathname === '/shop'
      ? {
          title: 'Shop Perfumes in Pakistan | AUREN Fragrances',
          description: `Explore AUREN fragrances for him and her. Shop Open and Desire for Rs299 each, or choose any two for Rs${pairOfferPrice} with our limited-time couple offer.`,
        }
      : pathname === '/collections'
        ? {
            title: 'AUREN Signature Perfume Collection | Open & Desire',
            description: `Explore the AUREN signature collection: Open and Desire Eau de Parfum. Each is Rs299, or get any two fragrances for Rs${pairOfferPrice}.`,
          }
        : pathname === '/story'
          ? {
              title: 'Our Story | AUREN Perfumes Pakistan',
              description: 'Discover the AUREN fragrance philosophy: considered scents, memorable notes, and signature perfumes created to be worn close and remembered.',
            }
          : isCheckout
            ? {
                title: 'Complete Your AUREN Order',
                description: 'Review your AUREN fragrance order and send your delivery details directly to our team on WhatsApp.',
              }
            : isNotFound
              ? {
                  title: 'Page Not Found | AUREN Perfumes',
                  description: 'The page you are looking for could not be found. Explore the AUREN fragrance collection.',
                }
              : {
                  title: 'AUREN Perfumes Pakistan | Open & Desire Couple Offer',
                  description: `Shop AUREN Open and Desire Eau de Parfum in Pakistan. Rs299 each, or choose any two fragrances for Rs${pairOfferPrice} with our limited-time couple offer.`,
                  image: fragrances[0].image,
                }

  useEffect(() => {
    document.title = page.title

    function setMeta(selector, attribute, key, content) {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.append(element)
      }
      element.setAttribute('content', content)
    }

    setMeta('meta[name="description"]', 'name', 'description', page.description)
    setMeta('meta[name="robots"]', 'name', 'robots', isCheckout || isNotFound ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:title"]', 'property', 'og:title', page.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', page.description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', product ? 'product' : 'website')
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${window.location.origin}${pathname}`)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'AUREN Perfumes')
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', page.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', page.description)

    const imageUrl = new URL(page.image || fragrances[0].image, window.location.origin).href
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)

    const structuredData = product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `AUREN ${product.name} Eau de Parfum`,
          description: product.description,
          image: new URL(product.image, window.location.origin).href,
          sku: product.id,
          brand: {'@type': 'Brand', name: 'AUREN'},
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'PKR',
          },
        }
      : pathname === '/'
        ? {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'AUREN Perfumes',
                description: 'AUREN perfumes including Open and Desire Eau de Parfum, with WhatsApp ordering in Pakistan.',
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+923275835635',
                  contactType: 'customer service',
                },
              },
              {
                '@type': 'WebSite',
                name: 'AUREN Perfumes',
              },
            ],
          }
        : null

    let script = document.getElementById('auren-structured-data')
    if (!structuredData) {
      script?.remove()
    } else if (!script) {
      script = document.createElement('script')
      script.id = 'auren-structured-data'
      script.type = 'application/ld+json'
      document.head.append(script)
    }
    if (script && structuredData) script.textContent = JSON.stringify(structuredData)
  }, [isCheckout, isNotFound, page.description, page.image, page.title, pathname, product])

  return null
}

function ProductCard({ fragrance, onAdd }) {
  return (
    <motion.article className="product-card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Link className="product-image-link" to={`/shop/${fragrance.id}`} aria-label={`Discover ${fragrance.name}`}>
        <img src={fragrance.image} alt={`${fragrance.name} fragrance bottle`} loading="lazy" />
        <span className="product-image-cta">Discover <ArrowUpRight size={15} /></span>
      </Link>
      <div className="product-card-copy">
        <div>
          <p className="eyebrow">{fragrance.note}</p>
          <h3><Link to={`/shop/${fragrance.id}`}>{fragrance.name}</Link></h3>
          <p>{fragrance.category} · Rs{fragrance.price}</p>
          <span className="product-offer-label">Limited time · Any 2 for Rs{pairOfferPrice}</span>
        </div>
        <button className="icon-button add-button" onClick={() => onAdd(fragrance)} aria-label={`Add ${fragrance.name} to bag`}>
          <Plus size={17} />
        </button>
      </div>
    </motion.article>
  )
}

function Home({ onAdd, onAddPair }) {
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
      gsap.from('.hero-product', {
        opacity: 0,
        scale: 0.92,
        y: 24,
        duration: 1.25,
        ease: 'power3.out',
        delay: 0.35,
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
          <div className="hero-grain" />
          <div className="hero-copy">
            <p className="hero-kicker hero-line"><span /> A fragrance, remembered <span /></p>
            <h1 className="hero-line">A SCENT THAT<br />STAYS WITH <em>YOU.</em></h1>
            <p className="hero-description hero-line">
              Timeless fragrance for the modern man.<br />
              Crafted with the finest ingredients, designed<br className="desktop-break" /> to leave a lasting impression.
            </p>
            <div className="hero-actions hero-line">
              <Link className="button button-gold" to="/collections">Explore the collection <ArrowRight size={15} /></Link>
              <Link className="button button-outline" to="/shop/desire">Discover Desire <ArrowRight size={15} /></Link>
            </div>
          </div>
          <div className="hero-product">
            <div className="hero-glow" />
            <img src={fragrances[0].image} alt="Auren Desire fragrance bottle" />
            <span className="hero-product-caption">DESIRE <small>EAU DE PARFUM · 100 ML</small></span>
          </div>
          <div className="hero-corner-note"><span>01</span><i /> THE SIGNATURE COLLECTION</div>
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
            <p className="eyebrow">Our story</p>
            <h2>More than a fragrance.<br />It’s a legacy.</h2>
            <p>AUREN is born from a simple belief — that true luxury is not just how you smell, but how you feel. We create fragrances for men who leave a mark, today and tomorrow.</p>
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
          <p className="eyebrow">AUREN · PERFUMES IN PAKISTAN</p>
          <h2>Find a fragrance that feels like you.</h2>
          <p>Explore AUREN perfumes in Pakistan, including Open and Desire Eau de Parfum. Open pairs bergamot, vetiver and sandalwood; Desire brings together saffron, smoked cedar and amber. Each fragrance is Rs299.</p>
          <p>Shopping for two? Choose any two AUREN fragrances for Rs499 with our limited-time couple offer. Add Open and Desire together, or mix and match from the collection. Your pair price is applied automatically in the bag, and you can send your order to us on WhatsApp.</p>
        </section>

        <Newsletter />
      </main>
    </>
  )
}

function Shop({ onAdd }) {
  const [filter, setFilter] = useState('All fragrances')
  const visible = filter === 'All fragrances' ? fragrances : fragrances.filter((item) => item.category.toLowerCase().includes(filter.toLowerCase()))
  return (
    <main className="inner-page">
      <PageIntro label="THE AUREN EDIT" title={<>A fragrance for<br /><em>every version of you.</em></>} copy="Discover the scents that become part of your story." />
      <PairOfferBanner />
      <section className="section-shell shop-section">
        <div className="shop-toolbar">
          <p>{visible.length} considered fragrances</p>
          <select aria-label="Filter fragrances" value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option>All fragrances</option>
            <option>Woody</option>
            <option>Smoky</option>
          </select>
        </div>
        <div className="product-grid">
          {visible.map((fragrance) => <ProductCard key={fragrance.id} fragrance={fragrance} onAdd={onAdd} />)}
        </div>
      </section>
    </main>
  )
}

function Collections({ onAdd, onAddPair }) {
  return (
    <main className="inner-page">
      <PageIntro label="CURATED WITH INTENTION" title={<>The signature<br /><em>collection.</em></>} copy="Three distinct expressions. One unmistakable point of view." />
      <PairOfferBanner />
      <CoupleOffer onAdd={onAdd} onAddPair={onAddPair} />
      <section className="section-shell collection-page-grid">
        {fragrances.map((fragrance, index) => (
          <article className="collection-row" key={fragrance.id}>
            <div className="collection-photo"><img src={fragrance.image} alt={`${fragrance.name} bottle`} loading="lazy" /><span>0{index + 1}</span></div>
            <div className="collection-detail">
              <p className="eyebrow">{fragrance.note}</p><h2>{fragrance.name}</h2>
              <p>{fragrance.description}</p><p className="note-list">{fragrance.notes}</p>
              <p className="collection-offer-note">Limited time: choose any 2 fragrances for Rs{pairOfferPrice}.</p>
              <div className="collection-actions"><Link className="text-link" to={`/shop/${fragrance.id}`}>Discover the scent <ArrowRight size={14} /></Link><button className="button button-dark" onClick={() => onAdd(fragrance)}>Add to bag · Rs{fragrance.price}</button></div>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

function Story() {
  return (
    <main className="inner-page story-page">
      <PageIntro label="OUR STORY" title={<>A mark that<br /><em>stays with you.</em></>} copy="The most memorable things are never the loudest. They are the ones that stay." />
      <section className="story-content section-shell">
        <div className="story-image"><img src="https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1400&q=85" alt="A considered fragrance ritual" /></div>
        <div className="story-essay">
          <p className="eyebrow">The Auren philosophy</p>
          <h2>Presence, distilled.</h2>
          <p>AUREN began with a simple idea: a fragrance should feel like an extension of who you are. Not a statement made for a room, but a quiet signature that stays long after you have left it.</p>
          <p>We work with exceptional ingredients and a patient hand, building each scent in layers. The result is a collection made to be worn close, remembered deeply, and made entirely your own.</p>
          <div className="story-signoff">With intention, <em>Auren</em></div>
        </div>
      </section>
      <div className="story-quote"><span>“</span><p>Luxury is not what you leave behind.<br />It is what remains.</p><small>THE AUREN WAY</small></div>
    </main>
  )
}

function Product({ onAdd }) {
  const { productId } = useParams()
  const fragrance = fragrances.find((item) => item.id === productId)
  if (!fragrance) return <NotFound />
  return (
    <main className="product-page section-shell">
      <div className="product-detail-image"><img src={fragrance.image} alt={`${fragrance.name} fragrance bottle`} /></div>
      <div className="product-detail-copy">
        <p className="eyebrow">AUREN · {fragrance.note}</p>
        <h1>{fragrance.name}</h1><p className="product-category">{fragrance.category} · Eau de parfum</p>
        <div className="product-rule" />
        <p className="product-description">{fragrance.description}</p>
        <div className="notes-box"><span>THE NOTES</span><p>{fragrance.notes}</p></div>
        <div className="size-picker"><span>SIZE</span><button className="selected-size">100 ml <small>3.4 fl oz</small></button></div>
        <p className="product-pair-offer"><strong>Limited-time pair offer</strong><span>Choose any 2 fragrances for Rs{pairOfferPrice} — save Rs99 on two Rs299 scents.</span></p>
        <button className="button button-dark add-to-bag" onClick={() => onAdd(fragrance)}>Add to bag <span>Rs{fragrance.price}</span><ArrowRight size={16} /></button>
        <p className="shipping-note"><Gift size={15} /> Complimentary gift wrapping on every order</p>
      </div>
    </main>
  )
}

function CoupleOffer({ onAdd, onAddPair }) {
  const openFragrance = fragrances.find((fragrance) => fragrance.id === 'auren-no-01')
  const desireFragrance = fragrances.find((fragrance) => fragrance.id === 'desire')

  return (
    <section className="couple-offer" id="pair-offer">
      <div className="couple-offer-copy">
        <p className="eyebrow">LIMITED-TIME OFFER · FOR HIM & HER</p>
        <h2>Open & Desire,<br /><em>made to share.</em></h2>
        <p>Choose your favorites, or get our featured Open + Desire pair together for the limited-time couple price.</p>
        <div className="couple-products">
          {[openFragrance, desireFragrance].map((fragrance) => (
            <div className="couple-product" key={fragrance.id}>
              <img src={fragrance.image} alt={`${fragrance.name} fragrance`} />
              <div><strong>{fragrance.name}</strong><span>Rs{fragrance.price} each</span></div>
              <button onClick={() => onAdd(fragrance)} aria-label={`Add ${fragrance.name} to bag`}>Add</button>
            </div>
          ))}
        </div>
        <div className="couple-offer-bottom">
          <div className="couple-offer-price"><strong>Rs{pairOfferPrice}</strong><span>for both · save Rs99</span></div>
          <button className="button button-gold" onClick={onAddPair}>Add Open + Desire to bag <ArrowRight size={15} /></button>
        </div>
      </div>
      <div className="couple-offer-image">
        <img src={openFragrance.image} alt="Open fragrance, Auren's shared signature scent" />
        <span>THE COUPLE EDIT</span>
      </div>
    </section>
  )
}

function PairOfferBanner() {
  return (
    <section className="pair-offer-banner">
      <span className="pair-offer-tag">PAIR DEAL</span>
      <div><p className="eyebrow">LIMITED-TIME COUPLE OFFER</p><h2>Any 2 fragrances for Rs{pairOfferPrice}</h2><p>Mix and match your favorites. The discount is applied automatically in your bag.</p></div>
      <Link className="text-link" to="/shop">Choose your pair <ArrowRight size={14} /></Link>
    </section>
  )
}

function Checkout({ bag }) {
  const groupedItems = bag.reduce((items, item) => {
    const existingItem = items.find((entry) => entry.id === item.id)
    if (existingItem) existingItem.quantity += 1
    else items.push({ ...item, quantity: 1 })
    return items
  }, [])
  const {subtotal, discount, total, qualifyingPairs} = getOrderPricing(bag)

  function sendOrder(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const orderLines = groupedItems.map((item) => (
      `${item.name} x ${item.quantity} — Rs${item.price * item.quantity}`
    ))
    const message = [
      'Hello Auren, I would like to place an order:',
      '',
      ...orderLines,
      '',
      `Subtotal: Rs${subtotal}`,
      ...(discount > 0 ? [`Limited-time couple offer (${qualifyingPairs} pair${qualifyingPairs === 1 ? '' : 's'}): -Rs${discount}`] : []),
      `Total: Rs${total}`,
      `Name: ${formData.get('name')}`,
      `Phone: ${formData.get('phone')}`,
      `Address: ${formData.get('address')}`,
      `City: ${formData.get('city')}`,
      formData.get('email') ? `Email: ${formData.get('email')}` : '',
      formData.get('notes') ? `Order notes: ${formData.get('notes')}` : '',
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/923478925552?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  if (bag.length === 0) {
    return (
      <main className="checkout-empty">
        <p className="eyebrow">YOUR AUREN BAG</p>
        <h1>Your bag is waiting.</h1>
        <p>Add a fragrance before starting your order.</p>
        <Link className="button button-dark" to="/shop">Explore fragrances <ArrowRight size={15} /></Link>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <p className="eyebrow">AUREN · ORDER DIRECT</p>
        <h1>Complete your <em>order.</em></h1>
        <p>Share your delivery details and confirm your order with us on WhatsApp.</p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={sendOrder}>
          <section className="checkout-section">
            <h2>Contact</h2>
            <label htmlFor="checkout-email">Email address <span>Optional</span></label>
            <input id="checkout-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <label htmlFor="checkout-phone">Phone number</label>
            <input id="checkout-phone" name="phone" type="tel" placeholder="+92 3XX XXXXXXX" autoComplete="tel" required />
          </section>
          <section className="checkout-section">
            <h2>Delivery</h2>
            <label htmlFor="checkout-country">Country/Region</label>
            <input id="checkout-country" value="Pakistan" readOnly />
            <label htmlFor="checkout-name">Full name</label>
            <input id="checkout-name" name="name" type="text" placeholder="Full name" autoComplete="name" required />
            <label htmlFor="checkout-address">Address</label>
            <input id="checkout-address" name="address" type="text" placeholder="Street address" autoComplete="street-address" required />
            <label htmlFor="checkout-city">City</label>
            <input id="checkout-city" name="city" type="text" placeholder="City" autoComplete="address-level2" required />
            <label htmlFor="checkout-notes">Order notes <span>Optional</span></label>
            <textarea id="checkout-notes" name="notes" rows="3" placeholder="Anything we should know about your delivery?" />
          </section>
          <p className="checkout-contact-note">Limited time: any 2 fragrances for Rs{pairOfferPrice}. Your pair discount is applied automatically. Your order is sent directly to Auren on WhatsApp.</p>
          <button className="button button-dark checkout-submit" type="submit">
            <WhatsAppIcon /> Send order on WhatsApp <ArrowRight size={15} />
          </button>
        </form>
        <aside className="checkout-summary" aria-label="Order summary">
          <h2>Your order <span>({bag.length})</span></h2>
          <div className="checkout-items">
            {groupedItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div className="checkout-item-image"><img src={item.image} alt="" /><span>{item.quantity}</span></div>
                <div><h3>{item.name}</h3><p>100 ml · Eau de parfum</p></div>
                <strong>Rs{item.price * item.quantity}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-pricing">
            <div><span>Subtotal</span><strong>Rs{subtotal}</strong></div>
            {discount > 0 && <div className="checkout-discount"><span>Couple offer {qualifyingPairs > 1 ? `× ${qualifyingPairs}` : ''}</span><strong>− Rs{discount}</strong></div>}
            <div className="checkout-total"><span>Total</span><strong>Rs{total}</strong></div>
          </div>
          <p className="checkout-summary-note">Shipping details will be confirmed with you on WhatsApp.</p>
        </aside>
      </div>
    </main>
  )
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="whatsapp-icon">
      <path fill="currentColor" d="M16.04 3.2A12.7 12.7 0 0 0 5.1 22.34L3.4 28.55l6.36-1.67A12.7 12.7 0 1 0 16.04 3.2Zm0 23.1c-1.92 0-3.8-.51-5.45-1.49l-.39-.23-3.77.99 1.01-3.67-.25-.4a10.47 10.47 0 1 1 8.85 4.8Zm5.75-7.84c-.32-.16-1.87-.92-2.16-1.02-.29-.1-.5-.16-.72.16-.22.32-.82 1.02-1 1.23-.18.22-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.84-1.59-1.88-1.78-2.2-.18-.33-.02-.5.14-.66.15-.14.32-.37.48-.55.16-.19.21-.32.32-.54.1-.22.05-.41-.03-.57-.08-.16-.72-1.73-.99-2.36-.26-.62-.53-.54-.72-.55h-.61c-.22 0-.57.08-.86.4-.3.33-1.13 1.1-1.13 2.67s1.16 3.1 1.32 3.32c.16.21 2.28 3.48 5.53 4.88.77.33 1.37.53 1.84.68.77.24 1.48.21 2.04.13.62-.1 1.87-.77 2.13-1.52.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
    </svg>
  )
}

function PageIntro({ label, title, copy }) {
  return (
    <section className="page-intro">
      <div className="page-intro-grain" />
      <p className="eyebrow">{label}</p><h1>{title}</h1><p>{copy}</p>
      <ArrowDown className="intro-arrow" size={18} />
    </section>
  )
}

function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  function submit(event) {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }
  return (
    <section className="newsletter">
      <p className="eyebrow">A note from Auren</p>
      <h2>Make room for <em>ritual.</em></h2>
      <p>Discover new scents, stories and considered moments.</p>
      {subscribed ? <p className="subscribe-success">Thank you. You’re on the list.</p> : (
        <form onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required value={email} onChange={(event) => setEmail(event.target.value)} /><button aria-label="Subscribe"><ArrowRight size={18} /></button></form>
      )}
    </section>
  )
}

function NotFound() {
  return <main className="not-found"><p className="eyebrow">A little lost?</p><h1>This scent isn’t here.</h1><Link className="button button-gold" to="/shop">Explore fragrances <ArrowRight size={15} /></Link></main>
}

function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="footer-brand"><span className="brand-symbol"><img src={logo} alt="" /></span></Link>
      <p>For those who leave a little of themselves behind.</p>
      <div className="footer-links"><Link to="/shop">Shop</Link><Link to="/collections">Collections</Link><Link to="/story">Our story</Link></div>
      <small className="copyright">© 2026 AUREN PARFUMS</small>
    </footer>
  )
}

function Storefront() {
  const location = useLocation()
  const [bag, setBag] = useState([])
  const [notice, setNotice] = useState('')
  const [bagOpen, setBagOpen] = useState(false)
  const {subtotal: bagSubtotal, discount: bagDiscount, total: bagTotal, qualifyingPairs: bagPairs} = getOrderPricing(bag)
  const noticeTimer = useRef(null)
  useEffect(() => () => window.clearTimeout(noticeTimer.current), [])

  function addToBag(fragrance) {
    setBag((items) => [...items, fragrance])
    setNotice(`${fragrance.name} added to your bag`)
    window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 2800)
  }

  function addCouplePair() {
    const pair = [
      fragrances.find((fragrance) => fragrance.id === 'auren-no-01'),
      fragrances.find((fragrance) => fragrance.id === 'desire'),
    ]
    const availablePair = pair.filter((fragrance) => fragrance !== undefined)
    if (availablePair.length !== 2) {
      setNotice('The couple offer is temporarily unavailable. You can still add fragrances individually.')
      window.clearTimeout(noticeTimer.current)
      noticeTimer.current = window.setTimeout(() => setNotice(''), 3500)
      return
    }
    setBag((items) => [...items, ...availablePair])
    setNotice('Open + Desire added to your bag · Rs499 couple offer applied')
    window.clearTimeout(noticeTimer.current)
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3500)
  }

  return (
    <>
      <ScrollToTop />
      <Navbar bagCount={bag.length} onOpenBag={() => setBagOpen(true)} />
      <Routes>
        <Route path="*" element={<PageSEO />} />
      </Routes>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <Routes>
            <Route path="/" element={<Home onAdd={addToBag} onAddPair={addCouplePair} />} />
            <Route path="/shop" element={<Shop onAdd={addToBag} />} />
            <Route path="/shop/:productId" element={<Product onAdd={addToBag} />} />
            <Route path="/collections" element={<Collections onAdd={addToBag} onAddPair={addCouplePair} />} />
            <Route path="/story" element={<Story />} />
            <Route path="/checkout" element={<Checkout bag={bag} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>
        {notice && <motion.div className="toast" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>{notice}<span>·</span><button onClick={() => setBagOpen(true)}>View bag</button></motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {bagOpen && (
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setBagOpen(false)}>
            <motion.aside className="bag-drawer" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} onClick={(event) => event.stopPropagation()} aria-label="Shopping bag">
              <div className="drawer-heading"><div><p className="eyebrow">AUREN</p><h2>Your bag <span>({bag.length})</span></h2></div><button className="icon-button" onClick={() => setBagOpen(false)} aria-label="Close bag"><X /></button></div>
              {bag.length === 0 ? <div className="empty-bag"><p>Your next signature scent is waiting.</p><Link to="/shop" onClick={() => setBagOpen(false)} className="button button-dark">Explore fragrances <ArrowRight size={15} /></Link></div> : (
                <div className="bag-items">{bag.map((item, index) => <div className="bag-item" key={`${item.id}-${index}`}><img src={item.image} alt="" /><div><p>{item.name}</p><small>100 ml · Eau de parfum</small><strong>Rs{item.price}</strong></div><button aria-label={`Remove ${item.name}`} onClick={() => setBag((items) => items.filter((_, itemIndex) => itemIndex !== index))}><Minus size={15} /></button></div>)}

                  <div className="bag-pricing">
                    <div><span>Subtotal</span><strong>Rs{bagSubtotal}</strong></div>
                    {bagPairs > 0
                      ? <div className="bag-discount"><span>Couple offer · {bagPairs} pair{bagPairs === 1 ? '' : 's'}</span><strong>− Rs{bagDiscount}</strong></div>
                      : <p className="bag-offer-prompt">Add one more fragrance to unlock any 2 for Rs{pairOfferPrice}.</p>}
                    <div className="bag-total"><span>Total</span><strong>Rs{bagTotal}</strong></div>
                  </div>
                  <Link to="/checkout" onClick={() => setBagOpen(false)} className="button button-dark checkout-button">Continue to checkout <ArrowRight size={15} /></Link><p className="shipping-note"><Gift size={15} /> Complimentary gift wrapping included</p>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <a className="whatsapp-float" href="https://wa.me/923478925552" target="_blank" rel="noreferrer" aria-label="Chat with Auren on WhatsApp at +92 3478925552">
        <WhatsAppIcon />
        <span>WhatsApp <small>+92 3478925552</small></span>
      </a>
    </>
  )
}

export default function App() {
  return <BrowserRouter><Storefront /></BrowserRouter>
}
