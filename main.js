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
          lat: 49.92, lng: 116.46
        },
        type: 16384,
        first: '1',
        second: 'bowuguan蒋介石故居1231231231',
        third: 'CNY 666 起',
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
      {
        id: 1231231,
        position: {
          lat: 42.92, lng: 119.46
        },
        type: 2,
        first: '2',
        second: 'laojia蒋介石故居1231231231',
        third: '8.5',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 12312315,
        position: {
          lat: 41.92, lng: 129.46
        },
        first: '3',
        second: 'laojia2',
        type: 1,
        third: '游玩时长4h',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 12311,
        position: {
          lat: 48.92, lng: 121.46
        },
        first: '4',
        second: 'laojia3',
        type: 512,
        third: '游玩时长5h',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 123123123,
        position: {
          lat: 52.92, lng: 126.46
        },
        first: '5',
        second: 'bowuguan1',
        third: '游玩时长2h',
        type: 4,
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
      {
        id: 123111,
        position: {
          lat: 51.92, lng: 176.46
        },
        first: '6',
        second: 'bowuguan1',
        third: '游玩时长2h',
        type: 4,
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
    ]

    this.data2 = [
      {
        id: 12312312,
        position: {
          lat: 32.92, lng: 116.46
        },
        type: 16384,
        first: '11',
        second: 'bowuguan蒋介石故居1231231231',
        third: 'CNY 666 起',
        img: 'http://mioji-attr.cdn.mioji.com/v204385_1.jpg'
      },
      {
        id: 12312311,
        position: {
          lat: 42.92, lng: 119.46
        },
        type: 2,
        first: '12',
        second: 'laojia蒋介石故居1231231231',
        third: '8.5',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
      {
        id: 123123151,
        position: {
          lat: 44.92, lng: 129.46
        },
        first: '13',
        second: 'laojia2',
        type: 1,
        third: '游玩时长4h',
        img: 'http://mioji-attr.cdn.mioji.com/v200463_42.jpg'
      },
    ];


    this.state = {
      data: this.data,
      select: this.data2,
      i: 0
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
      select.push(selectData);
    }
    this.setState({
      select,
      data,
      order: true
    });
  }
  addNewMarker() {
    const { select, data, i } = this.state;
    console.log(i % 2 == 0);
    this.setState({
      data: i % 2 == 0 ? this.data : this.data2,
      order: false,
      i: i + 1
    });
    this.map.initMapLens();
  }

  removeNewMarker() {
    this.map.initMapLens();
    
    
  }

  onClick(type, data) {
    this.map.initMapLens();
  }

  render() {
    const { data, select, order } = this.state;
    console.log(data);
    return (
      
      <div style={{width: '800px', height: '800px'}} >
      <div onClick={this.addNewMarker.bind(this)} >
        列表 +
      </div>
      <div onClick={this.removeNewMarker.bind(this)}>
        列表 -
      </div>
        <InfoMap
          whole={data}
          selected={[]}
          // infinite={true}
          // order={order}
          ref={(ref) => this.map = ref}
          // onClick={this.onClick.bind(this)}
          // onSelect={this.onSelect.bind(this)}   
        />
      </div>
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('container')
);
