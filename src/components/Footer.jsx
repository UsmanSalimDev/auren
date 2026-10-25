import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link to="/" className="footer-brand"><span className="brand-symbol"><img src={logo} alt="" /></span></Link>
      <p>For those who leave a little of themselves behind.</p>
      <div className="footer-links"><Link to="/shop">Shop</Link><Link to="/collections">Collections</Link><Link to="/story">Our story</Link></div>
      <small className="copyright">© 2026 AUREN PARFUMS</small>
    </footer>
  )
}
