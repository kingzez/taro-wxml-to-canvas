import React, { Component } from 'react'
import Taro, { CanvasContext } from '@tarojs/taro'
import { Canvas } from '@tarojs/components'
import xmlParse from './xml-parser'
import Widget from './widget'
import Draw from './draw'
import { compareVersion } from './utils'

const canvasId = 'weui-canvas'

type Props = {
  width: number
  height: number
}

type State = {
  use2dCanvas: boolean
}

type CopyArgsType = {
  x: number
  y: number
  width: number
  height: number
  destWidth: number
  destHeight: number
  canvasId?: string
  fileType: 'jpg' | 'png'
  quality: number
  success: (res: any) => void
  fail: (res: any) => void
  canvas?: Taro.Canvas | undefined
}

export default class WXMLToCanvas extends Component<Props, State> {
  ctx: CanvasContext | undefined
  canvas: Taro.Canvas | undefined
  dpr: number
  boundary: {
    top: number
    left: number
    width: number
    height: number
  }
  constructor(props) {
    super(props)
    this.state = {
      use2dCanvas: false, // 2.9.2 后可用canvas 2d 接口
    }
  }

  componentDidMount() {
    const { SDKVersion, pixelRatio: dpr } = Taro.getSystemInfoSync()
    const use2dCanvas = compareVersion(SDKVersion, '2.9.2') >= 0
    this.dpr = dpr
    this.setState({ use2dCanvas }, () => {
      if (use2dCanvas) {
        const query = Taro.createSelectorQuery()
        query
          .select(`#${canvasId}`)
          .fields({ node: true, size: true })
          .exec(
            (res: { node: Taro.Canvas; width: number; height: number }[]) => {
              const canvas = res[0].node
              const ctx = canvas.getContext('2d') as CanvasContext
              canvas.width = res[0].width * dpr
              canvas.height = res[0].height * dpr
              ctx.scale(dpr, dpr)
              this.ctx = ctx
              this.canvas = canvas
            }
          )
      } else {
        this.ctx = Taro.createCanvasContext(canvasId, this)
      }
    })
  }

  async renderToCanvas(args: { wxml: string; style: string }) {
    const { wxml, style } = args
    const ctx = this.ctx
    const canvas = this.canvas
    const { use2dCanvas } = this.state

    if (use2dCanvas && !canvas) {
      return Promise.reject(
        new Error('renderToCanvas: fail canvas has not been created')
      )
    }

    ctx?.clearRect(0, 0, this.props.width, this.props.height)
    const { root: xom } = xmlParse(wxml)

    const widget = new Widget(xom, style)
    const container = widget.init()
    this.boundary = {
      top: container.layoutBox.top,
      left: container.layoutBox.left,
      width: container.computedStyle.width,
      height: container.computedStyle.height,
    }
    const draw = new Draw(ctx, canvas, use2dCanvas)
    await draw.drawNode(container)

    if (!use2dCanvas) {
      await this.canvasDraw(ctx)
    }
    return Promise.resolve(container)
  }

  canvasDraw(ctx, reserve = false) {
    return new Promise(resolve => {
      ctx.draw(reserve, () => {
        resolve(true)
      })
    })
  }

  canvasToTempFilePath(
    args: { fileType?: 'jpg' | 'png'; quality?: number } = {}
  ) {
    const { use2dCanvas } = this.state
    return new Promise((resolve, reject) => {
      const { top, left, width, height } = this.boundary

      const copyArgs: CopyArgsType = {
        x: left,
        y: top,
        width,
        height,
        destWidth: width * this.dpr,
        destHeight: height * this.dpr,
        canvasId,
        fileType: args.fileType || 'png',
        quality: args.quality || 1,
        success: resolve,
        fail: reject,
      }

      if (use2dCanvas) {
        delete copyArgs.canvasId
        copyArgs.canvas = this.canvas
      }
      return Taro.canvasToTempFilePath(copyArgs, this)
    })
  }

  render() {
    const { width, height } = this.props
    const { use2dCanvas } = this.state

    return use2dCanvas ? (
      <Canvas
        id={canvasId}
        type="2d"
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    ) : (
      <Canvas
        canvas-id={canvasId}
        style={{ width: `${width}px`, height: `${height}px` }}
      />
    )
  }
}
