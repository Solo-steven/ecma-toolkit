import { traversal as DeclarativeTraversal } from "@/src/visitor/declarative";
import { traversal as HalfInlineTraversal } from "@/src/visitor/half-inline";
import { traversal as AllInlineTraversal } from "@/src/visitor/all-inline";
import { validParent, benchmark, createFakeAST, BindingTable } from "./helper";


function frecurive(n: number): number {
    if(n === 0) {
        return 0;
    }
    if(n === 1) {
        return 1;
    }
    return frecurive(n-1) + frecurive(n-2);
}




function main() {
    benchmark(() => {
        frecurive(7);
    }, "all-inline");

    benchmark(() => {
        frecurive(7);
    }, "declarative");

    benchmark(() => {
        frecurive(7);
    }, "half-inline");
}

main();