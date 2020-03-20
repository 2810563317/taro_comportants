import Taro, { Component } from '@tarojs/taro'
import { View, Text, Block , Picker} from '@tarojs/components'
import './index.less'
import TitleTost from '../titleTost'
import DateDiffer from '../date'
import DatePicker from '../datePicker'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pickVal: null,
    }
  }
  config = {
    navigationBarTitleText: '首页'
  }

  componentDidHide () { }
  onTitleClick (e){
    console.log('titleClick', e)
  }
  pickChange(e){
    console.log(222, e.value)
    this.setState({pickVal: e.value})
  }
  render () {
    const titles = [
      {title: 'titleTost1', titlebg: 'orange'},
      {title: 'titleTost2', titlebg: 'pink'},
      {title: 'titleTost3 可点', titlebg: '#ccc', titleFun: this.onTitleClick}
    ]
    const {pickVal} = this.state
    return (
      <View className='index'>
        {/* <TitleTost titles={titles}/> */}
        <View className='box'>
          <DateDiffer />
        </View>
        <DatePicker
          // format='YYYY-MM-DD hh:mm'
          bartitle = '日期选择'
          rangerDate = {true}
          // barCancelColor = 'red'
          // barConfirmColor = 'red'
          format='YYYY-MM-DD'
          // format='YYYY-MM hh:mm'
          // format='YYYY'
          // format='MM'
          // format='hh:mm'
          onChange={this.pickChange.bind(this)}
          value={pickVal}
          renderHtml={
            <View className='custorm_date'>{pickVal ? pickVal : 'picker'}</View>
          }
        />
        <Picker>
          time
        </Picker>
      </View>
    )
  }
}