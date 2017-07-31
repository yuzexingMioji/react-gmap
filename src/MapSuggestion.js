import React, {Component} from 'react'
import 'antd/dist/antd.css';
import Select from 'antd/lib/select';
import Icon from './Icon';
import './suggestion.scss';
import PubSub from 'pubsub-js';
import postRequest from './ApiClient';
import { getValue } from './utils';
const Option = Select.Option;
const suggestionErrorMsg = '无结果，请尝试搜索';
const searchErrorMsg = '未找到该地址';

class MapSuggestion extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource : []
    }
    this.isNeedEmpty = this.props.isNeedEmpty === undefined ? false : this.props.isNeedEmpty;

    let funcArr = ['handleSearch', 'doSelect','handleBlur','onFocus','reset','clearDropMenu',
    'onClearClick','setSelect','onSearchClick','searchPlace','mkOption','textSearch',
    ,'handleSelect','MapAddressChange','onTextSearchError', 'abortPromise'];
    funcArr.map((func) => {
      this[func] = this[func].bind(this);
    });
    this.reset();
  }

  searchPlace(val) {
    return postRequest('autocomplete', "input=" + val);
  }

  onFocus() {
    this.props.onFocus && this.props.onFocus();
  }

  handleSearch(value) {
    this.needBlurAction = true;
    this.needClear = true;
    this.promise && this.promise.abort();
    clearTimeout(this.timer);
    let {errorMsg,needLoading = true} = this.props;
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
      this.promise = this.searchPlace(value);
      if(needLoading) {
        this.needClear = true;
        this.setState({
          dataSource: this.loadingOption
        });
      }
      this.promise && this.promise.then((result) => {
        let body = getValue(['body', 'data'], result);
        if(body && body.status && body.predictions.length > 0) {
          let data = body.predictions;
          let arr =  data.map((val, index) => {
           return this.mkOption(val,index, Option);
          });
          this.needClear = false;
          this.setState({
            dataSource: arr
          });
        }else {
          this.needClear = true;
          this.setState({
            dataSource: [<Option disabled key = 'noData'>{errorMsg || suggestionErrorMsg}</Option>]
          })
        }
      });
    }, 150);
  }

  mkOption(data,index, Option) {
    let main_text = data.structured_formatting.main_text;
    let secondary_text = data.structured_formatting.secondary_text;
    let main_text_matched_substrings = data.structured_formatting.main_text_matched_substrings;
    let bold;
    let normal;
    if(main_text && main_text_matched_substrings && main_text_matched_substrings.length >0) {
      let match = main_text_matched_substrings[0];
      bold = main_text.substr(match.offset,match.length);
      normal = main_text.substr(match.offset+match.length);
    }
    return (
      <Option name = {data.description} id={data.place_id} key = {data.place_id}>
        <span className = 'deep-dark'>{bold}</span>
        <span className = 'dark'>{normal}</span>
        <span className = 'regular'>&nbsp;{secondary_text}</span>
      </Option>
    )
  }

  clearDropMenu() {
    const { dataSource } = this.state;
    if(dataSource && dataSource.length > 0) {
      this.setState({dataSource : []});
    }
  }

  onClearClick(e) {
    const { onSelect, onClearClick } = this.props;
    onSelect && onSelect('');
    this.handleSearch('');
    this.abortPromise();
    const { fetter } = this.props;
    PubSub.publish('clear',{from:fetter});
    this.needBlurAction = false;
    e.preventDefault();
    onClearClick && onClearClick();
  }

  onSearchClick(e) {
    const { value } = this.state;
    const { fetter } = this.props;
    e.preventDefault();
    this.needBlurAction = false;
    if(value) {
      this.textSearch(value);
      PubSub.publish('loading',{from:fetter, loading: true});
    }
    this.props.onSearchClick && this.props.onSearchClick(value);
  }

  textSearch(text) {
    let _this = this;
    this.abortPromise();
    this.clearDropMenu();
    this.textSearchPromise = postRequest('textsearch', 'query=' + text);

    this.textSearchPromise && this.textSearchPromise.then((response) => {
      const result = getValue(['body', 'data'], response);
      let status = result.status;
      if(status != 'OK') {
        _this.doSelect(text,'',true);
        _this.onTextSearchError();
        return;
      }
      let data = result.results;
      if(!data || data.length == 0) {
        _this.doSelect(text,'',true);
        _this.onTextSearchError();
        return;
      }
      let realData = data[0];
      // formatted_address可能有点问题
      let address = realData.formatted_address;
      let geo = realData.geometry.location;
      let lat = geo.lat;
      let lng = geo.lng;
      let position = {lat,lng};
      _this.doSelect(address,position,false);

    },(error) => {
        _this.doSelect(text,'',true);
        _this.onTextSearchError();
      }
    )
  }

  onTextSearchError() {
    let { textSearchErrorMsg }  = this.props
    this.setState({
      dataSource: [<Option disabled key = 'noData'>{textSearchErrorMsg || searchErrorMsg}</Option>]
    })
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
        this.setSelect('','',false);
        this.reset();
      } else {
        this.handleSearch('');
      }
      return;
    }
    if(source) {
      if(source.length == 0 || source[0].key === 'noData' ) {
        this.setSelect('');
        if (this.isNeedEmpty) {
          this.handleSearch('');
        }else {
          this.clearDropMenu();
        }
      }else {
        let defaultOption = source[0];
        this.handleSelect(defaultOption);
        this.clearDropMenu();
      }
      this.reset();
    }
  }
  /**
   * 选择完之后 需要请求详情, 之后发出select事件
  */
  handleSelect(key,option) {
    const { fetter } = this.props;
    if(!option || !key) {
       this.doSelect('', '', true);
       return;
    }
    let address = option.props.name;
    this.doSelect(address, '', false);
    let place_id = key;
    const actionQuery = {
      type: 'details',
      params: {
        placeid: place_id,
        language:'zh-CN'
      }
    };
    let _this = this;
    this.abortPromise();
    PubSub.publish('loading', {from:fetter, loading: true});
    this.detailPromise = postRequest('details', 'placeid=' + place_id);

    this.detailPromise && this.detailPromise.then((response) => {
      const result = getValue(['body', 'data'], response);
      if(result.status != 'OK') {
        this.doSelect(address,'',true);
        return;
      }
      let data = result.result;
      let geo = data.geometry.location;
      let lat = geo.lat;
      let lng = geo.lng;
      let position = { lat,lng };
      _this.doSelect(address,position,false);
    },(error,data)=>{
      _this.doSelect(address,'',true);
    });
  }
  /**
   * 
  */
  doSelect(address, geometry, error) {
    let option = {
      address,
      geometry,
      error
    };
    this.clearDropMenu();
    this.needBlurAction = false;
    this.setSelect(option);
  }

  /*
   *所有select事件必经之地
  */
  setSelect(option, noAction) {
    const { onSelect, fetter } = this.props;
    const action = onSelect && onSelect(option);
    if(!noAction) {
      if(!option || option == '') {
        PubSub.publish('onSelect', {
          from: fetter
        });
      }else {
        const dummy = _.cloneDeep(option);
        dummy.from = fetter;
        PubSub.publish('onSelect', dummy);
      }
    }
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
      value: option && option.address || ''
    });
  }

  abortPromise() {
    this.promise && this.promise.abort();
    this.detailPromise && this.detailPromise.abort();
    this.textSearchPromise && this.textSearchPromise.abort();
  }

  MapAddressChange(msg,data) {
    const {fetter} = this.props;
    if(fetter && data && data.from != fetter) {
      return;
    }
    this.setSelect(data,true);
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
    // let env = this.props.env;
    // if(env === 'test' || env === 'development') {
    //   api = 'http://gmaptest.mioji.com/nd/gmap';
    // }
    if(!this.props.value && this.props.isNeedEmpty) {
      this.handleSearch('');
    }
    PubSub.subscribe('onMapChange',this.MapAddressChange);
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.MapAddressChange);
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
          onSelect = {this.handleSelect}
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


export default MapSuggestion;
