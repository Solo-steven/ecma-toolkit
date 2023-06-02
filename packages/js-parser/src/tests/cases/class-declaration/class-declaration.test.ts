import path from "path";
import { toAST, readFileAsString } from "../../helper";

describe('cases/class-declaration', () => {
    test('class declaration with private name', async () => {
        const code = await readFileAsString(path.join(__dirname, "classDeclarationWithPrivateName.js"));
        expect(toAST(code)).toMatchSnapshot();
    })
});