import { ImportHelper } from "../ImportHelper";
import { WeaponParser } from "./WeaponParser";
import { Constants } from "../Constants";
export class ThrownParser extends WeaponParser {
    GetDamage(jsonData) {
        var _a, _b, _c, _d;
        let jsonDamage = ImportHelper.stringValue(jsonData, "damage");
        let damageCode = "";
        let damageAmount = 0;
        let damageType = "physical";
        let damageAttribute = "";
        //STR scaling weapons like the boomerang
        if (jsonDamage.includes("STR")) {
            damageAttribute = "strength";
            damageCode = (_a = jsonDamage.match(/((STR)([+-])[0-9]\)[PS])/g)) === null || _a === void 0 ? void 0 : _a[0];
            if (damageCode !== undefined) {
                let amountMatch = (_b = damageCode.match(/-?[0-9]+/g)) === null || _b === void 0 ? void 0 : _b[0];
                damageAmount = (amountMatch !== undefined) ? parseInt(amountMatch) : 0;
            }
        }
        else {
            damageCode = (_c = jsonDamage.match(/([0-9]+[PS])/g)) === null || _c === void 0 ? void 0 : _c[0];
            if (damageCode === undefined) {
                return {
                    type: {
                        base: DamageType.physical,
                        value: DamageType.physical
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
                        mod: {},
                    },
                    attribute: "",
                    mod: {}
                };
            }
            let amountMatch = (_d = damageCode.match(/[0-9]+/g)) === null || _d === void 0 ? void 0 : _d[0];
            if (amountMatch !== undefined) {
                damageAmount = parseInt(amountMatch);
            }
        }
        damageType = jsonDamage.includes("P") ? "physical" : "stun";
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
            base: damageAmount,
            value: damageAmount,
            ap: {
                base: damageAp,
                value: damageAp,
                mod: {},
            },
            attribute: damageAttribute,
            mod: {}
        };
    }
    ;
    GetBlast(jsonData, data) {
        var _a, _b;
        let blastData = {
            radius: 0,
            dropoff: 0
        };
        let blastCode = ImportHelper.stringValue(jsonData, "damage");
        let radiusMatch = (_a = blastCode.match(/([0-9]+m)/)) === null || _a === void 0 ? void 0 : _a[0];
        if (radiusMatch !== undefined) {
            blastData.radius = parseInt(radiusMatch.match(/[0-9]+/)[0]);
        }
        let dropoffMatch = (_b = blastCode.match(/(\-[0-9]+\/m)/)) === null || _b === void 0 ? void 0 : _b[0];
        if (dropoffMatch !== undefined) {
            blastData.dropoff = parseInt(dropoffMatch.match(/\-[0-9]+/)[0]);
        }
        if (blastData.dropoff && !blastData.radius) {
            blastData.radius = -(data.data.action.damage.base / blastData.dropoff);
        }
        return blastData;
    }
    Parse(jsonData, data) {
        data.data.action.skill = this.GetSkill(jsonData);
        data.data.action.damage = this.GetDamage(jsonData);
        data.data.action.limit.value = ImportHelper.intValue(jsonData, "accuracy");
        data.data.action.limit.base = ImportHelper.intValue(jsonData, "accuracy");
        if (jsonData.hasOwnProperty("range")) {
            data.data.thrown.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "range")];
        }
        else {
            data.data.thrown.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "category")];
        }
        data.data.thrown.blast = this.GetBlast(jsonData, data);
        return data;
    }
    ;
}
