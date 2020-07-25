import {ImportHelper} from "../helper/ImportHelper";

export abstract class Parser<TResult> {
    public abstract Parse(jsonData: object, data: TResult, jsonTranslation?: object): TResult;
}