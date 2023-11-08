# Taro Wxml to Canvas

wxml-to-canvas for Taro，小程序内通过静态模板和样式绘制 canvas，导出图片，可用于生成分享图等场景。

> https://github.com/wechat-miniprogram/wxml-to-canvas

## 使用

> 实例代码不可运行，作为与 wxml-to-canvas 比较

```tsx
import WxmlToCanvas from 'taro-wxml-to-canvas'

export default class Poster extends Component<Props, State> {
  private canvasRef: RefObject<WXMLToCanvas>
  private canvasWidth = Taro.getSystemInfoSync().windowWidth || 375
  private canvasHeight = Taro.getSystemInfoSync().windowHeight || 600

  constructor(props) {
    super(props)
    this.state = {}
    this.canvasRef = createRef()
  }

  componentDidMount() {
    this.renderToCanvas()
  }

  getWxml() {
    const { bg, imgUrl } = this.props
    const wxml = `
    <view class="poster-share">
      <view class="poster-wrap">
        <image class="poster-bg" src="${bg}"></image>
        <image class="poster-code" src="${imgUrl}"></image>
      </view>
    </view>
    `
    return wxml
  }

  renderToCanvas = async () => {
    const wxml = this.getWxml()
    const style = {
      posterShare: {},
      posterWrap: {},
      posterBg: {},
      posterCode: {},
    }
    try {
      const res = await this.canvasRef.current.renderToCanvas({ wxml, style })
      console.log('render done', res)
    } catch (err) {
      console.log('canvas err', err)
    }
  }

  renderToCanvas = () => {
    const setTempFile = this.canvasRef.current.canvasToTempFilePath()
    setTempFile
      .then(res => {
        console.log(res.tempFilePath)
      })
      .catch(() => {
        console.log('oops... something error')
      })
  }

  render() {
    return (
      <View>
        <View className="wxml-wrap">
          <WxmlToCanvas
            ref={this.canvasRef}
            width={this.canvasWidth}
            height={this.canvasHeight}
          ></WxmlToCanvas>
        </View>

        <View className="save-btn" onClick={this.renderToCanvas}>
          保存图片
        </View>
      </View>
    )
  }
}
```

## 组件API

同 [wxml-to-canvas](https://github.com/wechat-miniprogram/wxml-to-canvas#%E6%8E%A5%E5%8F%A3)
