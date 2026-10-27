import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Menu, ShoppingBag, X } from 'lucide-react'
import logo from '../assets/logo.png'
import {pairOfferPrice} from '../lib/promotions.js'

export default function Navbar({ bagCount, onOpenBag, isScrolled }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <Link to="/#pair-offer" className="announcement" onClick={closeMenu}>
        <span /> LIMITED TIME · ANY 2 FRAGRANCES FOR RS{pairOfferPrice} <span /> <ArrowRight size={12} />
      </Link>
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="Auren home" onClick={closeMenu}>
          <img src={logo} alt="Auren logo" className="brand-logo w-28" />
        </Link>
        <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <div className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          <NavLink to="/shop" onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/collections" onClick={closeMenu}>Collections</NavLink>
          <NavLink to="/story" onClick={closeMenu}>Our Story</NavLink>
        </div>
        <div className="nav-actions">
          <motion.button
            layout
            transition={{type: 'spring', stiffness: 280, damping: 28}}
            className={`bag-button${isScrolled ? ' bag-button-floating' : ''}`}
            onClick={onOpenBag}
            aria-label={`Open shopping bag, ${bagCount} items`}
          >
            <ShoppingBag size={17} /><span className="bag-label">Bag</span>{bagCount > 0 && <span className="bag-count">{bagCount}</span>}
          </motion.button>
          <Link to="/shop" className="nav-cta">Shop fragrances <ArrowRight size={14} /></Link>
        </div>
      </nav>
    </header>
  )
}
