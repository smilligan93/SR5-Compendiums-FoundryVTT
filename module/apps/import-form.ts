import { ImportHelper } from "../importer/ImportHelper";
import { Constants } from "../importer/Constants";

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

    async parseXML(xmlSource) {
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
            await this.parseXML(xmlSource);
        });
    }
}









