import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Plus } from 'lucide-react'
import { pairOfferPrice } from '../lib/promotions.js'

export default function ProductCard({ fragrance, onAdd }) {
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
