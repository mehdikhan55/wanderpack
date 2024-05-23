
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: mapCoordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker = new mapboxgl.Marker({color:'red'})
.setLngLat(mapCoordinates) //listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({ offset: 25 }) 
.setHTML(`
    <h4>${mapLocation}</h4><p>Location Provided after booking</p>
`))
.addTo(map); 

