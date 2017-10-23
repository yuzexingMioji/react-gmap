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

require('./index.scss');

var _infobubble = require('./infobubble');

var _infobubble2 = _interopRequireDefault(_infobubble);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var DELAY_TIME = 300;
var IMG_BIG_BLUE = 'http://ubsrc.cdn.mioji.com/gmap/img/icon_blue_focus.png';
var IMG_BIG_RED = 'http://ubsrc.cdn.mioji.com/gmap/img/icon_red_focus.png';
var IMG_SMALL_BLUE = 'http://ubsrc.cdn.mioji.com/gmap/img/icon_blue_normal.png';

var NORMAL_Z_INDEX = 100;
var HIGHER_Z_INDEX = 101;

var LABEL_HEIGHT = 35;

var INFO_BUBBLE_WIDTH = 350 + 2; // padding
var INFO_BUBBLE_HEIGHT = 100 + 2; // padding

var IMG_SUFFIX = "@base@tag=imgScale&h=66&w=100&rotate=0&c=1&m=2";

var ICON_ADD = "<svg t=\"1498555379744\" class=\"btn-icon\" style=\"\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"9427\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"14\" height=\"14\"><defs><style type=\"text/css\"></style></defs><path d=\"M437.842 437.842v-222.844c0-40.713 32.926-73.787 74.158-73.787 40.935 0 74.158 33.816 74.158 73.787v222.844h222.844c40.713 0 73.787 32.926 73.787 74.158 0 40.935-33.816 74.158-73.787 74.158h-222.844v222.844c0 40.713-32.926 73.787-74.158 73.787-40.935 0-74.158-33.816-74.158-73.787v-222.844h-222.844c-40.713 0-73.787-32.926-73.787-74.158 0-40.935 33.816-74.158 73.787-74.158h222.844z\" p-id=\"9428\" fill=\"#ffffff\"></path></svg>";

var ICON_SUB = "<svg t=\"1498556157368\" class=\"btn-icon\" style=\"\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"9870\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"14\" height=\"14\"><defs><style type=\"text/css\"></style></defs><path d=\"M256 448l512 0c38.4 0 64 25.6 64 64l0 0c0 38.4-25.6 64-64 64L256 576C217.6 576 192 550.4 192 512l0 0C192 473.6 217.6 448 256 448z\" p-id=\"9871\" fill=\"#ffffff\"></path></svg>";

var ICON_PRIVATE = '<svg t="1508309805028" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11041" xmlns:xlink="http://www.w3.org/1999/xlink" width="15" height="15"><defs><style type="text/css"></style></defs><path d="M887.466667 0h-750.933334c-75.093333 0-136.533333 61.44-136.533333 136.533333v750.933334c0 75.093333 61.44 136.533333 136.533333 136.533333h750.933334c75.093333 0 136.533333-61.44 136.533333-136.533333v-750.933334c0-75.093333-61.44-136.533333-136.533333-136.533333z m-491.52 819.2h-61.44v-286.72c-27.306667 54.613333-61.44 109.226667-102.4 157.013333l-27.306667-75.093333c54.613333-54.613333 102.4-116.053333 122.88-184.32h-109.226667v-61.44h116.053334v-81.92c-34.133333 6.826667-68.266667 6.826667-102.4 13.653333l-13.653334-61.44c95.573333-6.826667 184.32-20.48 259.413334-40.96l20.48 61.44c-34.133333 6.826667-68.266667 13.653333-109.226667 20.48v95.573334h102.4v61.44h-102.4v20.48c34.133333 34.133333 68.266667 61.44 102.4 102.4l-34.133333 54.613333c-27.306667-40.96-47.786667-75.093333-61.44-95.573333v300.373333z m361.813333 0c-6.826667-27.306667-6.826667-47.786667-13.653333-68.266667-88.746667 13.653333-184.32 34.133333-286.72 47.786667l-13.653334-61.44c20.48-6.826667 27.306667-13.653333 27.306667-20.48l136.533333-505.173333 61.44 6.826666-143.36 505.173334c75.093333-13.653333 136.533333-20.48 191.146667-34.133334-20.48-68.266667-34.133333-136.533333-61.44-197.973333l54.613333-20.48c34.133333 95.573333 68.266667 211.626667 95.573334 334.506667l-47.786667 13.653333z" p-id="11042" fill="#1fb71b"></path></svg>';

/**
 * Read Me
 * <InfoMap
 *   selected // 已选
 *   whole  // 全部数组
 *   ref  // 用于联动  // 用于调用startBounce(id)
 *   onClick   // marker click(type, id)
 *   onHover   // marker Hover(type, id)
 *   onSelect  // 新增/删除 (type, id) 1/0 新增/删除 markerID
 *   order  // 是否有序
 *   infinite // 是否无限添加
 *   noSuffix // 是否需要自动裁剪, 自动加后缀
 *  />
 */

var InfoMap = function (_Component) {
  _inherits(InfoMap, _Component);

  function InfoMap(props) {
    _classCallCheck(this, InfoMap);

    var _this2 = _possibleConstructorReturn(this, _Component.call(this, props));

    _this2.setIcon = _this2.setIcon.bind(_this2);
    _this2.loadMap = _this2.loadMap.bind(_this2);
    _this2.initMap = _this2.initMap.bind(_this2);
    _this2.initIcon = _this2.initIcon.bind(_this2);
    _this2.reLoadJS = _this2.reLoadJS.bind(_this2);
    _this2.initLine = _this2.initLine.bind(_this2);
    // this.updateMap = this.updateMap.bind(this);
    _this2.startBounce = _this2.startBounce.bind(_this2);
    _this2.initMarker = _this2.initMarker.bind(_this2);
    _this2.optionClick = _this2.optionClick.bind(_this2);
    _this2.setSelected = _this2.setSelected.bind(_this2);
    _this2.focusMarker = _this2.focusMarker.bind(_this2);
    _this2.setIconState = _this2.setIconState.bind(_this2);
    _this2.setUnselected = _this2.setUnselected.bind(_this2);
    _this2.getProjection = _this2.getProjection.bind(_this2);
    _this2.setButtonState = _this2.setButtonState.bind(_this2);
    _this2.moveToVisibile = _this2.moveToVisibile.bind(_this2);
    _this2.openInfoBubble = _this2.openInfoBubble.bind(_this2);
    _this2.initSelectState = _this2.initSelectState.bind(_this2);
    _this2.addMarkerWithInfoBubble = _this2.addMarkerWithInfoBubble.bind(_this2);
    _this2.map = null;
    _this2.markers = [];
    _this2.loadTime = 0;
    _this2.groupLines = [];
    _this2.state = {};
    /**
     *  当前hover 状态
     */
    _this2.hoverState = false;
    /**
     *  当前hover markerID
     */
    _this2.markerID = null;
    /**
     *  真实显示于地图上的路线对象
     */
    _this2.lineOnMap = null;

    _this2.default = {
      lineStyle: {
        strokeColor: '#000',
        strokeOpacity: 0.5,
        strokeWeight: 4,
        cursor: 'default'
      },
      options: {
        center: {
          lat: 39.92, lng: 116.46
        },
        zoom: 4,
        minZoom: 2,
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
        disableDoubleClickZoom: false,
        fullscreenControl: false
      }
    };
    return _this2;
  }

  InfoMap.prototype.componentDidMount = function componentDidMount() {
    var key = this.props.apiKey;
    if (window.google) {
      this.loadMap();
    } else {
      this.reLoadJS(key);
    }
  };

  InfoMap.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    var _this3 = this;

    if (!window.google) {
      return;
    }
    // 过滤重复已选城市/地图内部不考虑重复点

    // 有序 展示连线 无序移除连线
    var _props = this.props,
        _props$whole = _props.whole,
        whole = _props$whole === undefined ? [] : _props$whole,
        _props$selected = _props.selected,
        selected = _props$selected === undefined ? [] : _props$selected,
        order = _props.order;


    var nWhole = nextProps.whole || [];
    var nOrder = nextProps.order;
    var nSelected = nextProps.selected || [];

    if ((0, _isEqual2.default)(nWhole, whole) && (0, _isEqual2.default)(nSelected, selected)) {
      if (order != nOrder && !!this.lineOnMap) {
        this.lineOnMap.setMap(nOrder ? this.map : null);
        this.connectGroup(!nOrder, nSelected);
      }
      return;
    }
    // reset path
    if (this.lineOnMap) {
      this.lineOnMap.setPath([]);
      this.lineOnMap.setMap(null);
      // 是否需要reset groupPath see 1 see
    }

    var seen = new Map();
    var uniqueArr = nSelected.filter(function (a) {
      return !seen.has(a.id) && seen.set(a.id, 1);
    });
    seen.clear();
    seen = null;
    var newMarkers = merge([nWhole, uniqueArr]);

    var nextMarkers = [];
    this.markers.map(function (oldMarker) {
      var stay = newMarkers.find(function (newMarker) {
        return newMarker.id == oldMarker.id;
      });
      if (stay) {
        // 被保留的marker 可能是状态发生变化
        var select = uniqueArr.find(function (s) {
          return s.id == stay.id;
        });
        if (select && !oldMarker.selected) {
          // 改变状态
          _this3.initSelectState(oldMarker.marker, true);
          oldMarker.selected = true;
        } else if (!select && oldMarker.selected) {
          // 从已选列表中移除的 也需要重置
          _this3.initSelectState(oldMarker.marker, false, oldMarker.id);
          oldMarker.selected = false;
        }
        // 新数据替换旧数据 ...
        Object.assign(oldMarker, stay);
        nextMarkers.push(oldMarker);
      } else {
        // marker被移除了
        oldMarker.label.close();
        oldMarker.label.setMap(null);
        oldMarker.marker.setMap(null);
        if (oldMarker.id == _this3.markerID) {
          _this3.infoBubble.close();
        }
      }
    });
    var middeleArray = [];
    newMarkers.map(function (newMarker) {
      var marker = nextMarkers.find(function (nextMarker) {
        return nextMarker.id == newMarker.id;
      });
      // 新添加的marker, 添加到地图上
      if (!marker) {
        var select = nSelected.findIndex(function (s) {
          return s.id == newMarker.id;
        });
        newMarker.selected = select >= 0;
        if (!newMarker.marker && !newMarker.label) {
          var _addMarkerWithInfoBub = _this3.addMarkerWithInfoBubble(newMarker),
              _marker = _addMarkerWithInfoBub.marker,
              label = _addMarkerWithInfoBub.label;

          newMarker.marker = _marker;
          newMarker.label = label;
        }
        middeleArray.push(newMarker);
      }
    });

    this.markers = nextMarkers.concat(middeleArray);

    var path = [];
    nSelected.map(function (s) {
      path.push(s.position);
    });
    this.connectGroup(!nOrder, nSelected);

    setTimeout(function () {
      if (_this3.lineOnMap) {
        _this3.lineOnMap.setPath(path);
        _this3.lineOnMap.setMap(nOrder ? _this3.map : null);
      }
    }, 10);
  };

  InfoMap.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return !((0, _isEqual2.default)(this.props, nextProps) && (0, _isEqual2.default)(this.state, nextState));
  };

  InfoMap.prototype.loadMap = function loadMap() {
    var _props2 = this.props,
        options = _props2.options,
        getMap = _props2.getMap;


    var mapDom = _reactDom2.default.findDOMNode(this.refs.mjmap);
    this.map = new google.maps.Map(mapDom, (0, _assign2.default)(this.default.options, options));

    getMap && getMap(this.map);

    this.initMap();
    this.initIcon();
    this.initLine();
    this.initMarker();
    // this.initMapLens();
  };

  InfoMap.prototype.getProjection = function getProjection(projection) {
    this.projection = projection;
  };

  InfoMap.prototype.initMap = function initMap() {
    if (!window.google) {
      return;
    }
    var _props3 = this.props,
        posOptions = _props3.posOptions,
        options = _props3.options;

    var newOptions = (0, _assign2.default)(this.default.options, options);
    if (posOptions) {
      utils.fitMap(this.map, posOptions, this.getProjection);
    }
  };

  InfoMap.prototype.initIcon = function initIcon() {
    this.SB_Icon = {
      url: IMG_SMALL_BLUE,
      // size: new google.maps.Size(12, 22),
      size: new google.maps.Size(17, 29),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(8, 29),
      scaledSize: new google.maps.Size(17, 29)
    };

    this.BB_Icon = {
      url: IMG_BIG_BLUE,
      size: new google.maps.Size(22, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 36),
      scaledSize: new google.maps.Size(22, 36)
    };

    this.BR_Icon = {
      url: IMG_BIG_RED,
      size: new google.maps.Size(22, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 36),
      scaledSize: new google.maps.Size(22, 36)
    };
  };

  InfoMap.prototype.initLine = function initLine() {
    var _props4 = this.props,
        lineStyle = _props4.lineStyle,
        order = _props4.order,
        selected = _props4.selected,
        whole = _props4.whole;

    if (!!lineStyle) {
      (0, _assign2.default)(this.default.lineStyle, lineStyle);
    }
    var path = [];
    selected.map(function (s) {
      path.push(s.position);
    });

    this.lineOnMap && this.lineOnMap.setMap(null);

    this.lineOnMap = new google.maps.Polyline(this.default.lineStyle);

    this.lineOnMap.setPath(path);

    this.lineOnMap.setMap(order ? this.map : null);

    this.connectGroup(!order, selected);
  };

  InfoMap.prototype.initMarker = function initMarker() {
    var _this4 = this;

    var _props5 = this.props,
        _props5$selected = _props5.selected,
        selected = _props5$selected === undefined ? [] : _props5$selected,
        _props5$whole = _props5.whole,
        whole = _props5$whole === undefined ? [] : _props5$whole;


    var seen = new Map();
    var uniqueArr = selected.filter(function (a) {
      return !seen.has(a.id) && seen.set(a.id, 1);
    });

    var newWhole = merge([uniqueArr, whole]);

    this.markers.map(function (mMarker) {
      // mMarker.label.close();
      oldMarker.label.setMap(null);
      mMarker.marker.setMap(null);
    });

    this.markers = [];
    this.markerID = null;
    this.hoverState = false;
    // 处理数据

    newWhole && newWhole.map(function (data) {
      var id = data.id,
          first = data.first,
          second = data.second,
          third = data.third,
          img = data.img,
          position = data.position,
          type = data.type;

      var idx = selected.findIndex(function (select) {
        return select.id == id;
      });
      var mData = {
        id: id,
        img: img,
        first: first,
        second: second,
        third: third,
        position: position,
        type: type,
        selected: idx >= 0
      };

      var _addMarkerWithInfoBub2 = _this4.addMarkerWithInfoBubble(mData),
          marker = _addMarkerWithInfoBub2.marker,
          label = _addMarkerWithInfoBub2.label;

      mData.marker = marker;
      mData.label = label;

      _this4.markers.push(mData);
    });
  };

  // 重置地图镜头


  InfoMap.prototype.initMapLens = function initMapLens(allCoords, reset) {
    var _this5 = this;

    if (!allCoords || allCoords.length == 0) {
      var whole = this.props.whole;

      allCoords = whole.map(function (marker) {
        return marker.position;
      });
    }
    if (allCoords && allCoords.length > 0) {
      // this.map.setZoom(2);
      utils.noAnimationFit(this.map, { coords: allCoords } /*, this.getProjection*/);
    } else if (!reset) {
      setTimeout(function () {
        return _this5.initMapLens([], true);
      }, 50);
    }
  };

  InfoMap.prototype.optionClick = function optionClick(data) {
    var _props6 = this.props,
        infinite = _props6.infinite,
        onSelect = _props6.onSelect,
        whole = _props6.whole,
        selected = _props6.selected;
    var id = data.id,
        marker = data.marker;

    var selectData = whole.concat(selected).find(function (m) {
      return m.id == id;
    });
    if (!infinite && !!this.infoBubble && this.infoBubble.isOpen()) {
      if (!data.selected) {
        // 选中
        onSelect && onSelect(selectData.type, selectData, 1);
      } else {
        // 取消
        onSelect && onSelect(selectData.type, selectData, 0);
      }
    } else if (infinite) {
      // 可选重复
      onSelect && onSelect(selectData.type, selectData, 1);
    }
  };

  InfoMap.prototype.createContent = function createContent(data) {
    var _this6 = this;

    var id = data.id,
        first = data.first,
        second = data.second,
        third = data.third,
        img = data.img,
        selected = data.selected,
        infinite = data.infinite,
        type = data.type,
        custom = data.custom;
    var noSuffix = this.props.noSuffix;

    var content = document.createElement('div');
    var imageUrl = noSuffix ? img : img + IMG_SUFFIX;
    var icon = void 0;
    if (infinite) {
      icon = ICON_ADD;
    } else if (selected) {
      icon = ICON_SUB;
    } else {
      icon = ICON_ADD;
    }

    var style = this.styleDist(type);

    var className = custom == 3 && style.showPrivate ? 'gmap-info-map-first-title-siyou' : 'noIcon';

    content.innerHTML = "<img class='gmap-info-map-img' src=" + imageUrl + " />" + "<div class='map-info-wrap'>" + "<span class='gmap-info-map-first-title over-hide " + style.extraCool + "'><span class='" + className + "'>" + ICON_PRIVATE + "</span><span class='over-hide'>" + first + "</span></span>" + "<span class='gmap-info-map-second-title over-hide " + style.extraCooler + "'>" + second + "</span>" + "<span class='gmap-info-map-third-title over-hide " + style.extraCoolest + "'>" + third + "</span>" + "</div>" + "<div class='gmap-info-map-btn-wrap " + style.icon + "' id='btn-option'>" + icon + "</div>";
    content.className = 'gmap-info-bubble-info-wrap';
    var btn = content.getElementsByClassName('gmap-info-map-btn-wrap')[0];
    btn.onclick = function () {
      return _this6.optionClick(data);
    };
    return content;
  };

  /**
   *type
   * 1: 城市
   * 2: 景点
   * 4: 酒店
   * 8: 饭店
   * 16: 机场
   * 32: 火车站
   * 64: 租车公司
   * 128: 长途汽车站
   * 256: 购物
   * 512: 国家
   * 1024: 省/州
   */

  InfoMap.prototype.styleDist = function styleDist(type) {
    var style = {
      extraCool: '',
      extraCooler: '',
      extraCoolest: '',
      icon: ''
    };
    style.showPrivate = true;
    switch (type) {
      case 1:
        break;
      case 2:
        style.extraCoolest = 'poi';
        break;
      case 4:
        break;
      case 8:
        break;
      case 16:
        break;
      case 256:
        style.extraCoolest = 'shop';
        break;
      case 512:
        style.icon = 'noIcon';
        break;
      case 1024:
        style.icon = 'noIcon';
        break;
      // 玩乐
      case 16384:
      case 32768:
      case 65536:
      case 136125:
      case 131072:
      case 262144:
      case 524288:
        style.extraCoolest = 'play';
        style.showPrivate = true;
        break;
    }
    return style;
  };

  InfoMap.prototype.createLabel = function createLabel(data) {
    var first = data.first;


    return "<div class='label-title'>" + first + "</div>";
  };

  InfoMap.prototype.addMarkerWithInfoBubble = function addMarkerWithInfoBubble(data) {
    var _this7 = this;

    var position = data.position,
        type = data.type,
        id = data.id,
        selected = data.selected;


    if (!position) {
      console.log('无地理位置 error');
      return;
    }

    var content = this.createContent(data);

    var labelContent = this.createLabel(data);

    var IB_Small = new _infobubble2.default({
      maxWidth: 200,
      minHeight: 28,
      maxHeight: 28,
      padding: 0,
      arrowSize: 5,
      borderRadius: 1,
      disableAutoPan: true,
      hideCloseButton: true,
      disableAnimation: true,
      arrowPosition: 50,
      zIndex: NORMAL_Z_INDEX,
      borderWidth: 0,
      arrowStyle: 0,
      shadowStyle: 0,
      backgroundClassName: 'gmap-info-bubble-label-container',
      content: labelContent
    });

    if (!this.infoBubble) {
      this.infoBubble = new _infobubble2.default({
        padding: 0,
        maxWidth: 350,
        minWidth: 350,
        maxHeight: 90,
        minHeight: 90,
        arrowSize: 10,
        arrowStyle: 0,
        borderWidth: 0,
        shadowStyle: 0,
        borderRadius: 0,
        hideCloseButton: true,
        disableAutoPan: true,
        zIndex: HIGHER_Z_INDEX,
        disableAnimation: true,
        backgroundClassName: 'gmap-info-bubble-info-container',
        content: content
      });

      this.infoBubble.bubble_.addEventListener('mouseenter', function () {
        _this7.hoverState = true;
      });

      this.infoBubble.bubble_.addEventListener('mouseleave', function () {
        _this7.hoverState = false;
        _this7.leaveTimer = setTimeout(function () {
          if (_this7.infoBubble.isOpen() && !_this7.hoverState) {
            _this7.resetMarker(_this7.markerID);
            _this7.infoBubble.close();
          }
        }, DELAY_TIME);
      });
    }

    var marker = new google.maps.Marker({
      position: position,
      map: this.map,
      optimized: false,
      zIndex: NORMAL_Z_INDEX
    });

    this.setIconState(marker, selected);

    marker.label = IB_Small;
    if (marker.getMap()) {
      IB_Small.open(this.map, marker);
    }
    this.infoBubble.close();

    marker.addListener('mouseover', function (event) {
      _this7.hoverState = true;
      clearTimeout(_this7.outTimer);
      clearTimeout(_this7.leaveTimer);
      if (_this7.markerID == id) {
        return;
      }

      if (_this7.infoBubble.isOpen()) {
        _this7.resetMarker(_this7.markerID, true);
        _this7.infoBubble.close();
      }

      IB_Small.close();
      // const mMarker = this.markers.find((m) => m.id == id);
      _this7.openInfoBubble(_this7.createContent(data), marker, data);
      _this7.focusMarker(data, data.selected, id);
      var onHover = _this7.props.onHover;

      onHover && onHover(type, id);
    });

    marker.addListener('mouseout', function () {
      _this7.hoverState = false;
      _this7.outTimer = setTimeout(function () {
        _this7.resetMarker(id);
        if (_this7.infoBubble.isOpen() && !_this7.hoverState) {
          _this7.infoBubble.close();
        }
      }, DELAY_TIME);
    });

    if (type == 512 || type == 1024) {
      marker.addListener('click', function () {
        var _props7 = _this7.props,
            onClick = _props7.onClick,
            whole = _props7.whole,
            selected = _props7.selected;
        // 点击进入新列表页 其他无点击事件

        var selectData = whole.concat(selected).find(function (m) {
          return m.id == id;
        });
        onClick && onClick(type, selectData);
      });
    }

    return {
      marker: marker,
      label: IB_Small
    };
  };

  InfoMap.prototype.initSelectState = function initSelectState(marker, select, id) {
    var infinite = this.props.infinite;


    if (infinite && select) {
      this.setInfiniteSelect(marker, id);
    } else if (select) {
      // 选中
      this.setSelected(marker, id);
    } else {
      // 取消
      this.setUnselected(marker, id);
    }
  };

  InfoMap.prototype.setInfiniteSelect = function setInfiniteSelect(marker) {
    this.setIcon(ICON_ADD);
    marker.setIcon(this.BR_Icon);
  };

  InfoMap.prototype.setSelected = function setSelected(marker) {
    this.setIcon(ICON_SUB, true);
    marker.setIcon(this.BR_Icon);
  };

  InfoMap.prototype.setUnselected = function setUnselected(marker, id) {
    this.setIcon(ICON_ADD);
    marker.setIcon(this.markerID && this.markerID == id ? this.BB_Icon : this.SB_Icon);
  };

  InfoMap.prototype.setIcon = function setIcon(icon, grayBG) {
    if (!!this.infoBubble) {
      var content = this.infoBubble.getContent();
      var btn = content.getElementsByClassName('gmap-info-map-btn-wrap')[0];
      btn.innerHTML = icon;
      btn.classList.remove('gmap-info-map-btn-blue');
      btn.classList.remove('gmap-info-map-btn-gray');
      if (grayBG) {
        btn.classList.add('gmap-info-map-btn-gray', 'gmap-info-map-btn-gray');
      } else {
        btn.classList.add('gmap-info-map-btn-blue', 'gmap-info-map-btn-blue');
      }
    }
  };

  InfoMap.prototype.setButtonState = function setButtonState(select) {
    var infinite = this.props.infinite;


    if (infinite && select) {
      this.setIcon(ICON_ADD);
    } else if (select) {
      // 选中
      this.setIcon(ICON_SUB, true);
    } else {
      // 取消
      this.setIcon(ICON_ADD);
    }
  };

  InfoMap.prototype.setIconState = function setIconState(marker, select) {
    var infinite = this.props.infinite;

    if (infinite && select) {
      this.setInfiniteSelect(marker);
    } else if (select) {
      // 选中
      this.setSelected(marker);
    } else {
      // 取消
      this.setUnselected(marker);
    }
  };

  /**
   * 当时的想法: 不展示连线时，团伙展示，展示连线时，团伙不展，保证了团伙一直连线
   * @param {*} boolean 是否要展示
   * @param {*} selected 已选点
   */


  InfoMap.prototype.connectGroup = function connectGroup(boolean, selected) {
    var _this8 = this;

    this.groupLines.map(function (line) {
      line.setMap(null);
    });
    this.groupLines.length = 0;
    if (boolean) {
      (function () {
        var groupID = 0;
        var group = selected.filter(function (s) {
          return s.groupID === groupID;
        });

        var _loop = function _loop() {
          var path = [];
          group.map(function (marker) {
            path.push(marker.position);
          });
          var groupLine = new google.maps.Polyline(_this8.default.lineStyle);
          groupLine.setPath(path);
          groupLine.setMap(_this8.map);
          _this8.groupLines.push(groupLine);
          groupID++;
          group = selected.filter(function (s) {
            return s.groupID === groupID;
          });
        };

        while (group.length !== 0) {
          _loop();
        }
      })();
    } /* else {
      this.groupLines.map((line) => {
        line.setMap(null);
      });
      this.groupLines.length = 0;
      } */
  };

  InfoMap.prototype.openInfoBubble = function openInfoBubble(content, marker, data) {
    this.infoBubble.setContent(content);
    this.setButtonState(data.selected);
    this.infoBubble.open(this.map, marker);
  };

  InfoMap.prototype.startBounce = function startBounce(id) {
    var _this9 = this;

    if (typeof id == 'string') {
      var mMarker = this.markers.find(function (m) {
        return m.id == id;
      });
      if (!!mMarker) {
        this.bounce(mMarker.marker);
      }
    } else if (Array.isArray(id)) {
      var markers = this.markers.filter(function (m) {
        return id.includes(m.id);
      });
      markers.map(function (m) {
        _this9.bounce(m.marker);
      });
    }
  };

  InfoMap.prototype.stopBounce = function stopBounce(id) {
    var _this10 = this;

    if (typeof id == 'string') {
      var mMarker = this.markers.find(function (m) {
        return m.id == id;
      });
      if (!!mMarker) {
        this.beStatic(mMarker.marker);
      }
    } else if (Array.isArray(id)) {
      var markers = this.markers.filter(function (m) {
        return id.includes(m.id);
      });
      markers.map(function (m) {
        _this10.beStatic(m.marker);
      });
    }
  };

  InfoMap.prototype.bounce = function bounce(marker) {
    marker.setZIndex(HIGHER_Z_INDEX);
    marker.setAnimation(google.maps.Animation.BOUNCE);
  };

  InfoMap.prototype.beStatic = function beStatic(marker) {
    marker.setZIndex(NORMAL_Z_INDEX);
    marker.setAnimation(null);
  };

  InfoMap.prototype.moveToVisibile = function moveToVisibile(mMarker) {
    if (!this.projection) {
      return;
    }
    var anchor = this.projection.fromLatLngToContainerPixel(mMarker.marker.getPosition());
    var markerSize = utils.getValue(['marker', 'icon', 'size'], mMarker);
    var labelWidth = utils.getValue(['label', 'bubble_', 'clientWidth'], mMarker);
    var markerWithLabel_W = void 0;
    var markerWithLabel_H = void 0;
    if (mMarker.id == this.markerID) {
      markerWithLabel_W = INFO_BUBBLE_WIDTH;
      markerWithLabel_H = markerSize.height + INFO_BUBBLE_HEIGHT;
    } else {
      markerWithLabel_W = markerSize.width > labelWidth ? markerSize.width : labelWidth;
      markerWithLabel_H = markerSize.height + LABEL_HEIGHT;
    }

    var Y = anchor.y - markerWithLabel_H;
    var X = anchor.x - markerWithLabel_W / 2;
    var mapHeight = this.refs.mjmap.clientHeight;
    var mapWidth = this.refs.mjmap.clientWidth;

    if (X < 0 && Y < 0) {
      // 左上
      this.map.panBy(X, Y);
    } else if (X < 0 && Y + markerWithLabel_H < mapHeight && Y > 0) {
      // 左边
      this.map.panBy(X, 0);
    } else if (X + markerWithLabel_W > mapWidth && Y + markerWithLabel_H < mapHeight && Y > 0) {
      // 右边
      this.map.panBy(X - mapWidth + markerWithLabel_W, 0);
    } else if (Y + markerWithLabel_H > mapHeight && X + markerWithLabel_W > mapWidth) {
      // 右下
      this.map.panBy(X - mapWidth + markerWithLabel_W, Y - mapHeight + markerWithLabel_H);
    } else if (Y + markerWithLabel_H > mapHeight && X > 0 && X + markerWithLabel_W < mapWidth) {
      // 下边
      this.map.panBy(0, Y - mapHeight + markerWithLabel_H);
    } else if (X + markerWithLabel_W < mapWidth && Y < 0 && X > 0) {
      // 上边
      this.map.panBy(0, Y);
    } else if (X < 0 && Y + markerWithLabel_H > mapHeight) {
      // 左下
      this.map.panBy(X, Y - mapHeight + markerWithLabel_H);
    } else if (X + markerWithLabel_W > mapWidth && Y < 0) {
      // 右上
      this.map.panBy(X - mapWidth + markerWithLabel_W, Y);
    }
  };

  InfoMap.prototype.focusMarker = function focusMarker(mMarker, selected, id) {
    if (!selected) {
      // 没有被选中, 变成蓝色大图标(BB_Icon)
      mMarker.marker.setIcon(this.BB_Icon);
    }

    mMarker.marker.setZIndex(HIGHER_Z_INDEX);
    // 记录当前marker id
    this.markerID = id;
    // this.moveToVisibile(mMarker);
  };

  InfoMap.prototype.resetMarker = function resetMarker(id, force) {

    if (this.markerID == id && this.hoverState && !force) {
      return;
    }

    var mMarker = this.markers.find(function (m) {
      return m.id == id;
    });
    if (!mMarker) {
      return;
    }

    var marker = mMarker.marker,
        label = mMarker.label,
        selected = mMarker.selected;

    if (!selected) {
      // 没有被选中, 恢复蓝色小图标(SB_Icon)
      marker.setIcon(this.SB_Icon);
    }

    // 被选中/ 无选中的通常处理
    marker.setZIndex(NORMAL_Z_INDEX);
    if (!label.isOpen()) {
      label.open(this.map, marker);
    }
    if (this.markerID == id) {
      this.markerID = null;
    }
  };

  /**
   * 重新读取谷歌服务地图js
   */

  InfoMap.prototype.reLoadJS = function reLoadJS(key) {
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

  InfoMap.prototype.render = function render() {
    var loading = this.props.loading;

    return _react2.default.createElement(
      'div',
      { className: 'gmap-info-container' },
      _react2.default.createElement('div', { className: 'gmap-info-map', ref: 'mjmap' })
    );
  };

  return InfoMap;
}(_react.Component);

function merge(bigArray) {
  var array = [];
  var middeleArray = bigArray.reduce(function (a, b) {
    return a.concat(b);
  });

  middeleArray.forEach(function (midItem) {
    if (array.findIndex(function (arrItem) {
      return midItem.id == arrItem.id;
    }) == -1) {
      array.push(midItem);
    }
  });
  return array;
}

exports.default = InfoMap;
module.exports = exports['default'];