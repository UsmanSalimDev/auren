import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { ArrowRight, Gift, Minus, X } from 'lucide-react'
import { fragrances } from '../data/fragrances.js'
import { getOrderPricing, pairOfferPrice } from '../lib/promotions.js'
import Navbar from '../components/Navbar.jsx'
import PageSEO from '../components/PageSEO.jsx'
import Footer from '../components/Footer.jsx'
import WhatsAppIcon from '../components/WhatsAppIcon.jsx'
import NotFound from '../components/NotFound.jsx'
import Home from '../pages/Home.jsx'
import Shop from '../pages/Shop.jsx'
import Product from '../pages/Product.jsx'
import Collections from '../pages/Collections.jsx'
import Story from '../pages/Story.jsx'
import Checkout from '../pages/Checkout.jsx'

export function ScrollToTop() {
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

export default function Storefront() {
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
      fragrances.find((fragrance) => fragrance.id === 'open'),
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
