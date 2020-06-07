import {ImportHelper} from "../../helper/ImportHelper";
import {Constants} from "../../importer/Constants";
import Skill = Shadowrun.Skill;
import DamageData = Shadowrun.DamageData;
import Weapon = Shadowrun.Weapon;
import WeaponCategory = Shadowrun.WeaponCategory;
import {Parser} from "../Parser";
import {ItemParserBase} from "../item/ItemParserBase";

export abstract class WeaponParserBase extends ItemParserBase<Weapon> {
    public abstract GetDamage(jsonData: object): DamageData;

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

    public Parse(jsonData: object, data: Weapon): Weapon {
        data = super.Parse(jsonData, data);

        let category = ImportHelper.stringValue(jsonData, "category");
        // A single item does not meet normal rules, thanks Chummer!
        if (category === "Hold-outs") { category = "Holdouts"; }

        data.data.category = category.toLowerCase() as WeaponCategory;

        data.data.action.skill = this.GetSkill(jsonData);
        data.data.action.damage = this.GetDamage(jsonData);

        data.data.action.limit.value = ImportHelper.intValue(jsonData, "accuracy");
        data.data.action.limit.base = ImportHelper.intValue(jsonData, "accuracy");

        data.data.technology.conceal.base = ImportHelper.intValue(jsonData, "conceal");

        return data;
    }
}