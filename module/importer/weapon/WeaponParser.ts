import {ImportHelper} from "../ImportHelper";
import {Constants} from "../Constants";

export abstract class WeaponParser {
    public abstract GetDamage(jsonData: object): DamageData;

    public abstract Parse(jsonData: object, data: Weapon): Weapon;

    protected GetSkill(weaponJson: object): Skill {
        if (weaponJson.hasOwnProperty("useskill")) {
            let jsonSkill = ImportHelper.stringValue(weaponJson, "useskill");
            if (Constants.MAP_CATEGORY_TO_SKILL.hasOwnProperty(jsonSkill)) {
                return Constants.MAP_CATEGORY_TO_SKILL[jsonSkill];
            }
            return jsonSkill.replace(/[\s\-]/g, "_").toLowerCase();
        } else {
            let category = ImportHelper.stringValue(weaponJson, "category");
            if (Constants.MAP_CATEGORY_TO_SKILL.hasOwnProperty(category)) {
                return Constants.MAP_CATEGORY_TO_SKILL[category];
            }

            let type = ImportHelper.stringValue(weaponJson, "type").toLowerCase();
            return (type === "ranged") ? "exotic_range" : "exotic_melee";
        }
    };
}