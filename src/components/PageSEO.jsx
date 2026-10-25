import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { fragrances } from '../data/fragrances.js'
import { pairOfferPrice } from '../lib/promotions.js'

export default function PageSEO() {
  const {pathname} = useLocation()
  const productId = pathname.startsWith('/shop/') ? pathname.split('/')[2] : undefined
  const product = fragrances.find((fragrance) => fragrance.id === productId)
  const isCheckout = pathname === '/checkout'
  const isNotFound = !product && !['/', '/shop', '/collections', '/story', '/checkout'].includes(pathname)
  const page = product
    ? {
        title: `${product.name} Perfume in Pakistan | AUREN`,
        description: `Discover AUREN ${product.name} Eau de Parfum. ${product.description} Rs${product.price} each, or choose any two fragrances for Rs${pairOfferPrice}.`,
        image: product.image,
      }
    : pathname === '/shop'
      ? {
          title: 'Shop Perfumes in Pakistan | AUREN Fragrances',
          description: `Explore AUREN fragrances for him and her. Shop Open and Desire for Rs299 each, or choose any two for Rs${pairOfferPrice} with our limited-time couple offer.`,
        }
      : pathname === '/collections'
        ? {
            title: 'AUREN Signature Perfume Collection | Open & Desire',
            description: `Explore the AUREN signature collection: Open and Desire Eau de Parfum. Each is Rs299, or get any two fragrances for Rs${pairOfferPrice}.`,
          }
        : pathname === '/story'
          ? {
              title: 'Our Story | AUREN Perfumes Pakistan',
              description: 'Discover the AUREN fragrance philosophy: considered scents, memorable notes, and signature perfumes created to be worn close and remembered.',
            }
          : isCheckout
            ? {
                title: 'Complete Your AUREN Order',
                description: 'Review your AUREN fragrance order and send your delivery details directly to our team on WhatsApp.',
              }
            : isNotFound
              ? {
                  title: 'Page Not Found | AUREN Perfumes',
                  description: 'The page you are looking for could not be found. Explore the AUREN fragrance collection.',
                }
              : {
                  title: 'AUREN Perfumes Pakistan | Open & Desire Couple Offer',
                  description: `Shop AUREN Open and Desire Eau de Parfum in Pakistan. Rs299 each, or choose any two fragrances for Rs${pairOfferPrice} with our limited-time couple offer.`,
                  image: fragrances[0].image,
                }

  useEffect(() => {
    document.title = page.title

    function setMeta(selector, attribute, key, content) {
      let element = document.head.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.append(element)
      }
      element.setAttribute('content', content)
    }

    setMeta('meta[name="description"]', 'name', 'description', page.description)
    setMeta('meta[name="robots"]', 'name', 'robots', isCheckout || isNotFound ? 'noindex, nofollow' : 'index, follow')
    setMeta('meta[property="og:title"]', 'property', 'og:title', page.title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', page.description)
    setMeta('meta[property="og:type"]', 'property', 'og:type', product ? 'product' : 'website')
    setMeta('meta[property="og:url"]', 'property', 'og:url', `${window.location.origin}${pathname}`)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'AUREN Perfumes')
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', page.title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', page.description)

    const imageUrl = new URL(page.image || fragrances[0].image, window.location.origin).href
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl)
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl)

    const structuredData = product
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `AUREN ${product.name} Eau de Parfum`,
          description: product.description,
          image: new URL(product.image, window.location.origin).href,
          sku: product.id,
          brand: {'@type': 'Brand', name: 'AUREN'},
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'PKR',
          },
        }
      : pathname === '/'
        ? {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Organization',
                name: 'AUREN Perfumes',
                description: 'AUREN perfumes including Open and Desire Eau de Parfum, with WhatsApp ordering in Pakistan.',
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+923275835635',
                  contactType: 'customer service',
                },
              },
              {
                '@type': 'WebSite',
                name: 'AUREN Perfumes',
              },
            ],
          }
        : null

    let script = document.getElementById('auren-structured-data')
    if (!structuredData) {
      script?.remove()
    } else if (!script) {
      script = document.createElement('script')
      script.id = 'auren-structured-data'
      script.type = 'application/ld+json'
      document.head.append(script)
    }
    if (script && structuredData) script.textContent = JSON.stringify(structuredData)
  }, [isCheckout, isNotFound, page.description, page.image, page.title, pathname, product])

  return null
}
