import * as AST from './ast';
import { SyntaxKinds } from "@/src/syntax/kinds";

export function createIdentifier(name: string): AST.Identifier {
    return {
        kind: SyntaxKinds.Identifier,
        name: name,
    };
}

export function createArrayExpression(elements: Array<AST.Expression>): AST.ArrayExpression {
    return {
        kind: SyntaxKinds.ArrayExpression,
        elements
    };
}

export function createMetaProperty(meta: AST.Identifier, property: AST.Identifier): AST.MetaProperty {
    return {
        kind: SyntaxKinds.MetaProperty,
        meta, property
    }
}

export function createCallExpression(callee: AST.Expression, calleeArguments: Array<AST.Expression>): AST.CallExpression {
    return {
        kind: SyntaxKinds.CallExpression,
        callee, 
        arguments: calleeArguments
    }
}

export function createNewExpression(callee: AST.Expression, calleeArguments: Array<AST.Expression>): AST.NewExpression {
    return {
        kind: SyntaxKinds.NewExpression,
        callee, 
        arguments: calleeArguments
    }
}