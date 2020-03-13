import { View } from '@tarojs/components';
import Taro, { useCallback, useEffect, useState } from '@tarojs/taro';
import './index.less'
function Title({index, value, isLast}) {
    const [animationData, setAnimationData] = useState({});
    const durationTime = 1000
    const delayTime = 2000
    useEffect(() => {
      const firstDelayTime = index * (durationTime + delayTime + durationTime)
      let animation = Taro.createAnimation({
        duration: durationTime,
        timingFunction: 'ease',
      })
      animation.height('40rpx').step({delay: firstDelayTime})
      !isLast && animation.height(0).step({delay: delayTime})
      setAnimationData(animation)
    }, [])
    const onClick = useCallback(res => {
        this.props.onTitleClick(res)
      }, [])
    return (
      <View
        animation={animationData}
        className='title'
        style={{backgroundColor: value.titlebg}}
        onClick = {() => onClick(index)}
        >
        {value.title}
      </View>
    )
  }
  Title.defaultProps = {
    index: 0,
    value: {},
    isLast: false,
    onTitleClick: function(){}
  }
  export default Taro.memo(Title)