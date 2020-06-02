import { ImportHelper } from "../ImportHelper";
import { WeaponParser } from "./WeaponParser";
import { Constants } from "../Constants";
export class RangedParser extends WeaponParser {
    GetDamage(jsonData) {
        var _a;
        let jsonDamage = ImportHelper.stringValue(jsonData, "damage");
        let damageCode = (_a = jsonDamage.match(/[0-9]+[PS]/g)) === null || _a === void 0 ? void 0 : _a[0];
        if (damageCode == null) {
            return {
                type: {
                    base: DamageType.physical,
                    value: DamageType.none
                },
                element: {
                    base: DamageElement.none,
                    value: DamageElement.none
                },
                base: 0,
                value: 0,
                ap: {
                    base: 0,
                    value: 0,
                    mod: {}
                },
                attribute: "",
                mod: {}
            };
        }
        let damageType = (damageCode.includes("P")) ? "physical" : "stun";
        let damageAmount = parseInt(damageCode.replace(damageType[0].toUpperCase(), ""));
        let damageAp = ImportHelper.intValue(jsonData, "ap", 0);
        return {
            type: {
                base: damageType,
                value: damageType
            },
            element: {
                base: DamageElement.none,
                value: DamageElement.none
            },
            value: damageAmount,
            ap: {
                base: damageAp,
                value: damageAp,
                mod: {},
            },
            attribute: "",
            mod: {},
            base: damageAmount
        };
    }
    ;
    GetAmmo(weaponJson) {
        var _a;
        let jsonAmmo = ImportHelper.stringValue(weaponJson, "ammo");
        let match = (_a = jsonAmmo.match(/([0-9]+)/g)) === null || _a === void 0 ? void 0 : _a[0];
        return (match !== null) ? parseInt(match) : 0;
    }
    Parse(jsonData, data) {
        data.data.action.category = ImportHelper.stringValue(jsonData, "category");
        data.data.action.skill = this.GetSkill(jsonData);
        data.data.action.damage = this.GetDamage(jsonData);
        data.data.action.limit.value = ImportHelper.intValue(jsonData, "accuracy");
        data.data.action.limit.base = ImportHelper.intValue(jsonData, "accuracy");
        //TODO: Derive from mods.
        data.data.range.rc.base = ImportHelper.intValue(jsonData, "rc");
        data.data.range.rc.value = ImportHelper.intValue(jsonData, "rc");
        if (jsonData.hasOwnProperty("range")) {
            data.data.range.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "range")];
        }
        else {
            data.data.range.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "category")];
        }
        data.data.ammo.current.value = this.GetAmmo(jsonData);
        data.data.ammo.current.max = this.GetAmmo(jsonData);
        data.data.range.modes.single_shot = ImportHelper.stringValue(jsonData, "mode").includes("SS");
        data.data.range.modes.semi_auto = ImportHelper.stringValue(jsonData, "mode").includes("SA");
        data.data.range.modes.burst_fire = ImportHelper.stringValue(jsonData, "mode").includes("BF");
        data.data.range.modes.full_auto = ImportHelper.stringValue(jsonData, "mode").includes("FA");
        return data;
    }
    ;
}
