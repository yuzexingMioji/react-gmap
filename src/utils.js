/*.
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>*/
export function loadJS(key) {
  key = key ? '&key='+ key : '';
  if(window.loadPromise) {
    return window.loadPromise;
  } else {
    const loadPromise = new Promise((resolve, reject) => {
      let s = document.createElement('script');
      s.src = 'http://ditu.google.cn/maps/api/js?libraries=places'+key;
      s.onload = resolve;
      s.onerror = reject;
      let x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    });
    window.loadPromise = loadPromise;
    return loadPromise;
  }
}

export function geocode(options, callback) {
  if(window.google) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(options, callback);
  } else {
    loadJS().then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(options, callback);
    })
  }
}

export function latLng(lat, lng) {
  return new google.maps.LatLng(lat, lng);
}

export function fitMap(map, options, getProjection) {
  if(!options.coords || options.coords.lenght == 0) {
    return;
  }
  let coords = options.coords;
  fitBounds(map, coords);

  const leftTop = function(coords) {
    let lats = [],lngs = [];

    coords.forEach((coord) => {
      lats.push(parseFloat(coord.lat));
      lngs.push(parseFloat(coord.lng));
    })

    return {left: Math.min.apply(null,lngs), top: Math.max.apply(null,lats)};
  }

  const projCb = function(proj) {
    const defaultPix = {x: 0, y: 0};
    const pix = options.pix || defaultPix;
    const c1 = new google.maps.Point(0, 0);
    const c2 = new google.maps.Point(pix.x, pix.y);

    const coord1 = proj.fromContainerPixelToLatLng(c1);
    const coord2 = proj.fromContainerPixelToLatLng(c2);

    const offset = {left: coord2.lng() - coord1.lng(), top: coord2.lat() - coord1.lat()};

    coords.push({lat: leftTop(coords).top - offset.top, lng: leftTop(coords).left - offset.left});
    fitBounds(map, coords);
    getProjection && getProjection(proj);
  }

  latToCoords(map, projCb);
}

export function getValue(path, obj) {
  return path.reduce(function(acc, value) {
    return (acc && acc[value]) ? acc[value] : null
  }, obj);
}

function fitBounds(map, coords) {
  if(!window.google) {
    return;
  }
  if(coords && coords.lenght == 1) {
    // 单点特殊处理 约500m比例尺
    map.panTo(new google.maps.LatLng(coords[0].lat, coords[0].lng));
    map.setZoom(14);
    return;
  }
  let bounds = new google.maps.LatLngBounds();
  coords && coords.forEach((coord) => {
    bounds.extend(new google.maps.LatLng(coord.lat, coord.lng));
  })
  map.fitBounds(bounds);
}

function latToCoords(map, callback) {
  if(!window.google) {
    return;
  }
  let ov;
  function OV(map) {
    this.setMap(map);
  }
  OV.prototype = new google.maps.OverlayView();
  OV.prototype.draw = function() {
    return false;
  }
  OV.prototype.onAdd = function(){
    var proj = this.getProjection();
    callback && callback(proj);
  };
  ov = new OV(map);
}