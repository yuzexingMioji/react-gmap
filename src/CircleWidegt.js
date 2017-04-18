

class CircleWidegt {
  
  constructor() {
    this.center_position=null;
    this.dragger_position=null;
    this.radius = 200000;
    this.strokeWeight = 2;
    this.map=null;
    this.circle = new google.maps.Circle({
      strokeWeight: this.strokeWeight,
      radius:this.radius,
      center:this.center_position,
      map:this.map,
    });
    this.center = new google.maps.Marker({
      draggable: true,
      map:this.map,
      position:this.center_position,
      title: 'Move me!'
    });
    this.dragger = new google.maps.Marker({
      draggable: true,
      map:this.map,
      position:this.dragger_position,
      title: 'Drag me!'
    });
  }

  showWithRadius(center_position,radius) {
    if(radius <= 0) {
      return;
    }
    if(!center_position || !center_position.lat || !center_position.lng) {
      return;
    }
    this.center_position = center_position;
    this.radius = radius;
    this.circle.setRadius(radius);
    this.circle.setCenter(center_position);
  }
  setMap(map) {
    // this.map = map;
    this.circle.setMap(map);
  }
  showWithPosition() {

  }
  setStrokeWeight(strokeWeight) {
    this.strokeWeight = strokeWeight;
  }

}

export default CircleWidegt;