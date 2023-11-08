import computeLayout from './css-layout'
import { getDefaultStyle, scalableStyles, layoutAffectedStyles } from './style'

type LayoutData = {
  left: number
  top: number
  width: number
  height: number
}

type LayoutNode = {
  id: number
  style: Object
  children: LayoutNode[]
  layout?: LayoutData
}

let uuid = 0

class Element {
  public static uuid(): number {
    return uuid++
  }

  public parent: Element | null = null
  public id: number = Element.uuid()
  public style: { [key: string]: any } = {}
  public computedStyle: { [key: string]: any } = {}
  public lastComputedStyle: { [key: string]: any } = {}
  public children: { [key: string]: Element } = {}
  public layoutBox: LayoutData = { left: 0, top: 0, width: 0, height: 0 }

  constructor(style: { [key: string]: any } = {}) {
    // 拷贝一份，防止被外部逻辑修改
    style = Object.assign(getDefaultStyle(), style)
    this.computedStyle = Object.assign(getDefaultStyle(), style)
    this.lastComputedStyle = Object.assign(getDefaultStyle(), style)

    Object.keys(style).forEach(key => {
      Object.defineProperty(this.style, key, {
        configurable: true,
        enumerable: true,
        get: () => style[key],
        set: (value: any) => {
          if (value === style[key] || value === undefined) {
            return
          }

          this.lastComputedStyle = this.computedStyle[key]
          style[key] = value
          this.computedStyle[key] = value

          // 如果设置的是一个可缩放的属性, 计算自己
          if (scalableStyles.includes(key) && this.style.scale) {
            this.computedStyle[key] = value * this.style.scale
          }

          // 如果设置的是 scale, 则把所有可缩放的属性计算
          if (key === 'scale') {
            scalableStyles.forEach(prop => {
              if (style[prop]) {
                this.computedStyle[prop] = style[prop] * value
              }
            })
          }

          if (key === 'hidden') {
            if (value) {
              layoutAffectedStyles.forEach((key: string) => {
                this.computedStyle[key] = 0
              })
            } else {
              layoutAffectedStyles.forEach((key: string) => {
                this.computedStyle[key] = this.lastComputedStyle[key]
              })
            }
          }
        },
      })
    })

    if (this.style.scale) {
      scalableStyles.forEach((key: string) => {
        if (this.style[key]) {
          const computedValue = this.style[key] * this.style.scale
          this.computedStyle[key] = computedValue
        }
      })
    }

    if (style.hidden) {
      layoutAffectedStyles.forEach((key: string) => {
        this.computedStyle[key] = 0
      })
    }
  }

  getAbsolutePosition(element: Element) {
    if (!element) {
      return this.getAbsolutePosition(this)
    }

    if (!element.parent) {
      return {
        left: 0,
        top: 0,
      }
    }

    const { left, top } = this.getAbsolutePosition(element.parent)

    return {
      left: left + element.layoutBox.left,
      top: top + element.layoutBox.top,
    }
  }

  public add(element: Element) {
    element.parent = this
    this.children[element.id] = element
  }

  public remove(element?: Element) {
    // 删除自己
    if (!element) {
      Object.keys(this.children).forEach(id => {
        const child = this.children[id]
        child.remove()
        delete this.children[id]
      })
    } else if (this.children[element.id]) {
      // 是自己的子节点才删除
      element.remove()
      delete this.children[element.id]
    }
  }

  public getNodeTree(): LayoutNode {
    return {
      id: this.id,
      style: this.computedStyle,
      children: Object.keys(this.children).map((id: string) => {
        const child = this.children[id]
        return child.getNodeTree()
      }),
    }
  }

  public applyLayout(layoutNode: LayoutNode) {
    ;['left', 'top', 'width', 'height'].forEach((key: string) => {
      if (layoutNode.layout && typeof layoutNode.layout[key] === 'number') {
        this.layoutBox[key] = layoutNode.layout[key]
        if (this.parent && (key === 'left' || key === 'top')) {
          this.layoutBox[key] += this.parent.layoutBox[key]
        }
      }
    })

    layoutNode.children.forEach((child: LayoutNode) => {
      this.children[child.id].applyLayout(child)
    })
  }

  layout() {
    const nodeTree = this.getNodeTree()
    computeLayout(nodeTree)
    this.applyLayout(nodeTree)
  }
}

export default Element
