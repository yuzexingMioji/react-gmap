'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CircleWidegt = function () {
  function CircleWidegt() {
    _classCallCheck(this, CircleWidegt);

    this.center_position = null;
    this.dragger_position = null;
    this.radius = 200000;
    this.strokeWeight = 2;
    this.map = null;
    this.circle = new google.maps.Circle({
      strokeWeight: this.strokeWeight,
      radius: this.radius,
      center: this.center_position,
      map: this.map
    });
    this.center = new google.maps.Marker({
      draggable: true,
      map: this.map,
      position: this.center_position,
      title: 'Move me!'
    });
    this.dragger = new google.maps.Marker({
      draggable: true,
      map: this.map,
      position: this.dragger_position,
      title: 'Drag me!'
    });
  }

  CircleWidegt.prototype.showWithRadius = function showWithRadius(center_position, radius) {
    if (radius <= 0) {
      return;
    }
    if (!center_position || !center_position.lat || !center_position.lng) {
      return;
    }
    this.center_position = center_position;
    this.radius = radius;
    this.circle.setRadius(radius);
    this.circle.setCenter(center_position);
  };

  CircleWidegt.prototype.setMap = function setMap(map) {
    // this.map = map;
    this.circle.setMap(map);
  };

  CircleWidegt.prototype.showWithPosition = function showWithPosition() {};

  CircleWidegt.prototype.setStrokeWeight = function setStrokeWeight(strokeWeight) {
    this.strokeWeight = strokeWeight;
  };

  return CircleWidegt;
}();

exports.default = CircleWidegt;
module.exports = exports['default'];