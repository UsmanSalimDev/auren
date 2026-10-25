import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { pageContent } from '../data/pageContent.js'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  function submit(event) {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }
  return (
    <section className="newsletter">
      <p className="eyebrow">{pageContent.newsletter.eyebrow}</p>
      <h2>{pageContent.newsletter.titleLead} <em>{pageContent.newsletter.titleAccent}</em></h2>
      <p>{pageContent.newsletter.description}</p>
      {subscribed ? <p className="subscribe-success">{pageContent.newsletter.successMessage}</p> : (
        <form onSubmit={submit}><label className="sr-only" htmlFor="newsletter-email">{pageContent.newsletter.inputLabel}</label><input id="newsletter-email" type="email" placeholder={pageContent.newsletter.inputPlaceholder} required value={email} onChange={(event) => setEmail(event.target.value)} /><button aria-label="Subscribe"><ArrowRight size={18} /></button></form>
      )}
    </section>
  )
}
