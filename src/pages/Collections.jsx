import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fragrances } from '../data/fragrances.js'
import { pageContent } from '../data/pageContent.js'
import { pairOfferPrice } from '../lib/promotions.js'
import PageIntro from '../components/PageIntro.jsx'
import PairOfferBanner from '../components/PairOfferBanner.jsx'
import CoupleOffer from '../components/CoupleOffer.jsx'

export default function Collections({ onAdd, onAddPair }) {
  return (
    <main className="inner-page">
      <PageIntro label={pageContent.collections.introLabel} title={<>{pageContent.collections.titleLead}<br /><em>{pageContent.collections.titleAccent}</em></>} copy={pageContent.collections.introDescription} />
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
