import React, {Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Upload, Icon, Modal } from 'antd';
import { GMap, PlaceAutocomplete, utils,Suggestion,MJMap,MapSuggestion } from './src';
let request = require('superagent');


class App extends Component {



  constructor(props) { 

    super(props);
    this.state = {
      addr:'',
      previewVisible: false,
      previewImage: '',
      fileList: [{
        uid: -1,
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      },
      {
        uid: 123123,
        name: 'xxx.png',
        status: 'done',
        }],
    };
    this.handleCancel = this.handleCancel.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.uploadAction = this.uploadAction.bind(this);
    this.beforeUpload = this.beforeUpload.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.hasUpload = 0;
  }
  handleChange(v1,v2) {
    this.setState({ fileList:v1.fileList })
  }
  handleCancel() {
    this.setState({ previewVisible: false })
  }

  handleRemove() {
    this.hasUpload--;
  }

  beforeUpload(v1,v2) {
    this.hasUpload++;
    if(this.hasUpload > 3) {
      alert('超出文件限制');
      return false;
    }
  }

  handlePreview(file){
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleSelect(v1) {
    this.setState({
      addr:v1.addr
    });
  }

  uploadAction(v1,v2) {
    const actionQuery = {
      type: 'textsearch',
      query: {
        language:'zh-CN',
        file:v1.file

      }
    };
    request.post(v1.action)
    .set('charset','utf-8')
    .send(actionQuery)
    .then((d1)=>{
      debugger
    });
  }

  render() {
    const { previewVisible, previewImage, fileList,addr } = this.state;
    return (
      <div style={{width: '500px', height: '500px'}} >
        <MJMap
          centerDisabled={false}
          zoomDisabled={false}
          options={null}                                     // 可以对地图做一些初始化配置
          posOptions={null}/>     

        <MapSuggestion 
          allowClear={true}
          allowSearch={true}
        />     
      </div>
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('container')
);
