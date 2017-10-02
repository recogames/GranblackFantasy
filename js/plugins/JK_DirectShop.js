//=============================================================================
// JK_DirectShop.js
//=============================================================================

/*:
* @plugindesc allows for direct buy OR direct sell of items at a shop.
* @author Pirobi
* *
* @help
* Version 1.4
*
:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=
Plugin Commands
:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=

DirectBuy
- This will make the NEXT shop command called a purchaseOnly shop.

DirectSell
- This will make the NEXT shop command called a sellOnly shop.

If using the plugins, they must be called each time BEFORE the shop 
processing is called because the shop will "reset" after 
the processing ends.

:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=
Instructions for Use
:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:= 
There are essentially 4 ways to call shops when using this plugin:

1) Call the shop normally.
-Use the ShopProcessing command just like always.
-Will work like the default shop.
2) Check purchase only on the ShopProcessing
-Will Skip the buy/sell window and go right into purchasing
3) Add PluginCommand "DirectBuy" before the shop processing command
-Will do the same as 2). 
-The box for "Purchase Only" does NOT need to be ticked in order for 
the plugin command to run.
4) Add PluginCommand "DirectSell" before the shop processing command
-Will skip the buy/sell window and go right into selling
-IF "PurchaseOnly" is checked in the shop processing command, then
the shop will act like the DEFAULT shop.

:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=
Updates
:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=:=
-v1.4
Minor fixes. If both DirectBuy and DirectSell are active, make it
normal shop processing. Should definitely be compatible with other
shop plugins now(tested with Yanfly's Core Shop).
-v1.3
Removed code that automatically handles window position, in order to 
make this plugin compatible with other shop plugins, such as Yanfly's
Shop Core.
-v1.2
Renamed to JK_Directshop to reflect new features.
Added ability to "Direct Sell" items. Added plugin commands for
both DirectBuy and DirectSell.
-v1.1
Adjusted position of Gold window with Status and Buy windows, to close
The gap left behind by taking out the buy/sell option window.
-v1.0
Initial release
*/

var Imported = Imported || {};
var JK_DirectShop = JK_DirectShop || {};
(function($) {

$.directSell = false;

Scene_Shop.prototype.onBuyCancel = function() {
if(this._purchaseOnly)
{//Skip right to exiting the shop processing.
$.directBuy = false;
this.popScene();
}
else
{//As normally written
this._commandWindow.activate();
this._dummyWindow.show();
this._buyWindow.hide();
this._statusWindow.hide();
this._statusWindow.setItem(null);
this._helpWindow.clear();
}
};

Scene_Shop.prototype.onCategoryCancel = function() {
if(this._sellOnly)
{
$.directSell = false;
this.popScene();
}
else
{
this._commandWindow.activate();
this._dummyWindow.show();
this._categoryWindow.hide();
this._sellWindow.hide();
}
};

var JK_createScene = Scene_Shop.prototype.create;
Scene_Shop.prototype.create = function() {
if($.directBuy){
this._purchaseOnly = true;
this._sellOnly = false;
}
else if($.directSell){
this._sellOnly = true;
if(this._purchaseOnly){//If both buy and sell only are active, make it normal processing.
this._sellOnly = false;
this._purchaseOnly = false;
}
$.directSell = false;
}
JK_createScene.call(this);
if(this._purchaseOnly){
this._commandWindow.selectSymbol('buy');
this._commandWindow.deactivate();
this.commandBuy();
}
if(this._sellOnly){
this._commandWindow.deactivate();
this._commandWindow.selectSymbol('sell');
this.commandSell();
}
};

var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args)
{
switch(command)
{
case "DirectBuy":
$.directBuy = true;
$.directSell = false;
break;
case "DirectSell":
$.directSell = true;
$.directBuy = false;
break;
default:
_Game_Interpreter_pluginCommand.call(this, command, args);
break;
}
};

})(JK_DirectShop);
Imported["JK_DirectShop"] = 1.4;