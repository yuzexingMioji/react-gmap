import React, {Component} from 'react'
import Select from 'antd/lib/select';
import Icon from './Icon';
import './suggestion.scss'; 
const Option = Select.Option;

class Suggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource : []
    }
    this.isNeedEmpty = this.props.isNeedEmpty === undefined ? false : this.props.isNeedEmpty;

    let funcArr = ['handleSearch', 'onSelect','handleBlur','onFocus','reset','clearDropMenu',
    'onClearClick','setSelect','onSearchClick'];
    funcArr.map((func) => {
      this[func] = this[func].bind(this);
    });
    this.reset();
  }
  onFocus() {}
  handleSearch(value) {
    this.needBlurAction = true;
    this.needClear = true;
    this.promise && this.promise.abort();
    clearTimeout(this.timer);
    let {errorMsg, needLoading = true} = this.props;
    // if(value === this.state.value && !this.isNeedEmpty) return;
    this.setState({
      value
    });

    if (!this.isNeedEmpty) {
      if(!value) {
        this.setState({
          dataSource : []
        });
        return;
      }
    }

    this.timer = setTimeout(() => {
      this.promise = this.props.onChange(value);
      if(needLoading) {
        this.needClear = true;
        this.setState({
          dataSource: this.loadingOption
        });
      }
      this.promise.then((result) => {
        let {body} = result;
        if(body && body.status && body.predictions.length > 0) {
          let data = body.predictions;
          let arr =  data.map((val, index) => {
            if(this.props.mkOption){
              return this.props.mkOption(val,index, Option);
            }
          });
          this.needClear = false;
          this.setState({
            dataSource: arr
          });
        }else {
          this.needClear = true;
          this.setState({
            dataSource: [<Option disabled key = 'noData'>{errorMsg || '当前城市暂不支持'}</Option>]
          })
        }
      });
    }, 150);
  }
  clearDropMenu() {
    const { dataSource } = this.state;
    if(dataSource && dataSource.length > 0) {
      this.setState({dataSource : []});
    }
  }

  showTextSearchError() {
    console.log('this');
    this.setState({
      dataSource: [<Option disabled key = 'noData'>未找到该地址</Option>]
    })
  }

  onClearClick(e) {
    this.props.onSelect('');
    this.handleSearch('');
    this.needBlurAction = false;
    e.preventDefault();
    this.props.onClearClick && this.props.onClearClick();
  }
  onSearchClick(e) {
    let {value} = this.state;
    this.needBlurAction = false;
    e.preventDefault();
    this.props.onSearchClick && this.props.onSearchClick(value);
  }
  handleBlur(val) {
    clearTimeout(this.timer);
    let source = this.state.dataSource;
    if (!this.needBlurAction) {
      if (!this.isNeedEmpty) {
        this.clearDropMenu();
        this.reset();
      }
      return;
    }
    if(this.needClear) {
      if (!this.isNeedEmpty) {
        this.clearDropMenu();
        this.setSelect('');
        this.reset();
      } else {
        this.handleSearch('');
      }
      return;
    }
    if(source ) {
      if(source.length == 0 || source[0].key === 'noData' ) {
        // // 清空逻辑
        this.setSelect('');
        if (this.isNeedEmpty) {
          this.handleSearch('');
        }else {
          this.clearDropMenu();
        }
      }else {
        let defaultOption = source[0];
        this.setSelect(defaultOption);
        this.clearDropMenu();
      }
      this.reset();
    }
  }
  setSelect(option) {
    // 对外发出事件
    let action = this.props.onSelect(option);
    if(action) {
      if(action.noClear) {
        this.setState({
          value: this.props.value
        });
      }else {
        this.setState({
          value: ''
        });
      }
      return;
    }
    this.setState({
      value: option && option.props.name || ''
    });
  }
  onSelect(key, option) {
    // let noSource = this.props.mkOptionNoSource();
    if(key === 'noData')return;
    option = Object.assign({key: key}, option);
    // 清空下拉框
    this.clearDropMenu();
    // 不需要blur事件
    this.needBlurAction = false;
    this.setSelect(option);
  }
  componentWillReceiveProps(nextProps) {
    if( nextProps.value === this.props.value)return false;
    if(nextProps.value && !nextProps.dontClearDropDown) {
      this.clearDropMenu();
    }
    this.setState({
      value: nextProps.value
    });
  }
  componentDidMount() {
    if(!this.props.value && this.props.isNeedEmpty) {
      this.handleSearch('');
    }
  }
  componentWillMount() {
    const Loading = this.props.LoadingWidget;
    if(!Loading) {
      this.loadingOption = null;
      return;
    }
    // 初始话loading option
    this.loadingOption = 
      [<Option key="noData" disabled>
        <div className='mj-loading-suggestion'>
          <Loading isFixed={false} isLoading={true} type="line"  />
        </div>
      </Option>];
  }
  reset() {
    this.needClear = false;
    this.needBlurAction = false;
  }
  render() {
    let { dataSource, value } = this.state;
    let {width = 130, className, placeholder='',dropdownMenuStyle = {}, onValueChange, needError} = this.props;
    let {allowClear = true, allowSearch = false,onSearchClick} = this.props;
    let olDrop = {maxHeight: 160};
    olDrop = Object.assign(olDrop, dropdownMenuStyle);
    value = typeof value !== 'undefined' ? value : this.props.value;
    if(needError) {
      className = `${className} error-style`;
    }
    
    return (
      <div className='mj-suggestion-swg'>
        <Select
          combobox
          style={{ width: width }}
          className = {className}
          filterOption={false}
          onBlur={this.handleBlur}
          onSearch={this.handleSearch}
          onChange={onValueChange}
          onFocus={this.onFocus}
          value = {value}
          onSelect = {this.onSelect}
          placeholder={placeholder}
          getPopupContainer={this.props.popupContainer}
          dropdownMenuStyle = {olDrop}
        >
          {this.state.dataSource}
        </Select>
        <div className='mj-icon-wrap'>
          {
           allowClear && value ?
           <div className='ant-select-selection_clear' onMouseDown={this.onClearClick}>
             <Icon className='close-icon' type="closed" />
           </div>
           :null
          }
          {
           allowSearch ?
           <div className='ant-select-selection_search' onMouseDown={this.onSearchClick}>
             <Icon className='search-icon' type="search" />
           </div>
           :null
          }
        </div>
      </div>
    );
  }
}
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
export default Suggestion;
