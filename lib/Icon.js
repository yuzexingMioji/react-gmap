'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var Icon = function (_Component) {
  _inherits(Icon, _Component);

  function Icon(props) {
    _classCallCheck(this, Icon);

    var _this = _possibleConstructorReturn(this, _Component.call(this, props));

    _this.state = {};
    return _this;
  }

  Icon.prototype.handleClick = function handleClick(e) {
    e.stopPropagation();
    var onClick = this.props.onClick;

    onClick && onClick.call(this, e);
  };

  Icon.prototype.render = function render() {
    var _props = this.props,
        className = _props.className,
        type = _props.type,
        size = _props.size,
        color = _props.color,
        pointer = _props.pointer;

    return _react2.default.createElement('i', { className: 'iconfont icon-' + type + ' ' + (className ? className : '') + ' ' + (pointer ? 'pointer' : ''),
      style: { color: color, fontSize: size + 'px' },
      onClick: this.handleClick.bind(this) });
  };

  return Icon;
}(_react.Component);

Icon.propsTypes = {
  type: _react.PropTypes.string,
  onClick: _react.PropTypes.func
};

exports.default = Icon;
module.exports = exports['default'];