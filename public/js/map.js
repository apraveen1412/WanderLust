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
        .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h4 class='locate-popup-header'>${typeof locate !== 'undefined' ? locate : ''}</h4><p class='locate-popup-text'>Exact location will be provided after booking</p>`))
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

    // Initialize the GeolocateControl - this is what draws the pulsing
    // blue-dot visualization on the map once it has a position.
    const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
    });
    // Add the control to the map.
    map.addControl(geolocate);

    const mapGeometry = document.querySelector('.geometry');
    const useLiveLocationBtn = document.querySelector('.useLiveLocation');

    if (useLiveLocationBtn) {
        useLiveLocationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Our button just clicks Mapbox's own (tiny) locate button for us -
            // that's what triggers the fly-to + blue-dot visualization.
            geolocate.trigger();
        });
    }

    // Set an event listener that fires once Mapbox actually has the
    // coordinates (whether that came from our button above, or someone
    // clicking the small control icon on the map directly).
    geolocate.on('geolocate', (position) => {
        const { longitude, latitude } = position.coords;
        // Store as a GeoJSON Point string so req.body.geometry on the
        // server can be JSON.parse()'d back into {type, coordinates}.
        mapGeometry.value = JSON.stringify({
            type: 'Point',
            coordinates: [longitude, latitude]
        });
    });

    geolocate.on('error', (error) => {
        console.log(error);
        mapGeometry.value = '';
    });
}