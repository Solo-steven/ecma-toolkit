import { createParser } from "@/src/parser";
import * as factory from "@/src/syntax/factory"


function toAST(code: string) {
    return createParser(code).parse();
}

describe("expression/additive", () => {
    test("x+y", () => {
        expect(toAST("x+y")).toBe(
            factory.createProgram([
                
            ])
        )
    });
    test("x-y", () => {

    })
    test(`"use strict" + 42`, () => {

    });
});