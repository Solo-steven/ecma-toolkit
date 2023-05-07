import * as AST from './ast';
import { SyntaxKinds } from "@/src/syntax/kinds";

export function createIdentifier(name: string): AST.Identifier {
    return {
        kind: SyntaxKinds.Identifier,
        name: name,
    };
}
export function createNumberLiteral(value: string | number): AST.NumberLiteral {
    return {
        kind: SyntaxKinds.NumberLiteral,
        value,
    }
}
export function createArrayExpression(elements: Array<AST.Expression | null>): AST.ArrayExpression {
    return {
        kind: SyntaxKinds.ArrayExpression,
        elements
    };
}
export function createObjectExpression(properties: Array<AST.Property>): AST.ObjectExpression {
    return { kind: SyntaxKinds.ObjectExpression, properties };
}
 export function createMetaProperty(meta: AST.Identifier, property: AST.Identifier): AST.MetaProperty {
    return {
        kind: SyntaxKinds.MetaProperty,
        meta, property
    }
}
export function createSuper(): AST.Super {
    return { kind: SyntaxKinds.Super, name: "super" }
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
export function createMemberExpression(computed: boolean, object: AST.Expression, property: AST.Expression): AST.MemberExpression {
    return {
        kind: SyntaxKinds.MemberExpression,
        computed,
        object, property
    }
}
export function createSequenceExpression(exprs: Array<AST.Expression>): AST.SequenceExpression {
    return {
        kind: SyntaxKinds.SequenceExpression,
        exprs,
    }
}
export function createFunctionBody(body: Array<AST.NodeBase>): AST.FunctionBody {
    return { kind: SyntaxKinds.FunctionBody, body };
}
export function createArrowExpression(isExpression: boolean, body: AST.Expression | AST.FunctionBody, calleeArguments: Array<AST.Expression>): AST.ArrorFunctionExpression {
    return {
        kind: SyntaxKinds.ArrowFunctionExpression,
        body,
        expressionBody: isExpression, arguments: calleeArguments,
    }
}
export function createProgram( body: Array<AST.NodeBase>): AST.Program {
    return { kind: SyntaxKinds.Program, body };
}