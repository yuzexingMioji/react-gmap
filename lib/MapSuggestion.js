'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _select = require('antd/lib/select');

var _select2 = _interopRequireDefault(_select);

var _Icon = require('./Icon');

var _Icon2 = _interopRequireDefault(_Icon);

require('./suggestion.scss');

var _pubsubJs = require('pubsub-js');

var _pubsubJs2 = _interopRequireDefault(_pubsubJs);

var _cloneDeep = require('lodash/cloneDeep');

var _cloneDeep2 = _interopRequireDefault(_cloneDeep);

var _ApiClient = require('./ApiClient');

var _ApiClient2 = _interopRequireDefault(_ApiClient);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Option = _select2.default.Option;
var suggestionErrorMsg = '无结果，请尝试搜索';
var searchErrorMsg = '未找到该地址';

var MapSuggestion = function (_Component) {
  _inherits(MapSuggestion, _Component);

  function MapSuggestion(props) {
    _classCallCheck(this, MapSuggestion);

    var _this2 = _possibleConstructorReturn(this, _Component.call(this, props));

    _this2.state = {
      dataSource: []
    };
    _this2.isNeedEmpty = _this2.props.isNeedEmpty === undefined ? false : _this2.props.isNeedEmpty;

    var funcArr = ['handleSearch', 'doSelect', 'handleBlur', 'onFocus', 'reset', 'clearDropMenu', 'onClearClick', 'setSelect', 'onSearchClick', 'searchPlace', 'mkOption', 'textSearch',, 'handleSelect', 'MapAddressChange', 'onTextSearchError', 'abortPromise'];
    funcArr.map(function (func) {
      _this2[func] = _this2[func].bind(_this2);
    });
    _this2.reset();
    return _this2;
  }

  MapSuggestion.prototype.searchPlace = function searchPlace(val) {
    return (0, _ApiClient2.default)('autocomplete', "input=" + val);
  };

  MapSuggestion.prototype.onFocus = function onFocus() {
    this.props.onFocus && this.props.onFocus();
  };

  MapSuggestion.prototype.handleSearch = function handleSearch(value) {
    var _this3 = this;

    this.needBlurAction = true;
    this.needClear = true;
    this.promise && this.promise.abort();
    clearTimeout(this.timer);
    var _props = this.props,
        errorMsg = _props.errorMsg,
        _props$needLoading = _props.needLoading,
        needLoading = _props$needLoading === undefined ? true : _props$needLoading;
    // if(value === this.state.value && !this.isNeedEmpty) return;

    this.setState({
      value: value
    });

    if (!this.isNeedEmpty) {
      if (!value) {
        this.setState({
          dataSource: []
        });
        return;
      }
    }

    this.timer = setTimeout(function () {
      _this3.promise = _this3.searchPlace(value);
      if (needLoading) {
        _this3.needClear = true;
        _this3.setState({
          dataSource: _this3.loadingOption
        });
      }
      _this3.promise && _this3.promise.then(function (result) {
        var body = (0, _utils.getValue)(['body', 'data'], result);
        if (body && body.status && body.predictions.length > 0) {
          var data = body.predictions;
          var arr = data.map(function (val, index) {
            return _this3.mkOption(val, index, Option);
          });
          _this3.needClear = false;
          _this3.setState({
            dataSource: arr
          });
        } else {
          _this3.needClear = true;
          _this3.setState({
            dataSource: [_react2.default.createElement(
              Option,
              { disabled: true, key: 'noData' },
              errorMsg || suggestionErrorMsg
            )]
          });
        }
      });
    }, 150);
  };

  MapSuggestion.prototype.mkOption = function mkOption(data, index, Option) {
    var main_text = data.structured_formatting.main_text;
    var secondary_text = data.structured_formatting.secondary_text;
    var main_text_matched_substrings = data.structured_formatting.main_text_matched_substrings;
    var bold = void 0;
    var normal = void 0;
    if (main_text && main_text_matched_substrings && main_text_matched_substrings.length > 0) {
      var match = main_text_matched_substrings[0];
      bold = main_text.substr(match.offset, match.length);
      normal = main_text.substr(match.offset + match.length);
    }
    return _react2.default.createElement(
      Option,
      { name: data.description, id: data.place_id, key: data.place_id },
      _react2.default.createElement(
        'span',
        { className: 'deep-dark' },
        bold
      ),
      _react2.default.createElement(
        'span',
        { className: 'dark' },
        normal
      ),
      _react2.default.createElement(
        'span',
        { className: 'regular' },
        '\xA0',
        secondary_text
      )
    );
  };

  MapSuggestion.prototype.clearDropMenu = function clearDropMenu() {
    var dataSource = this.state.dataSource;

    if (dataSource && dataSource.length > 0) {
      this.setState({ dataSource: [] });
    }
  };

  MapSuggestion.prototype.onClearClick = function onClearClick(e) {
    var _props2 = this.props,
        onSelect = _props2.onSelect,
        onClearClick = _props2.onClearClick;

    onSelect && onSelect('');
    this.handleSearch('');
    this.abortPromise();
    var fetter = this.props.fetter;

    _pubsubJs2.default.publish('clear', { from: fetter });
    this.needBlurAction = false;
    e.preventDefault();
    onClearClick && onClearClick();
  };

  MapSuggestion.prototype.onSearchClick = function onSearchClick(e) {
    var value = this.state.value;
    var fetter = this.props.fetter;

    e.preventDefault();
    this.needBlurAction = false;
    if (value) {
      this.textSearch(value);
      _pubsubJs2.default.publish('loading', { from: fetter, loading: true });
    }
    this.props.onSearchClick && this.props.onSearchClick(value);
  };

  MapSuggestion.prototype.textSearch = function textSearch(text) {
    var _this = this;
    this.abortPromise();
    this.clearDropMenu();
    this.textSearchPromise = (0, _ApiClient2.default)('textsearch', 'query=' + text);

    this.textSearchPromise && this.textSearchPromise.then(function (response) {
      var result = (0, _utils.getValue)(['body', 'data'], response);
      var status = result.status;
      if (status != 'OK') {
        _this.doSelect(text, '', true);
        _this.onTextSearchError();
        return;
      }
      var data = result.results;
      if (!data || data.length == 0) {
        _this.doSelect(text, '', true);
        _this.onTextSearchError();
        return;
      }
      var realData = data[0];
      // formatted_address可能有点问题
      var address = realData.formatted_address;
      var geo = realData.geometry.location;
      var lat = geo.lat;
      var lng = geo.lng;
      var position = { lat: lat, lng: lng };
      _this.doSelect(address, position, false);
    }, function (error) {
      _this.doSelect(text, '', true);
      _this.onTextSearchError();
    });
  };

  MapSuggestion.prototype.onTextSearchError = function onTextSearchError() {
    var textSearchErrorMsg = this.props.textSearchErrorMsg;

    this.setState({
      dataSource: [_react2.default.createElement(
        Option,
        { disabled: true, key: 'noData' },
        textSearchErrorMsg || searchErrorMsg
      )]
    });
  };

  MapSuggestion.prototype.handleBlur = function handleBlur(val) {
    clearTimeout(this.timer);
    var source = this.state.dataSource;
    if (!this.needBlurAction) {
      if (!this.isNeedEmpty) {
        this.clearDropMenu();
        this.reset();
      }
      return;
    }
    if (this.needClear) {
      if (!this.isNeedEmpty) {
        this.clearDropMenu();
        this.setSelect('', '', false);
        this.reset();
      } else {
        this.handleSearch('');
      }
      return;
    }
    if (source) {
      if (source.length == 0 || source[0].key === 'noData') {
        this.setSelect('');
        if (this.isNeedEmpty) {
          this.handleSearch('');
        } else {
          this.clearDropMenu();
        }
      } else {
        var defaultOption = source[0];
        this.handleSelect(defaultOption);
        this.clearDropMenu();
      }
      this.reset();
    }
  };
  /**
   * 选择完之后 需要请求详情, 之后发出select事件
  */


  MapSuggestion.prototype.handleSelect = function handleSelect(key, option) {
    var _this4 = this;

    var fetter = this.props.fetter;

    if (!option || !key) {
      this.doSelect('', '', true);
      return;
    }
    var address = option.props.name;
    this.doSelect(address, '', false);
    var place_id = key;
    var actionQuery = {
      type: 'details',
      params: {
        placeid: place_id,
        language: 'zh-CN'
      }
    };
    var _this = this;
    this.abortPromise();
    _pubsubJs2.default.publish('loading', { from: fetter, loading: true });
    this.detailPromise = (0, _ApiClient2.default)('details', 'placeid=' + place_id);

    this.detailPromise && this.detailPromise.then(function (response) {
      var result = (0, _utils.getValue)(['body', 'data'], response);
      if (result.status != 'OK') {
        _this4.doSelect(address, '', true);
        return;
      }
      var data = result.result;
      var geo = data.geometry.location;
      var lat = geo.lat;
      var lng = geo.lng;
      var position = { lat: lat, lng: lng };
      _this.doSelect(address, position, false);
    }, function (error, data) {
      _this.doSelect(address, '', true);
    });
  };
  /**
   * 
  */


  MapSuggestion.prototype.doSelect = function doSelect(address, geometry, error) {
    var option = {
      address: address,
      geometry: geometry,
      error: error
    };
    this.clearDropMenu();
    this.needBlurAction = false;
    this.setSelect(option);
  };

  /*
   *所有select事件必经之地
  */


  MapSuggestion.prototype.setSelect = function setSelect(option, noAction) {
    var _props3 = this.props,
        onSelect = _props3.onSelect,
        fetter = _props3.fetter;

    var action = onSelect && onSelect(option);
    if (!noAction) {
      if (!option || option == '') {
        _pubsubJs2.default.publish('onSelect', {
          from: fetter
        });
      } else {
        var dummy = (0, _cloneDeep2.default)(option);
        dummy.from = fetter;
        _pubsubJs2.default.publish('onSelect', dummy);
      }
    }
    if (action) {
      if (action.noClear) {
        this.setState({
          value: this.props.value
        });
      } else {
        this.setState({
          value: ''
        });
      }
      return;
    }
    this.setState({
      value: option && option.address || ''
    });
  };

  MapSuggestion.prototype.abortPromise = function abortPromise() {
    this.promise && this.promise.abort();
    this.detailPromise && this.detailPromise.abort();
    this.textSearchPromise && this.textSearchPromise.abort();
  };

  MapSuggestion.prototype.MapAddressChange = function MapAddressChange(msg, data) {
    var fetter = this.props.fetter;

    if (fetter && data && data.from != fetter) {
      return;
    }
    this.setSelect(data, true);
  };

  MapSuggestion.prototype.componentWillMount = function componentWillMount() {
    var Loading = this.props.LoadingWidget;
    if (!Loading) {
      this.loadingOption = null;
      return;
    }
    // 初始话loading option
    this.loadingOption = [_react2.default.createElement(
      Option,
      { key: 'noData', disabled: true },
      _react2.default.createElement(
        'div',
        { className: 'mj-loading-suggestion' },
        _react2.default.createElement(Loading, { isFixed: false, isLoading: true, type: 'line' })
      )
    )];
  };

  MapSuggestion.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) return false;
    if (nextProps.value && !nextProps.dontClearDropDown) {
      this.clearDropMenu();
    }
    this.setState({
      value: nextProps.value
    });
  };

  MapSuggestion.prototype.componentDidMount = function componentDidMount() {
    // let env = this.props.env;
    // if(env === 'test' || env === 'development') {
    //   api = 'http://gmaptest.mioji.com/nd/gmap';
    // }
    if (!this.props.value && this.props.isNeedEmpty) {
      this.handleSearch('');
    }
    _pubsubJs2.default.subscribe('onMapChange', this.MapAddressChange);
  };

  MapSuggestion.prototype.componentWillUnmount = function componentWillUnmount() {
    _pubsubJs2.default.unsubscribe(this.MapAddressChange);
  };

  MapSuggestion.prototype.reset = function reset() {
    this.needClear = false;
    this.needBlurAction = false;
  };

  MapSuggestion.prototype.render = function render() {
    var _state = this.state,
        dataSource = _state.dataSource,
        value = _state.value;
    var _props4 = this.props,
        _props4$width = _props4.width,
        width = _props4$width === undefined ? 130 : _props4$width,
        className = _props4.className,
        _props4$placeholder = _props4.placeholder,
        placeholder = _props4$placeholder === undefined ? '' : _props4$placeholder,
        _props4$dropdownMenuS = _props4.dropdownMenuStyle,
        dropdownMenuStyle = _props4$dropdownMenuS === undefined ? {} : _props4$dropdownMenuS,
        onValueChange = _props4.onValueChange,
        needError = _props4.needError;
    var _props5 = this.props,
        _props5$allowClear = _props5.allowClear,
        allowClear = _props5$allowClear === undefined ? true : _props5$allowClear,
        _props5$allowSearch = _props5.allowSearch,
        allowSearch = _props5$allowSearch === undefined ? false : _props5$allowSearch,
        onSearchClick = _props5.onSearchClick;

    var olDrop = { maxHeight: 160 };
    olDrop = Object.assign(olDrop, dropdownMenuStyle);
    value = typeof value !== 'undefined' ? value : this.props.value;
    if (needError) {
      className = className + ' error-style';
    }

    return _react2.default.createElement(
      'div',
      { className: 'mj-suggestion-swg' },
      _react2.default.createElement(
        _select2.default,
        {
          combobox: true,
          style: { width: width },
          className: className,
          filterOption: false,
          onBlur: this.handleBlur,
          onSearch: this.handleSearch,
          onChange: onValueChange,
          onFocus: this.onFocus,
          value: value,
          onSelect: this.handleSelect,
          placeholder: placeholder,
          getPopupContainer: this.props.popupContainer,
          dropdownMenuStyle: olDrop
        },
        this.state.dataSource
      ),
      _react2.default.createElement(
        'div',
        { className: 'mj-icon-wrap' },
        allowClear && value ? _react2.default.createElement(
          'div',
          { className: 'ant-select-selection_clear', onMouseDown: this.onClearClick },
          _react2.default.createElement(_Icon2.default, { className: 'close-icon', type: 'closed' })
        ) : null,
        allowSearch ? _react2.default.createElement(
          'div',
          { className: 'ant-select-selection_search', onMouseDown: this.onSearchClick },
          _react2.default.createElement(_Icon2.default, { className: 'search-icon', type: 'search' })
        ) : null
      )
    );
  };

  return MapSuggestion;
}(_react.Component);

exports.default = MapSuggestion;
module.exports = exports['default'];