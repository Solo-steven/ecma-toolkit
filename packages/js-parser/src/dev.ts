import { createLexer } from "@/src/lexer";
import { SyntaxKinds } from "@/src/syntax/kinds";
import { createParser } from "@/src/parser";


const code = `
    a.b.c()
`;

console.log("=================================");
console.log("Test JavaScript Code:");
console.log("=================================");
console.log(code);

console.log("=================================");
console.log("============ lexer ==============");
console.log("=================================");

const lexer = createLexer(code);
while(lexer.getToken() != SyntaxKinds.EOFToken) {
    console.log(lexer.getSourceValue(), lexer.getStartPosition(), lexer.getEndPosition());
    lexer.nextToken();
}

console.log("=================================");
console.log("============ Parser =============");
console.log("=================================");

console.log(JSON.stringify(createParser(code).parse(), null, 4));