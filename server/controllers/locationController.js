import axios from 'axios';

// @desc   Forward geocoding (Address -> Lat/Lon)
// @route  GET /api/location/geocode?address=...
// @access Public
export const geocodeAddress = async (req, res, next) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'Address query parameter is required'
      });
    }

    const apiKey = process.env.LOCATIONIQ_API_KEY?.trim();
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'LocationIQ API key is not configured on the server'
      });
    }

    const searchQuery = address.trim();
    console.log(`[LocationIQ] Searching for: "${searchQuery}"`);

    const url = `https://us1.locationiq.com/v1/search?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&format=json&limit=1`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return res.status(200).json({
        success: true,
        data: {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          formattedAddress: result.display_name,
          placeId: result.place_id
        }
      });
    }

    res.status(404).json({
      success: false,
      message: 'Address not found'
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }
    console.error('Geocoding API error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to geocode address'
    });
  }
};

// @desc   Reverse geocoding (Lat/Lon -> Address)
// @route  GET /api/location/reverse?lat=...&lon=...
// @access Public
export const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude query parameters are required'
      });
    }

    const apiKey = process.env.LOCATIONIQ_API_KEY?.trim();
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'LocationIQ API key is not configured on the server'
      });
    }

    console.log(`[LocationIQ] Reverse geocoding: Lat ${lat}, Lon ${lon}`);
    const url = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;
    
    const response = await axios.get(url);
    
    if (response.data && response.data.display_name) {
      return res.status(200).json({
        success: true,
        data: {
          latitude: parseFloat(response.data.lat || lat),
          longitude: parseFloat(response.data.lon || lon),
          formattedAddress: response.data.display_name,
          placeId: response.data.place_id
        }
      });
    }

    res.status(404).json({
      success: false,
      message: 'Location not found'
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }
    console.error('Reverse Geocoding API error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to reverse geocode location'
    });
  }
};
