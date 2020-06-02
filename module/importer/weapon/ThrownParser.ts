import {ImportHelper} from "../ImportHelper";
import {WeaponParser} from "./WeaponParser";
import {Constants} from "../Constants";

export class ThrownParser extends WeaponParser {
    public GetDamage(jsonData: object): DamageData {
        let jsonDamage = ImportHelper.stringValue(jsonData, "damage");

        let damageCode = "";
        let damageAmount = 0;
        let damageType = "physical";
        let damageAttribute = "";

        //STR scaling weapons like the boomerang
        if (jsonDamage.includes("STR")) {
            damageAttribute = "strength";

            damageCode = jsonDamage.match(/((STR)([+-])[0-9]\)[PS])/g)?.[0];

            if (damageCode !== undefined) {
                let amountMatch = damageCode.match(/-?[0-9]+/g)?.[0];
                damageAmount = (amountMatch !== undefined) ? parseInt(amountMatch) : 0;
            }
        } else {
            damageCode = jsonDamage.match(/([0-9]+[PS])/g)?.[0];

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
                }
            }

            let amountMatch = damageCode.match(/[0-9]+/g)?.[0];
            if (amountMatch !== undefined) {
                damageAmount = parseInt(amountMatch);
            }
        }
        damageType = jsonDamage.includes("P") ? "physical" : "stun";

        let damageAp = ImportHelper.intValue(jsonData, "ap", 0);

        return {
            type: {
                base: (damageType as DamageType),
                value: (damageType as DamageType)
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
            attribute: (damageAttribute as ActorAttribute),
            mod: {}
        }
    };

    public GetBlast(jsonData: object, data: Weapon): BlastData {
        let blastData: BlastData = {
            radius: 0,
            dropoff: 0
        };

        let blastCode = ImportHelper.stringValue(jsonData, "damage");

        let radiusMatch = blastCode.match(/([0-9]+m)/)?.[0];
        if (radiusMatch !== undefined) {
            blastData.radius = parseInt(radiusMatch.match(/[0-9]+/)[0]);
        }

        let dropoffMatch = blastCode.match(/(\-[0-9]+\/m)/)?.[0];
        if (dropoffMatch !== undefined) {
            blastData.dropoff = parseInt(dropoffMatch.match(/\-[0-9]+/)[0]);
        }

        if (blastData.dropoff && !blastData.radius) {
            blastData.radius = -(data.data.action.damage.base/blastData.dropoff)
        }

        return blastData;
    }

    Parse(jsonData: object, data: Weapon): Weapon {
        data.data.action.skill = this.GetSkill(jsonData);
        data.data.action.damage = this.GetDamage(jsonData);

        data.data.action.limit.value = ImportHelper.intValue(jsonData, "accuracy");
        data.data.action.limit.base = ImportHelper.intValue(jsonData, "accuracy");

        if (jsonData.hasOwnProperty("range")) {
            data.data.thrown.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "range")];
        } else {
            data.data.thrown.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "category")];
        }

        data.data.thrown.blast = this.GetBlast(jsonData, data);

        return data;
    };
}