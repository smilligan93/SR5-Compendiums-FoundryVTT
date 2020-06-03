var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WeaponImporter } from "../importer/WeaponImporter";
import { ArmorImporter } from "../importer/ArmorImporter";
import { DataImporter } from "../importer/DataImporter";
import { AmmoImporter } from "../importer/AmmoImporter";
import { ModImporter } from "../importer/ModImporter";
let Import = /** @class */ (() => {
    class Import extends Application {
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
        parseXML(xmlSource) {
            return __awaiter(this, void 0, void 0, function* () {
                let jsonSource = yield DataImporter.xml2json(xmlSource);
                console.log(jsonSource);
                for (const di of Import.Importers) {
                    if (di.CanParse(jsonSource)) {
                        yield di.Parse(jsonSource);
                    }
                }
            });
        }
        activateListeners(html) {
            html.find("button[type='submit']").on("click", (event) => __awaiter(this, void 0, void 0, function* () {
                event.preventDefault();
                let xmlSource = html.find("#xml-source").val();
                yield this.parseXML(xmlSource);
            }));
        }
    }
    //Order is important, ex. some weapons need mods to fully import
    Import.Importers = [
        new ModImporter(),
        new WeaponImporter(),
        new ArmorImporter(),
        new AmmoImporter(),
    ];
    return Import;
})();
export { Import };
