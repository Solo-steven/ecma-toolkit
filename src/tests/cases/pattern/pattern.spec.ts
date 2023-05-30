import path from "path";
import { readFileAsString, toAST } from "../../helper";

describe("cases/ destructure pattern", () => {
    test("nested object pattern used in declaration", async () => {
        const code = await readFileAsString(path.join(__dirname, "nestObjectPatternDeclaration.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("array pattern in declaration", async () => {
        const code = await readFileAsString(path.join(__dirname, "arrayPatternInDeclaration.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("object pattern in declaration", async () => {
        const code = await readFileAsString(path.join(__dirname, "objectPatternInDeclaration.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
    test("nested array pattern in declaration", async () => {
        const code = await readFileAsString(path.join(__dirname, "nestedArrayPatternInDeclaration.js"));
        expect(toAST(code)).toMatchSnapshot();
    });
})