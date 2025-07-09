import type React from "react"
import { Link } from "react-router-dom"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-avocado-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold">KulturaView</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Experience the future of beauty with our advanced visualization technology. See your transformation before
              you commit at Kultura Spa in Pamporovo, Bulgaria.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin size={16} />
                <span>Pamporovo, Bulgaria</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone size={16} />
                <span>+359 XXX XXX XXX</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail size={16} />
                <span>info@kulturaview.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock size={16} />
                <span>Mon-Sun: 9:00 AM - 8:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-avocado-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-avocado-400 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/virtual-try-on" className="text-gray-300 hover:text-avocado-400 transition-colors">
                  Virtual Try-On
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-300 hover:text-avocado-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-300 hover:text-avocado-400 transition-colors">
                  Help & FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Lip Fillers</li>
              <li className="text-gray-300">Eye Brightening</li>
              <li className="text-gray-300">Skin Smoothing</li>
              <li className="text-gray-300">Facial Treatments</li>
              <li className="text-gray-300">Beauty Consultations</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 KulturaView - Kultura Spa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
