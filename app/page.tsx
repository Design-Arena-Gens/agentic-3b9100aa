'use client'

import { useState } from 'react'

interface Deal {
  title: string
  price: string
  location: string
  condition: string
  dealScore: number
  reasoning: string
  url: string
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [deals, setDeals] = useState<Deal[]>([])
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter what you\'re looking for')
      return
    }

    setLoading(true)
    setError('')
    setDeals([])

    try {
      const response = await fetch('/api/find-deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          location: location,
          maxPrice: maxPrice,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }

      const data = await response.json()
      setDeals(data.deals)
    } catch (err) {
      setError('Failed to find deals. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🤖 Facebook Marketplace Deal Finder
          </h1>
          <p className="text-gray-600 mb-6">
            AI-powered assistant to help you find the best deals on Facebook Marketplace
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What are you looking for? *
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., iPhone 13, gaming laptop, leather couch"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (optional)
                </label>
                <input
                  type="text"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="e.g., 500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              {loading ? 'Finding Deals...' : 'Find Best Deals'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {deals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Top Deals Found ({deals.length})
            </h2>
            {deals.map((deal, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {deal.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        💰 <strong className="ml-1">{deal.price}</strong>
                      </span>
                      <span className="flex items-center">
                        📍 {deal.location}
                      </span>
                      <span className="flex items-center">
                        ✨ {deal.condition}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full text-lg">
                      {deal.dealScore}/10
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    🧠 AI Analysis:
                  </p>
                  <p className="text-sm text-blue-800">{deal.reasoning}</p>
                </div>

                <a
                  href={deal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
                >
                  View on Facebook Marketplace →
                </a>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">
              Analyzing marketplace listings with AI...
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
