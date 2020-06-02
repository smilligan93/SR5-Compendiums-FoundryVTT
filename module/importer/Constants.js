let Constants = /** @class */ (() => {
    class Constants {
    }
    Constants.MAP_CATEGORY_TO_SKILL = {
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
    Constants.WEAPON_RANGES = {
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
            short: 1,
            medium: 10,
            long: 30,
            extreme: 60,
            attribute: "strength"
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
    Constants.ROOT_IMPORT_FOLDER_NAME = "SR5e";
    return Constants;
})();
export { Constants };