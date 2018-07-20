window.onload = function () {
    let map
    let geocoder
    let lat, lng
    let btnNearby = this.document.getElementById("nearby")
    let btnCity = this.document.getElementById("city")
    infoWindow = new google.maps.InfoWindow();
    btnNearby.addEventListener("click", function () {

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(showPosition);
        }

        function showPosition(position) {
            lat = position.coords.latitude
            lng = position.coords.longitude;

            map = new GMaps({
                div: '#cta',
                lat: lat,
                lng: lng,
                zoom: 15,
                styles: [{
                        elementType: 'geometry',
                        stylers: [{
                            color: '#242f3e'
                        }]
                    },
                    {
                        elementType: 'labels.text.stroke',
                        stylers: [{
                            color: '#242f3e'
                        }]
                    },
                    {
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#746855'
                        }]
                    },
                    {
                        featureType: 'administrative.locality',
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#d59563'
                        }]
                    },
                    {
                        featureType: 'poi',
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#d59563'
                        }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'geometry',
                        stylers: [{
                            color: '#263c3f'
                        }]
                    },
                    {
                        featureType: 'poi.park',
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#6b9a76'
                        }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry',
                        stylers: [{
                            color: '#38414e'
                        }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'geometry.stroke',
                        stylers: [{
                            color: '#212a37'
                        }]
                    },
                    {
                        featureType: 'road',
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#9ca5b3'
                        }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry',
                        stylers: [{
                            color: '#746855'
                        }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'geometry.stroke',
                        stylers: [{
                            color: '#1f2835'
                        }]
                    },
                    {
                        featureType: 'road.highway',
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#f3d19c'
                        }]
                    },
                    {
                        featureType: 'transit',
                        elementType: 'geometry',
                        stylers: [{
                            color: '#2f3948'
                        }]
                    },
                    {
                        featureType: 'transit.station',
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#d59563'
                        }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'geometry',
                        stylers: [{
                            color: '#17263c'
                        }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.fill',
                        stylers: [{
                            color: '#515c6d'
                        }]
                    },
                    {
                        featureType: 'water',
                        elementType: 'labels.text.stroke',
                        stylers: [{
                            color: '#17263c'
                        }]
                    }
                ]
            });

            let marker = map.addMarker({
                map: map.map,
                size: new google.maps.Size(10, 12),
                title: "I'm here",
                position: {
                    lat: lat,
                    lng: lng
                }
            });

            let request = {
                location: {
                    lat: lat,
                    lng: lng
                },
                radius: '2000',
                type: ['church']
            }

            let service = new google.maps.places.PlacesService(map.map);
            service.nearbySearch(request, callback);

            function callback(results, status) {
                console.log("entrei");
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (let i = 0; i < results.length; i++) {
                        let place = results[i];
                        //console.log(place)

                        let image = {
                            url: place.icon,
                            size: new google.maps.Size(40, 40),
                            scaledSize: new google.maps.Size(35, 35)
                        };
                        let marker = map.addMarker({
                            map: map.map,
                            icon: image,
                            size: new google.maps.Size(10, 12),
                            title: place.name,
                            position: place.geometry.location
                        });

                        google.maps.event.addListener(marker, 'click', function () {
                            let request = {
                                placeId: place.place_id
                            };

                            service.getDetails(request, function (result, status) {
                                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                                    console.error(status);
                                    return;
                                }
                                //console.log(result)

                                infoWindow.setContent(renderInfoWindow(result))
                                infoWindow.open(map, marker);
                            });
                        });
                    }
                }
            }



        }




    })


    btnCity.addEventListener("click", function () {
        geocoder = new google.maps.Geocoder();
        let cityName = document.getElementById("cityName").value
        codeAddress(cityName)
    })

    function codeAddress(address) {
        geocoder.geocode({
            address: address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results[0].geometry.location.lat())
                map = new GMaps({
                    div: '#cta',
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                    zoom: 15})

                map.setCenter(results[0].geometry.location); //center the map over the result
                //place a marker at the location
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                });
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function renderInfoWindow(result) {
        console.log(result)
        let str = `<html><body>`
        str += `<h4> ${result.name}</h4>`
        str += `<b>Address:</b> ${result.vicinity}<br>`
        if (result.rating != undefined) {
            str += `<b>Rating:</b> ${result.rating}<br>`
        }
        if (result.photos != null) {
            str += `<b>Photos:</b><br>`
            for (let i = 0; i < result.photos.length; i++) {
                const photo = result.photos[i]
                str += `<img src='${photo.getUrl({"maxWidth": 100, "maxHeight": 100})}'>&nbsp`
            }
        }
        if (result.website != undefined) {
            str += `<br><br><b>URL:</b> <a href='${result.website}' target='_blank'>${result.website}</a>`
        }
        str += `</body></html>`
        return str
    }


}