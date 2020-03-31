import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Skeleton from 'taro-skeleton'

import './index.less'

class ShowSkeleton extends Taro.Component {
  state = {
    loading: true,
    dataList: Array.from({length: 20}, (v,i) => {
      return Math.round(Math.random()*3)+1
    })
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ loading: false })
    }, 500)
  }
  render() {
    const {dataList, loading} = this.state
    return <View className='skeleton_wrap'>
      {
        dataList.map((v, i) => {
        return <View className='item_wrap' key={i}>
          {
            loading ? <View className='item'></View> : <Image mode='aspectFit' className='item' src={`../../asset/0${v}.jpg`} />
          }
        </View>
        })
      }
    </View>
  }
}

export default ShowSkeleton
