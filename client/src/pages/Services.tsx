"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Clock, Euro, Star } from "lucide-react"
import type { Service } from "../types"
import api from "../utils/api"
import toast from "react-hot-toast"

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await api.get("/services")
      setServices(response.data)
    } catch (error) {
      toast.error("Failed to load services")
    } finally {
      setLoading(false)
    }
  }

  // Fix the categories array creation
  const getUniqueCategories = () => {
    const categorySet = new Set<string>()
    services.forEach((service) => {
      if (service.category) {
        categorySet.add(service.category)
      }
    })
    return ["all", ...Array.from(categorySet)]
  }

  const categories = getUniqueCategories()
  const filteredServices =
    selectedCategory === "all" ? services : services.filter((service) => service.category === selectedCategory)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-avocado-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Beauty Services</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of professional beauty treatments, all available for virtual try-on before
            booking.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category ? "bg-avocado-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category === "all" ? "All Services" : category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm text-gray-600">4.8</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {service.description || "Professional beauty treatment tailored to your needs."}
              </p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{service.duration} min</span>
                </div>
                <div className="flex items-center space-x-1 text-avocado-600 font-semibold">
                  <Euro className="w-4 h-4" />
                  <span>{service.price}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Link to="/virtual-try-on" className="flex-1 btn-secondary text-center text-sm">
                  Try Virtual
                </Link>
                <Link to={`/book-appointment?service=${service.id}`} className="flex-1 btn-primary text-center text-sm">
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No services found in this category.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="card bg-avocado-50 border-avocado-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Not Sure Which Service is Right for You?</h2>
            <p className="text-gray-600 mb-6">
              Try our virtual visualization tool to see how different treatments would look on you.
            </p>
            <Link to="/virtual-try-on" className="btn-primary">
              Start Virtual Try-On
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services
