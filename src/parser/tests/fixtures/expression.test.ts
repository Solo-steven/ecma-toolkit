import { createParser } from "@/src/parser";
import { SyntaxKinds } from "@/src/syntax/kinds";
import * as factory from "@/src/syntax/factory"
// todo: add case `await a.test?.(await cc(), aa  ).s.d`

function toAST(code: string) {
    return createParser(code).parse();
}
// test source: https://github.com/jquery/esprima/tree/main/test/fixtures/expression/additive
describe("fixtures/expression/additive", () => {
    test("x+y", () => {
        expect(toAST("x+y")).toStrictEqual(
            factory.createProgram([
              factory.createExpressionStatement(
                factory.createBinaryExpression(
                    factory.createIdentifier("x"),
                    factory.createIdentifier("y"),
                    SyntaxKinds.PlusOperator,
                )
              )  
            ])
        );
    });
    test("x-y", () => {
        
    })
    test(`"use strict" + 42`, () => {

    });
});
// test source: https://github.com/jquery/esprima/tree/main/test/fixtures/expression/multiplicative
describe("fixtures/expression/multiplicative", () => {
    test("x * y", () => {

    });
    test("x / y", () => {

    });
    test("x % y", () => {

    });
});
// test source: https://github.com/jquery/esprima/tree/main/test/fixtures/expression/binary-bitwise
describe("fixtures/expression/binary-bitwise", () => {
    test("x & y", () => {

    });
    test("x ^ y", () => {
        
    });
    test("x | y", () => {

    });
});
// test source: https://github.com/jquery/esprima/tree/main/test/fixtures/expression/binary-logical
describe('fixtures/expression/binary-logical', () => {
    test("x || y", () => {

    });
    test("x && y", () => {

    });
    test("x || y || z", () => {
        
    });
    test("x && y && z" , () => {

    });
    test("x || y && z", () => {

    });
    test("x || y ^ z", () => {

    });
});
describe("fixtures/expression/bitwise-shift", () => {
    test("x << y", () => {

    });
    test("x >>> y", () => {

    });
})