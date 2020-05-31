const  {DataImporter} = import("../importer/DataImporter.js");

class Helper {
    static intValue = (jsonData, key) => parseInt(jsonData[key]['_text']);
    static intValueSafe = (jsonData, key, defaultValue = 0) => {
        try {
            return parseInt(jsonData[key]["_text"]);
        } catch (e) {
            return defaultValue;
        }
    };
    static stringValue = (jsonData, key) => jsonData[key]['_text'];
    static stringValueSafe = (jsonData, key, defaultValue) => {
        return (jsonData.hasOwnProperty(key)) ? Helper.stringValue(jsonData, key) : defaultValue;
    };
    static parseIntSafe = (value, defaultValue = 0) => {
        try {
            return parseInt(value);
        } catch (e) {
            return defaultValue;
        }
    };
}

export class Import extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.id = 'chummer-data-import';
        options.classes = ["app", "window-app", "filepicker"];
        options.title = 'Chummer/Data Import';
        options.template = 'modules/shadowrun5e-compendiums/templates/apps/compendium-import.html';
        options.width = 600;
        options.height = "auto";
        return options;
    }

    static categoryToRangesMap = {
        "Tasers": {
            short: 5,
            medium: 10,
            long: 15,
            extreme: 20
        },
        "Holdouts": {
            short: 5,
            medium: 15,
            long: 30,
            extreme: 50
        },
        "Light Pistols": {
            short: 5,
            medium: 15,
            long: 30,
            extreme: 50
        },
        "Heavy Pistols": {
            short: 5,
            medium: 20,
            long: 40,
            extreme: 60
        },
        "Machine Pistols": {
            short: 5,
            medium: 15,
            long: 30,
            extreme: 50
        },
        "Submachine Guns": {
            short: 10,
            medium: 40,
            long: 80,
            extreme: 150
        },
        "Assault Rifles": {
            short: 25,
            medium: 150,
            long: 350,
            extreme: 550
        },
        "Shotguns": {
            short: 10,
            medium: 40,
            long: 80,
            extreme: 150
        },
        "Shotguns (slug)": {
            short: 10,
            medium: 40,
            long: 80,
            extreme: 150
        },
        "Shotguns (flechette)": {
            short: 15,
            medium: 30,
            long: 45,
            extreme: 60
        },
        "Sniper Rifles": {
            short: 50,
            medium: 350,
            long: 800,
            extreme: 1500
        },
        "Sporting Rifles": {
            short: 50,
            medium: 250,
            long: 500,
            extreme: 750
        },
        "Light Machine Guns": {
            short: 25,
            medium: 200,
            long: 400,
            extreme: 800
        },
        "Medium/Heavy Machinegun": {
            short: 40,
            medium: 250,
            long: 750,
            extreme: 1200
        },
        "Assault Cannons": {
            short: 50,
            medium: 300,
            long: 750,
            extreme: 1500
        },
        "Grenade Launchers": {
            min: 5,
            short: 50,
            medium: 100,
            long: 150,
            extreme: 500
        },
        "Missile Launchers": {
            min: 20,
            short: 70,
            medium: 150,
            long: 450,
            extreme: 1500
        },
        "Bows": {
            short: null,
            medium: null,
            long: null,
            extreme: null
        },
        "Light Crossbows": {
            short: 6,
            medium: 24,
            long: 60,
            extreme: 120
        },
        "Medium Crossbows": {
            short: 9,
            medium: 36,
            long: 90,
            extreme: 150
        },
        "Heavy Crossbows": {
            short: 15,
            medium: 45,
            long: 120,
            extreme: 180
        },
        "Thrown Knife": {
            short: 1,
            medium: 2,
            long: 3,
            extreme: 5,
            attribute: "strength"
        },
        "Net": {
            short: 0.5,
            medium: 1,
            long: 1.5,
            extreme: 2.5,
            attribute: "strength"
        },
        "Shuriken": {
            short: 1,
            medium: 2,
            long: 5,
            extreme: 7,
            attribute: "strength"
        },
        "Standard Grenade": {
            short: 2,
            medium: 4,
            long: 6,
            extreme: 10,
            attribute: "strength"
        },
        "Aerodynamic Grenade": {
            min: 0,
            short: 2,
            medium: 4,
            long: 8,
            extreme: 15,
            attribute: "strength"
        },
        "Harpoon Gun": {
            short: 5,
            medium: 20,
            long: 40,
            extreme: 60
        },
        "Harpoon Gun (Underwater)": {
            short: 6,
            medium: 24,
            long: 60,
            extreme: 120
        },
        "Flamethrowers": {
            short: 15,
            medium: 20,
            long: -1,
            extreme: -1
        }
    };
    static categoryToSkillMap = {
        "Assault Cannons": "heavy_weapons",
        "Assault Rifles": "automatics",
        "Blades": "blades",
        "Bows": "archery",
        "Carbines": "automatics",
        "Clubs": "clubs",
        "Crossbows": "archery",
        "Exotic Melee Weapons": "exotic_melee",
        "Exotic Ranged Weapons": "exotic_ranged",
        "Flamethrowers": "exotic_ranged",
        "Grenade Launchers": "heavy_weapons",
        "Heavy Machine Guns": "heavy_weapons",
        "Heavy Pistols": "pistols",
        "Holdouts": "pistols",
        "Laser Weapons": "exotic_ranged",
        "Light Machine Guns": "heavy_weapons",
        "Light Pistols": "pistols",
        "Machine Pistols": "automatics",
        "Medium Machine Guns": "automatics",
        "Missile Launchers": "heavy_weapons",
        "Shotguns": "longarms",
        "Sniper Rifles": "longarms",
        "Sporting Rifles": "longarms",
        "Submachine Guns": "automatics",
        "Tasers": "pistols",
        "Unarmed": "unarmed_combat"
    };

    /**
     * Helper method to create a new folder.
     * @param name The name of the folder.
     * @param parent The parent folder.
     * @returns {Promise<Entity|Entity[]>} A promise that resolves with the folder object when the folder is created..
     */
    static async NewFolder(name, parent = null) {
        return await Folder.create({
            type: "Item",
            parent: (parent == null) ? null : parent.id,
            name: name
        });
    }

    static async parseWeapons(rootFolder, jsonSource) {
        // Copy functions to local
        const intValue = Helper.intValue;
        const intValueSafe = Helper.intValueSafe;
        const stringValue = Helper.stringValue;
        const stringValueSafe = Helper.stringValueSafe;
        const parseIntSafe = Helper.parseIntSafe;

        let weaponsFolder = await Import.NewFolder("Weapons", rootFolder);

        let jsonCategories = jsonSource["categories"]["category"];
        let weaponCategoryFolders = {};
        for (let i = 0; i < jsonCategories.length; i++) {
            let categoryName = jsonCategories[i]["_text"];
            weaponCategoryFolders[categoryName] = await this.NewFolder(categoryName, weaponsFolder);
        }
        weaponCategoryFolders["Gear"] = await this.NewFolder("Gear", weaponsFolder);
        weaponCategoryFolders["Quality"] = await this.NewFolder("Quality", weaponsFolder);

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
            let category = stringValueSafe(weaponJson, "range", stringValue(weaponJson, "category"));
            if (Import.categoryToRangesMap.hasOwnProperty(category)) {
                return Import.categoryToRangesMap[category];
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
            let damageCode = jsonDamage.match(/[0-9]+[PS](\(f\))?/g);

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
            let damageAp = intValueSafe(weaponJson, "ap", 0);

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
            let damageCode = jsonDamage.match(/(STR)([+-]?)([1-9]*)\)([PS])/g);

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
            let damageAp = intValueSafe(weaponJson, "ap", 0);

            let splitDamageCode = damageCode.split(")");
            let damageType = (splitDamageCode[1].includes("P")) ? "physical" : "stun";

            let splitBaseCode = damageCode.includes("+") ? splitDamageCode[0].split("+") : splitDamageCode[0].split("-");
            if (splitDamageCode[0].includes("+") || splitDamageCode[0].includes("-")) {
                damageBase = parseIntSafe(splitBaseCode[1], 0);
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
                if (Import.categoryToSkillMap.hasOwnProperty(jsonSkill)) {
                    return Import.categoryToSkillMap[jsonSkill];
                }
                return nameToId(jsonSkill);
            } else {
                let category = stringValue(jsonObject, "category");
                if (Import.categoryToSkillMap.hasOwnProperty(category)) {
                    return Import.categoryToSkillMap[category];
                }

                let type = stringValue(jsonObject, "type").toLowerCase();
                return (type === "ranged") ? "exotic_range" : "exotic_melee";
            }
        };

        let weaponDatas = [];
        let jsonWeapons = jsonSource["weapons"]["weapon"];
        for (let i = 0; i < jsonWeapons.length; i++) {
            let jsonData = jsonWeapons[i];

            let category = stringValue(jsonData, "category");
            // A single item does not meet normal rules, thanks Chummer.
            if (category === "Hold-outs") {
                category = "Holdouts";
            }

            let folder = weaponCategoryFolders[category];
            let weaponType = ParseWeaponType(jsonData);
            let data = {
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
                        cost: intValueSafe(jsonData, "cost"),
                        equipped: true,
                        concealability: intValue(jsonData, "conceal")
                    },
                    category: weaponType
                },
                permission: {
                    default: ENTITY_PERMISSIONS.OBSERVER
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
                            value: intValueSafe(jsonData, "accuracy", 0),
                            attribute: "physical",
                            mod: 0,
                            base: intValueSafe(jsonData, "accuracy", 0)
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

        await Item.create(weaponDatas);
    }

    static async parseArmors(rootFolder, jsonSource) {
        const intValue = Helper.intValue;
        const intValueSafe = Helper.intValueSafe;
        const stringValue = Helper.stringValue;
        const stringValueSafe = Helper.stringValueSafe;
        const parseIntSafe = Helper.parseIntSafe;

        let armorFolder = await Import.NewFolder("Armor", rootFolder);

        let armorCategoryFolders = {};
        let jsonCategories = jsonSource["categories"]["category"];
        for (let i = 0; i < jsonCategories.length; i++) {
            let categoryName = jsonCategories[i]["_text"];
            armorCategoryFolders[categoryName] = await this.NewFolder(categoryName, armorFolder);
        }

        let armorDatas = [];
        let jsonArmors = jsonSource["armors"]["armor"];
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
                        cost: intValueSafe(jsonData, "cost"),
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
                    default: ENTITY_PERMISSIONS.OBSERVER
                }
            };

            armorDatas.push(data);
        }

        await Item.create(armorDatas);
    }

    static async parseXML(xmlSource) {
        let rootFolder = await Import.NewFolder("SR5 Imported Data");
        let jsonSource = DataImporter.Parse(xmlSource);

        if (jsonSource.hasOwnProperty("weapons")) {
            await Import.parseWeapons(rootFolder, jsonSource);
        } else if (jsonSource.hasOwnProperty("armors")) {
            await Import.parseArmors(rootFolder, jsonSource);
        }
    }

    activateListeners(html) {
        html.find("button[type='submit']").on("click", async (event) => {
            event.preventDefault();

            let xmlSource = html.find("#xml-source").val();
            await Import.parseXML(xmlSource);
        });
    }
}









