//=============================================================================
// Kpp_ItemDropRate.js
//=============================================================================
// Copyright (c) 2016 カッピ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//
// ウェブサイト
// http://birdwind.webcrow.jp/
//
// Twitter
// https://twitter.com/kappi_bw

/*:ja
 * @plugindesc エネミーのアイテムドロップ率を百分率(％表記)に変更します。
 * @author カッピ
 * 
 * @help
 * エネミーの「ドロップアイテム」の「出現率」を百分率で指定します。
 * 「1 / 30」の場合、30%の確率でドロップします。
 *  (左側の 1 は無視されます)
 * 
 */

(function(){

    Game_Enemy.prototype.makeDropItems = function() {
        return this.enemy().dropItems.reduce(function(r, di) {
            //if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) { // OLD
            if (di.kind > 0 && Math.random() <= di.denominator / 100 * this.dropItemRate()) { // NEW
                return r.concat(this.itemObject(di.kind, di.dataId));
            } else {
                return r;
            }
        }.bind(this), []);
    };

}());