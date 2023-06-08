import { createLexer } from "@/src/lexer";
import { SyntaxKinds } from "js-types";
import { createParser } from "@/src/parser";

const code = `new foo().bar()`;

console.log("=================================");
console.log("Test JavaScript Code:");
console.log("=================================");
console.log(code);

console.log("=================================");
console.log("============ lexer ==============");
console.log("=================================");

const lexer = createLexer(code);
while(lexer.getToken() != SyntaxKinds.EOFToken) {
    console.log(lexer.getToken(), lexer.getSourceValue(), lexer.getStartPosition(), lexer.getEndPosition());
    lexer.nextToken();
}

console.log("=================================");
console.log("============ Parser =============");
console.log("=================================");

console.log(JSON.stringify(createParser(code).parse(), null, 4));

const ast = createParser(code).parse();