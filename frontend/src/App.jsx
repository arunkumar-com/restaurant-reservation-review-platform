import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import RestaurantDetails from './pages/RestaurantDetails'
import Reservation from './pages/Reservation'
import ThankYou from './pages/ThankYou'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/thank-you" element={<ThankYou />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
