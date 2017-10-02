//=============================================================================
// TMVplugin - 通常攻撃スキル拡張
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 1.0
// 最終更新日: 2016/07/03
//=============================================================================

/*:
 * @plugindesc 攻撃コマンドや防御コマンドで使用するスキルをアクターごとに設定します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @help
 * メモ欄タグ（アクター）:
 *   <attackSkill:3>
 *   アクターが攻撃コマンドで使用するスキルを３番のものに変更します。
 *
 *   <guardSkill:7>
 *   アクターが防御コマンドで使用するスキルを７番のものに変更します。
 * 
 */

var Imported = Imported || {};
Imported.TMAttackSkillEx = true;

(function() {

  //-----------------------------------------------------------------------------
  // Game_Actor
  //

  var _Game_Actor_attackSkillId = Game_Actor.prototype.attackSkillId;
  Game_Actor.prototype.attackSkillId = function() {
    if (this.actor().meta.attackSkill) {
      return +this.actor().meta.attackSkill;
    }
    return _Game_Actor_attackSkillId.call(this);
  };

  var _Game_Actor_guardSkillId = Game_Actor.prototype.guardSkillId;
  Game_Actor.prototype.guardSkillId = function() {
    if (this.actor().meta.guardSkill) {
      return +this.actor().meta.guardSkill;
    }
    return _Game_Actor_guardSkillId.call(this);
  };

  //-----------------------------------------------------------------------------
  // Window_ActorCommand
  //

  var _Window_ActorCommand_addAttackCommand = Window_ActorCommand.prototype.addAttackCommand;
  Window_ActorCommand.prototype.addAttackCommand = function() {
    if (this._actor.actor().meta.attackSkill) {
      var skill = $dataSkills[this._actor.actor().meta.attackSkill];
      this.addCommand(skill.name, 'attack', this._actor.canAttack());
    } else {
      _Window_ActorCommand_addAttackCommand.call(this);
    }
  };

  var _Window_ActorCommand_addGuardCommand = Window_ActorCommand.prototype.addGuardCommand;
  Window_ActorCommand.prototype.addGuardCommand = function() {
    if (this._actor.actor().meta.guardSkill) {
      var skill = $dataSkills[this._actor.actor().meta.guardSkill];
      this.addCommand(skill.name, 'guard', this._actor.canGuard());
    } else {
      _Window_ActorCommand_addGuardCommand.call(this);
    }
  };

})();
