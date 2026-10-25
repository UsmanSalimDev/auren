import { useState } from 'react'
import { fragrances } from '../data/fragrances.js'
import { pageContent } from '../data/pageContent.js'
import ProductCard from '../components/ProductCard.jsx'
import PageIntro from '../components/PageIntro.jsx'
import PairOfferBanner from '../components/PairOfferBanner.jsx'

export default function Shop({ onAdd }) {
  const [filter, setFilter] = useState('All fragrances')
  const visible = filter === 'All fragrances' ? fragrances : fragrances.filter((item) => item.category.toLowerCase().includes(filter.toLowerCase()))
  return (
    <main className="inner-page">
      <PageIntro label={pageContent.shop.introLabel} title={<>{pageContent.shop.titleLead}<br /><em>{pageContent.shop.titleAccent}</em></>} copy={pageContent.shop.introDescription} />
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
