import { NavLink } from 'react-router-dom';
import './NavBar.css';

export function NavBar() {
  return (
    <header className="navbar">
      <div className="navbar-inner container">
        <span className="navbar-brand">Postbook</span>
        <nav className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Profilo
          </NavLink>
          <NavLink to="/feed" className={({ isActive }) => (isActive ? 'active' : '')}>
            Feed
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
