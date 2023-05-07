import { createParser } from "@/src/parser";

describe("expression/additive", () => {
    test("x+y", () => {
        const code = "x+y";
        const parser = createParser(code);
        console.log(parser.parse());
    });
    test("x-y", () => {
        
    })
});