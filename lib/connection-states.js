/**
 * 接続状態
 */

var CONNECTION_STATES = {

  // 接続準備中
  OPNNING : 0,

  // 接続中
  OPENED  : 1,

  // 切断準備中
  CLOSING : 2,

  // 切断中
  CLOSED  : 3,

  // 壊れている
  BROKEN  : 4
};


module.exports = exports = CONNECTION_STATES;