import path from "path";
import { readTextFiles, toAST } from "../../helper";

// todo: add case `await a.test?.(await cc(), aa  ).s.d`
// todo add case `{ "test": content, ...a , }`
// to ass case `a = { b: 10 + 10, ...c, c: aa + yy, ...sssa, k, async *p(mm, d) {}, async [bb] () {}, o: (m = 10, v) => {} }`

describe('cases/member-expression/meta property in subscription',  () => {
    test("should parse import.meta as meta property when is in the start of subscriptions", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/case01.js"),
            path.join(__dirname, "/case01.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
    test("should parse import.meta as regular member expression when is in the middle of subscriptions", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/case02.js"),
            path.join(__dirname, "/case02.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
    test("should parse new.target as meta property when is in the start of subscriptions", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/case03.js"),
            path.join(__dirname, "/case03.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
    test("should parse new.target as regular member expression when is in the middle of subscriptions", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/case04.js"),
            path.join(__dirname, "/case04.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
});

describe("case/member-expression/chain expression in subscription ",  () => {
    test("chain expression with optional call expression", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/case05.js"),
            path.join(__dirname, "/case05.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
    test("chain expression with optional member expression", async () => {
        const { code, expectAst } = await readTextFiles(
            path.join(__dirname, "/case06.js"),
            path.join(__dirname, "/case06.json")
        )
        expect(toAST(code)).toStrictEqual(expectAst);
    });
})