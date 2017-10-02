/*:

@plugindesc
クリティカルヒットしたときに、SEを鳴らすことができます

@author
シトラス

@param criticalSeName
@desc
ここで記された名前のSEが敵にクリティカルヒットした時に
鳴ります
@default Thunder10

@param criticalSeVolume
@desc
敵にクリティカルヒットした時に鳴るSEの音量です
@default 100

@param criticalSePitch
@desc
敵にクリティカルヒットした時に鳴るSEのピッチです
@default 100

@param criticalSePan
@desc
敵にクリティカルヒットした時に鳴るSEのパンです
@default 0

@param fatalSeName
@desc
ここで記された名前のSEが味方にクリティカルヒットした時に
鳴ります
@default Earth5

@param fatalSeVolume
@desc
味方にクリティカルヒットした時に鳴るSEの音量です
@default 100

@param fatalSePitch
@desc
味方にクリティカルヒットした時に鳴るSEのピッチです
@default 100

@param fatalSePan
@desc
味方にクリティカルヒットした時に鳴るSEのパンです
@default 0

@help
スクリプトを書き換えてダメージのメッセージを消している場合、
このプラグインはその下に配置してください。

このプラグインにプラグインコマンドはありません
*/
(function(){
	
	var pluginName = "CustumCriticalSoundVer5";
	
	var criticalSeName   = PluginManager.parameters(pluginName).criticalSeName;
	var criticalSeVolume = Number(PluginManager.parameters(pluginName).criticalSeVolume);
	var criticalSePitch  = Number(PluginManager.parameters(pluginName).criticalSePitch);
	var criticalSePan    = Number(PluginManager.parameters(pluginName).criticalSePan);
	
	var fatalSeName   = PluginManager.parameters(pluginName).fatalSeName;
	var fatalSeVolume = Number(PluginManager.parameters(pluginName).fatalSeVolume);
	var fatalSePitch  = Number(PluginManager.parameters(pluginName).fatalSePitch);
	var fatalSePan    = Number(PluginManager.parameters(pluginName).fatalSePan);
	
	//通常のダメージSEを消す
	Game_Actor.prototype.performDamage = function() {
		Game_Battler.prototype.performDamage.call(this);
		if (this.isSpriteVisible()) {
			this.requestMotion('damage');
		} else {
			$gameScreen.startShake(5, 5, 10);
		}
	};
	Game_Enemy.prototype.performDamage = function() {
		Game_Battler.prototype.performDamage.call(this);
		this.requestEffect('blink');
	};
	
	var _Window_BattleLog_displayHpDamage = Window_BattleLog.prototype.displayHpDamage;
	Window_BattleLog.prototype.displayHpDamage = function(target) {
		_Window_BattleLog_displayHpDamage.call(this,target);
		if (target.result().hpDamage > 0 && !target.result().drain) {
			this.push('performDamage', target);
			if(target.isActor() === true){
				if(target.result().critical === true){
					//痛恨SE
					AudioManager.playSe( {"name":fatalSeName,"volume":fatalSeVolume,"pitch":fatalSePitch,"pan":fatalSePan} );
				}else{
					SoundManager.playActorDamage();
				}
			}else{
				//敵がダメージを受けた場合
				if(target.result().critical === true){
					//会心SE
					AudioManager.playSe( {"name":criticalSeName,"volume":criticalSeVolume,"pitch":criticalSePitch,"pan":criticalSePan} );
				}else{
					SoundManager.playEnemyDamage();
				}
			}
		}
	};
})();