"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { Sparkles, Eye, Smile, Shield } from "lucide-react"

const Home: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-avocado-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Visualize Your
              <span className="text-avocado-600"> Beauty Transformation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience the future of beauty with our advanced AI-powered visualization system. See realistic previews
              of your treatments before booking at Kultura Spa in Pamporovo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/virtual-try-on" className="btn-primary text-lg px-8 py-3">
                Try Virtual Visualization
              </Link>
              <Link to="/services" className="btn-secondary text-lg px-8 py-3">
                View Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose KulturaView?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our cutting-edge technology ensures you make informed decisions about your beauty treatments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-avocado-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-avocado-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Realistic Previews</h3>
              <p className="text-gray-600">
                See exactly how you'll look after treatments with our advanced computer vision technology.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-avocado-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-avocado-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your images are processed securely with advanced encryption and automatic deletion.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-avocado-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-avocado-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Results</h3>
              <p className="text-gray-600">
                Trusted by beauty professionals and backed by years of research and development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Beauty Services</h2>
            <p className="text-xl text-gray-600">
              Discover our range of professional beauty treatments available for visualization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Smile className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lip Enhancement</h3>
              <p className="text-gray-600 mb-4">
                Visualize fuller, more defined lips with our advanced lip filler simulation.
              </p>
              <div className="text-avocado-600 font-semibold">From €150</div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Eye Brightening</h3>
              <p className="text-gray-600 mb-4">
                See how eye treatments can enhance your natural beauty and brightness.
              </p>
              <div className="text-avocado-600 font-semibold">From €120</div>
            </div>

            <div className="card hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skin Smoothing</h3>
              <p className="text-gray-600 mb-4">
                Preview smoother, more radiant skin with our facial treatment simulations.
              </p>
              <div className="text-avocado-600 font-semibold">From €100</div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="btn-primary text-lg px-8 py-3">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Get started with your beauty transformation in just three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-avocado-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Your Photo</h3>
              <p className="text-gray-600">
                Take or upload a clear front-facing photo for the best visualization results.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-avocado-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Treatment</h3>
              <p className="text-gray-600">
                Select the beauty procedure you're interested in and adjust enhancement levels.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-avocado-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Appointment</h3>
              <p className="text-gray-600">Love what you see? Book your appointment directly through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-avocado-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Look?</h2>
          <p className="text-xl text-avocado-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have discovered their perfect look with KulturaView.
          </p>
          {user ? (
            <Link
              to="/virtual-try-on"
              className="bg-white text-avocado-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Start Your Visualization
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-avocado-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/virtual-try-on"
                className="border-2 border-white text-white hover:bg-white hover:text-avocado-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg"
              >
                Try Without Account
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
