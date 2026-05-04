// Curated high-quality travel images from Unsplash
// Using direct Unsplash image URLs (no API key needed for hotlinking)

const CURATED_IMAGES = {
  'beach': [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476673160081-cf065bc4cf87?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=600&h=400&fit=crop',
  ],
  'mountain': [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&h=400&fit=crop',
  ],
  'camping': [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1487730116645-74489c95b41b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=600&h=400&fit=crop',
  ],
  'heritage': [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=600&h=400&fit=crop',
  ],
  'city': [
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop',
  ],
  'default': [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=400&fit=crop',
  ]
}

// Specific destination images
const DESTINATION_IMAGES = {
  'taj mahal': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
  'jaipur': 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop',
  'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop',
  'manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop',
  'kashmir': 'https://images.unsplash.com/photo-1597074866923-dc0589150458?w=600&h=400&fit=crop',
  'shimla': 'https://images.unsplash.com/photo-1597074866923-dc0589150458?w=600&h=400&fit=crop',
  'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop',
  'kerala': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop',
  'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop',
  'santorini': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop',
  'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop',
  'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop',
  'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop',
  'dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop',
  'maldives': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&h=400&fit=crop',
  'nalanda': 'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=400&fit=crop',
  'bodh gaya': 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=600&h=400&fit=crop',
  'everest': 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=600&h=400&fit=crop',
  'ladakh': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop',
  'udaipur': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop',
}

/**
 * Get image URL for a destination
 */
export const getDestinationImage = (name, category = 'default') => {
  // Check specific destination first
  const nameLower = (name || '').toLowerCase()
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (nameLower.includes(key)) return url
  }
  
  // Fall back to category-based image
  const categoryImages = CURATED_IMAGES[category] || CURATED_IMAGES['default']
  const hash = nameLower.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return categoryImages[hash % categoryImages.length]
}

/**
 * Get a random travel image for backgrounds
 */
export const getRandomTravelImage = (width = 600, height = 400) => {
  const allImages = CURATED_IMAGES['default']
  return allImages[Math.floor(Math.random() * allImages.length)]
}

/**
 * Generate Unsplash search URL (for dynamic fetching)
 */
export const getUnsplashSearchUrl = (query, width = 400, height = 300) => {
  const encodedQuery = encodeURIComponent(`${query} travel`)
  return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=${width}&h=${height}&fit=crop&q=80`
}
