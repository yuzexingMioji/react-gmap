"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _isEqual = require("lodash/isEqual");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _assign = require("lodash/assign");

var _assign2 = _interopRequireDefault(_assign);

var _utils = require("./utils");

var utils = _interopRequireWildcard(_utils);

var _select = require("antd/lib/select");

var _select2 = _interopRequireDefault(_select);

var _pubsubJs = require("pubsub-js");

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

require("./index.scss");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var MJMap = function (_Component) {
  _inherits(MJMap, _Component);

  function MJMap(props) {
    _classCallCheck(this, MJMap);

    var _this2 = _possibleConstructorReturn(this, _Component.call(this, props));

    _this2.loadMap = _this2.loadMap.bind(_this2);
    _this2.reLoadJS = _this2.reLoadJS.bind(_this2);
    _this2.mapClick = _this2.mapClick.bind(_this2);
    _this2.queryAddr = _this2.queryAddr.bind(_this2);
    _this2.updateMap = _this2.updateMap.bind(_this2);
    _this2.dragEvent = _this2.dragEvent.bind(_this2);
    _this2.clearMarker = _this2.clearMarker.bind(_this2);
    _this2.renderLines = _this2.renderLines.bind(_this2);
    _this2.latLng2Addr = _this2.latLng2Addr.bind(_this2);
    _this2.renderMakers = _this2.renderMakers.bind(_this2);
    _this2.dragEndEvent = _this2.dragEndEvent.bind(_this2);
    _this2.setMarkerConfig = _this2.setMarkerConfig.bind(_this2);
    _this2.setCircleConfig = _this2.setCircleConfig.bind(_this2);
    _this2.onSuggestionSelect = _this2.onSuggestionSelect.bind(_this2);
    _this2.addMarker2Position = _this2.addMarker2Position.bind(_this2);
    _this2.map = null;
    _this2.lines = [];
    _this2.markers = [];
    // 加载地图次数  最多三次
    _this2.loadTime = 0;
    // 需要初始化反查地址  只反查一次
    _this2.initQueryAddr = true;
    _this2.state = {};

    _this2.signOnMap = [];

    _this2.default = {
      lineStyle: {
        strokeColor: "#2ec7fa",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        cursor: "default"
      },
      options: {
        center: {
          lat: 39.92,
          lng: 116.46
        },
        zoom: 4,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true,
        draggable: true,
        scaleControl: true,
        panControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        backgroundColor: "#eee",
        clickableIcons: false,
        draggingCursor: "move",
        draggableCursor: "default",
        disableDoubleClickZoom: false,
        scrollwheel: false,
        fullscreenControl: false
      }
    };
    _this2.config = {
      circleConfig: {
        show: false,
        color: '#ff1a47',
        opacity: 0.2,
        radius: 0
      },
      markerConfig: {
        shape: {
          coords: [5, 11, 16, 0, 27, 11, 16, 32],
          type: "poly"
        },
        draggable: true
      }
    };
    return _this2;
  }

  MJMap.prototype.renderLines = function renderLines() {
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

  MJMap.prototype.renderMakers = function renderMakers() {
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

  MJMap.prototype.updateMap = function updateMap() {
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

  MJMap.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (!(0, _isEqual2.default)(this.props, prevProps)) {
      this.updateMap();
    }
  };

  MJMap.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return !((0, _isEqual2.default)(this.props, nextProps) && (0, _isEqual2.default)(this.state, nextState));
  };

  MJMap.prototype.loadMap = function loadMap() {
    var _props3 = this.props,
        options = _props3.options,
        onClick = _props3.onClick,
        onDoubleClick = _props3.onDoubleClick;

    window.Marker = function (map, marker) {
      this.lat = marker.lat;
      this.lng = marker.lng;
      this.html = marker.content;
      this.setMap(map);
    };

    Marker.prototype = new google.maps.OverlayView();
    Marker.prototype.draw = function () {
      var ele = this.ele;
      if (!ele) {
        ele = this.ele = document.createElement("div");
        ele.style.position = "absolute";
        ele.style.zIndex = 999;
        ele.innerHTML = this.html;

        this.getPanes().overlayImage.appendChild(ele);
      }

      var latlng = new google.maps.LatLng(this.lat, this.lng);
      var pos = this.getProjection().fromLatLngToDivPixel(latlng);
      if (pos) {
        ele.style.left = pos.x + "px";
        ele.style.top = pos.y + "px";
      }
    };
    Marker.prototype.remove = function () {
      if (this.ele) {
        this.ele.parentNode.removeChild(this.ele);
        this.ele = null;
      }
      this.setMap(null);
    };
    var _this = this;
    var mapDom = _reactDom2.default.findDOMNode(this.refs.mjmap);
    this.map = new google.maps.Map(mapDom, (0, _assign2.default)(this.default.options, options));
    this.map.addListener("click", function (event) {
      onClick && onClick(event);
      _this.mapClick(event);
    });
    this.map.addListener("dblclick", function (event) {
      onDoubleClick && onDoubleClick(event);
    });
    this.config.markerConfig.image = {
      url: "http://ubsrc.cdn.mioji.com/gmap/img/icon_new_mappoint.png",
      size: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 32)
    };
    this.map.addMarker = this.addMarker2Position;
    this.props.getMap && this.props.getMap(this.map, this);
    this.updateMap();
    this.queryAddr();
  };

  MJMap.prototype.queryAddr = function queryAddr() {
    var initQueryAddr = this.initQueryAddr;

    if (!initQueryAddr) {
      return;
    }

    var queryAddr = this.props.queryAddr;

    if (!queryAddr || !queryAddr.lat || !queryAddr.lng) {
      return;
    }
    this.initQueryAddr = false;
    var lat = queryAddr.lat,
        lng = queryAddr.lng;

    var latLng = utils.latLng(lat, lng);
    this.latLng2Addr(latLng);
  };

  MJMap.prototype.componentDidMount = function componentDidMount() {
    var _this = this;
    var key = this.props.apiKey;
    if (window.google) {
      _this.loadMap();
    } else {
      this.reLoadJS(key);
    }
    // 订阅事件
    _pubsubJs2.default.subscribe("onSelect", this.onSuggestionSelect);
    _pubsubJs2.default.subscribe("loading", this.onSuggestionSelect);
    _pubsubJs2.default.subscribe("clear", this.onSuggestionSelect);
  };

  MJMap.prototype.componentWillUnmount = function componentWillUnmount() {
    _pubsubJs2.default.unsubscribe(this.onSuggestionSelect);
  };

  MJMap.prototype.reLoadJS = function reLoadJS(key) {
    if (this.loadTime >= 3) {
      alert("地图服务器错误");
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

  MJMap.prototype.onSuggestionSelect = function onSuggestionSelect(msg, data) {
    // 关联的suggestion
    var fetter = this.props.fetter;
    if (fetter && data.from != fetter) {
      return;
    }
    switch (msg) {
      // select 事件 可以取消loading
      case "onSelect":
        var position = data.geometry;
        if (position) {
          this.addMarker2Position(position);
          this.map.panTo(position);
          this.map.setZoom(16);
        } else {
          this.clearMarker();
        }
        this.setState({ loading: false });
        break;
      case "clear":
        //  清除事件
        this.clearMarker();
        this.setState({ loading: false });
        break;

      case "loading":
        // loading
        this.setState({ loading: true });
        break;
    }
  };

  MJMap.prototype.clearMarker = function clearMarker() {
    if (this.signOnMap.length > 0) {
      this.signOnMap.forEach(function (sign) {
        return sign.setMap(null);
      });
    }
    this.circle = null;
    this.point_marker = null;
    this.signOnMap.length = 0;
  };

  MJMap.prototype.mapClick = function mapClick(event) {
    var _this = this;
    var lat = event.latLng.lat();
    var lng = event.latLng.lng();
    var position = { lat: lat, lng: lng };
    this.addMarker2Position(position);
    var latLng = utils.latLng(lat, lng);
    this.latLng2Addr(latLng);
  };

  MJMap.prototype.latLng2Addr = function latLng2Addr(latLng) {
    var fetter = this.props.fetter;

    utils.geocode({ latLng: latLng }, function (result, status) {
      if (status == "OK") {
        var data = result[0];
        var geometry = data.geometry;
        var lat = geometry.location.lat();
        var lng = geometry.location.lng();
        var option = {
          address: data.formatted_address,
          geometry: { lat: lat, lng: lng },
          error: false,
          from: fetter
        };
        _pubsubJs2.default.publish("onMapChange", option);
      } else {
        var _option = {
          address: "",
          geometry: null,
          error: true,
          from: fetter
        };
        _pubsubJs2.default.publish("onMapChange", _option);
      }
    });
  };

  MJMap.prototype.setCircleConfig = function setCircleConfig(config) {
    (0, _assign2.default)(this.config.circleConfig, config);

    if (this.circle) {
      var _config$circleConfig = this.config.circleConfig,
          color = _config$circleConfig.color,
          radius = _config$circleConfig.radius,
          opacity = _config$circleConfig.opacity,
          show = _config$circleConfig.show;

      if (!show) {
        this.circle.setMap(null);
        return;
      }
      this.circle.setOptions({
        fillColor: color,
        fillOpacity: opacity,
        radius: radius
      });
    }
  };

  MJMap.prototype.setMarkerConfig = function setMarkerConfig(config) {
    (0, _assign2.default)(this.config.markerConfig, config);

    if (this.point_marker) {
      var _config$markerConfig = this.config.markerConfig,
          draggable = _config$markerConfig.draggable,
          image = _config$markerConfig.image,
          shape = _config$markerConfig.shape,
          show = _config$markerConfig.show;

      this.point_marker.setOptions({
        icon: image,
        draggable: draggable,
        shape: shape
      });
    }
  };

  MJMap.prototype.addMarker2Position = function addMarker2Position(position) {
    if (this.signOnMap.length > 0) {
      this.signOnMap.forEach(function (sign) {
        if (typeof sign.setPosition === 'function') {
          sign.setPosition(position);
        } else if (typeof sign.setCenter === 'function') {
          sign.setCenter(position);
        }
      });
      return;
    }
    var _props$normalMarker = this.props.normalMarker,
        normalMarker = _props$normalMarker === undefined ? false : _props$normalMarker;
    var _config$markerConfig2 = this.config.markerConfig,
        conf_shape = _config$markerConfig2.shape,
        conf_img = _config$markerConfig2.image,
        conf_draggable = _config$markerConfig2.draggable;

    var image = null;
    var shape = null;
    var draggable = conf_draggable;
    if (!normalMarker) {
      image = conf_img;
      shape = conf_shape;
    }
    this.point_marker = new google.maps.Marker({
      position: position,
      map: this.map,
      shape: shape,
      icon: image,
      draggable: draggable
    });
    this.point_marker.addListener("dragend", this.dragEndEvent);
    this.point_marker.addListener("drag", this.dragEvent);
    this.signOnMap.push(this.point_marker);

    var _config$circleConfig2 = this.config.circleConfig,
        show = _config$circleConfig2.show,
        radius = _config$circleConfig2.radius,
        color = _config$circleConfig2.color,
        opacity = _config$circleConfig2.opacity;


    if (show) {
      this.circle = new google.maps.Circle({
        radius: radius,
        center: position,
        strokeWeight: 0,
        strokeOpacity: 1,
        fillColor: color,
        fillOpacity: opacity,
        map: this.map
      });
      this.signOnMap.push(this.circle);
    }
  };

  MJMap.prototype.dragEndEvent = function dragEndEvent(location) {
    var position = location.latLng;
    var lat = position.lat();
    var lng = position.lng();
    var _this = this;
    var latLng = utils.latLng(lat, lng);
    var fetter = this.props.fetter;

    utils.geocode({ latLng: latLng }, function (result, status) {
      if (status == "OK") {
        var data = result[0];
        var geometry = data.geometry;
        var _lat = geometry.location.lat();
        var _lng = geometry.location.lng();
        var option = {
          geometry: { lat: _lat, lng: _lng },
          address: data.formatted_address,
          error: false,
          from: fetter
        };
        _pubsubJs2.default.publish("onMapChange", option);
      } else {
        var _option2 = {
          geometry: null,
          address: "",
          error: true,
          from: fetter
        };
        _pubsubJs2.default.publish("onMapChange", _option2);
      }
    });
  };

  MJMap.prototype.dragEvent = function dragEvent(location) {
    if (!this.config.circleConfig.show) return;

    var position = location.latLng;
    var lat = +position.lat();
    var lng = +position.lng();
    var point = {
      lat: lat,
      lng: lng
    };
    if (this.circle) {
      this.circle.setCenter(point);
      return;
    }

    var _config$circleConfig3 = this.config.circleConfig,
        radius = _config$circleConfig3.radius,
        color = _config$circleConfig3.color,
        opacity = _config$circleConfig3.opacity;

    this.circle = new google.maps.Circle({
      strokeWeight: 0,
      strokeOpacity: 1,
      radius: this.radius,
      center: position,
      fillColor: color,
      fillOpacity: opacity,
      map: this.map
    });
  };

  MJMap.prototype.render = function render() {
    var loading = this.state.loading;

    return _react2.default.createElement(
      "div",
      { className: "gmap-cool-container" },
      _react2.default.createElement("div", { className: "gmap-cool-map", ref: "mjmap" }),
      loading ? _react2.default.createElement(
        "div",
        { className: "gmap-loading-modal" },
        _react2.default.createElement(
          "div",
          { className: "gmap-loading-desc" },
          _react2.default.createElement(
            "div",
            { className: "gmap-loading-wrap" },
            _react2.default.createElement(
              "span",
              { className: "loader" },
              _react2.default.createElement(
                "svg",
                {
                  version: "1.1",
                  width: "14px",
                  height: "14px",
                  viewBox: "0 0 24 24",
                  style: { enableBackground: "new 0 0 50 50" }
                },
                _react2.default.createElement(
                  "path",
                  {
                    fill: "#fff",
                    d: "M0,12A12,12,0,1,1,12,24A2,2,0,1,1,12,20A8,8,0,1,0,4,12A2,2,0,1,1,0,12z"
                  },
                  _react2.default.createElement("animateTransform", {
                    attributeType: "xml",
                    attributeName: "transform",
                    type: "rotate",
                    from: "0 12 12",
                    to: "360 12 12",
                    dur: "0.6s",
                    repeatCount: "indefinite"
                  })
                )
              )
            ),
            _react2.default.createElement(
              "span",
              { className: "gmap-loading-inner-desc" },
              "\u6B63\u5728\u52A0\u8F7D\u2026"
            )
          )
        )
      ) : null
    );
  };

  return MJMap;
}(_react.Component);

MJMap.propTypes = {
  lines: _react.PropTypes.array,
  markers: _react.PropTypes.array,
  posOptions: _react.PropTypes.object,
  options: _react.PropTypes.object,
  lineStyle: _react.PropTypes.object,
  onClick: _react.PropTypes.func,
  onDoubleClick: _react.PropTypes.func,
  centerMarker: _react.PropTypes.object,
  normalMarker: _react.PropTypes.bool };

exports.default = MJMap;
module.exports = exports["default"];