
var CONNECTION_STATES = require('./connection-states');

/**
 * コマンド開始
 * コマンドが実行される前に必ず呼びだす関数
 * 
 * コマンドを実行できる状態になった場合は、activeCallbackが呼ばれます
 * 実行できない場合は、callbackが呼び出されます
 * @method start
 * @param  {Function} callback       結果を返すコールバック関数
 * @param  {Function} activeCallback 実際のコマンドの処理
 */
function start (callback, activeCallback) {
  this.activeCount++;
  openConnection(this, callback, activeCallback);
}

/**
 * 接続を開始します
 *
 * 切断中の場合にのみ処理されます 
 * すでに接続中の場合は特に処理は行いません
 * 接続準備中や切断準備中の場合は、一定時間後にもう一度この関数を実行します
 * 
 * @method openConnection
 * @param  {Driver}       driver
 * @param  {Function}     callback       結果を返すコールバック関数
 * @param  {Function}     activeCallback 実際のコマンドの処理
 */
function openConnection(driver, callback, activeCallback) {
  switch(driver.connectionState){

  case CONNECTION_STATES.OPENNING:
    setTimeout(function () {
      openConnection(driver, callback, activeCallback);
    }, driver.retryTime);
    break;

  case CONNECTION_STATES.OPENED:
    activeCallback();
    break;

  case CONNECTION_STATES.CLOSING:
    setTimeout(function () {
      openConnection(driver, callback, activeCallback);
    }, driver.retryTime);
    break;

  case CONNECTION_STATES.CLOSED:
    driver.connectionState = CONNECTION_STATES.OPENNING;
    driver.open()(function(err, opened){
      if (opened) {
        driver.connectionState = CONNECTION_STATES.OPENED;
        driver._openFailureCount = 0;
        driver.emit('open');
      } else {
        driver.connectionState = CONNECTION_STATES.CLOSED;
        driver._openFailureCount++;
        if (driver.retryMax < driver._openFailureCount) {
          driver.connectionState = CONNECTION_STATES.BROKEN;
          driver.emit('broken');
        }
      }
      if (err) {
        callback(err, null);
      } else {
        activeCallback();
      }
    });
    break;

  case CONNECTION_STATES.BROKEN:
    callback(new Error('接続が壊れています'), null);
    break;
  }
}

/** 
 * コマンド終了
 * コマンドが終了した時に必ず呼び出す関数
 * 
 * 接続を解除します
 * 結果が例外かどうかを自動的に判別します
 * @method end
 * @param  {Function}    callback   結果を返すコールバック関数
 * @param  {Error|Mixed} result     結果もしくは例外
 * @param  {String}      eventName  発行するイベント名
 * @param  {Mixed}       eventValue イベントの値
 */
function end (callback, result, eventName, eventValue) {
  var self = this;
  self.activeCount--;

  // 実行中のメソッドがない場合は一定時間様子をみて接続を解除
  if (self.activeCount < 1) {
    setTimeout(function(){
      if (self.activeCount < 1){
        closeConnection(self);
      }
    }, self.keepTime);
  }

  if (result instanceof Error) {
    callback(result, null);
  } else {
    callback(null, result);
    if (eventName) {
      self.emit(eventName, eventValue === undefined ? null : eventValue);
    }
  }
}

/**
 * 接続を切ります
 *
 * 接続中のときのみ実行されます
 * そのほかの状態では処理しません
 * 
 * @method closeConnection
 * @param  {Driver}        driver
 */
function closeConnection(driver) {
  switch(driver.connectionState) {

  case CONNECTION_STATES.OPENNING:
    break;

  case CONNECTION_STATES.OPENED:
    driver.connectionState = CONNECTION_STATES.CLOSING;
    driver.close()(function(err, closed){
      if (closed) {
        driver.connectionState = CONNECTION_STATES.CLOSED;
        driver.emit('close');
      } else {
        driver.connectionState = CONNECTION_STATES.OPENED;
      }
    });
    break;

  case CONNECTION_STATES.CLOSING:
  case CONNECTION_STATES.CLOSED:
  case CONNECTION_STATES.BROKEN:
    break;
  }
}


module.exports = exports = {
  start: start,
  end: end
};


