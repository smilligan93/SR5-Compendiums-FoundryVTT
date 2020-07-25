import {ImportHelper} from "../../helper/ImportHelper";
import Spell = Shadowrun.Spell;
import SpellCateogry = Shadowrun.SpellCateogry;
import {Parser} from "../Parser";

export class SpellParserBase extends Parser<Spell> {
    public Parse(jsonData: object, data: Spell): Spell {
        data.name = ImportHelper.StringValue(jsonData, "name");

        data.data.description.source = `${ImportHelper.StringValue(jsonData, "source")} ${ImportHelper.StringValue(jsonData, "page")}`;
        data.data.category = ImportHelper.StringValue(jsonData, "category").toLowerCase() as SpellCateogry;

        let damage = ImportHelper.StringValue(jsonData, "damage");
        if (damage === "P") {
            data.data.action.damage.type.base = "physical";
            data.data.action.damage.type.value = "physical";
        } else if (damage === "S") {
            data.data.action.damage.type.base = "stun";
            data.data.action.damage.type.value = "stun";
        }

        let duration = ImportHelper.StringValue(jsonData, "duration");
        if (duration === "I") {
            data.data.duration = "instant";
        } else if (duration === "S") {
            data.data.duration = "sustained";
        } else if (duration === "P") {
            data.data.duration = "permanent";
        }

        let drain = ImportHelper.StringValue(jsonData, "dv");
        if (drain.includes("+") || drain.includes("-")) {
            data.data.drain = parseInt(drain.substring(1, drain.length));
        }

        let range = ImportHelper.StringValue(jsonData, "range");
        if (range === "T") {
            data.data.range = "touch";
        } else if (range === "LOS") {
            data.data.range = "los";
        } else if (range === "LOS (A)") {
            data.data.range = "los_a";
        }

        let type = ImportHelper.StringValue(jsonData, "type");
        if (type === "P") {
            data.data.type = "physical";
        } else if (type === "M") {
            data.data.type = "mana";
        }

        return data;
    }
}