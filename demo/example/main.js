import React, {Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { GMap, PlaceAutocomplete, utils } from 'react-gmap';

class App extends Component {
  constructor(props) {
    super(props);
    this.onPlaceChange = this.onPlaceChange.bind(this);
    this.mapClick = this.mapClick.bind(this);
    this.searchPlace = this.searchPlace.bind(this);
    this.handleSelectFrom = this.handleSelectFrom.bind(this);
    this.mkOption = this.mkOption.bind(this);
    this.state = {
      options: {
        center: {lat: 39.92, lng: 116.46},
        zoom: 5
      },
      lineStyle: {
        strokeWeight: 4, 
        strokeColor: '#000'
      },
      lines: [{lat:39.92,lng:116.46},{lat:38.92,lng:116.46},{lat:38.92,lng:96.46}],
      markers: [
        {
          lat:39.92,
          lng:116.46,
          content: '<div class="marker "></div>'
        },
        {
          lat:38.92,
          lng:116.46,
          content: '<div class="marker"></div>'
        }
      ]
    };
  }
  searchPlace() {

  }
  mkOption(data,index, Option) {
    return <Option name = {data.name} id={data.id} key = {data.id}>{data.name}</Option>
  }
  handleSelectFrom() {
    
  }
  onPlaceChange(place) {
    this.setState({
      markers: [{lat: place.lat, lng: place.lng, content: '<div class="marker"></div>'}],
      options: {center: place, zoom: 16}
    })
  }
  mapClick(event) {
    const _this = this;
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    this.setState({
      markers: [{lat, lng, content: '<div class="marker"></div>'}],
    })
    const latLng = utils.latLng(lat, lng);
    utils.geocode({latLng}, function(result, status) {
      if(status == 'OK') {
        _this.placeRef.inputRef.value = result[0].formatted_address;
      }
    })
  }

  render() {
    return (
      <div style={{width: '500px', height: '500px'}} >
        <GMap 
          centerDisabled={true}
          zoomDisabled={true}
          ref={(v)=>this.mapRef=v}
          onClick={this.mapClick}
          lineStyle={this.state.lineStyle}
          options={this.state.options}
          posOptions={null}
          lines={this.state.lines}
          markers={this.state.markers} />
        <Suggestion
          width={130}
          onChange={this.searchPlace}
          mkOption = {this.mkOption}
          allowClear={false}
          onSelect = {this.handleSelectFrom}
          />
      </div>
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('container')
);
