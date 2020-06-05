import {DataImporter} from "./DataImporter";
import {ImportHelper} from "./ImportHelper";
import {Constants} from "./Constants";
import {RangedParser} from "./weapon/RangedParser";
import {MeleeParser} from "./weapon/MeleeParser";
import {ThrownParser} from "./weapon/ThrownParser";
import DamageElement = Shadowrun.DamageElement;
import WeaponCategory = Shadowrun.WeaponCategory;
import OpposedType = Shadowrun.OpposedType;
import Weapon = Shadowrun.Weapon;
import DamageType = Shadowrun.DamageType;

export class WeaponImporter extends DataImporter {
    CanParse(jsonObject: object): boolean {
        return jsonObject.hasOwnProperty("weapons") && jsonObject["weapons"].hasOwnProperty("weapon");
    }

    GetDefaultData(): Weapon {
        return {
            name: "Unnamed Item",
            folder: null,
            type: "weapon",
            data: {
                description: {
                    value: "",
                    chat: "",
                    source: ""
                },
                action: {
                    type: "varies",
                    category: "",
                    attribute: "agility",
                    attribute2: "",
                    skill: "",
                    spec: false,
                    mod: 0,
                    mod_description: "",
                    damage: {
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
                    },
                    limit: {
                        value: 0,
                        attribute: "",
                        mod: {},
                        base: 0
                    },
                    extended: false,
                    opposed: {
                        type: "defense",
                        attribute: "",
                        attribute2: "",
                        skill: "",
                        mod: 0,
                        description: ""
                    },
                    alt_mod: 0,
                    dice_pool_mod: {}
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
                ammo: {
                    spare_clips: {
                        value: 0,
                        max: 0
                    },
                    current: {
                        value: 0,
                        max: 0
                    }
                },
                range: {
                    category: "",
                    ranges: {
                        short: 0,
                        medium: 0,
                        long: 0,
                        extreme: 0
                    },
                    rc: {
                        value: 0,
                        base: 0,
                        mod: {}
                    },
                    modes: {
                        single_shot: false,
                        semi_auto: false,
                        burst_fire: false,
                        full_auto: false
                    }
                },
                melee: {
                    reach: 0
                },
                thrown: {
                    ranges: {
                        short: 0,
                        medium: 0,
                        long: 0,
                        extreme: 0,
                        attribute: ""
                    },
                    blast: {
                        radius: 0,
                        dropoff: 0
                    }
                },
                category: "range"
            },
            permission: {
                default: 2
            }
        };
    }

    protected GetWeaponType(weaponJson: object): WeaponCategory {
        let type = ImportHelper.stringValue(weaponJson, "type");
        //melee is the least specific, all melee entries are accurate
        if (type === "Melee") {
            return "melee";
        } else {
            // skill takes priorities over category
            if (weaponJson.hasOwnProperty("useskill")) {
                let skill = ImportHelper.stringValue(weaponJson, "useskill");
                if (skill === "Throwing Weapons") return "thrown";
            }

            // category is the fallback
            let category = ImportHelper.stringValue(weaponJson, "category");
            if (category === "Throwing Weapons") return "thrown";
            // ranged is everything else
            return "range";
        }
    }

    async Parse(jsonObject: object): Promise<Entity> {
        let folders = {};
        let jsonCategories = jsonObject["categories"]["category"];
        for (let i = 0; i < jsonCategories.length; i++) {
            let categoryName = jsonCategories[i][ImportHelper.CHAR_KEY];
            folders[categoryName] = await ImportHelper.GetFolderAtPath(
                `${Constants.ROOT_IMPORT_FOLDER_NAME}/Weapons/${categoryName}`,
                true
            );
        }

        folders["Gear"] = await ImportHelper.GetFolderAtPath(
            `${Constants.ROOT_IMPORT_FOLDER_NAME}/Weapons/Gear`,
            true
        );
        folders["Quality"] = await ImportHelper.GetFolderAtPath(
            `${Constants.ROOT_IMPORT_FOLDER_NAME}/Weapons/Quality`,
            true
        );

        let rangedParser = new RangedParser();
        let meleeParser = new MeleeParser();
        let thrownParser = new ThrownParser();

        let weaponDatas: Weapon[] = [];
        let jsonWeapons = jsonObject["weapons"]["weapon"];
        for (let i = 0; i < jsonWeapons.length; i++) {
            let jsonData = jsonWeapons[i];

            let category = ImportHelper.stringValue(jsonData, "category");
            // A single item does not meet normal rules, thanks Chummer.
            if (category === "Hold-outs") {
                category = "Holdouts";
            }

            let folder = folders[category];

            let data = this.GetDefaultData();
            data.name = ImportHelper.stringValue(jsonData, "name");
            data.folder = folder.id;

            data.data.description.source = `${ImportHelper.stringValue(jsonData, "source")} ${ImportHelper.stringValue(jsonData, "page")}`;
            data.data.technology.rating = 2;
            data.data.technology.availability = ImportHelper.stringValue(jsonData, "avail");
            data.data.technology.cost = ImportHelper.intValue(jsonData, "cost", 0);

            data.data.technology.conceal.base = ImportHelper.intValue(jsonData, "conceal");

            data.data.category = this.GetWeaponType(jsonData);

            switch (data.data.category) {
                case "range":
                    data = rangedParser.Parse(jsonData, data);
                    break;
                case "melee":
                    data = meleeParser.Parse(jsonData, data);
                    break;
                case "thrown":
                    data = thrownParser.Parse(jsonData, data);
                    break;
            }

            weaponDatas.push(data);
        }

        return await Item.create(weaponDatas);
    }
}