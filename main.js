import React, {Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {InfoMap } from './src';

class App extends Component {



  constructor(props) { 
    super(props);
    this.data = [
      {
        id: 123123,
        position: {
          lat: 39.92, lng: 116.46
        },
        type: 16384,
        first: '宋美龄博物馆蒋介石故居1231231231',
        second: 'bowuguan蒋介石故居1231231231',
        third: 'CNY 666 起',
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
      {
        id: 1231231,
        position: {
          lat: 40.92, lng: 119.46
        },
        type: 2,
        first: '蒋介石故居1231231231',
        second: 'laojia蒋介石故居1231231231',
        third: '8.5',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 12312315,
        position: {
          lat: 42.92, lng: 129.46
        },
        first: '蒋介石故居2',
        second: 'laojia2',
        type: 1,
        third: '游玩时长4h',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 12311,
        position: {
          lat: 46.92, lng: 121.46
        },
        first: '蒋介石故居3',
        second: 'laojia3',
        type: 512,
        third: '游玩时长5h',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 123123123,
        position: {
          lat: 59.92, lng: 126.46
        },
        first: '宋美龄博物馆1',
        second: 'bowuguan1',
        third: '游玩时长2h',
        type: 4,
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
      {
        id: 123111,
        position: {
          lat: 59.92, lng: 176.46
        },
        first: '宋美龄博物馆1',
        second: 'bowuguan1',
        third: '游玩时长2h',
        type: 4,
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
    ]

    this.data2 = [
      {
        id: 123123,
        position: {
          lat: 39.92, lng: 116.46
        },
        type: 16384,
        first: '宋美龄博物馆蒋介石故居1231231231',
        second: 'bowuguan蒋介石故居1231231231',
        third: 'CNY 666 起',
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
      {
        id: 1231231,
        position: {
          lat: 40.92, lng: 119.46
        },
        type: 2,
        first: '蒋介石故居1231231231',
        second: 'laojia蒋介石故居1231231231',
        third: '8.5',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 12312315,
        position: {
          lat: 42.92, lng: 129.46
        },
        first: '蒋介石故居2',
        second: 'laojia2',
        type: 1,
        third: '游玩时长4h',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
    ];


    this.state = {
      data: this.data,
      select: this.data2,
    };
  }

  onSelect(type, selectData) {
    const { select, data } = this.state;
    if(type == 0) {
      // sub
      const sb = select.findIndex((m) => m.id == selectData.id);
      select.splice(sb, 1);
    }else {
      // add
      // const sb = this.data.find((m) => m.id == id);
      select.push(selectData);
    }
    // let i = 0;
    // this.data2.sort(() => {
    //   i++;
    //   return i%2;
    // });
    this.setState({
      select,
      data,
      order: true
    });
  }
  addNewMarker() {
    const { select, data } = this.state;
    data.push({
        id: 12312301,
        position: {
          lat: 39.92, lng: 119.46
        },
        type: 1024,
        first: '蒋介石故居1231231231',
        second: 'laojia蒋介石故居1231231231',
        third: '320个国家',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg@base@tag=imgScale&h=66&w=100&rotate=0&c=1&m=2'
      },);
    this.setState({
      // select,
      data,
      order: false
    });
  }

  removeNewMarker() {
    this.map.initMapLens();
    
    
  }

  onClick(type, data) {
    console.log(type);
    console.log(data);
    this.map.initMapLens();
  }

  render() {
    const { data, select, order } = this.state;
    return (
      
      <div style={{width: '800px', height: '800px'}} >
      <div onClick={this.addNewMarker.bind(this)} >
        列表 +
      </div>
      <div onClick={this.removeNewMarker.bind(this)}>
        列表 -
      </div>
        <InfoMap
          whole={_.cloneDeep([data[0]])}
          selected={[]}
          infinite={true}
          order={order}
          ref={(ref) => this.map = ref}
          onClick={this.onClick.bind(this)}
          onSelect={this.onSelect.bind(this)}   
        />
      </div>
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('container')
);
