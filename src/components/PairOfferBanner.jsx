import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { pairOfferPrice } from '../lib/promotions.js'

export default function PairOfferBanner() {
  return (
    <section className="pair-offer-banner">
      <span className="pair-offer-tag">PAIR DEAL</span>
      <div><p className="eyebrow">LIMITED-TIME COUPLE OFFER</p><h2>Any 2 fragrances for Rs{pairOfferPrice}</h2><p>Mix and match your favorites. The discount is applied automatically in your bag.</p></div>
      <Link className="text-link" to="/shop">Choose your pair <ArrowRight size={14} /></Link>
    </section>
  )
}
