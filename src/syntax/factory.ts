import * as AST from './ast';
import { SyntaxKinds } from "@/src/syntax/kinds";
import { AssigmentOperatorKinds, BinaryOperatorKinds, UnaryOperatorKinds, UpdateOperatorKinds } from './operator';

export function createIdentifier(name: string): AST.Identifier {
    return {
        kind: SyntaxKinds.Identifier,
        name,
    };
}
export function createPrivateName(name: string): AST.PrivateName {
    return {
        kind: SyntaxKinds.PrivateName,
        name,
    }
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
export function createObjectProperty(
    key: AST.ObjectProperty['key'],
    value: AST.ObjectProperty['value'],
    computed: AST.ObjectProperty['computed'],
    shorted: AST.ObjectProperty['shorted']
): AST.ObjectProperty {
    return {
        kind: SyntaxKinds.ObjectProperty,
        computed, shorted, key, value
    }
}
export function createObjectMethodDefintion(
    key: AST.ObjectMethodDefinition['key'],
    body: AST.ObjectMethodDefinition['body'],
    params: AST.ObjectMethodDefinition['params'],
    async: AST.ObjectMethodDefinition['async'],
    type: AST.ObjectMethodDefinition['type'],
    generator: AST.ObjectMethodDefinition['generator'],
    computed: AST.ObjectMethodDefinition['computed']
): AST.ObjectMethodDefinition {
    return {
        kind: SyntaxKinds.ObjectMethodDefintion,
        async, type, generator, computed,
        key, params, body,
    }
}
export function createSpreadElement(argument: AST.Expression): AST.SpreadElement {
    return {
        kind: SyntaxKinds.SpreadElement,
        argument,
    }
}
 export function createMetaProperty(meta: AST.MetaProperty['meta'], property: AST.MetaProperty['property']): AST.MetaProperty {
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
export function createFunctionBody(body: Array<AST.StatementListItem>): AST.FunctionBody {
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
export function createClass(name: AST.Class['id'], superClass: AST.Class['superClass'], body: AST.Class['body']): AST.Class {
    return {
        id: name,
        superClass, 
        body,
    }
}
export function createClassBody(body: AST.ClassBody['body']): AST.ClassBody {
    return {
        kind: SyntaxKinds.ClassBody,
        body
    };
}
export function createClassProperty(
    key: AST.ClassProperty['key'],
    value: AST.ClassProperty['value'],
    computed: AST.ClassProperty['computed'],
    isStatic: AST.ClassProperty['static'],
    shorted: AST.ClassProperty['shorted']
): AST.ClassProperty {
    return {
        kind: SyntaxKinds.ClassProperty,
        computed, static: isStatic, shorted, key, value
    }
}
export function createClassMethodDefintion(
    key: AST.ClassMethodDefinition['key'],
    body: AST.ClassMethodDefinition['body'],
    params: AST.ClassMethodDefinition['params'],
    async: AST.ClassMethodDefinition['async'],
    type: AST.ClassMethodDefinition['type'],
    generator: AST.ClassMethodDefinition['generator'],
    computed: AST.ClassMethodDefinition['computed'],
    isStatic: AST.ClassMethodDefinition['static']
): AST.ClassMethodDefinition {
    return {
        kind: SyntaxKinds.ClassMethodDefinition,
        async, type, generator, computed, static: isStatic,
        key, params, body,
    }
}
export function transFormClassToClassExpression(classNode: AST.Class ): AST.ClassExpression {
    return {
        kind: SyntaxKinds.ClassExpression,
        ...classNode,
    }
}
// export function transFormFunctionToFunctionDeclaration(func: AST.Function): AST.FunctionDeclaration {
//     return {
//         kind: SyntaxKinds.FunctionDeclaration,
//         ...func,
//     }
// }
export function createVariableDeclaration(declarations: AST.VariableDeclaration['declarations'], variant: AST.VariableDeclaration['variant'] ): AST.VariableDeclaration{
    return {
        kind: SyntaxKinds.VariableDeclaration,
        variant,
        declarations,
    }
}
export function createVariableDeclarator(id: AST.VariableDeclarator['id'], init: AST.VariableDeclarator['init']): AST.VariableDeclarator  {
    return {
        kind: SyntaxKinds.VariableDeclarator,
        id, init,
    } 
}
export function createIfStatement(test: AST.IfStatement['test'], conseqence: AST.IfStatement['conseqence'], alter?: AST.IfStatement['alternative']): AST.IfStatement {
    return {
        kind: SyntaxKinds.IfStatement,
        test,
        conseqence,
        alternative: alter
    }
}
export function createBlockStatement(body: AST.BlockStatement['body']): AST.BlockStatement {
    return {
        kind: SyntaxKinds.BlockStatement,
        body,
    }
}
export function createSwitchStatement(discriminant: AST.SwitchStatement['discriminant'], cases: AST.SwitchStatement['cases']): AST.SwitchStatement {
    return {
        kind: SyntaxKinds.SwitchStatement,
        discriminant, cases,
    }
}
export function createSwitchCase(test: AST.SwitchCase['test'], consequence: AST.SwitchCase['consequence'] ):AST.SwitchCase {
    return {
        kind: SyntaxKinds.SwitchCase,
        test, consequence,
    }
}
export function createBreakStatement(label?: AST.BreakStatement['label']): AST.BreakStatement {
    return {
        kind: SyntaxKinds.BreakStatement,
        label,
    }
}
export function createContinueStatement(label?: AST.ContinueStatement['label']): AST.ContinueStatement {
    return {
        kind: SyntaxKinds.ContinueStatement,
        label,
    }
}
export function createLabeledStatement(label: AST.LabeledStatement['label'], body: AST.LabeledStatement['body']): AST.LabeledStatement {
    return {
        kind: SyntaxKinds.LabeledStatement,
        label,
        body,
    }
}
export function createReturnStatement(argu?: AST.Expression): AST.ReturnStatement {
    return {
        kind: SyntaxKinds.ReturnStatement,
        argu,
    }
}
export function createWhileStatement(test: AST.WhileStatement['test'], body: AST.WhileStatement['body']): AST.WhileStatement {
    return {
        kind: SyntaxKinds.WhileStatement,
        test, body,
    }
}
export function createDoWhileStatement(test: AST.DoWhileStatement['test'], body: AST.DoWhileStatement['body']): AST.DoWhileStatement {
    return {
        kind: SyntaxKinds.DoWhileStatement,
        test, body,
    }
}
export function createTryStatement(block: AST.TryStatement['block'], handler?: AST.TryStatement['handler'], finalizer?: AST.TryStatement['finalizer']): AST.TryStatement {
    return {
        kind: SyntaxKinds.TryStatement,
        block, handler, finalizer
    }
}
export function createCatchClause(param: AST.CatchClause['param'], body: AST.CatchClause['body']): AST.CatchClause {
    return {
        kind: SyntaxKinds.CatchClause,
        param, body,
    }
}
export function createThrowStatement(argu:AST.ThrowStatement['argu']): AST.ThrowStatement {
    return {
        kind: SyntaxKinds.ThrowKeyword,
        argu
    }
}
export function createAssignmentPattern(left: AST.AssignmentPattern['left'], right: AST.AssignmentPattern['right'] ): AST.AssignmentPattern {
    return {
        kind: SyntaxKinds.AssignmentPattern,
        left, 
        right
    }
}
export function createArrayPattern(elements: AST.ArrayPattern['elements']): AST.ArrayPattern {
    return {
        kind: SyntaxKinds.ArrayPattern,
        elements,
    };
}
export function createObjectPattern(properties: AST.ObjectPattern['properties']): AST.ObjectPattern {
    return {
        kind: SyntaxKinds.ObjectPattern,
        properties,
    }
}
export function createObjectPatternProperty(
    key: AST.ObjectPatternProperty['key'],
    value: AST.ObjectPatternProperty['value'],
    computed: AST.ObjectPatternProperty['computed'],
    shorted: AST.ObjectPatternProperty['shorted'],
): AST.ObjectPatternProperty {
    return {
        kind:  SyntaxKinds.ObjectPatternProperty,
        computed, shorted,
        key, value
    }
}
export function createRestElement(argument: AST.RestElement['argument']): AST.RestElement {
    return {
        kind: SyntaxKinds.RestElement,
        argument,
    }
}
export function createProgram( body: Array<AST.ModuleItem>): AST.Program {
    return { kind: SyntaxKinds.Program, body };
}
export function createImportDeclaration(specifiers: AST.ImportDeclaration['specifiers'],source: AST.ImportDeclaration['source']): AST.ImportDeclaration {
    return {
        kind: SyntaxKinds.ImportDeclaration,
        specifiers,
        source,
    }
}
export function createImportDefaultSpecifier(imported: AST.ImportDefaultSpecifier['imported']): AST.ImportDefaultSpecifier {
    return {
        kind: SyntaxKinds.ImportDefaultSpecifier,
        imported,
    }
}
export function createImportNamespaceSpecifier(imported: AST.ImportNamespaceSpecifier['imported']): AST.ImportNamespaceSpecifier {
    return {
        kind: SyntaxKinds.ImportNamespaceSpecifier,
        imported,
    }
}
export function createImportSpecifier(imported: AST.ImportSpecifier['imported'], local?: AST.ImportSpecifier['local']): AST.ImportSpecifier {
    return {
        kind: SyntaxKinds.ImportSpecifier,
        imported,
        local,
    }
}