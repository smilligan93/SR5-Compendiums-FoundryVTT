var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * An import helper to standardize data extraction.
 * Mostly conceived to reduced required refactoring if Chummer changes data file layout.
 * Also contains helper methods to safely parse values to appropriate types.
 */
let ImportHelper = /** @class */ (() => {
    class ImportHelper {
        /**
         * Helper method to create a new folder.
         * @param name The name of the folder.
         * @param parent The parent folder.
         * @returns {Promise<Folder>} A promise that resolves with the folder object when the folder is created.
         */
        static NewFolder(name, parent = null) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield Folder.create({
                    type: "Item",
                    parent: (parent === null) ? null : parent.id,
                    name: name
                });
            });
        }
        /**
         * Get a folder at a path in the items directory.
         * @param path The absolute path of the folder.
         * @param mkdirs If true, will make all folders along the hierarchy if they do not exist.
         * @returns A promise that will resolve with the found folder.
         */
        static GetFolderAtPath(path, mkdirs = false) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log(`Trying to find the following path: ${path}`);
                let idx = 0;
                let curr, last = null;
                let next = path.split("/");
                while (idx < next.length) {
                    curr = game.folders.find((folder) => folder.parent === last && folder.name === next[idx]);
                    if (curr === null) {
                        if (!mkdirs) {
                            return Promise.reject(`Unable to find folder: ${path}`);
                        }
                        curr = yield ImportHelper.NewFolder(next[idx], last);
                    }
                    last = curr;
                    idx++;
                }
                return Promise.resolve(curr);
            });
        }
        /**
         * Get a value from the the provided jsonData, optionally returning a default value if it is not found
         * or is unable to be parsed to an integer.
         * @param jsonData The data to get the keyed value in.
         * @param key The key to check for the value under.
         * @param fallback An optional default value to return if the key is not found.
         */
        static intValue(jsonData, key, fallback = undefined) {
            try {
                return parseInt(jsonData[key][ImportHelper.CHAR_KEY]);
            }
            catch (e) {
                if (fallback !== undefined) {
                    return fallback;
                }
                else {
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
        static stringValue(jsonData, key, fallback = undefined) {
            try {
                return jsonData[key][ImportHelper.CHAR_KEY];
            }
            catch (e) {
                if (fallback !== undefined) {
                    return fallback;
                }
                else {
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
        static parseInt(value, fallback = undefined) {
            try {
                return parseInt(value);
            }
            catch (e) {
                if (fallback !== undefined) {
                    return fallback;
                }
                else {
                    throw e;
                }
            }
        }
    }
    ImportHelper.CHAR_KEY = "_TEXT";
    return ImportHelper;
})();
export { ImportHelper };
