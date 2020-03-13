import { Block } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.less'
import Title from './title'

function TitleTostList({titles}) {
  return (
    <Block>
      {
        titles.map((v, index) => {
          return <Title 
            key='index'
            index={index}
            value={v}
            onTitleClick = {v.titleFun}
            isLast={titles.length-1 === index}
          />
        })
      }
    </Block>
  )
}

TitleTostList.defaultProps = {
  titles: []
}

export default Taro.memo(TitleTostList)
