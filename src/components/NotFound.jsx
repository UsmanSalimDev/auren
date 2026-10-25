import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return <main className="not-found"><p className="eyebrow">A little lost?</p><h1>This scent isn’t here.</h1><Link className="button button-gold" to="/shop">Explore fragrances <ArrowRight size={15} /></Link></main>
}
