
import { Link, NavLink } from 'react-router-dom';

export function Navbar() {
  const activeClassName = "text-primary font-semibold";
  
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Safe Routes</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink
              to="/map"
              className={({ isActive }) =>
                `text-foreground hover:text-primary transition-colors ${isActive ? activeClassName : ""}`
              }
            >
              Map
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
