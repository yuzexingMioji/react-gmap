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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Option = _select2.default.Option;

var Suggestion = function (_Component) {
  _inherits(Suggestion, _Component);

  function Suggestion(props) {
    _classCallCheck(this, Suggestion);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {
      dataSource: []
    };
    _this.isNeedEmpty = _this.props.isNeedEmpty === undefined ? false : _this.props.isNeedEmpty;

    var funcArr = ['handleSearch', 'onSelect', 'handleBlur', 'onFocus', 'reset', 'clearDropMenu', 'onClearClick', 'setSelect', 'onSearchClick'];
    funcArr.map(function (func) {
      _this[func] = _this[func].bind(_this);
    });
    _this.reset();
    return _this;
  }

  Suggestion.prototype.onFocus = function onFocus() {};

  Suggestion.prototype.handleSearch = function handleSearch(value) {
    var _this2 = this;

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
      _this2.promise = _this2.props.onChange(value);
      if (needLoading) {
        _this2.needClear = true;
        _this2.setState({
          dataSource: _this2.loadingOption
        });
      }
      _this2.promise.then(function (result) {
        var body = result.body;

        if (body && body.status && body.predictions.length > 0) {
          var data = body.predictions;
          var arr = data.map(function (val, index) {
            if (_this2.props.mkOption) {
              return _this2.props.mkOption(val, index, Option);
            }
          });
          _this2.needClear = false;
          _this2.setState({
            dataSource: arr
          });
        } else {
          _this2.needClear = true;
          _this2.setState({
            dataSource: [_react2.default.createElement(
              Option,
              { disabled: true, key: 'noData' },
              errorMsg || '当前城市暂不支持'
            )]
          });
        }
      });
    }, 150);
  };

  Suggestion.prototype.clearDropMenu = function clearDropMenu() {
    var dataSource = this.state.dataSource;

    if (dataSource && dataSource.length > 0) {
      this.setState({ dataSource: [] });
    }
  };

  Suggestion.prototype.showTextSearchError = function showTextSearchError() {
    console.log('this');
    this.setState({
      dataSource: [_react2.default.createElement(
        Option,
        { disabled: true, key: 'noData' },
        '\u672A\u627E\u5230\u8BE5\u5730\u5740'
      )]
    });
  };

  Suggestion.prototype.onClearClick = function onClearClick(e) {
    this.props.onSelect('');
    this.handleSearch('');
    this.needBlurAction = false;
    e.preventDefault();
    this.props.onClearClick && this.props.onClearClick();
  };

  Suggestion.prototype.onSearchClick = function onSearchClick(e) {
    var value = this.state.value;

    this.needBlurAction = false;
    e.preventDefault();
    this.props.onSearchClick && this.props.onSearchClick(value);
  };

  Suggestion.prototype.handleBlur = function handleBlur(val) {
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
        this.setSelect('');
        this.reset();
      } else {
        this.handleSearch('');
      }
      return;
    }
    if (source) {
      if (source.length == 0 || source[0].key === 'noData') {
        // // 清空逻辑
        this.setSelect('');
        if (this.isNeedEmpty) {
          this.handleSearch('');
        } else {
          this.clearDropMenu();
        }
      } else {
        var defaultOption = source[0];
        this.setSelect(defaultOption);
        this.clearDropMenu();
      }
      this.reset();
    }
  };

  Suggestion.prototype.setSelect = function setSelect(option) {
    // 对外发出事件
    var action = this.props.onSelect(option);
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
      value: option && option.props.name || ''
    });
  };

  Suggestion.prototype.onSelect = function onSelect(key, option) {
    // let noSource = this.props.mkOptionNoSource();
    if (key === 'noData') return;
    option = Object.assign({ key: key }, option);
    // 清空下拉框
    this.clearDropMenu();
    // 不需要blur事件
    this.needBlurAction = false;
    this.setSelect(option);
  };

  Suggestion.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.value === this.props.value) return false;
    if (nextProps.value && !nextProps.dontClearDropDown) {
      this.clearDropMenu();
    }
    this.setState({
      value: nextProps.value
    });
  };

  Suggestion.prototype.componentDidMount = function componentDidMount() {
    if (!this.props.value && this.props.isNeedEmpty) {
      this.handleSearch('');
    }
  };

  Suggestion.prototype.componentWillMount = function componentWillMount() {
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

  Suggestion.prototype.reset = function reset() {
    this.needClear = false;
    this.needBlurAction = false;
  };

  Suggestion.prototype.render = function render() {
    var _state = this.state,
        dataSource = _state.dataSource,
        value = _state.value;
    var _props2 = this.props,
        _props2$width = _props2.width,
        width = _props2$width === undefined ? 130 : _props2$width,
        className = _props2.className,
        _props2$placeholder = _props2.placeholder,
        placeholder = _props2$placeholder === undefined ? '' : _props2$placeholder,
        _props2$dropdownMenuS = _props2.dropdownMenuStyle,
        dropdownMenuStyle = _props2$dropdownMenuS === undefined ? {} : _props2$dropdownMenuS,
        onValueChange = _props2.onValueChange,
        needError = _props2.needError;
    var _props3 = this.props,
        _props3$allowClear = _props3.allowClear,
        allowClear = _props3$allowClear === undefined ? true : _props3$allowClear,
        _props3$allowSearch = _props3.allowSearch,
        allowSearch = _props3$allowSearch === undefined ? false : _props3$allowSearch,
        onSearchClick = _props3.onSearchClick;

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
          onSelect: this.onSelect,
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

  return Suggestion;
}(_react.Component);
/*
<div className='mj-icon-wrap'>
          {
           allowClear && value ?
           <div className='ant-select-selection_clear' onMouseDown={this.onClearClick}>
             <svg 
                 x="0px"
                 y="0px"
                 viewBox="0 0 1024 1024" 
                 version="1.1" 
                 xmlSpace="preserve"
                 width="10px" 
                 height="10px">
               <path fill="#a3a3a3" d="M460.280189 512 266.711524 318.431334C252.429492 304.149302 252.429492 280.993555 266.711524 266.711524 280.993555 252.429492 304.149302 252.429492 318.431334 266.711524L512 460.280189 705.568666 266.711524C719.850698 252.429492 743.006445 252.429492 757.288477 266.711524 771.570509 280.993555 771.570509 304.149302 757.288477 318.431334L563.719811 512 757.288477 705.568666C771.570509 719.850698 771.570509 743.006445 757.288477 757.288477 743.006445 771.570509 719.850698 771.570509 705.568666 757.288477L512 563.719811 318.431334 757.288477C304.149302 771.570509 280.993555 771.570509 266.711524 757.288477 252.429492 743.006445 252.429492 719.850698 266.711524 705.568666L460.280189 512Z">
               </path>
              </svg>
           </div>
           :null
          }
          {
           allowSearch ?
           <div className='ant-select-selection_search' onMouseDown={this.onSearchClick}>
             <svg 
               x="0px"
               y="0px"
               viewBox="0 0 1024 1024" 
               version="1.1" 
               xmlSpace="preserve"
               width="10px" 
               height="10px">
              <path fill='#7f7f7f'  d="M415.963429 770.570971C226.925714 770.570971 73.142857 614.154971 73.142857 421.8624 73.142857 229.569829 226.925714 73.153829 415.963429 73.153829 605.001143 73.153829 758.820571 229.569829 758.820571 421.8624 758.820571 614.154971 605.001143 770.570971 415.963429 770.570971M1013.284571 961.583543 738.925714 687.224686C797.001143 614.666971 831.963429 522.360686 831.963429 421.8624 831.963429 189.231543 645.339429 0.010971 415.963429 0.010971 186.624 0.010971 0 189.231543 0 421.8624 0 654.456686 186.624 843.713829 415.963429 843.713829 520.118857 843.713829 615.241143 804.399543 688.274286 739.997257L961.572571 1013.295543C968.704 1020.426971 978.066286 1024.010971 987.428571 1024.010971 996.790857 1024.010971 1006.153143 1020.426971 1013.284571 1013.295543 1027.584 998.996114 1027.584 975.8464 1013.284571 961.583543">
              </path>
              </svg>
            </div>
           :null
          }
        </div>
*/


exports.default = Suggestion;
module.exports = exports['default'];