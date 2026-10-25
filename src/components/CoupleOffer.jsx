import { ArrowRight } from 'lucide-react'
import { fragrances } from '../data/fragrances.js'
import { pairOfferPrice } from '../lib/promotions.js'

export default function CoupleOffer({ onAdd, onAddPair }) {
  const openFragrance = fragrances.find((fragrance) => fragrance.id === 'open')
  const desireFragrance = fragrances.find((fragrance) => fragrance.id === 'desire')
  const featuredPair = [openFragrance, desireFragrance].filter((fragrance) => fragrance !== undefined)
  const pairAvailable = featuredPair.length === 2

  return (
    <section className="couple-offer" id="pair-offer">
      <div className="couple-offer-copy">
        <p className="eyebrow">LIMITED-TIME OFFER · FOR HIM & HER</p>
        <h2>Open & Desire,<br /><em>made to share.</em></h2>
        <p>Choose your favorites, or get our featured Open + Desire pair together for the limited-time couple price.</p>
        <div className="couple-products">
          {featuredPair.map((fragrance) => (
            <div className="couple-product" key={fragrance.id}>
              <img src={fragrance.image} alt={`${fragrance.name} fragrance`} />
              <div><strong>{fragrance.name}</strong><span>Rs{fragrance.price} each</span></div>
              <button onClick={() => onAdd(fragrance)} aria-label={`Add ${fragrance.name} to bag`}>Add</button>
            </div>
          ))}
          {!pairAvailable && <p className="couple-offer-unavailable">The featured pair is temporarily unavailable.</p>}
        </div>
        <div className="couple-offer-bottom">
          <div className="couple-offer-price"><strong>Rs{pairOfferPrice}</strong><span>for both · save Rs99</span></div>
          <button className="button button-gold" onClick={onAddPair} disabled={!pairAvailable}>Add Open + Desire to bag <ArrowRight size={15} /></button>
        </div>
      </div>
      <div className="couple-offer-image">
        {openFragrance && <img src={openFragrance.image} alt="Open fragrance, Auren's shared signature scent" />}
        <span>THE COUPLE EDIT</span>
      </div>
    </section>
  )
}
