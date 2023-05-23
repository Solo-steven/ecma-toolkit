import { createParser } from "@/src/parser";
import { Program } from "@/src/syntax/ast";

export function toAST(code: string): Program {
    return createParser(code).parse();
}