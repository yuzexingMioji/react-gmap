'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadJS = loadJS;
exports.geocode = geocode;
exports.latLng = latLng;
exports.fitMap = fitMap;
/*.
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>*/
function loadJS(key) {
  key = key ? '&key=' + key : '';
  if (window.loadPromise) {
    return window.loadPromise;
  } else {
    var loadPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'http://ditu.google.cn/maps/api/js?libraries=places' + key;
      s.onload = resolve;
      s.onerror = reject;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    });
    window.loadPromise = loadPromise;
    return loadPromise;
  }
}

function geocode(options, callback) {
  if (window.google) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(options, callback);
  } else {
    loadJS().then(function () {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode(options, callback);
    });
  }
}

function latLng(lat, lng) {
  return new google.maps.LatLng(lat, lng);
}

function fitMap(map, options) {
  if (!options.coords || options.coords.lenght == 0) {
    return;
  }
  var coords = options.coords;
  fitBounds(map, coords);

  var leftTop = function leftTop(coords) {
    var lats = [],
        lngs = [];

    coords.forEach(function (coord) {
      lats.push(parseFloat(coord.lat));
      lngs.push(parseFloat(coord.lng));
    });

    return { left: Math.min.apply(null, lngs), top: Math.max.apply(null, lats) };
  };

  var projCb = function projCb(proj) {
    var defaultPix = { x: 0, y: 0 };
    var pix = options.pix || defaultPix;
    var c1 = new google.maps.Point(0, 0);
    var c2 = new google.maps.Point(pix.x, pix.y);

    var coord1 = proj.fromContainerPixelToLatLng(c1);
    var coord2 = proj.fromContainerPixelToLatLng(c2);

    var offset = { left: coord2.lng() - coord1.lng(), top: coord2.lat() - coord1.lat() };

    coords.push({ lat: leftTop(coords).top - offset.top, lng: leftTop(coords).left - offset.left });
    fitBounds(map, coords);
  };

  latToCoords(map, projCb);
}

function fitBounds(map, coords) {
  if (!window.google) {
    return;
  }
  var bounds = new google.maps.LatLngBounds();
  coords && coords.forEach(function (coord) {
    bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
  });
  map.fitBounds(bounds);
}

function latToCoords(map, callback) {
  if (!window.google) {
    return;
  }
  var ov = void 0;
  function OV(map) {
    this.setMap(map);
  }
  OV.prototype = new google.maps.OverlayView();
  OV.prototype.draw = function () {
    return false;
  };
  OV.prototype.onAdd = function () {
    var proj = this.getProjection();
    callback && callback(proj);
  };
  ov = new OV(map);
}