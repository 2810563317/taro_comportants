import Taro, { Component, useCallback, useEffect, useState } from '@tarojs/taro'
import { View, Text, Block ,Picker} from '@tarojs/components'
import './index.less'
function DateDiffer() {
  const [dateStart, setDateStart] = useState('2015-09-01');
  const [dateEnd, setDateEnd] = useState('2020-03-13');
  const [dateDiff, setDateDiff] = useState(0);
  useEffect(() => {
    const datediff = datedifference(dateStart, dateEnd)
    setDateDiff(datediff)
  }, [dateStart, dateEnd])
  function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
    let dateSpan,iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
  }
  const DateStartChange = useCallback(e => {
    setDateStart(e.detail.value)
  }, [])
  const DateEndChange = useCallback(e => {
    setDateEnd(e.detail.value)
  }, [])
  return (
    <View>
      <Text>出生时间</Text>
      <View className='time_content'>
        <Picker mode="date" value={dateStart} start="2015-09-01" end="2020-03-13" onChange={DateStartChange}>
          <Text className='time'>{dateStart}</Text>
        </Picker>
        <Text>至</Text>
        <Picker mode="date" value={dateEnd} start="2015-09-01" end="2020-03-13" onChange={DateEndChange}>
          <Text className='time'>{dateEnd}</Text>
        </Picker>
      </View>
      <Text>时间差：{dateDiff}</Text>
    </View>
  )
}
export default Taro.memo(DateDiffer)