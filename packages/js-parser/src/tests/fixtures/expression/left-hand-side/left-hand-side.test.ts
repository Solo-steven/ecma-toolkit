import path from "path"; 
import { toAST, readFileAsString } from "../../../helper";

describe("fixtures/expression/left-hand-side-expression/", () => {
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0000.js
    test("simple new expression", async () => {
        const code = await readFileAsString(path.join(__dirname, "simpleNewWithoutArgument.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0001.js
    test("simple new expression without arugments", async () => {
        const code = await readFileAsString(path.join(__dirname, "simpleNewExpression.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0002.js
    test("nested new expression without argument",async () => {
        const code = await readFileAsString(path.join(__dirname, "nestedNewExpressionWithoutArgument.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0003.js
    test("nested new expression", async () => {
        const code = await readFileAsString(path.join(__dirname, "nestedNewExpressionjs"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0004.js
    test("call expression after new expression", async () => {
        const code = await readFileAsString(path.join(__dirname, "callExpressionAfterNewExpression.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0005.js
    test("new expression with member computed subscription", async () => {
        const code = await readFileAsString(path.join(__dirname, "newExpressionWithComputedSubscription.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0006.js
    test('new expression with member expression callee', async () => {
        const code = await readFileAsString(path.join(__dirname, "newExpressionWithSubscription.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0007.js
    test("new expression with cover expression callee", async () => {
        const code = await readFileAsString(path.join(__dirname, "newExpressionWithCoverExpression.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0008.js
    test("simple call expression", async () => {
        const code = await readFileAsString(path.join(__dirname, "simpleCallExpression.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0009.js
    test("call expression with cover expression", async () => {
        const code = await readFileAsString(path.join(__dirname, "callExpressionWithCoverExpression.js"));
        expect(toAST(code)).toMatchSnapshot();
    })
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0010.js
    test("simple member expression", async () => {
        const code = await readFileAsString(path.join(__dirname, "simpleMemberExpression.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0011.js
    test("simple member expression - 2", async () => {
        const code = await readFileAsString(path.join(__dirname, "simpleMemberExpression_2.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0012.js
    test("simple member expression - 3", async () => {
        const code = await readFileAsString(path.join(__dirname, "simpleMemberExpression_3.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0013.js
    test("member expression with computed property", async () => {
        const code = await readFileAsString(path.join(__dirname, "memberExpressionWithComputed.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0014.js
    test("member expression with computed property - 2", async () => {
        const code = await readFileAsString(path.join(__dirname, "memberExpressionWithComputed_2.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0015.js
    test("member expression with computed property - 3", async () => {
        const code = await readFileAsString(path.join(__dirname, "memberExpressionWithComputed_3.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0016.js
    test("member expression with call expression", async () => {
        const code = await readFileAsString(path.join(__dirname, "memberExpressionCallExpression.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0017.js
    test("member expression complex example", async () => {
        const code = await readFileAsString(path.join(__dirname, "memberExpressionComplex.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    // https://github.com/jquery/esprima/blob/main/test/fixtures/expression/left-hand-side/migrated_0018.js
    test("member expression complex example - 2", async () => {
        const code = await readFileAsString(path.join(__dirname, "memberExpressionComplex_2.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
})