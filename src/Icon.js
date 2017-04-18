import React,{Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

class Icon extends Component{
  constructor(props){
    super(props);
    this.state={};
  }
  handleClick(e){
    e.stopPropagation();
    let {onClick} = this.props;
    onClick && onClick.call(this, e);
  }
  render(){
    let { className, type, size, color, pointer} = this.props;
    return(
      <i className={`iconfont icon-${type} ${
        className? className:''} ${pointer?'pointer':''}`}
        style={{color, fontSize:`${size}px`}}
        onClick={this.handleClick.bind(this)}>
      </i>
    )
  }
}
Icon.propsTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func
};

export default Icon;
