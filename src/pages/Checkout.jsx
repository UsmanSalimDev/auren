import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getOrderPricing, pairOfferPrice } from '../lib/promotions.js'
import WhatsAppIcon from '../components/WhatsAppIcon.jsx'

export default function Checkout({ bag }) {
  const groupedItems = bag.reduce((items, item) => {
    const existingItem = items.find((entry) => entry.id === item.id)
    if (existingItem) existingItem.quantity += 1
    else items.push({ ...item, quantity: 1 })
    return items
  }, [])
  const {subtotal, discount, total, qualifyingPairs} = getOrderPricing(bag)

  function sendOrder(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const orderLines = groupedItems.map((item) => (
      `${item.name} x ${item.quantity} — Rs${item.price * item.quantity}`
    ))
    const message = [
      'Hello Auren, I would like to place an order:',
      '',
      ...orderLines,
      '',
      `Subtotal: Rs${subtotal}`,
      ...(discount > 0 ? [`Limited-time couple offer (${qualifyingPairs} pair${qualifyingPairs === 1 ? '' : 's'}): -Rs${discount}`] : []),
      `Total: Rs${total}`,
      `Name: ${formData.get('name')}`,
      `Phone: ${formData.get('phone')}`,
      `Address: ${formData.get('address')}`,
      `City: ${formData.get('city')}`,
      formData.get('email') ? `Email: ${formData.get('email')}` : '',
      formData.get('notes') ? `Order notes: ${formData.get('notes')}` : '',
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/923478925552?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  if (bag.length === 0) {
    return (
      <main className="checkout-empty">
        <p className="eyebrow">YOUR AUREN BAG</p>
        <h1>Your bag is waiting.</h1>
        <p>Add a fragrance before starting your order.</p>
        <Link className="button button-dark" to="/shop">Explore fragrances <ArrowRight size={15} /></Link>
      </main>
    )
  }

  return (
    <main className="checkout-page">
      <div className="checkout-heading">
        <p className="eyebrow">AUREN · ORDER DIRECT</p>
        <h1>Complete your <em>order.</em></h1>
        <p>Share your delivery details and confirm your order with us on WhatsApp.</p>
      </div>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={sendOrder}>
          <section className="checkout-section">
            <h2>Contact</h2>
            <label htmlFor="checkout-email">Email address <span>Optional</span></label>
            <input id="checkout-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            <label htmlFor="checkout-phone">Phone number</label>
            <input id="checkout-phone" name="phone" type="tel" placeholder="+92 3XX XXXXXXX" autoComplete="tel" required />
          </section>
          <section className="checkout-section">
            <h2>Delivery</h2>
            <label htmlFor="checkout-country">Country/Region</label>
            <input id="checkout-country" value="Pakistan" readOnly />
            <label htmlFor="checkout-name">Full name</label>
            <input id="checkout-name" name="name" type="text" placeholder="Full name" autoComplete="name" required />
            <label htmlFor="checkout-address">Address</label>
            <input id="checkout-address" name="address" type="text" placeholder="Street address" autoComplete="street-address" required />
            <label htmlFor="checkout-city">City</label>
            <input id="checkout-city" name="city" type="text" placeholder="City" autoComplete="address-level2" required />
            <label htmlFor="checkout-notes">Order notes <span>Optional</span></label>
            <textarea id="checkout-notes" name="notes" rows="3" placeholder="Anything we should know about your delivery?" />
          </section>
          <p className="checkout-contact-note">Limited time: any 2 fragrances for Rs{pairOfferPrice}. Your pair discount is applied automatically. Your order is sent directly to Auren on WhatsApp.</p>
          <button className="button button-dark checkout-submit" type="submit">
            <WhatsAppIcon /> Send order on WhatsApp <ArrowRight size={15} />
          </button>
        </form>
        <aside className="checkout-summary" aria-label="Order summary">
          <h2>Your order <span>({bag.length})</span></h2>
          <div className="checkout-items">
            {groupedItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <div className="checkout-item-image"><img src={item.image} alt="" /><span>{item.quantity}</span></div>
                <div><h3>{item.name}</h3><p>100 ml · Eau de parfum</p></div>
                <strong>Rs{item.price * item.quantity}</strong>
              </div>
            ))}
          </div>
          <div className="checkout-pricing">
            <div><span>Subtotal</span><strong>Rs{subtotal}</strong></div>
            {discount > 0 && <div className="checkout-discount"><span>Couple offer {qualifyingPairs > 1 ? `× ${qualifyingPairs}` : ''}</span><strong>− Rs{discount}</strong></div>}
            <div className="checkout-total"><span>Total</span><strong>Rs{total}</strong></div>
          </div>
          <p className="checkout-summary-note">Shipping details will be confirmed with you on WhatsApp.</p>
        </aside>
      </div>
    </main>
  )
}
