
/**
 * 行の状態
 */

// 説明
//                 // データベース保存時動作
var ROW_STATES = {

  // 変更なし
  UNCHANGED   : 0, // なにもしない

  // 追加予定
  ADDED       : 1, // 追加

  // 変更予定
  MODIFIED    : 2, // 更新

  // 削除予定
  DELETED     : 3, // 削除

  // 削除済み
  DETACHED    : 4, // なにもしない

  // 更新中
  SAVING      : 5, // なにもしない

  // 更新成功
  SAVE_SUCCESS: 6, // なにもしない

  // 更新失敗
  SAVE_FAILURE: 7  // なにもしない
};


module.exports = exports = ROW_STATES;
