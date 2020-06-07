/// <reference path="Shadowrun.ts" />
declare namespace Shadowrun {
    export type Quality = {
        name: string,
        folder: string | null,
        type: "quality",
        data: {
            description: DescriptionData,
            action: ActionData,
            type: "positive"|"negative"|""
        }
        permission: {
            default: 2
        }
    }
}
