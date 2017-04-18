import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { isEqual, assign } from 'lodash';
import * as utils from './utils';
import 'antd/dist/antd.css';
import Select from 'antd/lib/select';
import PubSub from 'pubsub-js';
import './index.scss';

class MJMap extends Component{
  constructor(props) {
    super(props);
    this.loadMap = this.loadMap.bind(this);
    this.reLoadJS = this.reLoadJS.bind(this);
    this.mapClick = this.mapClick.bind(this);
    this.queryAddr = this.queryAddr.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.clearMarker = this.clearMarker.bind(this);
    this.renderLines = this.renderLines.bind(this);
    this.latLng2Addr = this.latLng2Addr.bind(this);
    this.renderMakers = this.renderMakers.bind(this);
    this.dragEndEvent = this.dragEndEvent.bind(this);
    this.onSuggestionSelect = this.onSuggestionSelect.bind(this);
    this.addMarker2Position = this.addMarker2Position.bind(this);
    this.map = null;
    this.lines = [];
    this.markers = [];
    // 加载地图次数  最多三次
    this.loadTime = 0;    
    // 需要初始化反查地址  只反查一次
    this.initQueryAddr = true;
    this.state = {}

    this.default = {
      lineStyle: {
        strokeColor: '#2ec7fa',
        strokeOpacity: 1.0,
        strokeWeight: 3
      },
      options: {
        center: {
          lat: 39.92, lng: 116.46
        },
        zoom: 4,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true,
        draggable: true,
        scrollwheel: true,
        scaleControl: true,
        panControl: true,
        mapTypeControl:false,
        streetViewControl: false,
        backgroundColor: '#eee',
        clickableIcons: false,
        draggingCursor: 'move',
        draggableCursor: 'default',
        disableDoubleClickZoom: false,
        scrollwheel:false
      }
    }
  }

  renderLines() {
    const { lines=[], lineStyle } = this.props;
    this.lines.forEach((line) => {
      line.setMap(null);
    })
    this.lines = [];
    const lStyle = assign(this.default.lineStyle, lineStyle);
    const line = new google.maps.Polyline(assign({path: lines}, lStyle));
    this.lines.push(line);
    line.setMap(this.map);
  }

  renderMakers() {
    const { markers=[] } = this.props;
    this.markers.forEach((marker) => {
      marker.remove();
    })
    this.markers = [];
    markers.forEach((marker) => {
      let oMarker = new Marker(this.map, marker);
      this.markers.push(oMarker);
    });
  }

  updateMap() {
    if(!window.google) {
      return;
    }
    const { posOptions, options } = this.props;
    const newOptions = assign(this.default.options, options);
    
    if(posOptions) {
      utils.fitMap(this.map, posOptions)
    } 
    this.renderLines();
    this.renderMakers();
  }

  componentDidUpdate(prevProps, prevState) {
    if(!isEqual(this.props, prevProps)) {
      this.updateMap();
    } 
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(this.props, nextProps) && isEqual(this.state, nextState));
  }

  loadMap() {
    const { options, onClick, onDoubleClick } = this.props;
    window.Marker = function(map, marker){
      this.lat = marker.lat;
      this.lng = marker.lng;
      this.html  = marker.content;
      this.setMap(map);
    }

    Marker.prototype = new google.maps.OverlayView();
    Marker.prototype.draw = function(){
      let ele = this.ele;
      if(!ele) {
        ele = this.ele = document.createElement('div');
        ele.style.position = 'absolute';
        ele.style.zIndex = 999;
        ele.innerHTML = this.html

        this.getPanes().overlayImage.appendChild(ele);
      }

      var latlng = new google.maps.LatLng(this.lat, this.lng);
      var pos = this.getProjection().fromLatLngToDivPixel(latlng);
      if(pos) {
        ele.style.left = pos.x + 'px';
        ele.style.top = pos.y + 'px';
      }
    }
    Marker.prototype.remove = function(){
      if(this.ele) {
        this.ele.parentNode.removeChild(this.ele);
        this.ele = null;
      }
      this.setMap(null);
    }
    let _this = this;
    const mapDom = ReactDOM.findDOMNode(this.refs.mjmap);
    this.map = new google.maps.Map(mapDom, assign(this.default.options, options));
    this.map.addListener('click', function(event) {
       onClick && onClick(event);
       _this.mapClick(event);
    });
    this.map.addListener('dblclick', function(event) {
       onDoubleClick && onDoubleClick(event);
    });
    this.map.addMarker = this.addMarker2Position;
    this.props.getMap && this.props.getMap(this.map);
    this.updateMap();
    this.queryAddr();
  }

  queryAddr() {
    const { initQueryAddr } = this;
    if(!initQueryAddr) {
      return;
    }

    const { queryAddr } = this.props;
    if(!queryAddr || !queryAddr.lat || !queryAddr.lng) {
      return;
    }
    this.initQueryAddr = false;
    const { lat, lng } = queryAddr;
    const latLng = utils.latLng(lat, lng);
    this.latLng2Addr(latLng);
  }

  componentDidMount() {
    const _this = this;
    let key = this.props.apiKey;
    if(window.google) {
      _this.loadMap();
    } else {
      this.reLoadJS(key);
    }
     // 订阅事件
    PubSub.subscribe('onSelect',this.onSuggestionSelect);
    PubSub.subscribe('loading',this.onSuggestionSelect);
    PubSub.subscribe('clear',this.onSuggestionSelect);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.onSuggestionSelect);
  }

  reLoadJS(key) {
    if(this.loadTime >= 3) {
      alert('地图服务器错误');
      return;
    }
    this.loadTime++;
    let _this = this;
    utils.loadJS(key).then(_this.loadMap, () => {
      setTimeout(()=>{
        window.loadPromise= null;
        _this.reLoadJS(key);
      },100);
    });
  }

  onSuggestionSelect(msg,data) {
    // 关联的suggestion
    let fetter = this.props.fetter;
    if(fetter && data.from != fetter) {
      return;
    }
    switch(msg) {
      // select 事件 可以取消loading
      case 'onSelect':
        let position = data.geometry;
        if(position) {
          this.addMarker2Position(position);
          this.map.panTo(position);
          this.map.setZoom(16);
        }else {
          this.clearMarker();
        }
        this.setState({loading: false});
        break;
      case 'clear':
      //  清除事件
        this.clearMarker();
        this.setState({loading: false});
        break;

      case 'loading':
      // loading
        this.setState({loading: true});
        break;
    }
  }

  clearMarker() {
    if(this.point_marker) {
      this.point_marker.setMap(null);
    }
  }

  mapClick(event) {
    const _this = this;
    let lat = event.latLng.lat();
    let lng = event.latLng.lng();
    let position = {lat: lat, lng: lng};
    this.addMarker2Position(position);
    const latLng = utils.latLng(lat, lng);
    this.latLng2Addr(latLng);
  }

  latLng2Addr(latLng) {
    const {fetter} = this.props;
    utils.geocode({latLng}, function(result, status) {
      if(status == 'OK') {
        let data = result[0];
        let geometry = data.geometry;
        let lat = geometry.location.lat();
        let lng = geometry.location.lng();
        let option = {
          address: data.formatted_address,
          geometry: {lat,lng},
          error:false,
          from: fetter
        };
        PubSub.publish('onMapChange',option);
      }else {
        let option = {
          address: null,
          geometry: null,
          error:true,
          from: fetter
        };
        PubSub.publish('onMapChange',option);
      }
    })
  }

  addMarker2Position(position) {
    if(this.point_marker) {
      this.point_marker.setMap(null);
    }
    let {normalMarker = false} = this.props;
    let image = null;
    let shape = null;
    if(!normalMarker) {
      image = {
        url: 'http://ubsrc.cdn.mioji.com/gmap/img/icon_new_mappoint.png',
        size: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 32)
      };
      shape = {
        coords: [5, 11, 16, 0, 27, 11, 16, 32],
        type: 'poly'
      };
    }
    this.point_marker = new google.maps.Marker({
      position: position,
      map: this.map,
      shape: shape,
      icon:image,
      draggable:true
   });
    this.point_marker.addListener('dragend', this.dragEndEvent);
  }

  dragEndEvent(location) {
    let position = location.latLng;
    let lat = position.lat();
    let lng = position.lng();
    let _this = this;
    const latLng = utils.latLng(lat, lng);
    const {fetter} = this.props;
    utils.geocode({latLng}, function(result, status) {
      if(status == 'OK') {
        let data = result[0];
        let geometry = data.geometry;
        let lat = geometry.location.lat();
        let lng = geometry.location.lng();
        let option = {
          geometry: {lat,lng},
          address: data.formatted_address,
          error:false,
          from: fetter
        };
        PubSub.publish('onMapChange',option);
      }else {
        let option = {
          geometry: null,
          address: null,
          error:true,
          from: fetter
        };
        PubSub.publish('onMapChange',option);
      }
    })
  }

  render() {
    const { loading } = this.state;
    return (
      <div className='gmap-cool-container'>
        <div className='gmap-cool-map' ref="mjmap"></div>
        {
          loading
          ?
          <div className='gmap-loading-modal'>
            <div className='gmap-loading-desc'>
              <div className='gmap-loading-wrap'>
                <span className="loader">
                  <svg version="1.1"
                       width={"14px"}
                       height={"14px"}
                       viewBox={"0 0 24 24"}
                       style={{ enableBackground: 'new 0 0 50 50'}}>
                    <path fill={'#fff'} d="M0,12A12,12,0,1,1,12,24A2,2,0,1,1,12,20A8,8,0,1,0,4,12A2,2,0,1,1,0,12z">
                      <animateTransform 
                        attributeType="xml"
                        attributeName="transform"
                        type="rotate"
                        from="0 12 12"
                        to="360 12 12"
                        dur="0.6s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>
                </span>
                <span className='gmap-loading-inner-desc'>
                  正在加载…
                </span>
              </div>
            </div>
          </div>
          :
          null
        }
      </div>
    )
  }
}
 



MJMap.propTypes = {
  lines: PropTypes.array,
  markers: PropTypes.array,
  posOptions: PropTypes.object,
  options: PropTypes.object,
  lineStyle: PropTypes.object,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  centerMarker: PropTypes.object,
  normalMarker:PropTypes.bool
}

export default MJMap;
