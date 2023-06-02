import { createLexer } from "./lexer/index";
import { SyntaxKinds } from "./syntax/kinds";
import { createParser } from "./parser/index";
export { createParser } from "./parser/index";
const code_1 = `
     a = {
        b: 10 + 10,
        ...c,
        c: aa + yy,
        ...sssa,
        k,
        async *p(mm, d) {

        },
        async [bb] () {

        },
        o: (m = 10, v) => {

        },
        I: function j(c, f) {

        }
     }
`
const code_2 =
`
     s = class {
        #test = 10
        static async i() {

        }
        [1] () {

        }
        #for(av, ls) {

        }
     }

`;

const code_3 = `
     let  {a , b : { c, j} } = dd, b = 100, c= 1000
`;
const code = `
const {
    props: {
        someProperty: {
            data,
            value,
            name,
        }
    },
    otherProps,
} = someNestedObject
`
const lexer = createLexer(code)


const obj = {
    a: {
        b: 10,
        c: 100,
    },
    d: 1,
}

const { a: {b} } = obj;
 
while(1) {
    const t = lexer.nextToken();
    if(t === SyntaxKinds.EOFToken) {
        break;
    }
    console.log(t, lexer.getSourceValue(), lexer.getStartPosition(), lexer.getEndPosition());
}

const parser = createParser(code);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));