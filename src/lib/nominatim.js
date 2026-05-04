// Nominatim API helper — free, no key needed
// Rate limit: max 1 request per second per Nominatim policy

let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1100 // 1.1 seconds

const throttle = async () => {
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
  }
  lastRequestTime = Date.now()
}

const headers = {
  'Accept': 'application/json',
  'User-Agent': 'TripMate/1.0 (travel-companion-app)'
}

/**
 * Search for locations by query string
 */
export const searchLocations = async (query, limit = 5) => {
  if (!query || query.trim().length < 2) return []
  
  try {
    await throttle()
    const encodedQuery = encodeURIComponent(query.trim())
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=${limit}&addressdetails=1`,
      { headers }
    )
    
    if (!response.ok) throw new Error('Nominatim search failed')
    
    const data = await response.json()
    return data.map(item => ({
      id: item.place_id,
      name: item.name || item.display_name.split(',')[0],
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      country: item.address?.country || '',
      state: item.address?.state || '',
      city: item.address?.city || item.address?.town || item.address?.village || '',
      type: item.type,
      category: item.class
    }))
  } catch (error) {
    console.error('Location search error:', error)
    return []
  }
}

/**
 * Reverse geocode coordinates to address
 */
export const reverseGeocode = async (lat, lon) => {
  try {
    await throttle()
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      { headers }
    )
    
    if (!response.ok) throw new Error('Reverse geocode failed')
    
    const data = await response.json()
    return {
      name: data.name || data.address?.suburb || data.address?.city || 'Unknown',
      displayName: data.display_name,
      lat: parseFloat(data.lat),
      lon: parseFloat(data.lon),
      address: data.address || {},
      city: data.address?.city || data.address?.town || data.address?.village || '',
      state: data.address?.state || '',
      country: data.address?.country || ''
    }
  } catch (error) {
    console.error('Reverse geocode error:', error)
    return null
  }
}

/**
 * Get nearby places of interest using Nominatim
 */
export const getNearbyPlaces = async (lat, lon, radius = 5000) => {
  try {
    await throttle()
    // Use Nominatim search with viewbox for nearby places
    const delta = radius / 111000 // rough conversion meters to degrees
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=6&addressdetails=1&viewbox=${lon - delta},${lat + delta},${lon + delta},${lat - delta}&bounded=1&q=tourism`,
      { headers }
    )
    
    if (!response.ok) throw new Error('Nearby places search failed')
    
    const data = await response.json()
    return data.map(item => ({
      id: item.place_id,
      name: item.name || item.display_name.split(',')[0],
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type,
      distance: calculateDistance(lat, lon, parseFloat(item.lat), parseFloat(item.lon))
    }))
  } catch (error) {
    console.error('Nearby places error:', error)
    return []
  }
}

/**
 * Calculate distance between two coordinates in km
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal
}
