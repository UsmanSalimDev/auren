import { useParams } from 'react-router-dom'
import { ArrowRight, Gift } from 'lucide-react'
import { fragrances } from '../data/fragrances.js'
import { pairOfferPrice } from '../lib/promotions.js'
import NotFound from '../components/NotFound.jsx'

export default function Product({ onAdd }) {
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
