import path from "path";
import { readTextFiles, toAST } from "../../helper";
// __dirname: '@/src/parser/test/fixtures'
// test source: https://github.com/jquery/esprima/tree/main/test/fixtures/expression/additive
describe("fixtures/expression/additive", () => {
    test("x+y", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/additive/case01.js"),
            path.join(__dirname, "/additive/case01.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
    test("x-y", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/additive/case02.js"),
            path.join(__dirname, "/additive/case02.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    })
    test(`"use strict" + 42`, async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/additive/case03.js"),
            path.join(__dirname, "/additive/case03.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
});