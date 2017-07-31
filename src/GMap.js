import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { isEqual, assign } from 'lodash';
import * as utils from './utils';
import 'antd/dist/antd.css';
import Select from 'antd/lib/select';
import './index.scss';

class GMap extends Component{
  constructor(props) {
    super(props);
    this.loadMap = this.loadMap.bind(this);
    this.reLoadJS = this.reLoadJS.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.renderLines = this.renderLines.bind(this);
    this.renderMakers = this.renderMakers.bind(this);
    this.addInfoWindow = this.addInfoWindow.bind(this);
    this.map = null;
    this.lines = [];
    this.markers = [];    
    this.loadTime = 0;
    this.state = {}

    this.default = {
      lineStyle: {
        strokeColor: '#2ec7fa',
        strokeOpacity: 1.0,
        strokeWeight: 3,
        cursor: 'default'
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
        disableDoubleClickZoom: false
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

  addInfoWindow(ele, data) {
    if(!data) {
      console.log('error no data');
      return;
    }
    const { name, type, playtime, point='', img, noHover } = data;
    const info = document.createElement('div');
    info.innerHTML = "<img class='info-img' src="+img+" /><div class='info-desc-wrap'><span class='info-name over-hide'>"+name+"</span><span class='info-type over-hide'>"+type+"</span><div class='time-point'><span class='info-point over-hide'>"+point+"</span><span class='info-time over-hide'>"+playtime+"</span></div></div>";
    info.className = 'info-container';
    info.style.display = 'none';
    info.style.zIndex = 1005;

    const tag = document.createElement('div');
    tag.innerHTML = "<div class='info-title over-hide'>"+name+"</div>";
    tag.className = 'info-title-container';
    tag.style.zIndex = 1000;
    tag.onmouseover = function(e) {
      e.stopPropagation()
    };
    tag.onmouseout = function(e) {
      e.stopPropagation()
    };
    info.onmouseover = function(e) {
      e.stopPropagation()
    };
    info.onmouseout = function(e) {
      e.stopPropagation()
    };

    const circle = ele.firstChild;
    circle.onmouseover = !noHover && function() {
      info.style.display = 'flex';
      tag.style.display = 'none';
      ele.style.zIndex = '1000';
    };
    circle.onmouseout = !noHover && function() {
      info.style.display = 'none';
      tag.style.display = 'inline-block';
      ele.style.zIndex = '999';
    };

    circle.position = 'relative';
    circle.appendChild(tag);
    if(!noHover) {
      circle.appendChild(info);
    }else {
      circle.style.cursor = 'default';
    }
  }

  loadMap() {
    const { options, onClick, onDoubleClick } = this.props;
    window.Marker = function(map, marker){
      this.lat = marker.lat;
      this.lng = marker.lng;
      this.html  = marker.content;
      this.needInfo = marker.needInfo;
      this.data = marker.data;
      this.setMap(map);
    }
    const _this = this;

    Marker.prototype = new google.maps.OverlayView();
    Marker.prototype.draw = function(){
      let ele = this.ele;
      if(!ele) {
        ele = this.ele = document.createElement('div');
        ele.style.position = 'absolute';
        ele.style.zIndex = 999;
        ele.innerHTML = this.html;
        // 展示windowInfo
        this.needInfo && _this.addInfoWindow(ele, this.data);
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
    const mapDom = ReactDOM.findDOMNode(this.refs.mjmap);
    this.map = new google.maps.Map(mapDom, assign(this.default.options, options));
    this.map.addListener('click', function(event) {
       onClick && onClick(event);
    });
    this.map.addListener('dblclick', function(event) {
       onDoubleClick && onDoubleClick(event);
    });
    this.props.getMap && this.props.getMap(this.map);
    this.updateMap();
  }

  componentDidMount() {
    const _this = this;
    let key = this.props.apiKey;
    if(window.google) {
      _this.loadMap();
    } else {
      this.reLoadJS(key);
    }
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
        window.loadPromise = null;
        _this.reLoadJS(key);
      },100);
    });
  }

  render() {
    const { loading } = this.props;
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
 



GMap.propTypes = {
  lines: PropTypes.array,
  markers: PropTypes.array,
  posOptions: PropTypes.object,
  options: PropTypes.object,
  lineStyle: PropTypes.object,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func
}

export default GMap;
