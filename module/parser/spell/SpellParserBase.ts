import {ImportHelper} from "../../importer/ImportHelper";
import Spell = Shadowrun.Spell;
import SpellCateogry = Shadowrun.SpellCateogry;

export class SpellParserBase {
    public Parse(jsonData: object, data: Spell): Spell {
        data.name = ImportHelper.stringValue(jsonData, "name");

        data.data.description.source = `${ImportHelper.stringValue(jsonData, "source")} ${ImportHelper.stringValue(jsonData, "page")}`;
        data.data.category = ImportHelper.stringValue(jsonData, "category").toLowerCase() as SpellCateogry;

        let damage = ImportHelper.stringValue(jsonData, "damage");
        if (damage === "P") {
            data.data.action.damage.type.base = "physical";
            data.data.action.damage.type.value = "physical";
        } else if (damage === "S") {
            data.data.action.damage.type.base = "stun";
            data.data.action.damage.type.value = "stun";
        }

        let duration = ImportHelper.stringValue(jsonData, "duration");
        if (duration === "I") {
            data.data.duration = "instant";
        } else if (duration === "S") {
            data.data.duration = "sustained";
        } else if (duration === "P") {
            data.data.duration = "permanent";
        }

        let drain = ImportHelper.stringValue(jsonData, "dv");
        if (drain.includes("+") || drain.includes("-")) {
            data.data.drain = parseInt(drain.substring(1, drain.length));
        }

        let range = ImportHelper.stringValue(jsonData, "range");
        if (range === "T") {
            data.data.range = "touch";
        } else if (range === "LOS") {
            data.data.range = "los";
        } else if (range === "LOS (A)") {
            data.data.range = "los_a";
        }

        let type = ImportHelper.stringValue(jsonData, "type");
        if (type === "P") {
            data.data.type = "physical";
        } else if (type === "M") {
            data.data.type = "mana";
        }

        return data;
    }
}