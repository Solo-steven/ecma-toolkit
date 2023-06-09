import { createLexer } from "@/src/lexer";
import { SyntaxKinds,  } from "js-types";
import { createParser } from "@/src/parser";
import { transformSyntaxKindToLiteral } from  "./tests/transform";
import fs from 'fs';
import { performance } from "node:perf_hooks";

const code =  `({a:b[0]})=>0`;
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

const ast = createParser(code).parse();
transformSyntaxKindToLiteral(ast);
console.log(JSON.stringify(ast, null, 4));
