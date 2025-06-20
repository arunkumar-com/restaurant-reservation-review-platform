import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

function ThankYou() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fas fa-check text-3xl text-green-600"></i>
          </div>

          {/* Thank You Message */}
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
            Thank You for Your Reservation!
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your table has been successfully reserved. We look forward to serving you!
          </p>

          {/* Reservation Tips */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Important Information
            </h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start">
                <i className="fas fa-clock mt-1 mr-3 text-primary-600"></i>
                <span>Please arrive 10 minutes before your reservation time</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-phone mt-1 mr-3 text-primary-600"></i>
                <span>If you need to modify or cancel your reservation, please contact the restaurant directly</span>
              </li>
              <li className="flex items-start">
                <i className="fas fa-utensils mt-1 mr-3 text-primary-600"></i>
                <span>Your table will be held for 15 minutes after the reservation time</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              as={Link}
              to="/"
              variant="primary"
            >
              Browse More Restaurants
            </Button>
            <Button
              as="a"
              href="#"
              variant="secondary"
              onClick={() => window.print()}
            >
              <i className="fas fa-print mr-2"></i>
              Print Confirmation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYou
