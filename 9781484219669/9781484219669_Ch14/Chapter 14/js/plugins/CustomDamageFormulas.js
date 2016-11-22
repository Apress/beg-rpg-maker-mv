//=============================================================================
// CustomDamageFormulas.js
//=============================================================================

/*:
 * @plugindesc A Beginning RPG Maker VX Ace Module adapted for RPG Maker MV
 * @author Darrin Perez
 * @help
 * Allows custom damage formulas to be expressed in the form Winter.module,
 * where module is equal to one of the variable properties in the js file.
 *
 * phys: Used for physical skills. Express in the form Winter.phys(p,a,b)
 * p is the power multiplier for the ATK stat of the attacker.
 *
 * magic: Used for magical skills. Express in the form Winter.magic(bd,p,a,b)
 * bd is the base damage of the spell
 * p is the power multiplier for the MAT stat of the attacker.
 */

var Winter = Winter || {};

Winter.phys = function (p, a, b) {
  if (a.atk > b.def) {
    return (a.atk*p)*(1.00-(b.def*1.00/a.atk*1.00));
   } else {
    return (a.atk*p)*(a.atk*1.00/b.def*1.00);
   }
};


Winter.magic = function(bd, p, a, b) {
return ((bd + a.mat*p)*(a.mat*1.00/b.mdf*1.00));
};
