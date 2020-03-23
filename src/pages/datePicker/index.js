import { View, PickerView, PickerViewColumn, Block } from '@tarojs/components';
import Taro, { useCallback, useEffect, useState } from '@tarojs/taro';
import './index.less'
/**
 * format: 日期格式 ’YYYY-MM-DD hh:mm‘
 * bartitle: 面板title
 * rangerDate: 是否为范围选择
 * barCancelColor： 取消按钮颜色
 * barConfirmColor： 确认按钮和范围选中颜色
 * renderHtml: 选择器包裹的内容
 * value: 传入值
 * onChange: 返回方法
*/
const BADECOLOC = '#4A90E2'
const BORDERCOLOR = '#f2f2f2'
function DatePicker(props) {
    const [showPicker, setShowPicker] = useState(true);
    const TODAY = new Date()
    const todayDatas = {
      todayY: `${TODAY.getFullYear()}`,
      todayM: `${('0' + (TODAY.getMonth() + 1)).slice(-2)}`,
      todayD:`${('0' + (TODAY.getDate())).slice(-2)}`,
      todayH: `${('0' + (TODAY.getHours())).slice(-2)}`,
      todayMi: `${('0' + (TODAY.getMinutes())).slice(-2)}`,
    }
    const [format, setFormat] = useState({})
    const [list, setList] = useState({})
    const [year, setyear] = useState([])
    const [month, setmonth] = useState([])
    const [days, setdays] = useState(() => [])
    const [hours, sethours] = useState(() => [])
    const [minutes, setminutes] = useState([])
    const [pickerValue, setPickerValue] = useState({})
    const [rangeList, setRangeList] = useState([])
    const [rangeSelect, setRangeSelect] = useState(0)
    const [prevPicker, setPrevPicker] = useState([])

    useEffect(() => {
      showPicker ? setList(getBaseList()) : {}
      showPicker ? setFormat(getFormat()) : {}
    }, [showPicker])
    useEffect(() => {
      Object.keys(list).length ? setyear(list.yearList) : []
    }, [list])
    useEffect(() => {
      year.length ? setmonth(list.monthList) : []
    }, [year])
    useEffect(() => {
      month.length ? setdays(list.daysList) : []
    }, [month])
    useEffect(() => {
      days.length ? sethours(list.hoursList) : []
    }, [days])
    useEffect(() => {
      hours.length ? setminutes(list.minutesList) : []
    }, [hours])
    useEffect(() => {
      minutes.length ? setPickerValue(valueMapFormat(showPropsValue())) : []
      minutes.length && props.rangerDate && props.value && props.value.length ? setRangeList(props.value) : null
    }, [minutes])
    
    useEffect(() => {
      if(props.rangerDate && minutes.length){
        const list = rangeList
        rangeSelect === 0 ? list[0] = formatValue() : list[1] = formatValue()
        list.length === 1 ? list[1] = formatValue() : null
        compareDate(list) ? setPickerValue(prevPicker) : setRangeList(list)
      }
    }, [pickerValue])

    // 判断起始时间是否大于结束时间
    function compareDate (list) {
      return new Date(list[0].replace(/-/g,"\/")) > new Date(list[1].replace(/-/g,"\/"))
    }

    const returnPickVal = useCallback(() => {
      setShowPicker(false)
      props.onChange({value: props.rangerDate ? rangeList : formatValue()})
    }, [pickerValue])

    const pickerChange = useCallback(e => {
      const val = e.detail.value
      setPrevPicker(pickerValue)
      setPickerValue(val)
      const currentDateNum = new Date(year[val[0]], month[val[1]], 0).getDate()
      setdays(getList(1, currentDateNum))
    }, [pickerValue])

    function formatValue(){
      let data3 = []
      const dataList = pickerMapValue()
      dataList.data1.length && data3.push(dataList.data1.join('-'))
      dataList.data2.length && data3.push(dataList.data2.join(':'))
      return data3.join(' ')
    }
    function onShowPick(){
      setRangeSelect(0)
      setShowPicker(true)
    }

    function onHiddenPick(){
      setShowPicker(false)
      setRangeList([])
    }

    function getFormat(){
      return showPicker ? {
        isYear: isInclude('YYYY'),
        isMonth: isInclude('MM'),
        isDays: isInclude('DD'),
        isHours: isInclude('hh'),
        isMinutes: isInclude('mm'),
      } : {}
    }
    function isInclude(cur){
      return props.format && props.format.indexOf(cur) > -1
    }
    /**
     * 获取基础数据
    */
    function getBaseList(){
      const currentYear = TODAY.getFullYear()
      const currentDateNum = new Date(currentYear, `${('0' + (TODAY.getMonth() + 1)).slice(-2)}`, 0).getDate()
      return {
        yearList: getList(currentYear - 50, currentYear + 49, false),
        monthList: getList(1, 12),
        daysList: getList(1, currentDateNum),
        hoursList: getList(0, 23),
        minutesList: getList(0, 59),
      }
    }

    function getList(min, max, addZero = true){
      const list = []
      for(let i = min; i < (max+1); i++){
        addZero ? list.push(`${('0' + i).slice(-2)}`) : list.push(String(i))
      }
      return list
    }
    /**
     * 根据传入的数据匹配picker下标
    */
    function showPropsValue () {
      if (props.value === null || props.value === ''){
        return [year.indexOf(todayDatas.todayY), month.indexOf(todayDatas.todayM), days.indexOf(todayDatas.todayD), hours.indexOf(todayDatas.todayH), minutes.indexOf(todayDatas.todayMi)]
      } else {
        return props.rangerDate ? valueToPicker(props.value[0]) : valueToPicker(props.value)
      }
    }
    function valueToPicker(val) {
      const splitList = valueFill(val)
      const split2 = splitList.split2
      const split3 = splitList.split3
      return [year.indexOf(split2[0]), month.indexOf(split2[1]), days.indexOf(split2[2]), hours.indexOf(split3[0]), minutes.indexOf(split3[1])]
    }
    /**
     * 将传入的数据补至最齐全状态
    */
    function valueFill(val){
      const split1 = val.split(" ")
      const datas = {
        Y:todayDatas.todayY,
        M:todayDatas.todayM,
        D:todayDatas.todayD,
        H:todayDatas.todayH,
        Mi:todayDatas.todayMi
      }
      let returnSplit = {}
      if(split1.length === 2) {
        returnSplit = HMFill(split1[1].split(":"), YMHFill(split1[0].split("-"), datas))
      }else if(format.isHours || format.isMinutes) {
        returnSplit = HMFill(split1[0].split(":"), datas)
      } else {
        returnSplit = YMHFill(split1[0].split("-"), datas)
      }
      return {
        split2: [returnSplit.Y, returnSplit.M, returnSplit.D],
        split3: [returnSplit.H, returnSplit.Mi]
      }

    }
    function HMFill(split, datas) {
      if(split.length === 2) {
        datas.H = split[0]
        datas.Mi = split[1]
      } else {
        format.isHours ? datas.H = split[0] : datas.Mi = split[0]
      }
      return datas
    }
    function YMHFill(split3, datas) {
      if(split3.length === 3) {
        datas.Y = split3[0]
        datas.M = split3[1]
        datas.D = split3[2]
      } else if(split3.length === 2){
        if(format.isYear){
          datas.Y = split3[0]
          datas.M = split3[1]
        } else {
          datas.M = split3[0]
          datas.D = split3[1]
        }
      } else {
        format.isYear ? datas.Y = split3[0] : (format.isMonth ? datas.M = split3[0] : datas.D = split3[0])
      }
      return datas
    }
    /**
     * 返回数据是按格式匹配
    */
    function pickerMapValue(){
      const split1 = props.format.split(" ")
      let data1 = [], data2 = []
      if(split1.length === 2) {
        data1=YMHMap(split1[0].split("-"))
        data2=HMMap(split1[1].split(":"), data1.length)
      }else if(format.isHours || format.isMinutes) {
        data2=HMMap(split1[0].split(":"), 0)
      } else {
        data1=YMHMap(split1[0].split("-"))
      }
      return {data1, data2}
    }
    function HMMap(split, length) {
      let data1 = []
      if(split.length === 2) {
        data1.push(hours[pickerValue[0 + length]])
        data1.push(minutes[pickerValue[1 + length]])
      } else {
        format.isHours ? data1.push(hours[pickerValue[0 + length]]) : data1.push(minutes[pickerValue[0+ length]])
      }
      return data1
    }
    function YMHMap(split3) {
      let data1 = []
      if(split3.length === 3) {
        data1.push(year[pickerValue[0]])
        data1.push(month[pickerValue[1]])
        data1.push(days[pickerValue[2]])
      } else if(split3.length === 2){
        if(format.isYear){
          data1.push(year[pickerValue[0]])
          data1.push(month[pickerValue[1]])
        } else {
          data1.push(month[pickerValue[0]])
          data1.push(days[pickerValue[1]])
        }
      } else {
        format.isYear ? data1.push(year[pickerValue[0]]) : (format.isMonth ? data1.push(month[pickerValue[0]]) : data1.push(days[pickerValue[0]]))
      }
      return data1
    }
    /**
     * 将最全的pickList匹配format
    */
    function valueMapFormat(pickList){
      let newPickList = []
      pickList.length && pickList.map((v, i) => {
        if (format.isYear && i === 0 )
          newPickList.push(v)
        else if(format.isMonth && i === 1 )
          newPickList.push(v)
        else if(format.isDays && i === 2 )
          newPickList.push(v)
        else if(format.isHours && i === 3 )
          newPickList.push(v)
        else if(format.isMinutes && i === 4 )
          newPickList.push(v)
      })
      return newPickList
    }
    function rangeClick(rangeNum){
      setRangeSelect(rangeNum)
      setPickerValue(valueMapFormat(valueToPicker(rangeList[rangeNum])))
    }
    return (
      <Block>
        <View className='custormPicker'>
          <View className='picker_html' onClick={onShowPick}>{this.props.renderHtml}</View>
          {
            showPicker && minutes.length ? <View className='picker_msk' onClick={onHiddenPick} onTouchMove={e => {e.stopPropagation()}}>
              <View className='picker_content' onClick={e => {e.stopPropagation()}}>
                <View className='picker_bar'>
                  <Text style={{color: props.barCancelColor ? props.barCancelColor : BADECOLOC}} onClick={onHiddenPick}>取消</Text>
                  <view>{props.bartitle}</view>
                  <Text style={{color: props.barConfirmColor ? props.barConfirmColor : BADECOLOC}} onClick={returnPickVal}>确定</Text>
                </View>
                {
                  props.rangerDate ? <View className='picker_range_wrap'>
                  <View className='picker_range_time' onClick={() => rangeClick(0)} style={{color: rangeSelect === 0 ? props.barConfirmColor || BADECOLOC : '#000', borderColor: rangeSelect === 0 ? props.barConfirmColor || BADECOLOC : BORDERCOLOR}}>{rangeList[0]}</View>
                  <Text>至</Text>
                  <View className='picker_range_time' onClick={() => rangeClick(1)} style={{color: rangeSelect === 1 ? props.barConfirmColor || BADECOLOC : '#000', borderColor: rangeSelect === 1 ? props.barConfirmColor || BADECOLOC : BORDERCOLOR}}>{rangeList[1]}</View>
                </View> : null
                }
                
                <PickerView indicatorStyle='height: 42px;' className='pickview' value={pickerValue} onChange={pickerChange}>
                  {
                    format.isYear ? <PickerViewColumn>
                    {
                      year.map((v, i) => {
                        return <View key='v' className='pickcolum'>{v}年</View>
                      })
                    }
                  </PickerViewColumn> : null
                  }
                  {
                    format.isMonth ? <PickerViewColumn>
                    {
                      month.map((v, i) => {
                        return <View key='v' className='ßpickcolum'>{v}月</View>
                      })
                    }
                  </PickerViewColumn> : null
                  }
                  {
                    format.isDays ? <PickerViewColumn>
                    {
                      days.map((v, i) => {
                        return <View key='v' className='pickcolum'>{v}日</View>
                      })
                    }
                  </PickerViewColumn> : null
                  }
                  {
                    format.isHours ? <PickerViewColumn>
                    {
                      hours.map((v, i) => {
                        return <View key='v' className='pickcolum'>{v}时</View>
                      })
                    }
                  </PickerViewColumn> : null
                  }
                  {
                    format.isMinutes ? <PickerViewColumn>
                    {
                      minutes.map((v, i) => {
                        return <View key='v' className='pickcolum'>{v}分</View>
                      })
                    }
                  </PickerViewColumn> : null
                  }
                </PickerView>
              </View>
            </View> : null
          }
        </View>
      </Block>
    )
  }
  DatePicker.defaultProps = {
    value: '',
    format: 'YYYY-MM-DD',
    bartitle: '',
    rangerDate: false,
    onChange: () => {}
  }
  export default Taro.memo(DatePicker)
