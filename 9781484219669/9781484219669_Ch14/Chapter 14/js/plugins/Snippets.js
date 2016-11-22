//=============================================================================
// Snippets.js
//=============================================================================

/*:
 * @plugindesc Contains all modified code for Chapter 14's exercises.
 * @author Darrin Perez
 * @help
 * Please refer to Chapter 14 of Beginning RPG Maker MV.
 */
//=============================================================================
// Damage Floors Revisited
//=============================================================================

//Modified Floor Damage method
var _Game_Actor_basicFloorDamage = Game_Actor.prototype.basicFloorDamage;
Game_Actor.prototype.basicFloorDamage = function() {
_Game_Actor_basicFloorDamage.call(this);
switch ($gameVariables.value(4)) {
    case 0:
    default:
        return 10;
    case 1:
        return 20;
    case 2:
        return 35;
    case 3:
        return 60;
  }
};

//=============================================================================
// setEscape snippet (from Chapter 9)
//=============================================================================

BattleManager.setEscape = function(bool) {
    this._canEscape = bool;
};
//=============================================================================
// Critically Coded
//=============================================================================

//Modified critical damage method
var _Game_Action_itemCri = Game_Action.prototype.itemCri;
Game_Action.prototype.itemCri = function(target) {
_Game_Action_itemCri.call(this,target);
return this.item().damage.critical ?
  (this.subject().cri + (this.subject().luk * 0.002)) -
  (target.luk * 0.002) * (1 - target.cev) : 0;
};

//==============================================================================
// Coded Messages (in a Bottle)
//==============================================================================
//Modified HP damage text
var _Window_BattleLog_makeHpDamageText = Window_BattleLog.prototype.makeHpDamageText;
Window_BattleLog.prototype.makeHpDamageText = function(target) {
_Window_BattleLog_makeHpDamageText.call(this,target);
    var result = target.result();
    var damage = result.hpDamage;
    var isActor = target.isActor();
    var fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return fmt.format(target.name(), damage, TextManager.hp);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
        return fmt.format(target.name(), damage);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return fmt.format(target.name(), -damage, TextManager.hp);
    } else {
        fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
        return fmt.format(target.name());
    }
};
//Modified MP damage text
var _Window_BattleLog_makeMpDamageText = Window_BattleLog.prototype.makeMpDamageText;
Window_BattleLog.prototype.makeMpDamageText = function(target) {
_Window_BattleLog_makeMpDamageText.call(this,target);
    var result = target.result();
    var damage = result.mpDamage;
    var isActor = target.isActor();
    var fmt;
    if (damage > 0 && result.drain) {
        fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
        return fmt.format(target.name(), damage, TextManager.mp);
    } else if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return fmt.format(target.name(), damage, TextManager.mp);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
        return fmt.format(target.name(), -damage, TextManager.mp);
    } else {
        return '';
    }
};
//Modified TP damage text
var _Window_BattleLog_makeTpDamageText = Window_BattleLog.prototype.makeTpDamageText;
Window_BattleLog.prototype.makeTpDamageText = function(target) {
_Window_BattleLog_makeTpDamageText.call(this,target);
    var result = target.result();
    var damage = result.tpDamage;
    var isActor = target.isActor();
    var fmt;
    if (damage > 0) {
        fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
        return fmt.format(target.name(), damage, TextManager.tp);
    } else if (damage < 0) {
        fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
        return fmt.format(target.name(), -damage, TextManager.tp);
    } else {
        return '';
    }
};

//==============================================================================
// TP Preservation and Other TP Elements
//==============================================================================

//Modified onBattleStart method
var _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    this.setActionState('undecided');
    this.clearMotion();
};

//Modified onBattleEnd method
var _Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
    this.clearResult();
    this.removeBattleStates();
    this.removeAllBuffs();
    this.clearActions();
    this.appear();
};

//Modified max TP method
var _Game_BattlerBase_maxTp = Game_BattlerBase.prototype.maxTp;
Game_BattlerBase.prototype.maxTp = function() {
_Game_BattlerBase_maxTp.call(this);
    return 500;
};
//Modified tpRate method
var _Game_BattlerBase_tpRate = Game_BattlerBase.prototype.tpRate;
Game_BattlerBase.prototype.tpRate = function() {
_Game_BattlerBase_tpRate.call(this);
    return this.tp / 500;
};

//==============================================================================
// Game Over by Incapacitation
//==============================================================================
var _Game_BattlerBase_isDeathStateAffected = Game_BattlerBase.prototype.isDeathStateAffected;
Game_BattlerBase.prototype.isDeathStateAffected = function() {
_Game_BattlerBase_isDeathStateAffected.call(this);
    return this.isStateAffected(this.deathStateId()) ||
    this.isStateAffected(this.incapStateId());
};

//New function for Game_BattlerBase
Game_BattlerBase.prototype.incapStateId = function() {
    return 10;
};
//==============================================================================
// Adding a Menu to the Game Over Screen
//==============================================================================
Scene_Gameover.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this.playGameoverMusic();
    this.createBackground();
    this.createWindowLayer();
    this.createCommandWindow();
};

Scene_Gameover.prototype.update = function() {
  if (!this.isBusy()) {
      this._commandWindow.open();
  }
    Scene_Base.prototype.update.call(this);
};

//New class methods
Scene_Gameover.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_GameoverCommand();
    //this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('toTitle', this.commandToTitle.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this.addWindow(this._commandWindow);
};

/*
Scene_Gameover.prototype.commandNewGame = function() {
    DataManager.setupNewGame();
    this._commandWindow.close();
    this.fadeOutAll();
    SceneManager.goto(Scene_Map);
};
*/

Scene_Gameover.prototype.commandContinue = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Load);
};

Scene_Gameover.prototype.commandOptions = function() {
    this._commandWindow.close();
    SceneManager.push(Scene_Options);
};

Scene_Gameover.prototype.commandToTitle = function() {
    this.fadeOutAll();
    SceneManager.goto(Scene_Title);
};

//==============================================================================
// Tweaking the Game Over Menu
//==============================================================================
function Window_GameoverCommand() {
    this.initialize.apply(this, arguments);
}

Window_GameoverCommand.prototype = Object.create(Window_Command.prototype);
Window_GameoverCommand.prototype.constructor = Window_GameoverCommand;

Window_GameoverCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
    this.openness = 0;
    this.selectLast();
};

Window_GameoverCommand._lastCommandSymbol = null;

Window_GameoverCommand.initCommandPosition = function() {
    this._lastCommandSymbol = null;
};

Window_GameoverCommand.prototype.windowWidth = function() {
    return 240;
};

Window_GameoverCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 96;
};

Window_GameoverCommand.prototype.makeCommandList = function() {
    //this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    this.addCommand(TextManager.toTitle,   'toTitle');
    this.addCommand(TextManager.options,   'options');
};

Window_GameoverCommand.prototype.isContinueEnabled = function() {
    return DataManager.isAnySavefileExists();
};

Window_GameoverCommand.prototype.processOk = function() {
    Window_GameoverCommand._lastCommandSymbol = this.currentSymbol();
    Window_Command.prototype.processOk.call(this);
};

Window_GameoverCommand.prototype.selectLast = function() {
    if (Window_GameoverCommand._lastCommandSymbol) {
        this.selectSymbol(Window_GameoverCommand._lastCommandSymbol);
    } else if (this.isContinueEnabled()) {
        this.selectSymbol('continue');
    }
};
