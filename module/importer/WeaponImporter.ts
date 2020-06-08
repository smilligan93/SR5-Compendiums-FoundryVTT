import {DataImporter} from "./DataImporter";
import {ImportHelper} from "./ImportHelper";
import {Constants} from "./Constants";
import {RangedParser} from "../parser/weapon/RangedParser";
import {MeleeParser} from "../parser/weapon/MeleeParser";
import {ThrownParser} from "../parser/weapon/ThrownParser";
import DamageElement = Shadowrun.DamageElement;
import WeaponCategory = Shadowrun.WeaponCategory;
import OpposedType = Shadowrun.OpposedType;
import Weapon = Shadowrun.Weapon;
import DamageType = Shadowrun.DamageType;
import {ParserMap} from "../parser/ParserMap";

export class WeaponImporter extends DataImporter {
    public categoryTranslations: any;
    public weaponTranslations: any;

    public jsoni18n: any;
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

    ExtractTranslation() {

    }

    private static GetWeaponType(weaponJson: object): WeaponCategory {
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
        const folders = await ImportHelper.MakeCategoryFolders(jsonObject, "Weapons", this.categoryTranslations);
        const gearCategory = "gear";
        const qualityCategory = "quality";


        folders[gearCategory] = await ImportHelper.GetFolderAtPath(
            `${Constants.ROOT_IMPORT_FOLDER_NAME}/Weapons/Gear`,
            true
        );
        folders[gearCategory] = await ImportHelper.GetFolderAtPath(
            `${Constants.ROOT_IMPORT_FOLDER_NAME}/Weapons/Quality`,
            true
        );

        console.log(folders);

        const parser = new ParserMap<Weapon>(WeaponImporter.GetWeaponType, [
            { key: "range", value: new RangedParser() },
            { key: "melee", value: new MeleeParser() },
            { key: "thrown", value: new ThrownParser() },
        ]);

        let datas: Weapon[] = [];
        let jsonDatas = jsonObject["weapons"]["weapon"];
        for (let i = 0; i < jsonDatas.length; i++) {
            let jsonData = jsonDatas[i];

            let data = parser.Parse(jsonData, this.GetDefaultData());
            data.folder = folders[data.data.category].id;

            datas.push(data);
        }

        return await Item.create(datas);
    }
}