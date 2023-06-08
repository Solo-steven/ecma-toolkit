import { createLexer } from "@/src/lexer";
import { SyntaxKinds } from "@/src/syntax/kinds";
import { createParser } from "@/src/parser";

const code = `
import expres from "express"
const app = express();

app.get("/", function(req, res) {
    res.json({});
})
app.listen(3000, function() {
    console.log("Server On 3000")
})
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
    console.log(lexer.getToken(), lexer.getSourceValue(), lexer.getStartPosition(), lexer.getEndPosition());
    lexer.nextToken();
}

console.log("=================================");
console.log("============ Parser =============");
console.log("=================================");

console.log(JSON.stringify(createParser(code).parse(), null, 4));

const ast = createParser(code).parse();