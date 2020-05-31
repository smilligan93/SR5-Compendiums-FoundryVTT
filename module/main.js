import { Import } from "./apps/import-form";
Hooks.on("renderItemDirectory", (app, html) => {
    const button = $("<button>Import Chummer Data</button>");
    html.find("footer").before(button);
    button.on("click", (event) => {
        new Import().render(true);
    });
});
