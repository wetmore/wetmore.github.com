function initialize() {
  geocoder = new google.maps.Geocoder();

  var mapOptions = {
    zoom: 3,
    center: new google.maps.LatLng(0, -180),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var mydiv = document.getElementById('elm-place');
  var where = Elm.embed(Elm.WhereIsMatt, mydiv, {});
  var places = [];

  where.ports.updateMap.subscribe(function(update) {
    var place = find(geocoder, update[1], function(place) {
      console.log(place)

      places.push(place);

      if (update[0] == "stay") {
        map.setCenter(place.geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: place.geometry.location
        });
      } else if (update[0] == "travel") {
        var takeoff = places[places.length - 2].geometry.location
        var landing = places[places.length - 1].geometry.location
        var current = google.maps.geometry.spherical.interpolate(takeoff, landing, update[2])

        var flightPath = new google.maps.Polyline({
          path: [
            takeoff,
            landing
          ],
          geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        map.setCenter(place.geometry.location);

        flightPath.setMap(map);
      }
    });
  });
}

function find(geocoder, place, cb) {
  geocoder.geocode( { 'address': place}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      return cb(results[0]);
    }
  });
} 

google.maps.event.addDomListener(window, 'load', initialize);