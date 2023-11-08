const textStyles: string[] = [
  'color',
  'fontSize',
  'textAlign',
  'fontWeight',
  'lineHeight',
  'lineBreak',
]

const scalableStyles: string[] = [
  'left',
  'top',
  'right',
  'bottom',
  'width',
  'height',
  'margin',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'borderWidth',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth',
]

const layoutAffectedStyles: string[] = [
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'width',
  'height',
]

export type Style = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
  maxWidth: number
  maxHeight: number
  minWidth: number
  minHeight: number
  margin: number
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number
  padding: number
  paddingLeft: number
  paddingRight: number
  paddingTop: number
  paddingBottom: number
  borderWidth: number
  borderLeftWidth: number
  borderRightWidth: number
  borderTopWidth: number
  borderBottomWidth: number
  flexDirection: 'column' | 'row'
  justifyContent: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
  alignItems: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  alignSelf: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  flex: number
  flexWrap: 'wrap' | 'nowrap'
  position: 'relative' | 'absolute'

  hidden: boolean
  scale: number
}

const getDefaultStyle = () => ({
  left: undefined,
  top: undefined,
  right: undefined,
  bottom: undefined,
  width: undefined,
  height: undefined,
  maxWidth: undefined,
  maxHeight: undefined,
  minWidth: undefined,
  minHeight: undefined,
  margin: undefined,
  marginLeft: undefined,
  marginRight: undefined,
  marginTop: undefined,
  marginBottom: undefined,
  padding: undefined,
  paddingLeft: undefined,
  paddingRight: undefined,
  paddingTop: undefined,
  paddingBottom: undefined,
  borderWidth: undefined,
  flexDirection: undefined,
  justifyContent: undefined,
  alignItems: undefined,
  alignSelf: undefined,
  flex: undefined,
  flexWrap: undefined,
  position: undefined,

  hidden: false,
  scale: 1,
})

export { getDefaultStyle, scalableStyles, textStyles, layoutAffectedStyles }
