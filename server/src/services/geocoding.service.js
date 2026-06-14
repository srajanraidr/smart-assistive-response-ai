const axios = require("axios");

async function geocodeLocation(location) {
  if (!location) {
    return {
      latitude: null,
      longitude: null,
    };
  }

  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1,
        },
        headers: {
          "User-Agent": "SARA Emergency Dispatch System",
        },
      }
    );

    if (response.data.length === 0) {
      return {
        latitude: null,
        longitude: null,
      };
    }

    return {
      latitude: Number(response.data[0].lat),
      longitude: Number(response.data[0].lon),
    };
  } catch (error) {
    console.error("Geocoding failed:", error.message);

    return {
      latitude: null,
      longitude: null,
    };
  }
}

module.exports = {
  geocodeLocation,
};