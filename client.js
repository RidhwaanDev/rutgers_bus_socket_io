let map;

// NB
const locations = {
  lat: 40.499820,
  lng: -74.448530,
};

const LX = "4012630";
const A = "4012616";
const B = "4012618";
const EE = "4012624";
const F = "4012626";
const H = "4012628";

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: { lat: locations.lat, lng: locations.lng }
  });
  getAllSegments();
}

function getSegmentsForRoute() {
  // query Transloc API
  $.ajax({
    url: "https://transloc-api-1-2.p.rapidapi.com/segments.json",
    contentType: 'application/json; charset=utf-8',
    type: "GET",
    data: {
      "agencies": 1323,
      "routes": "4012630",
      "geo_area": "40.506831,-74.456645|15000",
    },
    headers: {
      "X-RapidAPI-Host": "transloc-api-1-2.p.rapidapi.com",
      "X-RapidAPI-Key": "hHcLr1qWHDmshwibREtIrhryL9bcp1Fw9AQjsnCiZyEzRrJKOS"
    },
      success: function (result) {
      parseSegments((result));
    }
  });
}

function getAllRoutes(callback){
  $.ajax({
    url: "https://transloc-api-1-2.p.rapidapi.com/routes.json",
    contentType: 'application/json; charset=utf-8',
    type: "GET",
    data: {
      "agencies": 1323,
    },
    headers: {
      "X-RapidAPI-Host": "transloc-api-1-2.p.rapidapi.com",
      "X-RapidAPI-Key": "hHcLr1qWHDmshwibREtIrhryL9bcp1Fw9AQjsnCiZyEzRrJKOS"
    },

      success: function (result) {
        callback(result);
    }
  });

function getAllSegments(){
 $.ajax({
    url: "https://transloc-api-1-2.p.rapidapi.com/segments.json",
    contentType: 'application/json; charset=utf-8',
    type: "GET",
    data: {
      "agencies": 1323,
    },
    headers: {
      "X-RapidAPI-Host": "transloc-api-1-2.p.rapidapi.com",
      "X-RapidAPI-Key": "hHcLr1qWHDmshwibREtIrhryL9bcp1Fw9AQjsnCiZyEzRrJKOS"
    },
      success: function (result) {
        drawAllSegments(result);
    }
  });
}

function drawAllSegments(result){
  const segments = result.data;

  getAllRoutes(function(result){
    const data = (result.data)['1323'];
    data.forEach(route => {

      const color_random = randomColor();

      route.segments.forEach(it => {
        drawSingleSegment(segments[it[0]]);
      });

    });
  }
}

// draw a single segment from a polyline encoding
function drawSingleSegment(encoding){
  let array_latlng = google.maps.geometry.encoding.decodePath(encoding);
  const spoly = new google.maps.Polyline({
    strokeColor: randomColor(),
    strokeOpacity: 1.0,
    strokeWeight: 5,
  });
  array_latlng.forEach(latlng => { addLatLngToPoly(latlng, spoly) });
  spoly.setMap(map);
}


function randomColor(){
  return  '#' + (function co(lor){   return (lor +=
	[0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
      && (lor.length == 6) ?  lor : co(lor); })('');
}

function parseSegments(result) {
  // console.log(result);
  const segments = result.data;
  for (let key of Object.keys(segments)) {
    let array_latlng = google.maps.geometry.encoding.decodePath(segments[key]);
    console.log(segments[key]);
    drawSingleSegment(segments[key]);
  }
}

function addLatLngToPoly(latLng, poly) {
  const path = poly.getPath();
  path.push(latLng);
}

