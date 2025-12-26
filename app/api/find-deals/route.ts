import { NextRequest, NextResponse } from 'next/server'

interface Deal {
  title: string
  price: string
  location: string
  condition: string
  dealScore: number
  reasoning: string
  url: string
}

// Simulated marketplace data since we can't actually scrape Facebook
const generateMockListings = (query: string, location: string, maxPrice: string) => {
  const items = [
    {
      title: `${query} - Excellent Condition`,
      price: '$' + Math.floor(Math.random() * 500 + 100),
      location: location || 'San Francisco, CA',
      condition: 'Like New',
      description: 'Barely used, no scratches, comes with original box and accessories',
      listedDaysAgo: 2,
    },
    {
      title: `${query} - Great Deal!`,
      price: '$' + Math.floor(Math.random() * 300 + 50),
      location: location || 'Oakland, CA',
      condition: 'Good',
      description: 'Works perfectly, minor cosmetic wear, great price',
      listedDaysAgo: 1,
    },
    {
      title: `${query} Bundle - Must Sell`,
      price: '$' + Math.floor(Math.random() * 400 + 150),
      location: location || 'Berkeley, CA',
      condition: 'Very Good',
      description: 'Moving sale, includes extras, quick pickup needed',
      listedDaysAgo: 5,
    },
    {
      title: `Premium ${query}`,
      price: '$' + Math.floor(Math.random() * 600 + 200),
      location: location || 'San Jose, CA',
      condition: 'Excellent',
      description: 'Top condition, well maintained, all original parts',
      listedDaysAgo: 7,
    },
    {
      title: `${query} - Price Reduced!`,
      price: '$' + Math.floor(Math.random() * 250 + 75),
      location: location || 'Palo Alto, CA',
      condition: 'Fair',
      description: 'Some wear and tear, fully functional, motivated seller',
      listedDaysAgo: 10,
    },
  ]

  return items.filter(item => {
    if (maxPrice) {
      const itemPrice = parseInt(item.price.replace('$', ''))
      const max = parseInt(maxPrice)
      return itemPrice <= max
    }
    return true
  })
}

const analyzeDealsWithAI = async (query: string, listings: any[]): Promise<Deal[]> => {
  // Simulated AI analysis
  const analyzedDeals = listings.map((listing, index) => {
    const priceValue = parseInt(listing.price.replace('$', ''))
    const avgPrice = listings.reduce((sum, l) => sum + parseInt(l.price.replace('$', '')), 0) / listings.length

    let dealScore = 5
    let reasoning = ''

    // Price analysis
    if (priceValue < avgPrice * 0.7) {
      dealScore += 2
      reasoning = `Excellent price - ${Math.round(((avgPrice - priceValue) / avgPrice) * 100)}% below average. `
    } else if (priceValue < avgPrice * 0.9) {
      dealScore += 1
      reasoning = `Good price - below average market value. `
    } else {
      reasoning = `Fair price - in line with market value. `
    }

    // Condition analysis
    if (listing.condition === 'Like New' || listing.condition === 'Excellent') {
      dealScore += 2
      reasoning += 'Item is in excellent condition. '
    } else if (listing.condition === 'Very Good') {
      dealScore += 1
      reasoning += 'Item is in very good condition. '
    }

    // Urgency analysis
    if (listing.listedDaysAgo <= 2) {
      dealScore += 1
      reasoning += 'Recently listed - act fast! '
    }

    // Description analysis
    if (listing.description.includes('box') || listing.description.includes('accessories')) {
      dealScore += 1
      reasoning += 'Includes extras or original packaging. '
    }

    if (listing.description.toLowerCase().includes('must sell') ||
        listing.description.toLowerCase().includes('moving')) {
      reasoning += 'Seller is motivated - good negotiation opportunity. '
    }

    return {
      title: listing.title,
      price: listing.price,
      location: listing.location,
      condition: listing.condition,
      dealScore: Math.min(10, dealScore),
      reasoning: reasoning.trim(),
      url: `https://www.facebook.com/marketplace/item/${Math.random().toString(36).substr(2, 9)}`,
    }
  })

  // Sort by deal score
  return analyzedDeals.sort((a, b) => b.dealScore - a.dealScore).slice(0, 5)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, location, maxPrice } = body

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    // Generate mock listings
    const listings = generateMockListings(query, location, maxPrice)

    // Analyze with AI
    const deals = await analyzeDealsWithAI(query, listings)

    return NextResponse.json({ deals })
  } catch (error) {
    console.error('Error finding deals:', error)
    return NextResponse.json(
      { error: 'Failed to find deals' },
      { status: 500 }
    )
  }
}
