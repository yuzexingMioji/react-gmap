'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

require('./index.scss');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var GMap = function (_Component) {
  _inherits(GMap, _Component);

  function GMap(props) {
    _classCallCheck(this, GMap);

    var _this2 = _possibleConstructorReturn(this, _Component.call(this, props));

    _this2.loadMap = _this2.loadMap.bind(_this2);
    _this2.reLoadJS = _this2.reLoadJS.bind(_this2);
    _this2.updateMap = _this2.updateMap.bind(_this2);
    _this2.renderLines = _this2.renderLines.bind(_this2);
    _this2.renderMakers = _this2.renderMakers.bind(_this2);
    _this2.addInfoWindow = _this2.addInfoWindow.bind(_this2);
    _this2.map = null;
    _this2.lines = [];
    _this2.markers = [];
    _this2.loadTime = 0;
    _this2.state = {};

    _this2.default = {
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
        mapTypeControl: false,
        streetViewControl: false,
        backgroundColor: '#eee',
        clickableIcons: false,
        draggingCursor: 'move',
        draggableCursor: 'default',
        disableDoubleClickZoom: false
      }
    };
    return _this2;
  }

  GMap.prototype.renderLines = function renderLines() {
    var _props = this.props,
        _props$lines = _props.lines,
        lines = _props$lines === undefined ? [] : _props$lines,
        lineStyle = _props.lineStyle;

    this.lines.forEach(function (line) {
      line.setMap(null);
    });
    this.lines = [];
    var lStyle = (0, _assign2.default)(this.default.lineStyle, lineStyle);
    var line = new google.maps.Polyline((0, _assign2.default)({ path: lines }, lStyle));
    this.lines.push(line);
    line.setMap(this.map);
  };

  GMap.prototype.renderMakers = function renderMakers() {
    var _this3 = this;

    var _props$markers = this.props.markers,
        markers = _props$markers === undefined ? [] : _props$markers;

    this.markers.forEach(function (marker) {
      marker.remove();
    });
    this.markers = [];
    markers.forEach(function (marker) {
      var oMarker = new Marker(_this3.map, marker);
      _this3.markers.push(oMarker);
    });
  };

  GMap.prototype.updateMap = function updateMap() {
    if (!window.google) {
      return;
    }
    var _props2 = this.props,
        posOptions = _props2.posOptions,
        options = _props2.options;

    var newOptions = (0, _assign2.default)(this.default.options, options);
    if (posOptions) {
      utils.fitMap(this.map, posOptions);
    }
    this.renderLines();
    this.renderMakers();
  };

  GMap.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!(0, _isEqual2.default)(this.props, prevProps)) {
      this.updateMap();
    }
  };

  GMap.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return !((0, _isEqual2.default)(this.props, nextProps) && (0, _isEqual2.default)(this.state, nextState));
  };

  GMap.prototype.addInfoWindow = function addInfoWindow(ele, data) {
    if (!data) {
      console.log('error no data');
      return;
    }
    var name = data.name,
        type = data.type,
        playtime = data.playtime,
        _data$point = data.point,
        point = _data$point === undefined ? '' : _data$point,
        img = data.img,
        noHover = data.noHover;

    var info = document.createElement('div');
    info.innerHTML = "<img class='info-img' src=" + img + " /><div class='info-desc-wrap'><span class='info-name over-hide'>" + name + "</span><span class='info-type over-hide'>" + type + "</span><div class='time-point'><span class='info-point over-hide'>" + point + "</span><span class='info-time over-hide'>" + playtime + "</span></div></div>";
    info.className = 'info-container';
    info.style.display = 'none';
    info.style.zIndex = 1005;

    var tag = document.createElement('div');
    tag.innerHTML = "<div class='info-title over-hide'>" + name + "</div>";
    tag.className = 'info-title-container';
    tag.style.zIndex = 1000;
    tag.onmouseover = function (e) {
      e.stopPropagation();
    };
    tag.onmouseout = function (e) {
      e.stopPropagation();
    };
    info.onmouseover = function (e) {
      e.stopPropagation();
    };
    info.onmouseout = function (e) {
      e.stopPropagation();
    };

    var circle = ele.firstChild;
    circle.onmouseover = !noHover && function () {
      info.style.display = 'flex';
      tag.style.display = 'none';
      ele.style.zIndex = '1000';
    };
    circle.onmouseout = !noHover && function () {
      info.style.display = 'none';
      tag.style.display = 'inline-block';
      ele.style.zIndex = '999';
    };

    circle.position = 'relative';
    circle.appendChild(tag);
    if (!noHover) {
      circle.appendChild(info);
    } else {
      circle.style.cursor = 'default';
    }
  };

  GMap.prototype.loadMap = function loadMap() {
    var _props3 = this.props,
        options = _props3.options,
        onClick = _props3.onClick,
        onDoubleClick = _props3.onDoubleClick;

    window.Marker = function (map, marker) {
      this.lat = marker.lat;
      this.lng = marker.lng;
      this.html = marker.content;
      this.needInfo = marker.needInfo;
      this.data = marker.data;
      this.setMap(map);
    };
    var _this = this;

    Marker.prototype = new google.maps.OverlayView();
    Marker.prototype.draw = function () {
      var ele = this.ele;
      if (!ele) {
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
      if (pos) {
        ele.style.left = pos.x + 'px';
        ele.style.top = pos.y + 'px';
      }
    };
    Marker.prototype.remove = function () {
      if (this.ele) {
        this.ele.parentNode.removeChild(this.ele);
        this.ele = null;
      }
      this.setMap(null);
    };
    var mapDom = _reactDom2.default.findDOMNode(this.refs.mjmap);
    this.map = new google.maps.Map(mapDom, (0, _assign2.default)(this.default.options, options));
    this.map.addListener('click', function (event) {
      onClick && onClick(event);
    });
    this.map.addListener('dblclick', function (event) {
      onDoubleClick && onDoubleClick(event);
    });
    this.props.getMap && this.props.getMap(this.map);
    this.updateMap();
  };

  GMap.prototype.componentDidMount = function componentDidMount() {
    var _this = this;
    var key = this.props.apiKey;
    if (window.google) {
      _this.loadMap();
    } else {
      this.reLoadJS(key);
    }
  };

  GMap.prototype.reLoadJS = function reLoadJS(key) {
    if (this.loadTime >= 3) {
      alert('地图服务器错误');
      return;
    }
    this.loadTime++;
    var _this = this;
    utils.loadJS(key).then(_this.loadMap, function () {
      setTimeout(function () {
        window.loadPromise = null;
        _this.reLoadJS(key);
      }, 100);
    });
  };

  GMap.prototype.render = function render() {
    var loading = this.props.loading;

    return _react2.default.createElement(
      'div',
      { className: 'gmap-cool-container' },
      _react2.default.createElement('div', { className: 'gmap-cool-map', ref: 'mjmap' }),
      loading ? _react2.default.createElement(
        'div',
        { className: 'gmap-loading-modal' },
        _react2.default.createElement(
          'div',
          { className: 'gmap-loading-desc' },
          _react2.default.createElement(
            'div',
            { className: 'gmap-loading-wrap' },
            _react2.default.createElement(
              'span',
              { className: 'loader' },
              _react2.default.createElement(
                'svg',
                { version: '1.1',
                  width: "14px",
                  height: "14px",
                  viewBox: "0 0 24 24",
                  style: { enableBackground: 'new 0 0 50 50' } },
                _react2.default.createElement(
                  'path',
                  { fill: '#fff', d: 'M0,12A12,12,0,1,1,12,24A2,2,0,1,1,12,20A8,8,0,1,0,4,12A2,2,0,1,1,0,12z' },
                  _react2.default.createElement('animateTransform', {
                    attributeType: 'xml',
                    attributeName: 'transform',
                    type: 'rotate',
                    from: '0 12 12',
                    to: '360 12 12',
                    dur: '0.6s',
                    repeatCount: 'indefinite'
                  })
                )
              )
            ),
            _react2.default.createElement(
              'span',
              { className: 'gmap-loading-inner-desc' },
              '\u6B63\u5728\u52A0\u8F7D\u2026'
            )
          )
        )
      ) : null
    );
  };

  return GMap;
}(_react.Component);

GMap.propTypes = {
  lines: _react.PropTypes.array,
  markers: _react.PropTypes.array,
  posOptions: _react.PropTypes.object,
  options: _react.PropTypes.object,
  lineStyle: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  onDoubleClick: _react.PropTypes.func
};

exports.default = GMap;
module.exports = exports['default'];