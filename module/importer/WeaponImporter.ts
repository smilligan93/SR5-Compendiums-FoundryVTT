import { DataImporter } from "./DataImporter";
import { ImportHelper } from "./ImportHelper";
import { Constants } from "./Constants";

declare type WeaponType = "range"|"melee"|"thrown";

export class WeaponImporter extends DataImporter {
    canParse(jsonObject: object): boolean {
        return jsonObject.hasOwnProperty("weapons") && jsonObject["weapons"].hasOwnProperty("weapon");
    }

    getDefaultData(type: WeaponType): object {
        let data: any = {
            name: "Unnamed Item",
            folder: null,
            type: "weapon",
            data: {
                description: {
                    value: "",
                    chat: "",
                    source: ""
                },
                technology: {
                    rating: 1,
                    availability: 0,
                    quantity: 1,
                    cost: "",
                    equipped: true,
                    concealability: 0
                },
                category: type
            },
            permission: {
                default: 2
            }
        };
        switch (type) {
            case "range":
                data.data.action = {
                    type: "varies",
                    category: "",
                    attribute: "agility",
                    skill: "",
                    damage: 0,
                    limit: {
                        value: 0,
                        attribute: "",
                        mod: 0,
                        base: 0
                    },
                    opposed: {
                        type: "defense",
                        attribute: "",
                        attribute2: "",
                        skill: "",
                        mod: 0,
                        description: ""
                    },
                };
                return data;
            case "melee":

                return data;
            case "thrown":

                return data;
            default:
                throw new TypeError("Error: objectType must of type 'range'|'melee'|'thrown'.");
        }
    }

    async parse(jsonObject: object): Promise<Entity> {
        // Copy functions to local
        const intValue = ImportHelper.intValue;
        const stringValue = ImportHelper.stringValue;
        const parseInt = ImportHelper.parseInt;

        let weaponsFolder = await ImportHelper.NewFolder("Weapons");

        let jsonCategories = jsonObject["categories"]["category"];
        let weaponCategoryFolders = {};
        for (let i = 0; i < jsonCategories.length; i++) {
            let categoryName = jsonCategories[i]["_text"];
            weaponCategoryFolders[categoryName] = await ImportHelper.NewFolder(categoryName, weaponsFolder);
        }
        weaponCategoryFolders["Gear"] = await ImportHelper.NewFolder("Gear", weaponsFolder);
        weaponCategoryFolders["Quality"] = await ImportHelper.NewFolder("Quality", weaponsFolder);

        //DONE
        const ParseFiringModes = function(weapon) {
            let firingModesString = stringValue(weapon, "mode");
            return {
                single_shot: firingModesString.includes("SS"),
                semi_auto: firingModesString.includes("SA"),
                burst_fire: firingModesString.includes("BF"),
                full_auto: firingModesString.includes("FA")
            }
        };
        const nameToId = (value) => {
            return value.replace(/[\s\-]/g, "_").toLowerCase();
        };

        /**
         *
         * @param weaponJson
         * @returns {"melee"|"thrown"|"range"}
         * @constructor
         */
        const ParseWeaponType = function (weaponJson) {
            let type = stringValue(weaponJson, "type");
            //melee is the least specific, all melee entries are accurate
            if (type === "Melee") {
                return "melee";
            } else {
                // skill takes priorities over category
                if (weaponJson.hasOwnProperty("useskill")) {
                    let skill = stringValue(weaponJson, "useskill");
                    if (skill === "Throwing Weapons") return "thrown";
                }

                // category is the fallback
                let category = stringValue(weaponJson, "category");
                if (category === "Throwing Weapons") return "thrown";
                // ranged is everything else
                return "range";
            }
        };
        const ParseRanges = function (weaponJson) {
            let category = stringValue(weaponJson, "range", stringValue(weaponJson, "category"));
            if (Constants.WEAPON_RANGES.hasOwnProperty(category)) {
                return Constants.WEAPON_RANGES[category];
            }
            return {
                short: 0,
                medium: 0,
                long: 0,
                extreme: 0
            }
        };

        const ParseRangedDamage = function (weaponJson) {
            let jsonDamage = stringValue(weaponJson, "damage");
            let damageCode: any = jsonDamage.match(/[0-9]+[PS](\(f\))?/g);

            if (damageCode == null) {
                return {
                    type: "",
                    element: "",
                    value: 0,
                    ap: {
                        value: 0,
                        mod: 0,
                        base: 0
                    },
                    attribute: 0,
                    mod: 0,
                    base: 0
                }
            }

            //ignore any other matches for simplicity
            damageCode = damageCode[0];

            let flechette = damageCode.includes("(f)"); //currently unused but handled for when it is
            if (flechette) { damageCode = damageCode.replace("(f)", ""); }

            let damageType = (damageCode.includes("P")) ? "physical" : "stun";
            let damageAmount = parseInt(damageCode.replace(damageType[0].toUpperCase(), ""));
            let damageAp = intValue(weaponJson, "ap", 0);

            return {
                type: damageType,
                element: "",
                value: damageAmount,
                ap: {
                    value: damageAp,
                    mod: 0,
                    base: damageAp
                },
                attribute: "",
                mod: "",
                base: damageAmount
            }
        };
        const ParseMeleeDamage = function (weaponJson) {
            let jsonDamage = stringValue(weaponJson, "damage");
            let damageCode: any = jsonDamage.match(/(STR)([+-]?)([1-9]*)\)([PS])/g);

            if (damageCode == null) {
                return {
                    type: "",
                    element: "",
                    value: 0,
                    ap: {
                        value: 0,
                        mod: 0,
                        base: 0
                    },
                    attribute: 0,
                    mod: 0,
                    base: 0
                }
            }

            damageCode = damageCode[0];

            let damageBase = 0;
            let damageAp = intValue(weaponJson, "ap", 0);

            let splitDamageCode = damageCode.split(")");
            let damageType = (splitDamageCode[1].includes("P")) ? "physical" : "stun";

            let splitBaseCode = damageCode.includes("+") ? splitDamageCode[0].split("+") : splitDamageCode[0].split("-");
            if (splitDamageCode[0].includes("+") || splitDamageCode[0].includes("-")) {
                damageBase = parseInt(splitBaseCode[1], 0);
            }
            let damageAttribute = (damageCode.includes("STR")) ? "strength" : "";

            return {
                type: damageType,
                element: "",
                value: damageBase,
                ap: {
                    value: damageAp,
                    mod: 0,
                    base: damageAp
                },
                attribute: damageAttribute,
                mod: 0,
                base: damageBase
            }
        };

        const ParseAmmo = function(weaponJson) {
            let jsonAmmo = stringValue(weaponJson, "ammo");
            let match = jsonAmmo.match(/[0-9]/g);
            return (match != null) ? match.join("") : 0;
        };

        const ParseSkill = function(jsonObject) {
            if (jsonObject.hasOwnProperty("useskill")) {
                let jsonSkill = stringValue(jsonObject, "useskill");
                if (Constants.MAP_CATEGORY_TO_SKILL.hasOwnProperty(jsonSkill)) {
                    return Constants.MAP_CATEGORY_TO_SKILL[jsonSkill];
                }
                return nameToId(jsonSkill);
            } else {
                let category = stringValue(jsonObject, "category");
                if (Constants.MAP_CATEGORY_TO_SKILL.hasOwnProperty(category)) {
                    return Constants.MAP_CATEGORY_TO_SKILL[category];
                }

                let type = stringValue(jsonObject, "type").toLowerCase();
                return (type === "ranged") ? "exotic_range" : "exotic_melee";
            }
        };

        let weaponDatas = [];
        let jsonWeapons = jsonObject["weapons"]["weapon"];
        for (let i = 0; i < jsonWeapons.length; i++) {
            let jsonData = jsonWeapons[i];

            let category = stringValue(jsonData, "category");
            // A single item does not meet normal rules, thanks Chummer.
            if (category === "Hold-outs") {
                category = "Holdouts";
            }

            let folder = weaponCategoryFolders[category];
            let weaponType = ParseWeaponType(jsonData);
            let data: any = {
                name: stringValue(jsonData, "name"),
                folder: folder.id,
                type: "weapon",
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
                        cost: intValue(jsonData, "cost", 0),
                        equipped: true,
                        concealability: intValue(jsonData, "conceal")
                    },
                    category: weaponType
                },
                permission: {
                    default: 2
                }
            };

            switch (data.data.category) {
                case "range":
                    data.data.action = {
                        type: "varies", //TODO: Proper action types?
                        category: stringValue(jsonData, "category"),
                        attribute: "agility",
                        skill: ParseSkill(jsonData),
                        damage: ParseRangedDamage(jsonData),
                        limit: {
                            value: intValue(jsonData, "accuracy"),
                            attribute: "",
                            mod: 0,
                            base: intValue(jsonData,"accuracy")
                        },
                        opposed: {
                            type: "defense",
                            attribute: "",
                            attribute2: "",
                            skill: "",
                            mod: 0,
                            description: ""
                        },
                    };
                    data.data.range = {
                        ranges: ParseRanges(jsonData),
                        rc: {
                            value: intValue(jsonData, "rc"),
                            mod: 0,
                            base: intValue(jsonData, "rc")
                        },
                        modes: ParseFiringModes(jsonData),
                        mods: [],
                        ammo: {
                            enabled: false,
                            count: {
                                value: 0,
                                max: 0
                            },
                            equipped: {
                                name: "Regular",
                                equipped: true,
                                qty: 0,
                                damage: null,
                                damageType: "physical",
                                element: "",
                                ap: null,
                                blast: {
                                    radius: null,
                                    dropoff: null
                                }
                            },
                            available: [
                                {
                                    name: "Regular",
                                    equipped: true,
                                    qty: 0,
                                    damage: null,
                                    damageType: "physical",
                                    element: "",
                                    ap: null,
                                    blast: {
                                        radius: null,
                                        dropoff: null
                                    }
                                },
                                {"name": "Depleted Uranium", "qty": 0, "equipped": false, "damage": 1, "damageType": "physical", "element": "", "ap": -5, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Silver", "qty": 0, "equipped": false, "damage": 0, "damageType": "physical", "element": "", "ap": 2, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Wood Pulp", "qty": 0, "equipped": false, "damage": -4, "damageType": "physical", "element": "", "ap": 4, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Subsonic", "qty": 0, "equipped": false, "damage": -1, "damageType": "physical", "element": "", "ap": 0, "blast": {"radius": null, "dropoff": null}},
                                {"name": "APDS", "qty": 0, "equipped": false, "damage": 0, "damageType": "physical", "element": "", "ap": -4, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Explosive Rounds", "qty": 0, "equipped": false, "damage": 1, "damageType": "physical", "element": "", "ap": -1, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Flechette Rounds", "qty": 0, "equipped": false, "damage": 2, "damageType": "physical", "element": "", "ap": 5, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Gel Rounds", "qty": 0, "equipped": false, "damage": 0, "damageType": "physical", "element": "", "ap": 1, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Hollow Points", "qty": 0, "equipped": false, "damage": 1, "damageType": "physical", "element": "", "ap": 2, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Stick-n-Shock", "qty": 0, "equipped": false, "damage": -2, "damageType": "physical", "element": "", "ap": 0, "blast": {"radius": null, "dropoff": null}},
                                {"name": "EX-Explosive Rounds", "qty": 0, "equipped": false, "damage": 2, "damageType": "physical", "element": "", "ap": -1, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Frangible Rounds", "qty": 0, "equipped": false, "damage": -1, "damageType": "physical", "element": "", "ap": 4, "blast": {"radius": null, "dropoff": null}},
                                {"name": "Flare Rounds", "qty": 0, "equipped": false, "damage": -2, "damageType": "physical", "element": "", "ap": 2, "blast": {"radius": null, "dropoff": null}},
                                {"name": "AV Rounds", "qty": 0, "equipped": false, "damage": 0, "damageType": "physical", "element": "", "ap": -1, "blast": {"radius": null, "dropoff": null}},
                            ],
                            value: ParseAmmo(jsonData),
                            max: ParseAmmo(jsonData)
                        }
                    };
                    break;
                case "melee":
                    data.data.melee = {
                        reach: intValue(jsonData, "reach")
                    };
                    data.data.action = {
                        type: "complex",
                        category: stringValue(jsonData, "category"),
                        attribute: "agility",
                        skill: ParseSkill(jsonData),
                        damage: ParseMeleeDamage(jsonData),
                        limit: {
                            value: intValue(jsonData, "accuracy"),
                            attribute: "",
                            mod: 0,
                            base: intValue(jsonData,"accuracy")
                        },
                        opposed: {
                            type: "defense",
                            attribute: "",
                            attribute2: "",
                            skill: "",
                            mod: 0,
                            description: ""
                        },
                    };
                    break;
                case "thrown":
                    data.data.action = {
                        type: "varies", //TODO: Proper action types?
                        category: stringValue(jsonData, "category"),
                        attribute: "agility",
                        skill: ParseSkill(jsonData),
                        damage: {
                            type: "physical",
                            element: "",
                            value: 0,
                            ap: {
                                value: 0,
                                mod: 0,
                                base: 0
                            },
                            attribute: 0,
                            mod: 0,
                            base: 0
                        },
                        limit: {
                            value: intValue(jsonData, "accuracy", 0),
                            attribute: "physical",
                            mod: 0,
                            base: intValue(jsonData, "accuracy", 0)
                        },
                        opposed: {
                            type: "defense",
                            attribute: "",
                            attribute2: "",
                            skill: "",
                            mod: 0,
                            description: ""
                        },
                    };
                    data.data.thrown = {
                        ranges: ParseRanges(jsonData),
                    };
                    break;
                default:
                    console.warn(`Category '${data.data.category}' did not match known categories.`);
            }

            weaponDatas.push(data);
        }

        return await Item.create(weaponDatas);
    }
}