import { traversal as DeclarativeTraversal } from "@/src/visitor/declarative";
import { traversal as HalfInlineTraversal } from "@/src/visitor/half-inline";
import { traversal as AllInlineTraversal } from "@/src/visitor/all-inline";
import { validParent, createFakeAST, BindingTable } from "./helper";



export function benchmark(callback: CallableFunction, prefix: string) {
    const startStr = `${prefix}-start`;
    const endStr = `${prefix}-end`;
    performance.mark(startStr);
    callback();
    performance.mark(endStr);
    console.log(performance.measure(prefix, startStr, endStr));
}

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