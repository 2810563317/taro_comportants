import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block } from '@tarojs/components'
import './index.less'
import TitleTost from '../titleTost'
import DateDiffer from '../date'

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  
  componentWillMount () {}

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }
  onTitleClick (e){
    console.log('titleClick', e)
  }
  render () {
    const titles = [
      {title: 'titleTost1', titlebg: 'orange'},
      {title: 'titleTost2', titlebg: 'pink'},
      {title: 'titleTost3 可点', titlebg: '#ccc', titleFun: this.onTitleClick}
    ]
    return (
      <View className='index'>
        <TitleTost titles={titles}/>
        <View className='box'>
          <DateDiffer />
        </View>
      </View>
    )
  }
}
