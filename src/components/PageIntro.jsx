import { ArrowDown } from 'lucide-react'

export default function PageIntro({ label, title, copy }) {
  return (
    <section className="page-intro">
      <div className="page-intro-grain" />
      <p className="eyebrow">{label}</p><h1>{title}</h1><p>{copy}</p>
      <ArrowDown className="intro-arrow" size={18} />
    </section>
  )
}
