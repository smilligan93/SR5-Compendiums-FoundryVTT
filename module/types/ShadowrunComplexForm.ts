/// <reference path="Shadowrun.ts" />
declare namespace Shadowrun {
    export type ComplexForm = {
        name: string,
        folder: string | null,
        type: "complex_form",
        data: {
            description: DescriptionData,
            action: ActionData,
            target: ComplexFormTarget,
            duration: SpellDuration,
            fade: number
        },
        permission: {
            default: 2
        }
    }
    export type ComplexFormTarget = "persona"|"device"|"file"|"self"|"sprite"|"other"|"";
}