import {ImportHelper} from "../../helper/ImportHelper";
import {WeaponParserBase} from "./WeaponParserBase";
import {Constants} from "../../importer/Constants";
import DamageData = Shadowrun.DamageData;
import DamageElement = Shadowrun.DamageElement;
import DamageType = Shadowrun.DamageType;
import Weapon = Shadowrun.Weapon;

export class RangedParser extends WeaponParserBase {
    public GetDamage(jsonData: object): DamageData {
        let jsonDamage = ImportHelper.stringValue(jsonData, "damage");
        let damageCode = jsonDamage.match(/[0-9]+[PS]/g)?.[0];

        if (damageCode == null) {
            return {
                type: {
                    base: "physical",
                    value: ""
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
            }
        }

        let damageType = (damageCode.includes("P")) ? "physical" : "stun";
        let damageAmount = parseInt(damageCode.replace(damageType[0].toUpperCase(), ""));
        let damageAp = ImportHelper.intValue(jsonData, "ap", 0);

        return {
            type: {
                base: (damageType as DamageType),
                value: (damageType as DamageType)
            },
            element: {
                base: "",
                value: ""
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
        }
    };

    protected GetAmmo(weaponJson: object) {
        let jsonAmmo = ImportHelper.stringValue(weaponJson, "ammo");
        let match = jsonAmmo.match(/([0-9]+)/g)?.[0];
        return (match !== undefined) ? parseInt(match) : 0;
    }

    Parse(jsonData: object, data: Weapon): Weapon {
        data = super.Parse(jsonData, data);

        data.data.range.rc.base = ImportHelper.intValue(jsonData, "rc");
        data.data.range.rc.value = ImportHelper.intValue(jsonData, "rc");

        if (jsonData.hasOwnProperty("range")) {
            data.data.range.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "range")];
        } else {
            data.data.range.ranges = Constants.WEAPON_RANGES[ImportHelper.stringValue(jsonData, "category")];
        }

        data.data.ammo.current.value = this.GetAmmo(jsonData);
        data.data.ammo.current.max = this.GetAmmo(jsonData);

        data.data.range.modes.single_shot = ImportHelper.stringValue(jsonData, "mode").includes("SS");
        data.data.range.modes.semi_auto = ImportHelper.stringValue(jsonData, "mode").includes("SA");
        data.data.range.modes.burst_fire = ImportHelper.stringValue(jsonData, "mode").includes("BF");
        data.data.range.modes.full_auto = ImportHelper.stringValue(jsonData, "mode").includes("FA");

        return data;
    };
}