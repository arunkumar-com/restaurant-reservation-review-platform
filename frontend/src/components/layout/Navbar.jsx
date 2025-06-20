import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'nav-link nav-link-active' : 'nav-link nav-link-default'
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-heading font-bold text-black tracking-tight">
              TableSpot
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>
              Restaurants
            </Link>
            <a 
              href="#how-it-works" 
              className="nav-link nav-link-default"
            >
              How It Works
            </a>
            <button className="btn btn-primary">
              Make a Reservation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (hidden by default) */}
        <div className="hidden md:hidden">
          <div className="py-2 space-y-1">
            <Link
              to="/"
              className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
            >
              Restaurants
            </Link>
            <a
              href="#how-it-works"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              How It Works
            </a>
            <div className="px-4 py-3">
              <button className="btn btn-primary w-full">
                Make a Reservation
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
