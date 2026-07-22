// Check whether valid coordinates are available
if (
    Array.isArray(coordinates) &&
    coordinates.length === 2 &&
    coordinates.every(Number.isFinite)
) {
    // Create a map centered on the listing's location
    const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: "map", // ID of the HTML element that will contain the map
        style: "mapbox://styles/mapbox/standard", // Mapbox map style
        center: coordinates, // [longitude, latitude]
        zoom: 11 // Initial zoom level
    });

    // Create and add a marker at the listing's location
    new mapboxgl.Marker({
        color: "#FF0000", // Marker color
        scale: 1 // Marker size
    })
        .setLngLat(coordinates) // Set marker position
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4 class='locate-popup-header'>${locate}</h4><p class='locate-popup-text'>Exact location will be provided after booking</p>`))
        .addTo(map); // Add marker to the map

} else {
    // If no valid coordinates exist, show the default world map
    const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: "map", // ID of the HTML element that will contain the map
        style: "mapbox://styles/mapbox/standard", // Mapbox map style
        center: [-24, 42], // Default world view
        zoom: 1 // Zoomed out to show most of the world
    });

    // Add a geolocation control so users can locate themselves
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true // Use GPS if available
            },
            trackUserLocation: true, // Continuously track user's location
            showUserHeading: true // Display an arrow indicating device direction
        })
    );
}