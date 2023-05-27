import path from "path";
import { readTextFiles, toAST } from "../../helper";

describe("case/object-literal/object property name ", () => {
    test("complex case of object literal", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/complexProperty.js"),
            path.join(__dirname, "/complexProperty.json")
        )
        // expect(toAST(code)).toStrictEqual(expectAst);
    })
    test("spread property of object literal", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/spread.js"),
            path.join(__dirname, "/spread.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
    test("expression value of object literal", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/expressionValue.js"),
            path.join(__dirname, "/expressionValue.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
})