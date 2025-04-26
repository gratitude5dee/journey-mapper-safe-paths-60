
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Safe Routes</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/map" className="text-foreground hover:text-primary transition-colors">
              Map
            </Link>
            <Link to="/routes" className="text-foreground hover:text-primary transition-colors">
              Routes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

