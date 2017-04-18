# react-gmap


### install

```bash
npm install react-gmap-mj --save
```

### example
```javascript
import React, {Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { MJMap, MapSuggestion, utils } from 'react-gmap-mj';

class App extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div style={{width: '500px', height: '500px'}} >
        <MJMap
          centerDisabled={false}
          zoomDisabled={false}
          options={options}                                     // 可以对地图做一些初始化配置
          posOptions={null}/>
        <MapSuggestion  
          className={`custom-map-search ${showErrNoAddr||showErrNoCoord ? 'error' : ''}`}
          width='100%'
          allowClear={true}                                        // 是否需要清除按钮
          allowSearch={true}                                      // 是否需要搜索按钮
          onSearchClick={this.onSearchClick}                     // 搜索按钮点击回调
          onClearClick = {this.onClearClick}                    // 搜索清除点击回调
          placeholder='请搜索地址，或单击地图直接标记中心点'         // hint
          popupContainer= {() => document.getElementById('custom-poi-container')}   // 获取父容器
          value={addr}                                        // value值 
          onSelect={this.handleSelect}/>                     // 当点击地图, 拖动地图上的点, 搜索, 选定时 回调
      </div>
    )
  }
}
ReactDOM.render(
  <App />,
  document.getElementById('container')
);

```
