import {Constants} from "./Constants";

/**
 * An import helper to standardize data extraction.
 * Mostly conceived to reduced required refactoring if Chummer changes data file layout.
 * Also contains helper methods to safely parse values to appropriate types.
 */
export class ImportHelper {
    public static readonly CHAR_KEY = "_TEXT";

    /**
     * Helper method to create a new folder.
     * @param name The name of the folder.
     * @param parent The parent folder.
     * @returns {Promise<Folder>} A promise that resolves with the folder object when the folder is created.
     */
    public static async NewFolder(name: string, parent: Folder | null = null): Promise<Folder> {
        return await Folder.create({
            type: "Item",
            parent: (parent === null) ? null : parent.id,
            name: name
        });
    }

    /**
     * Get a folder at a path in the items directory.
     * @param path The absolute path of the folder.
     * @param mkdirs If true, will make all folders along the hierarchy if they do not exist.
     * @returns A promise that will resolve with the found folder.
     */
    public static async GetFolderAtPath(path: string, mkdirs: boolean = false): Promise<Entity> {
        let idx = 0;
        let curr, last = null;
        let next = path.split("/");
        while (idx < next.length) {
            curr = game.folders.find((folder) => folder.parent === last && folder.name === next[idx]);
            if (curr === null) {
                if (!mkdirs) {
                    return Promise.reject(`Unable to find folder: ${path}`);
                }

                curr = await ImportHelper.NewFolder(next[idx], last);
            }
            last = curr;
            idx++;
        }
        return Promise.resolve(curr);
    }

    /**
     * Get a value from the the provided jsonData, optionally returning a default value if it is not found
     * or is unable to be parsed to an integer.
     * @param jsonData The data to get the keyed value in.
     * @param key The key to check for the value under.
     * @param fallback An optional default value to return if the key is not found.
     */
    public static intValue(jsonData: object, key: string, fallback: number|undefined = undefined): number {
        try {
            return parseInt(jsonData[key][ImportHelper.CHAR_KEY]);
        }
        catch (e) {
            if (fallback !== undefined) {
                return fallback;
            } else {
                throw e;
            }
        }
    }

    /**
     * Get a value from the the provided jsonData, optionally returning a default value if it is not found.
     * @param jsonData The data to get the keyed value in.
     * @param key The key to check for the value under.
     * @param fallback An optional default value to return if the key is not found.
     */
    public static stringValue(jsonData: object, key: string|number, fallback: string|undefined = undefined): string {
        try {
            return jsonData[key][ImportHelper.CHAR_KEY];
        }
        catch (e) {
            if (fallback !== undefined) {
                return fallback;
            } else {
                throw e;
            }
        }
    }

    /**
     * Get an object from the the provided jsonData, optionally returning a default value if it is not found.
     * @param jsonData The data to get the keyed value in.
     * @param key The key to check for the value under.
     * @param fallback An optional default value to return if the key is not found.
     */
    public static objectValue(jsonData: object, key: string|number, fallback: object|null|undefined = undefined): object|null {
        try {
            return jsonData[key];
        }
        catch (e) {
            if (fallback !== undefined) {
                return fallback;
            } else {
                throw e;
            }
        }
    }

    /**
     * A decorated parseInt which supports error suppression by providing a default value to
     * be returned in the event an error is raised.
     * @param value The value to parse.
     * @param fallback The devault value to return in case of error.
     */
    public static parseInt(value: any, fallback: number|undefined = undefined): number {
        try {
            return parseInt(value);
        }
        catch (e) {
            if (fallback !== undefined) {
                return fallback;
            } else {
                throw e;
            }
        }
    }

    //TODO
    public static findItem(nameOrCmp: string|ItemComparer): Entity {
        let result: any | null;
        if (typeof (nameOrCmp) === "string") {
            result = game.items.find((item) => item.name == nameOrCmp);
        } else {
            result = game.items.find(nameOrCmp);
        }
        return result;
    }

    //TODO
    public static async MakeCategoryFolders(jsonData: object, path: string, jsonCategoryTranslations?: object | undefined): Promise<{ [name: string]: Folder }> {
        let folders = {};
        let jsonCategories = jsonData["categories"]["category"];

        for (let i = 0; i < jsonCategories.length; i++) {
            let categoryName = jsonCategories[i][ImportHelper.CHAR_KEY];
            // use untranslated category name for easier mapping during DataImporter.Parse implementations.
            let origCategoryName = categoryName;
            if (jsonCategoryTranslations && jsonCategoryTranslations.hasOwnProperty(categoryName)) {
                categoryName = jsonCategoryTranslations[categoryName];
            }
            folders[origCategoryName.toLowerCase()] = await ImportHelper.GetFolderAtPath(
                `${Constants.ROOT_IMPORT_FOLDER_NAME}/${path}/${categoryName}`,
                true
            );
        }

        return folders;
    }

    public static ExtractDataFileTranslation(jsoni18n, dataFileName): object {
        for (let i = 0; i < jsoni18n.length; i++) {
            const translation = jsoni18n[i];
            if (translation.$.file === dataFileName) {
                return translation;
            }
        }
        return {};
    };

    public static ExtractCategoriesTranslation(jsonChummeri18n) {
        const categoryTranslations = {};
        if (jsonChummeri18n && jsonChummeri18n.hasOwnProperty("categories")) {
            jsonChummeri18n.categories.category.forEach(category => {
                const name = category[ImportHelper.CHAR_KEY];
                const translate = category.$.translate;
                categoryTranslations[name] = translate;
            })
        }
        return categoryTranslations;
    }

    public static ExtractItemTranslation(jsonItemsi18n, typeKey, listKey) {
        const itemTranslation = {};
        if (jsonItemsi18n && jsonItemsi18n[typeKey] && jsonItemsi18n[typeKey][listKey] && jsonItemsi18n[typeKey][listKey].length > 0) {
            jsonItemsi18n[typeKey][listKey].forEach(item => {
                const name = item.name[ImportHelper.CHAR_KEY];
                const translate = item.translate[ImportHelper.CHAR_KEY];
                itemTranslation[name] = translate;
            })
        }

        return itemTranslation;
    }

    public static MapNameToTranslation(translationMap, name): string {
        if (translationMap && translationMap.hasOwnProperty(name)) {
            return translationMap[name];
        }
        return name;
    }
}
type ItemComparer = (item: Item) => boolean;