
/**
 * 行の状態
 */

// 説明
//                 // -> データベース保存時動作 -> 遷移ステータス
var ROW_STATES = {

  // 変更なし
  UNCHANGED : 0,   // -> なにもしない

  // 追加予定
  ADDED     : 1,   // -> 追加 -> UNCHANGED

  // 変更予定
  MODIFIED  : 2,   // -> 更新 -> UNCHANGED

  // 削除予定
  DELETED   : 3,   // -> 削除 -> DETACHED

  // 削除済み
  DETACHED  : 4,   // -> なにもしない

  // 更新中
  SAVING    : 5    // -> なにもしない
};


module.exports = exports = ROW_STATES;
