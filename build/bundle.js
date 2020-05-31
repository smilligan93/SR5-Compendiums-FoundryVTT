(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Import = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _interopRequireWildcard2 = _interopRequireDefault(require("@babel/runtime/helpers/interopRequireWildcard"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var _import = Promise.resolve().then(function () {
  return (0, _interopRequireWildcard2["default"])(require("../importer/DataImporter.js"));
}),
    DataImporter = _import.DataImporter;

var Helper = function Helper() {
  (0, _classCallCheck2["default"])(this, Helper);
};

(0, _defineProperty2["default"])(Helper, "intValue", function (jsonData, key) {
  return parseInt(jsonData[key]['_text']);
});
(0, _defineProperty2["default"])(Helper, "intValueSafe", function (jsonData, key) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  try {
    return parseInt(jsonData[key]["_text"]);
  } catch (e) {
    return defaultValue;
  }
});
(0, _defineProperty2["default"])(Helper, "stringValue", function (jsonData, key) {
  return jsonData[key]['_text'];
});
(0, _defineProperty2["default"])(Helper, "stringValueSafe", function (jsonData, key, defaultValue) {
  return jsonData.hasOwnProperty(key) ? Helper.stringValue(jsonData, key) : defaultValue;
});
(0, _defineProperty2["default"])(Helper, "parseIntSafe", function (value) {
  var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  try {
    return parseInt(value);
  } catch (e) {
    return defaultValue;
  }
});

var Import = /*#__PURE__*/function (_Application) {
  (0, _inherits2["default"])(Import, _Application);

  var _super = _createSuper(Import);

  function Import() {
    (0, _classCallCheck2["default"])(this, Import);
    return _super.apply(this, arguments);
  }

  (0, _createClass2["default"])(Import, [{
    key: "activateListeners",
    value: function activateListeners(html) {
      html.find("button[type='submit']").on("click", /*#__PURE__*/function () {
        var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(event) {
          var xmlSource;
          return _regenerator["default"].wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  event.preventDefault();
                  xmlSource = html.find("#xml-source").val();
                  _context.next = 4;
                  return Import.parseXML(xmlSource);

                case 4:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }], [{
    key: "NewFolder",

    /**
     * Helper method to create a new folder.
     * @param name The name of the folder.
     * @param parent The parent folder.
     * @returns {Promise<Entity|Entity[]>} A promise that resolves with the folder object when the folder is created..
     */
    value: function () {
      var _NewFolder = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(name) {
        var parent,
            _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                parent = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : null;
                _context2.next = 3;
                return Folder.create({
                  type: "Item",
                  parent: parent == null ? null : parent.id,
                  name: name
                });

              case 3:
                return _context2.abrupt("return", _context2.sent);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function NewFolder(_x2) {
        return _NewFolder.apply(this, arguments);
      }

      return NewFolder;
    }()
  }, {
    key: "parseWeapons",
    value: function () {
      var _parseWeapons = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(rootFolder, jsonSource) {
        var intValue, intValueSafe, stringValue, stringValueSafe, parseIntSafe, weaponsFolder, jsonCategories, weaponCategoryFolders, i, categoryName, ParseFiringModes, nameToId, ParseWeaponType, ParseRanges, ParseRangedDamage, ParseMeleeDamage, ParseAmmo, ParseSkill, weaponDatas, jsonWeapons, _i, jsonData, category, folder, weaponType, data;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                // Copy functions to local
                intValue = Helper.intValue;
                intValueSafe = Helper.intValueSafe;
                stringValue = Helper.stringValue;
                stringValueSafe = Helper.stringValueSafe;
                parseIntSafe = Helper.parseIntSafe;
                _context3.next = 7;
                return Import.NewFolder("Weapons", rootFolder);

              case 7:
                weaponsFolder = _context3.sent;
                jsonCategories = jsonSource["categories"]["category"];
                weaponCategoryFolders = {};
                i = 0;

              case 11:
                if (!(i < jsonCategories.length)) {
                  _context3.next = 19;
                  break;
                }

                categoryName = jsonCategories[i]["_text"];
                _context3.next = 15;
                return this.NewFolder(categoryName, weaponsFolder);

              case 15:
                weaponCategoryFolders[categoryName] = _context3.sent;

              case 16:
                i++;
                _context3.next = 11;
                break;

              case 19:
                _context3.next = 21;
                return this.NewFolder("Gear", weaponsFolder);

              case 21:
                weaponCategoryFolders["Gear"] = _context3.sent;
                _context3.next = 24;
                return this.NewFolder("Quality", weaponsFolder);

              case 24:
                weaponCategoryFolders["Quality"] = _context3.sent;

                //DONE
                ParseFiringModes = function ParseFiringModes(weapon) {
                  var firingModesString = stringValue(weapon, "mode");
                  return {
                    single_shot: firingModesString.includes("SS"),
                    semi_auto: firingModesString.includes("SA"),
                    burst_fire: firingModesString.includes("BF"),
                    full_auto: firingModesString.includes("FA")
                  };
                };

                nameToId = function nameToId(value) {
                  return value.replace(/[\s\-]/g, "_").toLowerCase();
                };
                /**
                 *
                 * @param weaponJson
                 * @returns {"melee"|"thrown"|"range"}
                 * @constructor
                 */


                ParseWeaponType = function ParseWeaponType(weaponJson) {
                  var type = stringValue(weaponJson, "type"); //melee is the least specific, all melee entries are accurate

                  if (type === "Melee") {
                    return "melee";
                  } else {
                    // skill takes priorities over category
                    if (weaponJson.hasOwnProperty("useskill")) {
                      var skill = stringValue(weaponJson, "useskill");
                      if (skill === "Throwing Weapons") return "thrown";
                    } // category is the fallback


                    var category = stringValue(weaponJson, "category");
                    if (category === "Throwing Weapons") return "thrown"; // ranged is everything else

                    return "range";
                  }
                };

                ParseRanges = function ParseRanges(weaponJson) {
                  var category = stringValueSafe(weaponJson, "range", stringValue(weaponJson, "category"));

                  if (Import.categoryToRangesMap.hasOwnProperty(category)) {
                    return Import.categoryToRangesMap[category];
                  }

                  return {
                    "short": 0,
                    medium: 0,
                    "long": 0,
                    extreme: 0
                  };
                };

                ParseRangedDamage = function ParseRangedDamage(weaponJson) {
                  var jsonDamage = stringValue(weaponJson, "damage");
                  var damageCode = jsonDamage.match(/[0-9]+[PS](\(f\))?/g);

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
                    };
                  } //ignore any other matches for simplicity


                  damageCode = damageCode[0];
                  var flechette = damageCode.includes("(f)"); //currently unused but handled for when it is

                  if (flechette) {
                    damageCode = damageCode.replace("(f)", "");
                  }

                  var damageType = damageCode.includes("P") ? "physical" : "stun";
                  var damageAmount = parseInt(damageCode.replace(damageType[0].toUpperCase(), ""));
                  var damageAp = intValueSafe(weaponJson, "ap", 0);
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
                  };
                };

                ParseMeleeDamage = function ParseMeleeDamage(weaponJson) {
                  var jsonDamage = stringValue(weaponJson, "damage");
                  var damageCode = jsonDamage.match(/(STR)([+-]?)([1-9]*)\)([PS])/g);

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
                    };
                  }

                  damageCode = damageCode[0];
                  var damageBase = 0;
                  var damageAp = intValueSafe(weaponJson, "ap", 0);
                  var splitDamageCode = damageCode.split(")");
                  var damageType = splitDamageCode[1].includes("P") ? "physical" : "stun";
                  var splitBaseCode = damageCode.includes("+") ? splitDamageCode[0].split("+") : splitDamageCode[0].split("-");

                  if (splitDamageCode[0].includes("+") || splitDamageCode[0].includes("-")) {
                    damageBase = parseIntSafe(splitBaseCode[1], 0);
                  }

                  var damageAttribute = damageCode.includes("STR") ? "strength" : "";
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
                  };
                };

                ParseAmmo = function ParseAmmo(weaponJson) {
                  var jsonAmmo = stringValue(weaponJson, "ammo");
                  var match = jsonAmmo.match(/[0-9]/g);
                  return match != null ? match.join("") : 0;
                };

                ParseSkill = function ParseSkill(jsonObject) {
                  if (jsonObject.hasOwnProperty("useskill")) {
                    var jsonSkill = stringValue(jsonObject, "useskill");

                    if (Import.categoryToSkillMap.hasOwnProperty(jsonSkill)) {
                      return Import.categoryToSkillMap[jsonSkill];
                    }

                    return nameToId(jsonSkill);
                  } else {
                    var category = stringValue(jsonObject, "category");

                    if (Import.categoryToSkillMap.hasOwnProperty(category)) {
                      return Import.categoryToSkillMap[category];
                    }

                    var type = stringValue(jsonObject, "type").toLowerCase();
                    return type === "ranged" ? "exotic_range" : "exotic_melee";
                  }
                };

                weaponDatas = [];
                jsonWeapons = jsonSource["weapons"]["weapon"];
                _i = 0;

              case 36:
                if (!(_i < jsonWeapons.length)) {
                  _context3.next = 60;
                  break;
                }

                jsonData = jsonWeapons[_i];
                category = stringValue(jsonData, "category"); // A single item does not meet normal rules, thanks Chummer.

                if (category === "Hold-outs") {
                  category = "Holdouts";
                }

                folder = weaponCategoryFolders[category];
                weaponType = ParseWeaponType(jsonData);
                data = {
                  name: stringValue(jsonData, "name"),
                  folder: folder.id,
                  type: "weapon",
                  data: {
                    description: {
                      value: "",
                      chat: "",
                      source: "".concat(stringValue(jsonData, "source"), " ").concat(stringValue(jsonData, "page"))
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
                    "default": ENTITY_PERMISSIONS.OBSERVER
                  }
                };
                _context3.t0 = data.data.category;
                _context3.next = _context3.t0 === "range" ? 46 : _context3.t0 === "melee" ? 49 : _context3.t0 === "thrown" ? 52 : 55;
                break;

              case 46:
                data.data.action = {
                  type: "varies",
                  //TODO: Proper action types?
                  category: stringValue(jsonData, "category"),
                  attribute: "agility",
                  skill: ParseSkill(jsonData),
                  damage: ParseRangedDamage(jsonData),
                  limit: {
                    value: intValue(jsonData, "accuracy"),
                    attribute: "",
                    mod: 0,
                    base: intValue(jsonData, "accuracy")
                  },
                  opposed: {
                    type: "defense",
                    attribute: "",
                    attribute2: "",
                    skill: "",
                    mod: 0,
                    description: ""
                  }
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
                    available: [{
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
                    }, {
                      "name": "Depleted Uranium",
                      "qty": 0,
                      "equipped": false,
                      "damage": 1,
                      "damageType": "physical",
                      "element": "",
                      "ap": -5,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Silver",
                      "qty": 0,
                      "equipped": false,
                      "damage": 0,
                      "damageType": "physical",
                      "element": "",
                      "ap": 2,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Wood Pulp",
                      "qty": 0,
                      "equipped": false,
                      "damage": -4,
                      "damageType": "physical",
                      "element": "",
                      "ap": 4,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Subsonic",
                      "qty": 0,
                      "equipped": false,
                      "damage": -1,
                      "damageType": "physical",
                      "element": "",
                      "ap": 0,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "APDS",
                      "qty": 0,
                      "equipped": false,
                      "damage": 0,
                      "damageType": "physical",
                      "element": "",
                      "ap": -4,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Explosive Rounds",
                      "qty": 0,
                      "equipped": false,
                      "damage": 1,
                      "damageType": "physical",
                      "element": "",
                      "ap": -1,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Flechette Rounds",
                      "qty": 0,
                      "equipped": false,
                      "damage": 2,
                      "damageType": "physical",
                      "element": "",
                      "ap": 5,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Gel Rounds",
                      "qty": 0,
                      "equipped": false,
                      "damage": 0,
                      "damageType": "physical",
                      "element": "",
                      "ap": 1,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Hollow Points",
                      "qty": 0,
                      "equipped": false,
                      "damage": 1,
                      "damageType": "physical",
                      "element": "",
                      "ap": 2,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Stick-n-Shock",
                      "qty": 0,
                      "equipped": false,
                      "damage": -2,
                      "damageType": "physical",
                      "element": "",
                      "ap": 0,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "EX-Explosive Rounds",
                      "qty": 0,
                      "equipped": false,
                      "damage": 2,
                      "damageType": "physical",
                      "element": "",
                      "ap": -1,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Frangible Rounds",
                      "qty": 0,
                      "equipped": false,
                      "damage": -1,
                      "damageType": "physical",
                      "element": "",
                      "ap": 4,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "Flare Rounds",
                      "qty": 0,
                      "equipped": false,
                      "damage": -2,
                      "damageType": "physical",
                      "element": "",
                      "ap": 2,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }, {
                      "name": "AV Rounds",
                      "qty": 0,
                      "equipped": false,
                      "damage": 0,
                      "damageType": "physical",
                      "element": "",
                      "ap": -1,
                      "blast": {
                        "radius": null,
                        "dropoff": null
                      }
                    }],
                    value: ParseAmmo(jsonData),
                    max: ParseAmmo(jsonData)
                  }
                };
                return _context3.abrupt("break", 56);

              case 49:
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
                    base: intValue(jsonData, "accuracy")
                  },
                  opposed: {
                    type: "defense",
                    attribute: "",
                    attribute2: "",
                    skill: "",
                    mod: 0,
                    description: ""
                  }
                };
                return _context3.abrupt("break", 56);

              case 52:
                data.data.action = {
                  type: "varies",
                  //TODO: Proper action types?
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
                  }
                };
                data.data.thrown = {
                  ranges: ParseRanges(jsonData)
                };
                return _context3.abrupt("break", 56);

              case 55:
                console.warn("Category '".concat(data.data.category, "' did not match known categories."));

              case 56:
                weaponDatas.push(data);

              case 57:
                _i++;
                _context3.next = 36;
                break;

              case 60:
                _context3.next = 62;
                return Item.create(weaponDatas);

              case 62:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function parseWeapons(_x3, _x4) {
        return _parseWeapons.apply(this, arguments);
      }

      return parseWeapons;
    }()
  }, {
    key: "parseArmors",
    value: function () {
      var _parseArmors = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(rootFolder, jsonSource) {
        var intValue, intValueSafe, stringValue, stringValueSafe, parseIntSafe, armorFolder, armorCategoryFolders, jsonCategories, i, categoryName, armorDatas, jsonArmors, _i2, jsonData, category, folder, data;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                intValue = Helper.intValue;
                intValueSafe = Helper.intValueSafe;
                stringValue = Helper.stringValue;
                stringValueSafe = Helper.stringValueSafe;
                parseIntSafe = Helper.parseIntSafe;
                _context4.next = 7;
                return Import.NewFolder("Armor", rootFolder);

              case 7:
                armorFolder = _context4.sent;
                armorCategoryFolders = {};
                jsonCategories = jsonSource["categories"]["category"];
                i = 0;

              case 11:
                if (!(i < jsonCategories.length)) {
                  _context4.next = 19;
                  break;
                }

                categoryName = jsonCategories[i]["_text"];
                _context4.next = 15;
                return this.NewFolder(categoryName, armorFolder);

              case 15:
                armorCategoryFolders[categoryName] = _context4.sent;

              case 16:
                i++;
                _context4.next = 11;
                break;

              case 19:
                armorDatas = [];
                jsonArmors = jsonSource["armors"]["armor"];

                for (_i2 = 0; _i2 < jsonArmors.length; _i2++) {
                  jsonData = jsonArmors[_i2];
                  category = stringValue(jsonData, "category");
                  folder = armorCategoryFolders[category];
                  data = {
                    name: stringValue(jsonData, "name"),
                    folder: folder.id,
                    type: "armor",
                    data: {
                      description: {
                        value: "",
                        chat: "",
                        source: "".concat(stringValue(jsonData, "source"), " ").concat(stringValue(jsonData, "page"))
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
                      "default": ENTITY_PERMISSIONS.OBSERVER
                    }
                  };
                  armorDatas.push(data);
                }

                _context4.next = 24;
                return Item.create(armorDatas);

              case 24:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function parseArmors(_x5, _x6) {
        return _parseArmors.apply(this, arguments);
      }

      return parseArmors;
    }()
  }, {
    key: "parseXML",
    value: function () {
      var _parseXML = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(xmlSource) {
        var rootFolder, jsonSource;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return Import.NewFolder("SR5 Imported Data");

              case 2:
                rootFolder = _context5.sent;
                jsonSource = DataImporter.Parse(xmlSource);

                if (!jsonSource.hasOwnProperty("weapons")) {
                  _context5.next = 9;
                  break;
                }

                _context5.next = 7;
                return Import.parseWeapons(rootFolder, jsonSource);

              case 7:
                _context5.next = 12;
                break;

              case 9:
                if (!jsonSource.hasOwnProperty("armors")) {
                  _context5.next = 12;
                  break;
                }

                _context5.next = 12;
                return Import.parseArmors(rootFolder, jsonSource);

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function parseXML(_x7) {
        return _parseXML.apply(this, arguments);
      }

      return parseXML;
    }()
  }, {
    key: "defaultOptions",
    get: function get() {
      var options = (0, _get2["default"])((0, _getPrototypeOf2["default"])(Import), "defaultOptions", this);
      options.id = 'chummer-data-import';
      options.classes = ["app", "window-app", "filepicker"];
      options.title = 'Chummer/Data Import';
      options.template = 'modules/shadowrun5e-compendiums/templates/apps/compendium-import.html';
      options.width = 600;
      options.height = "auto";
      return options;
    }
  }]);
  return Import;
}(Application);

exports.Import = Import;
(0, _defineProperty2["default"])(Import, "categoryToRangesMap", {
  "Tasers": {
    "short": 5,
    medium: 10,
    "long": 15,
    extreme: 20
  },
  "Holdouts": {
    "short": 5,
    medium: 15,
    "long": 30,
    extreme: 50
  },
  "Light Pistols": {
    "short": 5,
    medium: 15,
    "long": 30,
    extreme: 50
  },
  "Heavy Pistols": {
    "short": 5,
    medium: 20,
    "long": 40,
    extreme: 60
  },
  "Machine Pistols": {
    "short": 5,
    medium: 15,
    "long": 30,
    extreme: 50
  },
  "Submachine Guns": {
    "short": 10,
    medium: 40,
    "long": 80,
    extreme: 150
  },
  "Assault Rifles": {
    "short": 25,
    medium: 150,
    "long": 350,
    extreme: 550
  },
  "Shotguns": {
    "short": 10,
    medium: 40,
    "long": 80,
    extreme: 150
  },
  "Shotguns (slug)": {
    "short": 10,
    medium: 40,
    "long": 80,
    extreme: 150
  },
  "Shotguns (flechette)": {
    "short": 15,
    medium: 30,
    "long": 45,
    extreme: 60
  },
  "Sniper Rifles": {
    "short": 50,
    medium: 350,
    "long": 800,
    extreme: 1500
  },
  "Sporting Rifles": {
    "short": 50,
    medium: 250,
    "long": 500,
    extreme: 750
  },
  "Light Machine Guns": {
    "short": 25,
    medium: 200,
    "long": 400,
    extreme: 800
  },
  "Medium/Heavy Machinegun": {
    "short": 40,
    medium: 250,
    "long": 750,
    extreme: 1200
  },
  "Assault Cannons": {
    "short": 50,
    medium: 300,
    "long": 750,
    extreme: 1500
  },
  "Grenade Launchers": {
    min: 5,
    "short": 50,
    medium: 100,
    "long": 150,
    extreme: 500
  },
  "Missile Launchers": {
    min: 20,
    "short": 70,
    medium: 150,
    "long": 450,
    extreme: 1500
  },
  "Bows": {
    "short": null,
    medium: null,
    "long": null,
    extreme: null
  },
  "Light Crossbows": {
    "short": 6,
    medium: 24,
    "long": 60,
    extreme: 120
  },
  "Medium Crossbows": {
    "short": 9,
    medium: 36,
    "long": 90,
    extreme: 150
  },
  "Heavy Crossbows": {
    "short": 15,
    medium: 45,
    "long": 120,
    extreme: 180
  },
  "Thrown Knife": {
    "short": 1,
    medium: 2,
    "long": 3,
    extreme: 5,
    attribute: "strength"
  },
  "Net": {
    "short": 0.5,
    medium: 1,
    "long": 1.5,
    extreme: 2.5,
    attribute: "strength"
  },
  "Shuriken": {
    "short": 1,
    medium: 2,
    "long": 5,
    extreme: 7,
    attribute: "strength"
  },
  "Standard Grenade": {
    "short": 2,
    medium: 4,
    "long": 6,
    extreme: 10,
    attribute: "strength"
  },
  "Aerodynamic Grenade": {
    min: 0,
    "short": 2,
    medium: 4,
    "long": 8,
    extreme: 15,
    attribute: "strength"
  },
  "Harpoon Gun": {
    "short": 5,
    medium: 20,
    "long": 40,
    extreme: 60
  },
  "Harpoon Gun (Underwater)": {
    "short": 6,
    medium: 24,
    "long": 60,
    extreme: 120
  },
  "Flamethrowers": {
    "short": 15,
    medium: 20,
    "long": -1,
    extreme: -1
  }
});
(0, _defineProperty2["default"])(Import, "categoryToSkillMap", {
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
});

},{"../importer/DataImporter.js":2,"@babel/runtime/helpers/asyncToGenerator":5,"@babel/runtime/helpers/classCallCheck":6,"@babel/runtime/helpers/createClass":7,"@babel/runtime/helpers/defineProperty":8,"@babel/runtime/helpers/get":9,"@babel/runtime/helpers/getPrototypeOf":10,"@babel/runtime/helpers/inherits":11,"@babel/runtime/helpers/interopRequireDefault":12,"@babel/runtime/helpers/interopRequireWildcard":13,"@babel/runtime/helpers/possibleConstructorReturn":14,"@babel/runtime/regenerator":18}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DataImporter =
/** @class */
function () {
  function DataImporter() {}

  return DataImporter;
}();

exports.DataImporter = DataImporter;

},{}],3:[function(require,module,exports){
"use strict";

var _import = require("./apps/import");

Hooks.on("renderItemDirectory", function (app, html) {
  var button = $("<button>Import Chummer Data</button>");
  html.find("footer").before(button);
  button.on("click", function (event) {
    new _import.Import().render(true);
  });
});

},{"./apps/import":1}],4:[function(require,module,exports){
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],5:[function(require,module,exports){
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],6:[function(require,module,exports){
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],7:[function(require,module,exports){
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],8:[function(require,module,exports){
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;
},{}],9:[function(require,module,exports){
var superPropBase = require("./superPropBase");

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;
},{"./superPropBase":16}],10:[function(require,module,exports){
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],11:[function(require,module,exports){
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":15}],12:[function(require,module,exports){
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

module.exports = _interopRequireDefault;
},{}],13:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {
    return {
      "default": obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj["default"] = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

module.exports = _interopRequireWildcard;
},{"../helpers/typeof":17}],14:[function(require,module,exports){
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":17,"./assertThisInitialized":4}],15:[function(require,module,exports){
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],16:[function(require,module,exports){
var getPrototypeOf = require("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":10}],17:[function(require,module,exports){
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],18:[function(require,module,exports){
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":19}],19:[function(require,module,exports){
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}]},{},[3]);
