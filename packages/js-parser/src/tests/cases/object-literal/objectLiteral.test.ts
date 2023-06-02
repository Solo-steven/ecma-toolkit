import path from "path";
import { readFileAsString, toAST } from "../../helper";

describe("case/object-literal", () => {
    test("complex case of object literal", async () => {
        const code =  await readFileAsString(path.join(__dirname, "complexProperty.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("computed property of object literal", async () => {
        const code = await readFileAsString(path.join(__dirname, "computedProperty.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("expression value of object literal", async () => {
        const code = await readFileAsString(path.join(__dirname, "expressionValue.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("number literal property of object literal", async () => {
        const code = await readFileAsString(path.join(__dirname, "numberLiteralProperty.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("setter and getter of object literal", async () => {
        const code = await readFileAsString(path.join(__dirname, "setterAndgetter.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("spread of object literal", async () => {
        const code = await readFileAsString(path.join(__dirname, "spread.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("string literal property of object literal", async () => {
        const code = await readFileAsString(path.join(__dirname, "stringLiteralProperty.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
})