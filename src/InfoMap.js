import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { isEqual, assign } from 'lodash';
import * as utils from './utils';
import './index.scss';
import InfoBubble from './Infobubble';

const DELAY_TIME = 300;
const IMG_BIG_BLUE = 'http://ubsrc.cdn.mioji.com/gmap/img/icon_blue_focus.png';
const IMG_BIG_RED = 'http://ubsrc.cdn.mioji.com/gmap/img/icon_red_focus.png';
const IMG_SMALL_BLUE = 'http://ubsrc.cdn.mioji.com/gmap/img/icon_blue_normal.png';

const NORMAL_Z_INDEX = 100;
const HIGHER_Z_INDEX = 101;

const LABEL_HEIGHT = 35;

const INFO_BUBBLE_WIDTH = 350 + 2; // padding
const INFO_BUBBLE_HEIGHT = 100 + 2; // padding

const ICON_ADD = "<svg t=\"1498555379744\" class=\"btn-icon\" style=\"\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"9427\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"14\" height=\"14\"><defs><style type=\"text/css\"></style></defs><path d=\"M437.842 437.842v-222.844c0-40.713 32.926-73.787 74.158-73.787 40.935 0 74.158 33.816 74.158 73.787v222.844h222.844c40.713 0 73.787 32.926 73.787 74.158 0 40.935-33.816 74.158-73.787 74.158h-222.844v222.844c0 40.713-32.926 73.787-74.158 73.787-40.935 0-74.158-33.816-74.158-73.787v-222.844h-222.844c-40.713 0-73.787-32.926-73.787-74.158 0-40.935 33.816-74.158 73.787-74.158h222.844z\" p-id=\"9428\" fill=\"#ffffff\"></path></svg>";

const ICON_SUB = "<svg t=\"1498556157368\" class=\"btn-icon\" style=\"\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"9870\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"14\" height=\"14\"><defs><style type=\"text/css\"></style></defs><path d=\"M256 448l512 0c38.4 0 64 25.6 64 64l0 0c0 38.4-25.6 64-64 64L256 576C217.6 576 192 550.4 192 512l0 0C192 473.6 217.6 448 256 448z\" p-id=\"9871\" fill=\"#ffffff\"></path></svg>";

/**
 * Read Me
 * <InfoMap
 *   selected // 已选
 *   whole  // 全部数组
 *   ref  // 用于联动  // 用于调用startBounce(id)
 *   onClick   // marker click(type, id)
 *   onHover   // marker Hover(type, id)
 *   onSelect  // 新增/删除 (type, id) 1/0 新增/删除 markerID
 *   order  // 是否有序   
 *   infinite // 是否无限添加
 *  />
 */


class InfoMap extends Component{
  constructor(props) {
    super(props);
    this.setIcon = this.setIcon.bind(this);
    this.loadMap = this.loadMap.bind(this);
    this.initMap = this.initMap.bind(this);
    this.initIcon = this.initIcon.bind(this);
    this.reLoadJS = this.reLoadJS.bind(this);
    this.initLine = this.initLine.bind(this);
    // this.updateMap = this.updateMap.bind(this);
    this.startBounce = this.startBounce.bind(this);
    this.initMarker = this.initMarker.bind(this);
    this.optionClick = this.optionClick.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.focusMarker = this.focusMarker.bind(this);
    this.setIconState = this.setIconState.bind(this);
    this.setUnselected = this.setUnselected.bind(this);
    this.getProjection = this.getProjection.bind(this);
    this.setButtonState = this.setButtonState.bind(this);
    this.moveToVisibile = this.moveToVisibile.bind(this);
    this.openInfoBubble = this.openInfoBubble.bind(this);
    this.initSelectState = this.initSelectState.bind(this);
    this.addMarkerWithInfoBubble = this.addMarkerWithInfoBubble.bind(this);
    this.map = null;
    this.markers = [];    
    this.loadTime = 0;
    this.state = {};
    /**
     *  当前hover 状态
     */
    this.hoverState = false;
    /**
     *  当前hover markerID
     */
    this.markerID = null;
    /**
     *  真实显示于地图上的路线对象 
     */
    this.lineOnMap = null;


    this.default = {
      lineStyle: {
        strokeColor: '#000',
        strokeOpacity: 0.5,
        strokeWeight: 4,
      },
      options: {
        center: {
          lat: 39.92, lng: 116.46
        },
        zoom: 4,
        minZoom: 3,
        maxZoom: 18,
        zoomControl: true,
        draggable: true,
        scrollwheel: true,
        scaleControl: true,
        panControl: true,
        mapTypeControl:false,
        streetViewControl: false,
        backgroundColor: '#eee',
        clickableIcons: false,
        draggingCursor: 'move',
        draggableCursor: 'default',
        disableDoubleClickZoom: false
      }
    }
  }

  componentDidMount() {
    let key = this.props.apiKey;
    if(window.google) {
      this.loadMap();
    } else {
      this.reLoadJS(key);
    }
  }

  componentWillReceiveProps(nextProps) {
    // 过滤重复已选城市/地图内部不考虑重复点

    // 有序 展示连线 无序移除连线
    const { whole =[], selected = [], order } = this.props;

    const nWhole = nextProps.whole || [];
    const nOrder = nextProps.order;
    const nSelected = nextProps.selected || [];

    if(isEqual(nWhole, whole) && isEqual(nSelected, nWhole)) {
      if(order != nOrder && !!this.lineOnMap) {
        this.lineOnMap.setMap(nOrder ? this.map : null);
      }
      return;
    }

    const newMarkers = merge([nWhole, nSelected]);
    const nextMarkers = [];
    this.markers.map((oldMarker) => {
      const stay = newMarkers.find((newMarker) => newMarker.id == oldMarker.id);
      if(stay) {
        // 被保留的marker 可能是状态发生变化
        const select = nSelected.find((s) => s.id == stay.id);
        if(select && !oldMarker.selected) {
          // 改变状态
          this.initSelectState(oldMarker.marker, true);
          oldMarker.selected = true;
        }else if(!select && oldMarker.selected) {
        // 从已选列表中移除的 也需要重置
          this.initSelectState(oldMarker.marker, false, oldMarker.id);
          oldMarker.selected = false;
        }
        nextMarkers.push(oldMarker);
      }else {
        // marker被移除了
        oldMarker.marker.setMap(null);
        oldMarker.label.close();
        if(oldMarker.id == this.markerID) {
          this.infoBubble.close();
        }
      }
    });
    const middeleArray = [];
    newMarkers.map((newMarker) => {
      const marker = nextMarkers.find((nextMarker) => nextMarker.id == newMarker.id);
      // 新添加的marker, 添加到地图上
      if(!marker) {

        const select = nSelected.findIndex((s) => s.id == newMarker.id);
        newMarker.selected = select >= 0;

        const { marker, label } = this.addMarkerWithInfoBubble(newMarker);

        newMarker.marker = marker;
        newMarker.label = label;

        middeleArray.push(newMarker);
      }
    });

    this.markers = nextMarkers.concat(middeleArray);

    const seen = new Map()
    const uniqueArr = nSelected.filter((a) => !seen.has(a.id) && seen.set(a.id, 1))

    const path = [];
    uniqueArr.map((s) => {
      path.push(s.position);
    });

    this.lineOnMap.setPath(path);
    this.lineOnMap.setMap(nOrder ? this.map : null);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(isEqual(this.props, nextProps) && isEqual(this.state, nextState));
  }

  loadMap() {
    const { options, getMap } = this.props;
    
    const mapDom = ReactDOM.findDOMNode(this.refs.mjmap);
    this.map = new google.maps.Map(mapDom, assign(this.default.options, options));

    getMap && getMap(this.map);
    
    this.initMap();
    this.initIcon();
    this.initLine();
    this.initMarker();
    this.initMapLens();
  }

  getProjection(projection) {
    this.projection = projection;
  }

  initMap() {
    if(!window.google) {
      return;
    }
    const { posOptions, options } = this.props;
    const newOptions = assign(this.default.options, options);
    if(posOptions) {
      utils.fitMap(this.map, posOptions, this.getProjection)
    } 
  }

  initIcon() {
    this.SB_Icon = {
      url: IMG_SMALL_BLUE,
      // size: new google.maps.Size(12, 22),
      size: new google.maps.Size(17, 29),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(8, 29),
      scaledSize: new google.maps.Size(17, 29),
    };

    this.BB_Icon = {
      url: IMG_BIG_BLUE,
      size: new google.maps.Size(22, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 36),
      scaledSize: new google.maps.Size(22, 36),
    };

    this.BR_Icon = {
      url: IMG_BIG_RED,
      size: new google.maps.Size(22, 36),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(11, 36),
      scaledSize: new google.maps.Size(22, 36),
    };
  }

  initLine() {
    const { lineStyle, order, selected, whole } = this.props;
    if(!!lineStyle) {
      assign(this.default.lineStyle, lineStyle);
    }
    const path = [];
    selected.map((s) => {
      path.push(s.position);
    });

    this.lineOnMap && this.lineOnMap.setMap(null);

    this.lineOnMap = new google.maps.Polyline(this.default.lineStyle);

    this.lineOnMap.setPath(path);

    this.lineOnMap.setMap(order ? this.map : null);
  }

  initMarker() {
    const { selected = [], whole = []} = this.props;
    const newWhole = merge([selected, whole]);

    this.markers.map((mMarker) => {
      mMarker.marker.setMap(null);
      mMarker.label.close();
    });

    this.markers = [];
    this.markerID = null;
    this.hoverState = false;
    // 处理数据

    newWhole && newWhole.map((data) => {
      const { id, first, second, third, img, position, type } = data;
      const idx = selected.findIndex((select) => select.id == id);
      const mData = {
        id,
        img,
        first,
        second,
        third,
        position,
        type,
        selected: idx >= 0,
      };
      const { marker, label } = this.addMarkerWithInfoBubble(mData);

      mData.marker = marker;
      mData.label = label;

      this.markers.push(mData);
    })
    // selected.map((select) => {
    //   if(this.markers.findIndex((m) => m.id == select.id) < 0) {
    //     this.markers.push(select);
    //   }
    // });
  }

  // 重置地图镜头
  initMapLens(allCoords, reset) {
    if(!allCoords || allCoords.length == 0) {
      const { whole } = this.props;
      allCoords = whole.map((marker) => marker.position);
    }
    if(allCoords && allCoords.length > 0) {
      utils.fitMap(this.map, { coords: allCoords }, this.getProjection);
    }else if(!reset) {
      setTimeout(() => this.initMapLens([], true), 50);
    }
  }

  optionClick(data) {
    const { infinite, onSelect, whole, selected } = this.props;
    const { id, marker } = data;
    const selectData = whole.concat(selected).find((m) => m.id == id);
    if(!infinite && !!this.infoBubble && this.infoBubble.isOpen()) {
      if(!data.selected) {
        // 选中
        onSelect && onSelect(selectData.type, selectData, 1);
      }else {
        // 取消
        onSelect && onSelect(selectData.type, selectData, 0);
      }
    }else if(infinite) {
      // 可选重复
      onSelect && onSelect(selectData.type, selectData, 1);
    }
  }

  createContent(data) {
    const { id, first, second, third, img, selected, infinite, type  } = data;
    const content = document.createElement('div');
    let icon;
    if(infinite) {
      icon = ICON_ADD;
    }else if(selected) {
      icon = ICON_SUB;
    }else {
      icon = ICON_ADD;
    }

    const style = this.styleDist(type);

    content.innerHTML = 
    "<img class='map-img' src="+img+" />"
    +"<div class='map-info-wrap'>"
      +"<span class='first-title over-hide "+ style.extraCool +"'>"+first+"</span>"
      +"<span class='second-title over-hide "+ style.extraCooler +"'>"+second+"</span>"
      +"<span class='third-title over-hide "+ style.extraCoolest +"'>"+third+"</span>"  
    +"</div>"
    +"<div class='btn-wrap "+ style.icon +"' id='btn-option'>"
      + icon
    +"</div>";
    content.className = 'gmap-info-bubble-info-wrap';
    const btn = content.getElementsByClassName('btn-wrap')[0];
    btn.onclick = () => this.optionClick(data);
    return content;
  }

  /**
   *type
   * 1: 城市
   * 2: 景点
   * 4: 酒店
   * 8: 饭店
   * 16: 机场
   * 32: 火车站
   * 64: 租车公司
   * 128: 长途汽车站
   * 256: 购物
   * 512: 国家
   * 1024: 省/州
   */

  styleDist(type) {
    const style = {
      extraCool: '',
      extraCooler: '',
      extraCoolest: '',
      icon: '',
    }
    switch(type) {
      case 1:
        break;
      case 2:
        style.extraCoolest = 'poi'
        break;
      case 4:
        break;
      case 8:
        break;
      case 16:
        break;
      case 256:
        style.extraCoolest = 'shop'
        break;
      case 512:
        style.icon = 'noIcon';
        break;
      case 1024:
        style.icon = 'noIcon';
        break;
      // 玩乐
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
        style.extraCoolest = 'play'
        break;
    }
    return style
  }

  createLabel(data) {
    const { first } = data;

    return "<div class='label-title'>"+first+"</div>";
  }

  addMarkerWithInfoBubble(data) {
    const { position, type, id, selected } = data;

    if(!position) {
      console.log('无地理位置 error');
      return;
    }
   
    const content = this.createContent(data);
    
    const labelContent = this.createLabel(data);

    const IB_Small = new InfoBubble({
      maxWidth: 200,
      minHeight: 28,
      maxHeight: 28,
      padding: 0,
      arrowSize: 5,
      borderRadius: 1,
      disableAutoPan: true,
      hideCloseButton: true,
      disableAnimation: true,
      arrowPosition: 50,
      zIndex: NORMAL_Z_INDEX,
      borderWidth: 0,
      arrowStyle: 0,
      shadowStyle: 0,
      backgroundClassName: 'gmap-info-bubble-label-container',
      content: labelContent,
    });

    if(!this.infoBubble) {
      this.infoBubble = new InfoBubble({
        padding: 0,
        maxWidth: 350,
        minWidth: 350,
        maxHeight: 90,
        minHeight: 90,
        arrowSize: 10,
        arrowStyle: 0,
        borderWidth: 0,
        shadowStyle: 0,
        borderRadius: 0,
        hideCloseButton: true,
        disableAutoPan: true,
        zIndex: HIGHER_Z_INDEX,
        disableAnimation: true,
        backgroundClassName: 'gmap-info-bubble-info-container',
        content: content,
      });
      
      this.infoBubble.bubble_.addEventListener('mouseenter', () => {
        this.hoverState = true;
      })

      this.infoBubble.bubble_.addEventListener('mouseleave', () => {
        this.hoverState = false;
        this.leaveTimer = setTimeout(() => {
          if(this.infoBubble.isOpen() && !this.hoverState) {
            this.resetMarker(this.markerID);
            this.infoBubble.close();
          }
        }, DELAY_TIME);
      })
    }

    const marker = new google.maps.Marker({
      position: position,
      map: this.map,
      optimized: false,
      zIndex: NORMAL_Z_INDEX
    })

    this.setIconState(marker, selected);

    marker.label = IB_Small;

    IB_Small.open(this.map, marker);
    this.infoBubble.close();

    marker.addListener('mouseover', (event) => {
      this.hoverState = true;
      clearTimeout(this.outTimer);
      clearTimeout(this.leaveTimer);
      if(this.markerID == id) {
        return;
      }

      if(this.infoBubble.isOpen()) {
        this.resetMarker(this.markerID, true);
        this.infoBubble.close();
      }

      IB_Small.close();
      this.openInfoBubble(content, marker, data);
      this.focusMarker(data, data.selected, id);
      // event.ta.currentTarget.style.opacity="1"
      const { onHover } = this.props;
      onHover && onHover(type, id);
    })

    marker.addListener('mouseout', () => {
      this.hoverState = false;
      this.outTimer = setTimeout(() => {
        this.resetMarker(id);
        if(this.infoBubble.isOpen() && !this.hoverState) {
          this.infoBubble.close();
        }
      }, DELAY_TIME);
    })

    if(type == 512 || type == 1024) {
      marker.addListener('click', () => {
        const { onClick, whole, selected } = this.props;
        // 点击进入新列表页 其他无点击事件
        const selectData = whole.concat(selected).find((m) => m.id == id);
        onClick && onClick(type, selectData);
      });
    }

    return {
      marker,
      label: IB_Small
    };
  }

  initSelectState(marker, select, id) {
    const { infinite } = this.props;

    if(infinite && select) {
      this.setInfiniteSelect(marker, id);
    }else if(select) {
      // 选中
      this.setSelected(marker, id);
    }else {
      // 取消
      this.setUnselected(marker, id);
    }
  }

  setInfiniteSelect(marker) {
    this.setIcon(ICON_ADD);
    marker.setIcon(this.BR_Icon);
  }

  setSelected(marker) {
    this.setIcon(ICON_SUB, true);
    marker.setIcon(this.BR_Icon);
  }

  setUnselected(marker, id) {
    this.setIcon(ICON_ADD);
    marker.setIcon(this.markerID && this.markerID == id ? this.BB_Icon : this.SB_Icon);
  }

  setIcon(icon, grayBG) {
    if(!!this.infoBubble) {
      const content = this.infoBubble.getContent();
      const btn = content.getElementsByClassName('btn-wrap')[0];
      btn.innerHTML = icon;
      if(grayBG) {
        btn.style.backgroundColor = "#595959";
      }else {
        btn.style.backgroundColor = "#0061f3";
      }
    }
  }

  setButtonState(select) {
    const { infinite } = this.props;

    if(infinite && select) {
      this.setIcon(ICON_ADD);
    }else if(select) {
      // 选中
      this.setIcon(ICON_SUB, true);
    }else {
      // 取消
      this.setIcon(ICON_ADD);
    }
  }

  setIconState(marker, select) {

    const { infinite } = this.props;
    if(infinite && select) {
      this.setInfiniteSelect(marker);
    }else if(select) {
      // 选中
      this.setSelected(marker);
    }else {
      // 取消
      this.setUnselected(marker);
    }
  }

  openInfoBubble(content, marker, data) {
    this.infoBubble.setContent(content);
    this.setButtonState(data.selected);
    this.infoBubble.open(this.map, marker);
  }

  startBounce(id) {
    const mMarker = this.markers.find((m) => m.id == id);
    if(!!mMarker) {
      mMarker.marker.setAnimation(google.maps.Animation.BOUNCE);

      this.moveToVisibile(mMarker);
    }
  }

  stopBounce(id) {
    const mMarker = this.markers.find((m) => m.id == id);
    if(!!mMarker) {
      mMarker.marker.setAnimation(null);
    }
  }

  moveToVisibile(mMarker) {
    if(!this.projection) {
      return;
    }
    const anchor = this.projection.fromLatLngToContainerPixel(mMarker.marker.getPosition());
    const markerSize = utils.getValue(['marker', 'icon', 'size'], mMarker);
    const labelWidth = utils.getValue(['label', 'bubble_', 'clientWidth'], mMarker);
    let markerWithLabel_W;
    let markerWithLabel_H;
    if(mMarker.id == this.markerID) {
      // 
      markerWithLabel_W = INFO_BUBBLE_WIDTH;
      markerWithLabel_H = markerSize.height + INFO_BUBBLE_HEIGHT;
    }else {
      markerWithLabel_W =  markerSize.width > labelWidth ? markerSize.width: labelWidth;
      markerWithLabel_H = markerSize.height + LABEL_HEIGHT;
    }
    

    const Y = anchor.y - markerWithLabel_H;
    const X = anchor.x - markerWithLabel_W / 2;
    const mapHeight = this.refs.mjmap.clientHeight;
    const mapWidth = this.refs.mjmap.clientWidth;

    if(X < 0 && Y < 0) {  // 左上
      this.map.panBy(X, Y);
    }else if(X < 0 && Y + markerWithLabel_H < mapHeight && Y > 0) { // 左边
      this.map.panBy(X, 0);
    }else if(X + markerWithLabel_W > mapWidth && Y + markerWithLabel_H < mapHeight && Y > 0) { // 右边
      this.map.panBy(X - mapWidth + markerWithLabel_W, 0);
    }else if(Y + markerWithLabel_H > mapHeight && X + markerWithLabel_W > mapWidth) {  // 右下
      this.map.panBy(X - mapWidth + markerWithLabel_W, Y - mapHeight + markerWithLabel_H);
    }else if(Y + markerWithLabel_H > mapHeight && X > 0 && X + markerWithLabel_W < mapWidth) {  // 下边
      this.map.panBy(0, Y - mapHeight + markerWithLabel_H);
    }else if(X + markerWithLabel_W < mapWidth && Y < 0 && X > 0) { // 上边
      this.map.panBy(0, Y);
    }else if(X < 0 && Y + markerWithLabel_H > mapHeight) { // 左下
      this.map.panBy(X, Y - mapHeight + markerWithLabel_H);
    }else if(X + markerWithLabel_W > mapWidth && Y < 0) { // 右上
      this.map.panBy(X - mapWidth + markerWithLabel_W, Y);
    }
  }

  focusMarker(mMarker, selected, id) {
    if(!selected) {
      // 没有被选中, 变成蓝色大图标(BB_Icon)
      mMarker.marker.setIcon(this.BB_Icon);
    }

    mMarker.marker.setZIndex(HIGHER_Z_INDEX);
    // 记录当前marker id
    this.markerID = id;
    this.moveToVisibile(mMarker);
  }

  resetMarker(id, force) {

    if(this.markerID == id && this.hoverState && !force) {
      return;
    }

    const mMarker = this.markers.find((m) => m.id == id);
    if(!mMarker) {
      return;
    }

    const { marker, label, selected } = mMarker;
    if(!selected) {
      // 没有被选中, 恢复蓝色小图标(SB_Icon)
      marker.setIcon(this.SB_Icon);
    }

    // 被选中/ 无选中的通常处理
    marker.setZIndex(NORMAL_Z_INDEX);
    if(!label.isOpen()) {
      label.open(this.map, marker);
    }
    if(this.markerID == id) {
      this.markerID = null;
    }
  }

  /**
   * 重新读取谷歌服务地图js
   */

  reLoadJS(key) {
    if(this.loadTime >= 3) {
      alert('地图服务器错误');
      return;
    }
    this.loadTime++;
    let _this = this;
    utils.loadJS(key).then(_this.loadMap, () => {
      setTimeout(()=>{
        window.loadPromise = null;
        _this.reLoadJS(key);
      },100);
    });
  }

  render() {
    const { loading } = this.props;
    return (
      <div className='gmap-info-container'>
        <div className='gmap-info-map' ref="mjmap"></div>
      </div>
    )
  }
}

function merge(bigArray) {
  let array = [];
  const middeleArray = bigArray.reduce((a,b) => {
    return a.concat(b);
  });

  middeleArray.forEach((midItem) => {
    if(array.findIndex((arrItem) => midItem.id == arrItem.id) == -1){
      array.push(midItem);
    }
  });
  return array;
}

export default InfoMap;
