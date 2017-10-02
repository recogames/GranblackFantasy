//=============================================================================
// RenewMenuWindow.js
//=============================================================================


/*:
 * @plugindesc メニューウインドウのレイアウトを変更します
 * @author mokumoku
 *
 * @param battlerX
 * @desc x軸方向の移動量
 * @default -180
 *
 * @param battlerY
 * @desc y軸方向の移動量
 * @default -150
 *
 * @param comandWindowWidth
 * @desc コマンドウインドウの幅
 * @default 160
 * @help このプラグインには、プラグインコマンドはありません。
 * サイドビューバトル時に敵を左にずらします。
 */
 
(function() {
	var parameters = PluginManager.parameters('RenewMenuWindow');
	var battlerX = Number(parameters['battlerX'] );
	var battlerY = Number(parameters['battlerY'] );
	var comandWindowWidth = Number(parameters['comandWindowWidth'] );
    
    
// バトルのキャラクター
	
var _Game_Enemy_prototype_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup  = function(enemyId, x, y) {
    _Game_Enemy_prototype_setup.call(this, enemyId, x + battlerX, y + battlerY);
};
	


Sprite_Actor.prototype.setActorHome = function(index) {
    this.setHome(390 + index * 16, 200 + index * 48);
};
	
	// ここからバトルのウインドウ系
	
	const battleCommandWidth = 192 * 2 / 3;

Window_ActorCommand.prototype.windowWidth = function() {
    return battleCommandWidth;
};
	
	
Window_ActorCommand.prototype.numVisibleRows = function() {
    return 4;
};
	
	
Window_PartyCommand.prototype.windowWidth = function() {
    return battleCommandWidth;
};
	

Window_PartyCommand.prototype.numVisibleRows = function() {
    return 3;
};
	
Window_BattleStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - battleCommandWidth;
};
	
Window_BattleStatus.prototype.numVisibleRows = function() {
    return 3;
};
	
// 2つのバトルゲージの全体長（小さいと右から削られ大きいと右にスペース加わる）
Window_BattleStatus.prototype.gaugeAreaWidth = function() {
    return 330 - 170;
};
	
	
Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    var hpWidth = 85;
    var mpWidth = this.gaugeAreaWidth() - hpWidth - 15;
    this.drawActorHp(actor, rect.x + 0, rect.y, hpWidth);
    this.drawActorMp(actor, rect.x + hpWidth + 15,  rect.y, mpWidth);
};


Window_Base.prototype.drawCurrentAndMax = function(current, max, x, y,
                                                   width, color1, color2) {
    var labelWidth = this.textWidth('HP');
    var valueWidth = this.textWidth('000');
    var slashWidth = this.textWidth('/');
    var x1 = x + width - valueWidth;
    var x2 = x1 - slashWidth;
    var x3 = x2 - valueWidth;
    if (x3 >= x + labelWidth) {
        this.changeTextColor(color1);
        this.drawText(current, x3, y, valueWidth, 'right');
        this.changeTextColor(color2);
        this.drawText('/', x2, y, slashWidth, 'right');
        this.drawText(max, x1, y, valueWidth, 'right');
    } else {
        this.changeTextColor(color1);
        this.drawText(current, x1, y, valueWidth, 'right');
    }
};

Window_Base.prototype.drawActorHp = function(actor, x, y, width) {
    width = width || 186;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
    this.changeTextColor(this.systemColor());
    // Hp文字は大丈夫
    this.drawText(TextManager.hpA, x, y, 44);
    this.drawCurrentAndMax(actor.hp, actor.mhp, x, y, width, this.hpColor(actor), this.normalColor());
};


Window_BattleEnemy.prototype.windowWidth = function() {
    return Graphics.boxWidth - battleCommandWidth;
};
	
	
// メニューの作成
// メニュートップのコマンド選択ウインドウの幅
Window_MenuCommand.prototype.windowWidth = function() {
	return comandWindowWidth;
};

// メニュートップの所持金ウインドウの幅
Window_Gold.prototype.windowWidth = function() {
    return comandWindowWidth;
};
	
// メニューのコマンドの選択肢追加
Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
	//this.addFormationCommand();
	//this.addOriginalCommands();
    //this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
};
	
// メニュートップのステータスウインドウの幅
Window_MenuStatus.prototype.windowWidth = function() {
    return Graphics.boxWidth - comandWindowWidth;
};

// メニュー画面で表示されるアクターのレベル
Window_Base.prototype.drawActorLevel = function(actor, x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48);
    this.resetTextColor();
    this.drawText(actor.level, x + 84 - 60, y, 36, 'right');
};

// メニュートップ、スキル画面などで表示されるアクターのステータス
Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
    var lineHeight = this.lineHeight();
    var space1 = 160;
    var x2 = x + space1;
    var width2 = Math.min(200, width - space1 - this.textPadding());
    this.drawActorName(actor, x, y + 5);
    this.drawActorLevel(actor, x + 55, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    //this.drawActorClass(actor, x2, y);
    this.drawActorHp(actor, x2, y + lineHeight * 1 - 10, width2);
    this.drawActorMp(actor, x2, y + lineHeight * 2 - 10, width2);
};

// メニュートップのアクターのホコグラの表示

Window_MenuStatus.prototype.drawItemImage = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    this.changePaintOpacity(actor.isBattleMember());
    //this.drawActorFace(actor, rect.x + 1, rect.y + 1, 144, rect.height - 2);
    this.drawActorCharacter(actor, rect.x + 1 + 30, rect.y + 1 + 95);
    this.changePaintOpacity(true);
};

// メニュートップのアクターのステータスの表示
Window_MenuStatus.prototype.drawItemStatus = function(index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    var x = rect.x + 16;
    var y = rect.y + rect.height / 2 - this.lineHeight() * 1.5;
    var width = rect.width - x - this.textPadding();
    this.drawActorSimpleStatus(actor, x, y, width);
};


//各上にあるヘルプウインドウ
Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 1);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
};

// そうび
Window_EquipStatus.prototype.windowWidth = function() {
    return 312 - 90;
};


Window_EquipStatus.prototype.numVisibleRows = function() {
    return 6;
};

Window_EquipStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        this.drawActorName(this._actor, this.textPadding() - 10, -5);
        for (var i = 0; i < 5; i++) {
            this.drawItem(0, this.lineHeight() * (1 + i) - 5, 2 + i);
        }
    }
};

Window_EquipStatus.prototype.drawItem = function(x, y, paramId) {
    this.drawParamName(x + this.textPadding() - 8, y, paramId);
    if (this._actor) {
        this.drawCurrentParam(x + 70 , y, paramId);
    }
    if (this._tempActor) {
    	this.drawRightArrow(x + 116, y);
        this.drawNewParam(x + 126, y, paramId);
    }
};


Window_EquipStatus.prototype.drawParamName = function(x, y, paramId) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.param(paramId), x, y, 60);
};

Window_EquipStatus.prototype.drawCurrentParam = function(x, y, paramId) {
    this.resetTextColor();
    this.drawText(this._actor.param(paramId), x, y, 48, 'right');
};


Window_EquipCommand.prototype.maxCols = function() {
    return 2;
};

Window_EquipCommand.prototype.makeCommandList = function() {
    this.addCommand(TextManager.equip2,   'equip');
    //this.addCommand(TextManager.optimize, 'optimize');
    this.addCommand(TextManager.clear,    'clear');
};


Window_EquipSlot.prototype.drawItem = function(index) {
    if (this._actor) {
        var rect = this.itemRectForText(index);
        this.changeTextColor(this.systemColor());
        this.changePaintOpacity(this.isEnabled(index));
        const space = 100;
        this.drawText(this.slotName(index), rect.x, rect.y, space, this.lineHeight());
        this.drawItemName(this._actor.equips()[index], rect.x + space, rect.y);
        this.changePaintOpacity(true);
    }
};

// スキル

Window_SkillType.prototype.windowWidth = function() {
    return 120;
};

Window_SkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var w = this.width - this.padding * 2;
        var h = this.height - this.padding * 2;
        var y = h / 2 - this.lineHeight() * 1.5;
        var width = w - 162 - this.textPadding();
        //this.drawActorFace(this._actor, 0, 0, 144, h);
    	this.drawActorCharacter(this._actor, 25, 110);
        this.drawActorSimpleStatus(this._actor, 12, y, width + 150);
    }
};

// ステータス画面

Window_Status.prototype.drawBlock2 = function(y) {
    this.drawActorFace(this._actor, 15, y);
    this.drawBasicInfo(204 + 40, y);
    //this.drawExpInfo(325, y);
};


Window_Status.prototype.drawBasicInfo = function(x, y) {
    var lineHeight = this.lineHeight();
    this.drawActorLevel(this._actor, x, y + lineHeight * 0);
    this.drawActorIcons(this._actor, x, y + lineHeight * 1);
    this.drawActorHp(this._actor, x, y + lineHeight * 2, 180);
    this.drawActorMp(this._actor, x, y + lineHeight * 3, 180);
};

Window_Status.prototype.drawBlock3 = function(y) {
    this.drawParameters(20, y);
    this.drawEquipments(280, y);
};


Window_Status.prototype.drawParameters = function(x, y) {
    var lineHeight = this.lineHeight();
    for (var i = 0; i < 5; i++) {
        var paramId = i + 2;
        var y2 = y + lineHeight * i;
        this.changeTextColor(this.systemColor());
        var space = 100;
        this.drawText(TextManager.param(paramId), x, y2, space);
        this.resetTextColor();
        this.drawText(this._actor.param(paramId), x + space, y2, 60, 'right');
    }
};

// セーブ系


DataManager.maxSavefiles = function() {
    return 3;
};

Window_SavefileList.prototype.maxVisibleItems = function() {
    return 3;
};
	



})();