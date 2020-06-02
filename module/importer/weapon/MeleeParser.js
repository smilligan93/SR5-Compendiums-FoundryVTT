import { ImportHelper } from "../ImportHelper";
import { WeaponParser } from "./WeaponParser";
export class MeleeParser extends WeaponParser {
    GetDamage(jsonData) {
        var _a;
        let jsonDamage = ImportHelper.stringValue(jsonData, "damage");
        let damageCode = (_a = jsonDamage.match(/(STR)([+-]?)([1-9]*)\)([PS])/g)) === null || _a === void 0 ? void 0 : _a[0];
        if (damageCode == null) {
            return {
                type: {
                    base: "physical",
                    value: "physical"
                },
                element: {
                    base: "",
                    value: ""
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
        let damageBase = 0;
        let damageAp = ImportHelper.intValue(jsonData, "ap", 0);
        let splitDamageCode = damageCode.split(")");
        let damageType = (splitDamageCode[1].includes("P")) ? "physical" : "stun";
        let splitBaseCode = damageCode.includes("+") ? splitDamageCode[0].split("+") : splitDamageCode[0].split("-");
        if (splitDamageCode[0].includes("+") || splitDamageCode[0].includes("-")) {
            damageBase = parseInt(splitBaseCode[1], 0);
        }
        let damageAttribute = (damageCode.includes("STR")) ? "strength" : "";
        return {
            type: {
                base: damageType,
                value: damageType
            },
            element: {
                base: "",
                value: ""
            },
            base: damageBase,
            value: damageBase,
            ap: {
                base: damageAp,
                value: damageAp,
                mod: {}
            },
            attribute: damageAttribute,
            mod: {}
        };
    }
    ;
    Parse(jsonData, data) {
        data.data.action.category = ImportHelper.stringValue(jsonData, "category");
        data.data.action.skill = this.GetSkill(jsonData);
        data.data.action.damage = this.GetDamage(jsonData);
        data.data.action.limit.value = ImportHelper.intValue(jsonData, "accuracy");
        data.data.action.limit.base = ImportHelper.intValue(jsonData, "accuracy");
        data.data.melee.reach = ImportHelper.intValue(jsonData, "reach");
        return data;
    }
    ;
}
