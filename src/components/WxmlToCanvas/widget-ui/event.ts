import _EventEmitter from 'eventemitter3'
const emitter = new _EventEmitter()
export default class EventEmitter {
  public emit(event: string, data?: any) {
    emitter.emit(event, data)
  }

  public on(event: string, callback) {
    emitter.on(event, callback)
  }

  public off(event: string, callback) {
    emitter.off(event, callback)
  }
}
