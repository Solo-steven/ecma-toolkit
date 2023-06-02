import { SourcePosition, cloneSourcePosition} from '../utils/position';
import * as AST from './ast';
import { SyntaxKinds } from "./kinds";
import { AssigmentOperatorKinds, BinaryOperatorKinds, UnaryOperatorKinds, UpdateOperatorKinds } from './operator';

export function createIdentifier(name: string, start: SourcePosition, end: SourcePosition): AST.Identifier {
    return {
        kind: SyntaxKinds.Identifier,
        name,
        start, end,
    };
}
export function createPrivateName(name: string, start: SourcePosition, end: SourcePosition): AST.PrivateName {
    return {
        kind: SyntaxKinds.PrivateName,
        name, start, end
    }
}
export function createNumberLiteral(value: string | number, start: SourcePosition, end: SourcePosition): AST.NumberLiteral {
    return {
        kind: SyntaxKinds.NumberLiteral,
        value, start, end
    }
}
export function createStringLiteral(value: string, start: SourcePosition, end: SourcePosition): AST.StringLiteral {
    return {
        kind: SyntaxKinds.StringLiteral,
        value, start, end
    }
}
export function createTemplateLiteral(quasis: Array<AST.TemplateElement>, expressions: Array<AST.Expression>, start: SourcePosition, end: SourcePosition): AST.TemplateLiteral {
    return {
        kind: SyntaxKinds.TemplateLiteral,
        quasis, expressions, start , end
    }
}
export function createTemplateElement(value: string, tail: boolean, start: SourcePosition, end: SourcePosition): AST.TemplateElement {
    return {
        kind: SyntaxKinds.TemplateElement,
        value, tail, start , end
    }
}
export function createArrayExpression(elements: Array<AST.Expression | null>, start: SourcePosition, end: SourcePosition): AST.ArrayExpression {
    return {
        kind: SyntaxKinds.ArrayExpression,
        elements,start, end
    };
}
export function createObjectExpression(properties: Array<AST.PropertyDefinition>, start: SourcePosition, end: SourcePosition): AST.ObjectExpression {
    return { 
        kind: SyntaxKinds.ObjectExpression, 
        properties, start, end
    };
}
export function createObjectProperty(
    key: AST.ObjectProperty['key'],
    value: AST.ObjectProperty['value'],
    computed: AST.ObjectProperty['computed'],
    shorted: AST.ObjectProperty['shorted'],
    start: SourcePosition, end: SourcePosition,
): AST.ObjectProperty {
    return {
        kind: SyntaxKinds.ObjectProperty,
        computed, shorted, key, value,
        start, end
    }
}
export function createObjectMethodDefintion(
    key: AST.ObjectMethodDefinition['key'],
    body: AST.ObjectMethodDefinition['body'],
    params: AST.ObjectMethodDefinition['params'],
    async: AST.ObjectMethodDefinition['async'],
    generator: AST.ObjectMethodDefinition['generator'],
    computed: AST.ObjectMethodDefinition['computed'],
    start: SourcePosition, end: SourcePosition,
): AST.ObjectMethodDefinition {
    return {
        kind: SyntaxKinds.ObjectMethodDefintion,
        async, generator, computed,
        key, params, body,
        start, end
    }
}
export function createObjectAccessor(
    key: AST.ObjectAccessor['key'],
    body: AST.ObjectAccessor['body'],
    params: AST.ObjectAccessor['params'],
    type: AST.ObjectAccessor['type'],
    computed: AST.ObjectAccessor['computed'],
    start: SourcePosition, end: SourcePosition,
): AST.ObjectAccessor {
    return {
        kind: SyntaxKinds.ObjectAccessor,
        key,params, body, 
        type, computed,
        start, end
    }
}
export function createSpreadElement(
    argument: AST.Expression, 
    start: SourcePosition, end: SourcePosition,
): AST.SpreadElement {
    return {
        kind: SyntaxKinds.SpreadElement,
        argument, 
        start, end
    }
}
 export function createMetaProperty(
    meta: AST.MetaProperty['meta'], 
    property: AST.MetaProperty['property'],
    start: SourcePosition, end: SourcePosition,
): AST.MetaProperty {
    return {
        kind: SyntaxKinds.MetaProperty,
        meta, property,
        start,
        end,
    }
}
export function createSuper(
    start: SourcePosition, end: SourcePosition
): AST.Super {
    return { 
        kind: SyntaxKinds.Super, 
        name: "super",
        start, end
    }
}
export function createThisExpression(
    start: SourcePosition, end: SourcePosition
): AST.ThisExpression {
    return {
        kind: SyntaxKinds.ThisExpression,
        name: "this",
        start, end
    }
}
export function createChainExpression(
    expr: AST.Expression,
    start: SourcePosition, end: SourcePosition,
): AST.ChainExpression {
    return { 
        kind: SyntaxKinds.ChainExpression, 
        expression: expr,
        start, end
    };
}
export function createCallExpression(
    callee: AST.Expression, 
    calleeArguments: Array<AST.Expression>, 
    optional: boolean,
    start: SourcePosition, end: SourcePosition,
): AST.CallExpression {
    return {
        kind: SyntaxKinds.CallExpression,
        optional,
        callee, 
        arguments: calleeArguments,
        start,
        end,
    }
}
export function createNewExpression(callee: AST.Expression, calleeArguments: Array<AST.Expression>, start: SourcePosition, end: SourcePosition): AST.NewExpression {
    return {
        kind: SyntaxKinds.NewExpression,
        callee, 
        arguments: calleeArguments,
        start, end,
    }
}
export function createMemberExpression(computed: boolean, object: AST.Expression, property: AST.Expression, optional: boolean, start: SourcePosition, end: SourcePosition): AST.MemberExpression {
    return {
        kind: SyntaxKinds.MemberExpression,
        computed,optional,
        object, property,
        start, end
    }
}
export function createTagTemplateExpression(
    base: AST.Expression, 
    quasi: AST.TemplateLiteral,
    start: SourcePosition, end: SourcePosition,
): AST.TaggedTemplateExpression {
    return { 
        kind: SyntaxKinds.TaggedTemplateExpression,
        tag: base,
        quasi,
        start, end
    }
}
export function createUpdateExpression(
    argument: AST.Expression,
    operator: UpdateOperatorKinds,
    prefix: boolean,
    start: SourcePosition,
    end: SourcePosition
): AST.UpdateExpression {
    return {
        kind: SyntaxKinds.UpdateExpression,
        operator,
        prefix,
        argument,
        start, end
    };
}
export function createAwaitExpression(
    argument: AST.Expression, 
    start: SourcePosition, end: SourcePosition,
): AST.AwaitExpression {
    return { 
        kind: SyntaxKinds.AwaitExpression, 
        argument,
        start, end,
    };
}
export function createUnaryExpression(
    argument: AST.Expression, 
    operator: UnaryOperatorKinds,
    start: SourcePosition, end: SourcePosition,
): AST.UnaryExpression {
    return {
        kind: SyntaxKinds.UnaryExpression,
        operator,
        argument,
        start, end
    }
}
export function createArrowExpression(
    isExpression: boolean, 
    body: AST.Expression | AST.FunctionBody, 
    calleeArguments: Array<AST.Expression>,
    async: boolean,
    start: SourcePosition, end: SourcePosition,
): AST.ArrorFunctionExpression {
    return {
        kind: SyntaxKinds.ArrowFunctionExpression,
        expressionBody: isExpression, 
        async,
        arguments: calleeArguments,
        body,
        start, end
    }
}
export function createBinaryExpression(
    left: AST.Expression, 
    right: AST.Expression,
    operator: BinaryOperatorKinds,
    start: SourcePosition, end: SourcePosition,
): AST.BinaryExpression {
    return {
        kind: SyntaxKinds.BinaryExpression,
        operator,
        left, right, start, end
    };
}
export function createConditionalExpression(
    test: AST.Expression,
    consequnce: AST.Expression,
    alter: AST.Expression,
    start: SourcePosition, end: SourcePosition,
): AST.ConditionalExpression {
    return {
        kind: SyntaxKinds.ConditionalExpression,
        test,
        consequnce,
        alter,start, end
    };
}
export function createAssignmentExpression(
    left: AST.Expression, 
    right: AST.Expression, 
    operator: AssigmentOperatorKinds,
    start: SourcePosition, end: SourcePosition,
): AST.AssigmentExpression {
    return {
        kind: SyntaxKinds.AssigmentExpression,
        operator,
        left, right,
        start, end
    }
}
export function createSequenceExpression(
    exprs: Array<AST.Expression>,
    start: SourcePosition, end: SourcePosition,
): AST.SequenceExpression {
    return {
        kind: SyntaxKinds.SequenceExpression,
        exprs, start, end
    }
}
export function createExpressionStatement(
    expr: AST.Expression,
    start: SourcePosition, end: SourcePosition,
): AST.ExpressionStatement {
    return { 
        kind: SyntaxKinds.ExpressionStatement, 
        expr,start, end
    };
}
export function createFunctionBody(
    body: Array<AST.StatementListItem>,
    start: SourcePosition, end: SourcePosition,
): AST.FunctionBody {
    return { 
        kind: SyntaxKinds.FunctionBody, 
        body, start, end
    };
}
export function createFunction(
    name: AST.Function['name'], 
    body: AST.Function['body'], 
    params: AST.Function['params'], 
    generator: AST.Function['generator'],
    async: AST.Function['async'],
    start: SourcePosition, end: SourcePosition,
): AST.Function {
    return {
        name,
        generator,
        async,
        body,
        params,
        start, end
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
export function createClass(
    name: AST.Class['id'], 
    superClass: AST.Class['superClass'], 
    body: AST.Class['body'],
    start: SourcePosition, end: SourcePosition,
): AST.Class {
    return {
        id: name,
        superClass, 
        body, start, end
    }
}
export function createClassBody(
    body: AST.ClassBody['body'],
    start: SourcePosition, end: SourcePosition,
): AST.ClassBody {
    return {
        kind: SyntaxKinds.ClassBody,
        body, start, end
    };
}
export function createClassProperty(
    key: AST.ClassProperty['key'],
    value: AST.ClassProperty['value'],
    computed: AST.ClassProperty['computed'],
    isStatic: AST.ClassProperty['static'],
    shorted: AST.ClassProperty['shorted'],
    start: SourcePosition, end: SourcePosition,
): AST.ClassProperty {
    return {
        kind: SyntaxKinds.ClassProperty,
        computed, static: isStatic, shorted, key, value,
        start, end
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
    isStatic: AST.ClassMethodDefinition['static'],
    start: SourcePosition, end: SourcePosition,
): AST.ClassMethodDefinition {
    return {
        kind: SyntaxKinds.ClassMethodDefinition,
        async, type, generator, computed, static: isStatic,
        key, params, body, start, end
    }
}
export function createClassAccessor(
    key: AST.ClassAccessor['key'],
    body: AST.ClassAccessor['body'],
    params: AST.ClassAccessor['params'],
    type: AST.ClassAccessor['type'],
    computed: AST.ClassAccessor['computed'],
    start: SourcePosition, end: SourcePosition,
): AST.ClassAccessor {
    return {
        kind: SyntaxKinds.ClassAccessor,
        key, params, body, type, computed,
        start, end
    }
}
export function transFormClassToClassExpression(classNode: AST.Class ): AST.ClassExpression {
    return {
        kind: SyntaxKinds.ClassExpression,
        ...classNode,
    }
}
export function transFormClassToClassDeclaration(classNode: AST.Class): AST.ClassDeclaration {
    return {
        kind: SyntaxKinds.ClassDeclaration,
        ...classNode,
    }
}
export function createVariableDeclaration(
    declarations: AST.VariableDeclaration['declarations'], 
    variant: AST.VariableDeclaration['variant'],
    start: SourcePosition, end: SourcePosition,
): AST.VariableDeclaration{
    return {
        kind: SyntaxKinds.VariableDeclaration,
        variant,
        declarations,
        start,
        end
    }
}
export function createVariableDeclarator(
    id: AST.VariableDeclarator['id'], 
    init: AST.VariableDeclarator['init'],
    start: SourcePosition, end: SourcePosition,
): AST.VariableDeclarator  {
    return {
        kind: SyntaxKinds.VariableDeclarator,
        id, init,
        start, end
    } 
}
export function createIfStatement(
    test: AST.IfStatement['test'], 
    conseqence: AST.IfStatement['conseqence'], 
    alter: AST.IfStatement['alternative'],
    start: SourcePosition, end: SourcePosition,
): AST.IfStatement {
    return {
        kind: SyntaxKinds.IfStatement,
        test,
        conseqence,
        alternative: alter,
        start, end
    }
}
export function createBlockStatement(
    body: AST.BlockStatement['body'],
    start: SourcePosition, end: SourcePosition,
): AST.BlockStatement {
    return {
        kind: SyntaxKinds.BlockStatement,
        body, start, end
    }
}
export function createSwitchStatement(
    discriminant: AST.SwitchStatement['discriminant'], 
    cases: AST.SwitchStatement['cases'],
    start: SourcePosition, end: SourcePosition,
): AST.SwitchStatement {
    return {
        kind: SyntaxKinds.SwitchStatement,
        discriminant, cases, start, end
    }
}
export function createSwitchCase(
    test: AST.SwitchCase['test'], 
    consequence: AST.SwitchCase['consequence'],
    start: SourcePosition, end: SourcePosition,
):AST.SwitchCase {
    return {
        kind: SyntaxKinds.SwitchCase,
        test, consequence, start, end
    }
}
export function createBreakStatement(
    label: AST.BreakStatement['label'],
    start: SourcePosition, end: SourcePosition,
): AST.BreakStatement {
    return {
        kind: SyntaxKinds.BreakStatement,
        label, start, end
    }
}
export function createContinueStatement(
    label: AST.ContinueStatement['label'],
    start: SourcePosition, end: SourcePosition,
): AST.ContinueStatement {
    return {
        kind: SyntaxKinds.ContinueStatement,
        label, start, end
    }
}
export function createLabeledStatement(
    label: AST.LabeledStatement['label'], 
    body: AST.LabeledStatement['body'],
    start: SourcePosition, end: SourcePosition,
): AST.LabeledStatement {
    return {
        kind: SyntaxKinds.LabeledStatement,
        label,
        body,
        start, end
    }
}
export function createReturnStatement(
    argu: AST.ReturnStatement['argu'],
    start: SourcePosition, end: SourcePosition,
): AST.ReturnStatement {
    return {
        kind: SyntaxKinds.ReturnStatement,
        argu, start, end
    }
}
export function createWhileStatement(
    test: AST.WhileStatement['test'], 
    body: AST.WhileStatement['body'],
    start: SourcePosition, end: SourcePosition,
): AST.WhileStatement {
    return {
        kind: SyntaxKinds.WhileStatement,
        test, body, start, end
    }
}
export function createDoWhileStatement(
    test: AST.DoWhileStatement['test'], 
    body: AST.DoWhileStatement['body'],
    start: SourcePosition, end: SourcePosition,
): AST.DoWhileStatement {
    return {
        kind: SyntaxKinds.DoWhileStatement,
        test, body, start, end
    }
}
export function createTryStatement(
    block: AST.TryStatement['block'], 
    handler: AST.TryStatement['handler'], 
    finalizer: AST.TryStatement['finalizer'],
    start: SourcePosition, end: SourcePosition
): AST.TryStatement {
    return {
        kind: SyntaxKinds.TryStatement,
        block, handler, finalizer,
        start, end
    }
}
export function createCatchClause(
    param: AST.CatchClause['param'],
    body: AST.CatchClause['body'],
    start: SourcePosition, end: SourcePosition
): AST.CatchClause {
    return {
        kind: SyntaxKinds.CatchClause,
        param, body, start, end
    }
}
export function createThrowStatement(
    argu: AST.ThrowStatement['argu'],
    start: SourcePosition, 
    end: SourcePosition
): AST.ThrowStatement {
    return {
        kind: SyntaxKinds.ThrowKeyword,
        argu, start, end
    }
}
export function createWithStatement(
    object: AST.WithStatement['object'], 
    body: AST.WithStatement['body'],
    start: SourcePosition, end: SourcePosition
): AST.WithStatement {
    return {
        kind: SyntaxKinds.WithStatement,
        body, object, start, end
    }
}
export function createDebuggerStatement(
    start: SourcePosition, 
    end: SourcePosition
): AST.DebuggerStatement {
    return {
        kind: SyntaxKinds.DebuggerStatement, start, end
    }
}
export function createForStatement(
    body: AST.ForStatement['body'],
    init: AST.ForStatement['init'],
    test: AST.ForStatement['test'],
    update: AST.ForStatement['update'],
    start: SourcePosition, end: SourcePosition,
): AST.ForStatement {
    return {
        kind: SyntaxKinds.ForStatement,
        init, test, update, body,
        start, end
    }
}
export function createForInStatement(
    left: AST.ForInStatement['left'],
    right: AST.ForInStatement['right'],
    body: AST.ForInStatement['body'],
    start: SourcePosition, end: SourcePosition
): AST.ForInStatement {
    return {
        kind: SyntaxKinds.ForInStatement,
        left, right, body,
        start, end
    }
}
export function createForOfStatement(
    isAwait: boolean, 
    left: AST.ForOfStatement['left'],
    right: AST.ForOfStatement['right'],
    body: AST.ForOfStatement['body'],
    start: SourcePosition, end: SourcePosition
): AST.ForOfStatement {
    return {
        kind: SyntaxKinds.ForOfStatement,
        await: isAwait,
        left, right, body,
        start, end
    }
}
export function createAssignmentPattern(
    left: AST.AssignmentPattern['left'], 
    right: AST.AssignmentPattern['right'],
    start: SourcePosition, end: SourcePosition
): AST.AssignmentPattern {
    return {
        kind: SyntaxKinds.AssignmentPattern,
        left, 
        right,
        start, end
    }
}
export function createArrayPattern(
    elements: AST.ArrayPattern['elements'],
    start: SourcePosition, end: SourcePosition
): AST.ArrayPattern {
    return {
        kind: SyntaxKinds.ArrayPattern,
        elements,
        start, end
    };
}
export function createObjectPattern(
    properties: AST.ObjectPattern['properties'],
    start: SourcePosition, end: SourcePosition
): AST.ObjectPattern {
    return {
        kind: SyntaxKinds.ObjectPattern,
        properties,
        start, end
    }
}
export function createObjectPatternProperty(
    key: AST.ObjectPatternProperty['key'],
    value: AST.ObjectPatternProperty['value'],
    computed: AST.ObjectPatternProperty['computed'],
    shorted: AST.ObjectPatternProperty['shorted'],
    start: SourcePosition, end: SourcePosition
): AST.ObjectPatternProperty {
    return {
        kind:  SyntaxKinds.ObjectPatternProperty,
        computed, shorted,
        key, value, start, end
    }
}
export function createRestElement(
    argument: AST.RestElement['argument'],
    start: SourcePosition, end: SourcePosition
): AST.RestElement {
    return {
        kind: SyntaxKinds.RestElement,
        argument, start, end
    }
}
export function createProgram( body: Array<AST.ModuleItem>): AST.Program {
    return { kind: SyntaxKinds.Program, body };
}
export function createImportDeclaration(
    specifiers: AST.ImportDeclaration['specifiers'],
    source: AST.ImportDeclaration['source'],
    start: SourcePosition, end: SourcePosition
): AST.ImportDeclaration {
    return {
        kind: SyntaxKinds.ImportDeclaration,
        specifiers,
        source,start, end
    }
}
export function createImportDefaultSpecifier(
    imported: AST.ImportDefaultSpecifier['imported'],
    start: SourcePosition, end: SourcePosition
): AST.ImportDefaultSpecifier {
    return {
        kind: SyntaxKinds.ImportDefaultSpecifier,
        imported, start, end
    }
}
export function createImportNamespaceSpecifier(
    imported: AST.ImportNamespaceSpecifier['imported'],
    start: SourcePosition, end: SourcePosition
): AST.ImportNamespaceSpecifier {
    return {
        kind: SyntaxKinds.ImportNamespaceSpecifier,
        imported, start, end
    }
}
export function createImportSpecifier(
    imported: AST.ImportSpecifier['imported'], 
    local: AST.ImportSpecifier['local'],
    start: SourcePosition, end: SourcePosition
): AST.ImportSpecifier {
    return {
        kind: SyntaxKinds.ImportSpecifier,
        imported,
        local, start, end
    }
}

export function createExportAllDeclaration(
    exported: AST.ExportAllDeclaration['exported'], 
    source: AST.ExportAllDeclaration['source'],
    start: SourcePosition, end: SourcePosition
): AST.ExportAllDeclaration {
    return {
        kind: SyntaxKinds.ExportAllDeclaration,
        exported, source,
        start,end
    }
}
export function createExportNamedDeclaration(
    specifiers: AST.ExportNamedDeclarations['specifiers'],
    declaration: AST.ExportNamedDeclarations['declaration'],
    source: AST.ExportNamedDeclarations['source'],
    start: SourcePosition, end: SourcePosition
): AST.ExportNamedDeclarations {
    return {
        kind: SyntaxKinds.ExportNamedDeclaration,
        specifiers, declaration, source, start, end
    }
}
export function createExportSpecifier(
    exported: AST.ExportSpecifier['exported'], 
    local: AST.ExportSpecifier['local'],
    start: SourcePosition, end: SourcePosition
): AST.ExportSpecifier {
    return {
        kind: SyntaxKinds.ExportSpecifier,
        exported, local,start, end
    }
}
export function createExportDefaultDeclaration(
    declaration: AST.ExportDefaultDeclaration['declaration'],
    start: SourcePosition, end: SourcePosition
): AST.ExportDefaultDeclaration {
    return {
        kind: SyntaxKinds.ExportDefaultDeclaration,
        declaration, start, end
    }
}