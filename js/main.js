import { classificationPage } from "./pages/classification.js";
import { output1Page } from "./pages/output1.js";
import { output2Page } from "./pages/output2.js";
import { tictactoePage } from "./pages/tictactoe.js";

function main() {
    const page = document.body.dataset.page;
    if (page === "output1") {
        output1Page();
    } else if (page === "output2") {
        output2Page();
    } else if (page === "classification") {
        classificationPage();
    } else if (page === "tictactoe") {
        tictactoePage();
    }
}

main()