import { readFile } from "fs/promises";
import { createParser } from "@/src/parser";
import { Program } from "@/src/syntax/ast";

export function toAST(code: string): Program {
    return createParser(code).parse();
}

export async function readFileAsString(path: string) {
    return readFile(path).then(buffer => buffer.toString());
}

export async function readTextFiles(codePath: string, jsonPath: string) {
    const [codeStringBuffer, astStringBuffer] = await Promise.all([
        readFile(codePath), readFile(jsonPath)
    ]);
    return {
        code: codeStringBuffer.toString(),
        expectAst: JSON.parse(astStringBuffer.toString()),
    }
}