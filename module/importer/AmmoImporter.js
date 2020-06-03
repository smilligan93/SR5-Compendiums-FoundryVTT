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
import { Constants } from "./Constants";
export class AmmoImporter extends DataImporter {
    CanParse(jsonObject) {
        return jsonObject.hasOwnProperty("gears") && jsonObject["gears"].hasOwnProperty("gear");
    }
    GetDefaultData() {
        return {
            name: "",
            folder: null,
            type: "ammo",
            data: {
                description: {
                    value: "",
                    chat: "",
                    source: ""
                },
                technology: {
                    rating: 1,
                    availability: "",
                    quantity: 1,
                    cost: 0,
                    equipped: true,
                    conceal: {
                        base: 0,
                        value: 0,
                        mod: {}
                    }
                },
                condition_monitor: {
                    value: 0,
                    max: 0
                },
                element: "",
                ap: 0,
                damage: 0,
                damageType: "physical",
                blast: {
                    radius: 0,
                    dropoff: 0
                }
            },
            permission: {
                default: 2
            }
        };
    }
    Parse(jsonObject) {
        return __awaiter(this, void 0, void 0, function* () {
            let ammoDatas = [];
            let jsonAmmos = jsonObject["gears"]["gear"];
            for (let i = 0; i < jsonAmmos.length; i++) {
                let jsonData = jsonAmmos[i];
                if (ImportHelper.stringValue(jsonData, "category", "") !== "Ammunition") {
                    continue;
                }
                let data = this.GetDefaultData();
                data.name = ImportHelper.stringValue(jsonData, "name");
                data.data.description.source = `${ImportHelper.stringValue(jsonData, "source")} ${ImportHelper.stringValue(jsonData, "page")}`;
                data.data.technology.rating = 2;
                data.data.technology.availability = ImportHelper.stringValue(jsonData, "avail");
                data.data.technology.cost = ImportHelper.intValue(jsonData, "cost", 0);
                let bonusData = ImportHelper.objectValue(jsonData, "weaponbonus", null);
                if (bonusData !== undefined && bonusData !== null) {
                    data.data.ap = ImportHelper.intValue(bonusData, "ap", 0);
                    data.data.damage = ImportHelper.intValue(bonusData, "damage", 0);
                    let damageType = ImportHelper.stringValue(bonusData, "damagetype", "");
                    if (damageType.length > 0) {
                        if (damageType.includes("P")) {
                            data.data.damageType = "physical";
                        }
                        else if (damageType.includes("S")) {
                            data.data.damageType = "stun";
                        }
                        else if (damageType.includes("M")) {
                            data.data.damageType = "matrix";
                        }
                    }
                }
                let shouldLookForWeapons = false;
                let nameLower = data.name.toLowerCase();
                ["greande", "rocket", "missile"].forEach((compare) => {
                    shouldLookForWeapons = shouldLookForWeapons || nameLower.includes(compare);
                });
                if (shouldLookForWeapons) {
                    let foundWeapon = ImportHelper.findItem((item) => {
                        return item.name.toLowerCase() === nameLower;
                    });
                    if (foundWeapon !== null) {
                        data.data.damage = foundWeapon.data.data.action.damage.value;
                        data.data.ap = foundWeapon.data.data.action.damage.ap.value;
                    }
                }
                //TODO: Derive from mods.
                // data.data.technology.conceal.base = ImportHelper.intValue(jsonData, "conceal");
                // data.data.technology.conceal.value = ImportHelper.intValue(jsonData, "conceal");
                ammoDatas.push(data);
            }
            for (let i = 0; i < ammoDatas.length; i++) {
                let folderName = "Misc";
                let ammo = ammoDatas[i];
                let splitName = ammo.name.split(":");
                if (splitName.length > 1) {
                    folderName = splitName[0].trim();
                }
                let folder = yield ImportHelper.GetFolderAtPath(`${Constants.ROOT_IMPORT_FOLDER_NAME}/Ammo/${folderName}`, true);
                ammo.folder = folder.id;
            }
            return yield Item.create(ammoDatas);
        });
    }
}
