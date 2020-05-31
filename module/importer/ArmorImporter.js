var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DataImporter } from "./DataImporter";
import { ImportHelper } from "./ImportHelper";
export class ArmorImporter extends DataImporter {
    canParse(jsonObject) {
        return jsonObject.hasOwnProperty("armors") && jsonObject["armors"].hasOwnProperty("armor");
    }
    getDefaultData(objectType = undefined) {
        return undefined;
    }
    parse(jsonObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const intValue = ImportHelper.intValue;
            const stringValue = ImportHelper.stringValue;
            const parseInt = ImportHelper.parseInt;
            let armorFolder = yield ImportHelper.NewFolder("SR5e Armor");
            let armorCategoryFolders = {};
            let jsonCategories = jsonObject["categories"]["category"];
            for (let i = 0; i < jsonCategories.length; i++) {
                let categoryName = ImportHelper.stringValue(jsonCategories, i);
                armorCategoryFolders[categoryName] = yield ImportHelper.NewFolder(categoryName, armorFolder);
                console.log(categoryName);
                console.log(armorCategoryFolders[categoryName]);
            }
            let armorDatas = [];
            let jsonArmors = jsonObject["armors"]["armor"];
            for (let i = 0; i < jsonArmors.length; i++) {
                let jsonData = jsonArmors[i];
                let category = stringValue(jsonData, "category");
                let folder = armorCategoryFolders[category];
                let data = {
                    name: stringValue(jsonData, "name"),
                    folder: folder.id,
                    type: "armor",
                    data: {
                        description: {
                            value: "",
                            chat: "",
                            source: `${stringValue(jsonData, "source")} ${stringValue(jsonData, "page")}`
                        },
                        technology: {
                            rating: 2,
                            availability: stringValue(jsonData, "avail"),
                            quantity: 1,
                            cost: intValue(jsonData, "cost"),
                            equipped: true,
                            concealability: 0
                        },
                        armor: {
                            value: intValue(jsonData, "armor"),
                            mod: stringValue(jsonData, "armor").includes("+"),
                            acid: 0,
                            cold: 0,
                            fire: 0,
                            electricity: 0,
                            radiation: 0
                        }
                    },
                    permission: {
                        default: 2
                    }
                };
                armorDatas.push(data);
            }
            return Item.create(armorDatas);
        });
    }
}
