import { createLexer } from "@/src/lexer";
import { SyntaxKinds } from "@/src/syntax/kinds";
import { createParser } from "@/src/parser";

const code = "styled`color: blus ${props => { props  + 1} }`";
const lexer = createLexer(code)

while(1) {
    const t = lexer.nextToken();
    if(t === SyntaxKinds.EOFToken) {
        break;
    }
    console.log(t, lexer.getSourceValue());
}

const parser = createParser(code);
const ast = parser.parse();
console.log(JSON.stringify(ast, null, 2));