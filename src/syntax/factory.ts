import * as AST from './ast';
import { SyntaxKinds } from "@/src/syntax/kinds";
import { AssigmentOperatorKinds, BinaryOperatorKinds, UnaryOperatorKinds, UpdateOperatorKinds } from './operator';

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
export function createStringLiteral(value: string): AST.StringLiteral {
    return {
        kind: SyntaxKinds.StringLiteral,
        value,
    }
}
export function createTemplateLiteral(quasis: Array<AST.TemplateElement>, expressions: Array<AST.Expression>): AST.TemplateLiteral {
    return {
        kind: SyntaxKinds.TemplateLiteral,
        quasis, expressions,
    }
}
export function createTemplateElement(value: string, tail: boolean): AST.TemplateElement {
    return {
        kind: SyntaxKinds.TemplateElement,
        value, tail
    }
}
export function createArrayExpression(elements: Array<AST.Expression | null>): AST.ArrayExpression {
    return {
        kind: SyntaxKinds.ArrayExpression,
        elements
    };
}
export function createObjectExpression(properties: Array<AST.PropertyDefinition>): AST.ObjectExpression {
    return { 
        kind: SyntaxKinds.ObjectExpression, 
        properties 
    };
}
export function createMethodDefintion(
    key: AST.MethodDefinition['key'],
    body: AST.MethodDefinition['body'],
    params: AST.MethodDefinition['params'],
    async: AST.MethodDefinition['async'],
    type: AST.MethodDefinition['type'],
    generator: AST.MethodDefinition['generator'],
    isStatic: AST.MethodDefinition['static'],
    computed: AST.MethodDefinition['computed']
): AST.MethodDefinition {
    return {
        kind: SyntaxKinds.MethodDefinition,
        async, type, generator, static: isStatic, computed,
        key, params, body,
    }
}
export function createProperty(key: AST.Property['key'], value: AST.Property['value'], computed: boolean): AST.Property {
    return {
        kind: SyntaxKinds.Property,
        computed,
        key, value
    }
}
export function createSpreadElement(argument: AST.Expression): AST.SpreadElement {
    return {
        kind: SyntaxKinds.SpreadElement,
        argument,
    }
}
 export function createMetaProperty(meta: AST.Identifier, property: AST.Identifier): AST.MetaProperty {
    return {
        kind: SyntaxKinds.MetaProperty,
        meta, property
    }
}
export function createSuper(): AST.Super {
    return { 
        kind: SyntaxKinds.Super, 
        name: "super" 
    }
}
export function createThisExpression(): AST.ThisExpression {
    return {
        kind: SyntaxKinds.ThisExpression,
        name: "this",
    }
}
export function createChainExpression(expr: AST.Expression): AST.ChainExpression {
    return { 
        kind: SyntaxKinds.ChainExpression, 
        expression: expr 
    };
}
export function createCallExpression(callee: AST.Expression, calleeArguments: Array<AST.Expression>, optional: boolean): AST.CallExpression {
    return {
        kind: SyntaxKinds.CallExpression,
        optional,
        callee, 
        arguments: calleeArguments,
    }
}
export function createNewExpression(callee: AST.Expression, calleeArguments: Array<AST.Expression>): AST.NewExpression {
    return {
        kind: SyntaxKinds.NewExpression,
        callee, 
        arguments: calleeArguments
    }
}
export function createMemberExpression(computed: boolean, object: AST.Expression, property: AST.Expression, optional: boolean): AST.MemberExpression {
    return {
        kind: SyntaxKinds.MemberExpression,
        computed,optional,
        object, property,
    }
}
export function createTagTemplateExpression(base: AST.Expression, quasi: AST.TemplateLiteral): AST.TaggedTemplateExpression {
    return { 
        kind: SyntaxKinds.TaggedTemplateExpression,
        tag: base,
        quasi,

    }
}
export function createUpdateExpression(argument: AST.Expression, operator: UpdateOperatorKinds, prefix: boolean): AST.UpdateExpression {
    return {
        kind: SyntaxKinds.UpdateExpression,
        operator,
        prefix,
        argument,
    };
}
export function createAwaitExpression(argument: AST.Expression): AST.AwaitExpression {
    return { 
        kind: SyntaxKinds.AwaitExpression, 
        argument
    };
}
export function createUnaryExpression(argument: AST.Expression, operator: UnaryOperatorKinds, ): AST.UnaryExpression {
    return {
        kind: SyntaxKinds.UnaryExpression,
        operator,
        argument
    }
}
export function createArrowExpression(
    isExpression: boolean, 
    body: AST.Expression | AST.FunctionBody, 
    calleeArguments: Array<AST.Expression>,
    async: boolean,
): AST.ArrorFunctionExpression {
    return {
        kind: SyntaxKinds.ArrowFunctionExpression,
        expressionBody: isExpression, 
        async,
        arguments: calleeArguments,
        body,
    }
}
export function createBinaryExpression(left: AST.Expression, right: AST.Expression, operator: BinaryOperatorKinds): AST.BinaryExpression {
    return {
        kind: SyntaxKinds.BinaryExpression,
        operator,
        left, right,
    };
}
export function createConditionalExpression(test: AST.Expression, consequnce: AST.Expression, alter: AST.Expression): AST.ConditionalExpression {
    return {
        kind: SyntaxKinds.ConditionalExpression,
        test,
        consequnce,
        alter,
    };
}
export function createAssignmentExpression(left: AST.Expression, right: AST.Expression, operator: AssigmentOperatorKinds): AST.AssigmentExpression {
    return {
        kind: SyntaxKinds.AssigmentExpression,
        operator,
        left, right,
    }
}
export function createSequenceExpression(exprs: Array<AST.Expression>): AST.SequenceExpression {
    return {
        kind: SyntaxKinds.SequenceExpression,
        exprs,
    }
}
export function createExpressionStatement(expr: AST.Expression): AST.ExpressionStatement {
    return { 
        kind: SyntaxKinds.ExpressionStatement, 
        expr
    };
}
export function createFunctionBody(body: Array<AST.NodeBase>): AST.FunctionBody {
    return { 
        kind: SyntaxKinds.FunctionBody, 
        body
    };
}
export function createFunction(
    name: AST.Function['name'], 
    body: AST.Function['body'], 
    params: AST.Function['params'], 
    generator: AST.Function['generator'],
    async: AST.Function['async'],
): AST.Function {
    return {
        name,
        generator,
        async,
        body,
        params,
    };
}
export function transFormFunctionToFunctionExpression(func: AST.Function ): AST.FunctionExpression {
    return {
        kind: SyntaxKinds.FunctionExpression,
        ...func,
    }
}
export function transFormFunctionToFunctionDeclaration(func: AST.Function): AST.FunctionDeclaration {
    return {
        kind: SyntaxKinds.FunctionDeclaration,
        ...func,
    }
}
export function createAssignmentPattern(left: AST.AssignmentPattern['left'], right: AST.AssignmentPattern['right'] ): AST.AssignmentPattern {
    return {
        kind: SyntaxKinds.AssignmentPattern,
        left, 
        right
    }
}
export function createRestElement(argument: AST.RestElements['argument']): AST.RestElements {
    return {
        kind: SyntaxKinds.RestElements,
        argument,
    }
}
export function createProgram( body: Array<AST.NodeBase>): AST.Program {
    return { kind: SyntaxKinds.Program, body };
}