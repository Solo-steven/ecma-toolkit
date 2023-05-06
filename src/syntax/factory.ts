import * as AST from './ast';
import { SyntaxKinds } from "@/src/syntax/kinds";

export function createIdentifier(name: string): AST.Identifier {
    return {
        kind: SyntaxKinds.Identifier,
        name: name,
    };
}