import { 
    BinaryExpression, 
    ModuleItem,
    ObjectExpression,
    ObjectMethodDefinition,
    ObjectProperty,
    ObjectAccessor,
    PrivateName,
    Program,
    Super,
    TemplateElement,
    TemplateLiteral,
    ThisExpression,
    SpreadElement,
    ClassExpression,
    ArrayExpression,
    FunctionExpression,
    ArrorFunctionExpression,
    MetaProperty,
    AwaitExpression,
    NewExpression,
    MemberExpression,
    CallExpression,
    UpdateExpression,
    UnaryExpression,
    ConditionalExpression,
    YieldExpression,
    AssigmentExpression,
    SequenceExpression,
    ObjectPattern,
    ObjectPatternProperty,
    ArrayPattern,
    AssignmentPattern,
    RestElement,
    IfStatement,
    BlockStatement,
    SwitchStatement,
    SwitchCase,
    ContinueStatement,
    BreakStatement,
    ReturnStatement,
    LabeledStatement,
    WhileStatement,
    DoWhileStatement,
    TryStatement,
    CatchClause,
    ThrowStatement,
    WithStatement,
    DebuggerStatement,
    ForStatement,
    ForInStatement,
    ForOfStatement,
    VariableDeclaration,
    VariableDeclarator,
    FunctionBody,
    FunctionDeclaration,
    ClassBody,
    ClassProperty,
    ClassMethodDefinition,
    ClassAccessor,
    ClassDeclaration,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportSpecifier,
    ImportNamespaceSpecifier,
    ExportNamedDeclarations,
    ExportSpecifier,
    ExportDefaultDeclaration,
    ExportAllDeclaration,
    TaggedTemplateExpression,
    ChainExpression,
    ClassConstructor
} from "../syntax/ast";
import { SyntaxKinds } from "../syntax/kinds";
/**
 * Why not use visitor pattern there, there are two reason,
 * frist, binder should run after any visitor, because i want to 
 * design it as part of core.
 * Second, visitor performance is 2 time of time-cost than this
 * method, thougth both using jump table, but if we using visitor
 * to wrap binder, it will make extra function call, which maybe
 * the main reasom why using visitor is slower than without using
 * it
 */
const BindingTable: { [key: number ]: (node: ModuleItem) => void } = {
    [SyntaxKinds.Program]: function bindProgram(node: Program) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    },
    [SyntaxKinds.Super]: function bindSuper(node: Super) {
        return;
    },
    [SyntaxKinds.ThisExpression]: function bindThisExpression(node: ThisExpression) {
        return;
    },
    [SyntaxKinds.PrivateName]: function bindPrivateName(node: PrivateName) {
        return;
    },
    [SyntaxKinds.TemplateLiteral]: function bindTemplateLiteral(node: TemplateLiteral) {
        setParentForNodes(node.expressions, node);
        setParentForNodes(node.quasis, node);
        bindNodes(node.expressions);
        bindNodes(node.quasis);
    },
    [SyntaxKinds.TemplateElement]: function bindTemplateElement(node: TemplateElement) {
        return;
    },
    [SyntaxKinds.ObjectExpression]: function bindObjectExpression(node: ObjectExpression) {
        setParentForNodes(node.properties, node);
        bindNodes(node.properties);
    },
    [SyntaxKinds.ObjectProperty]: function bindObjectProperty(node: ObjectProperty) {
        setParentForNode(node.key, node);
        setParentForNode(node.value, node);
        bindNode(node.key);
        bindNode(node.value);
    },
    [SyntaxKinds.ObjectMethodDefintion]: function bindObjectMethodDefintion(node: ObjectMethodDefinition) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNodes(node.params);
        bindNode(node.body);
    },
    [SyntaxKinds.ObjectAccessor]: function bindObjectAccessor(node: ObjectAccessor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNodes(node.params);
        bindNode(node.body);
    },
    [SyntaxKinds.SpreadElement]: function bindSpreadElement(node: SpreadElement) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    },
    [SyntaxKinds.ClassExpression]: function bindClassExpression(node: ClassExpression) {
        setParentForNode(node.superClass, node);
        setParentForNode(node.id, node);
        setParentForNode(node.body, node);
        bindNode(node.id);
        bindNode(node.superClass);
        bindNode(node.body);
    },
    [SyntaxKinds.ArrayExpression]: function bindArrayExpression(node: ArrayExpression) {
        setParentForNodes(node.elements, node);
        bindNodes(node.elements);
    },
    [SyntaxKinds.FunctionExpression]: function bindFunctionExpression(node: FunctionExpression) {
        setParentForNode(node.name, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.name);
        bindNodes(node.params);
        bindNode(node.body);
    },
    [SyntaxKinds.ArrowFunctionExpression]: function bindArrowFunctionExpression(node: ArrorFunctionExpression) {
        setParentForNode(node.body, node);
        setParentForNodes(node.arguments, node);
        bindNode(node.body);
        bindNodes(node.arguments);
    },
    [SyntaxKinds.MetaProperty]: function bindMetaProperty(node: MetaProperty) {
        setParentForNode(node.meta, node);
        setParentForNode(node.property, node);
        bindNode(node.meta);
        bindNode(node.property);
    },
    [SyntaxKinds.AwaitExpression]: function bindAwaitExpression(node: AwaitExpression) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    },
    [SyntaxKinds.NewExpression]: function bindNewExpression(node: NewExpression) {
        setParentForNode(node.callee, node);
        setParentForNodes(node.arguments, node);
        bindNode(node.callee);
        bindNodes(node.arguments);
    },
    [SyntaxKinds.MemberExpression]: function bindMemberExpression(node: MemberExpression) {
        setParentForNode(node.object, node);
        setParentForNode(node.property, node);
        bindNode(node.object);
        bindNode(node.property);
    },
    [SyntaxKinds.CallExpression]: function bindCallExpression(node: CallExpression) {
        setParentForNode(node.callee, node);
        setParentForNodes(node.arguments, node);
        bindNode(node.callee);
        bindNodes(node.arguments);
    },
    [SyntaxKinds.TaggedTemplateExpression]: function bindTaggTemplateExpression(node: TaggedTemplateExpression) {
        setParentForNode(node.tag, node);
        setParentForNode(node.quasi, node);
        bindNode(node.tag);
        bindNode(node.quasi);
    },
    [SyntaxKinds.ChainExpression]: function bindChainExpression(node: ChainExpression) {
        setParentForNode(node.expression, node);
        bindNode(node.expression);
    },
    [SyntaxKinds.UpdateExpression]: function bindUpdateExpression(node: UpdateExpression) {
        setParentForNode(node.argument, node);
        bindNode(node);
    },
    [SyntaxKinds.UnaryExpression]: function bindUnaryExpression(node: UnaryExpression) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    },
    [SyntaxKinds.BinaryExpression]: function bindBinaryExpression(node: BinaryExpression) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        bindNode(node.left);
        bindNode(node.right);
    },
    [SyntaxKinds.ConditionalExpression]: function bindConditionalExpression(node: ConditionalExpression) {
        setParentForNode(node.test, node);
        setParentForNode(node.consequnce, node);
        setParentForNode(node.alter, node);
        bindNode(node.test);
        bindNode(node.consequnce);
        bindNode(node.alter);
    },
    [SyntaxKinds.YieldExpression]: function bindYieldExpression(node: YieldExpression) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    },
    [SyntaxKinds.AssigmentExpression]: function bindAssignmentExpression(node: AssigmentExpression) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        bindNode(node.left);
        bindNode(node.right);
    },
    [SyntaxKinds.SequenceExpression]: function bindSequenceExpression(node: SequenceExpression) {
        setParentForNodes(node.exprs, node);
        bindNodes(node.exprs)
    },
    [SyntaxKinds.ObjectPattern]: function bindObjectPattern(node: ObjectPattern) {
        setParentForNodes(node.properties, node);
        bindNodes(node.properties);
    },
    [SyntaxKinds.ObjectPatternProperty]: function bindObjectPatternProperty(node: ObjectPatternProperty) {
        setParentForNode(node.key,node);
        setParentForNode(node.value, node);
        bindNode(node.key);
        bindNode(node.value);
    },
    [SyntaxKinds.ArrayPattern]: function bindArrayPattern(node: ArrayPattern) {
        setParentForNodes(node.elements, node);
        bindNodes(node.elements);
    },
    [SyntaxKinds.AssignmentPattern]: function bindAssigmentPattern(node: AssignmentPattern) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        bindNode(node.left);
        bindNode(node.right);
    },
    [SyntaxKinds.RestElement]: function bindRestElement(node: RestElement) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    },
    [SyntaxKinds.IfStatement]: function bindIfStatement(node: IfStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.conseqence, node);
        setParentForNode(node.alternative, node);
        bindNode(node.test);
        bindNode(node.conseqence);
        bindNode(node.alternative);
    },
    [SyntaxKinds.BlockStatement]: function bindBlockStatement(node: BlockStatement) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    },
    [SyntaxKinds.SwitchStatement]: function bindSwitchStatement(node: SwitchStatement) {
        setParentForNode(node.discriminant, node);
        setParentForNodes(node.cases, node);
        bindNode(node.discriminant);
        bindNodes(node.cases);
    },
    [SyntaxKinds.SwitchCase]: function bindSwitchCase(node: SwitchCase) {
        setParentForNode(node.test, node);
        setParentForNodes(node.consequence, node);
        bindNode(node.test);
        bindNodes(node.consequence);
    },
    [SyntaxKinds.ContinueStatement]: function bindContinueStatement(node: ContinueStatement) {
        setParentForNode(node.label, node);
        bindNode(node.label);
    },
    [SyntaxKinds.BreakStatement]: function bindBreakStatement(node: BreakStatement) {
        setParentForNode(node.label, node);
        bindNode(node.label);
    },
    [SyntaxKinds.ReturnStatement]: function bindReturnStatement(node: ReturnStatement) {
        setParentForNode(node.argu, node);
        bindNode(node.argu);
    },
    [SyntaxKinds.LabeledStatement]: function bindLabeledStatement(node: LabeledStatement) {
        setParentForNode(node.label, node);
        setParentForNode(node.body, node);
        bindNode(node.label);
        bindNode(node.body);
    },
    [SyntaxKinds.WhileStatement]: function bindWhileStatement(node: WhileStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.body, node);
        bindNode(node.test);
        bindNode(node.body);
    },
    [SyntaxKinds.DoWhileStatement]: function bindDoWhileStatement(node: DoWhileStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.body, node);
        bindNode(node.test);
        bindNode(node.body);
    },
    [SyntaxKinds.TryStatement]: function bindTryStatement(node: TryStatement) {
        setParentForNode(node.block, node);
        setParentForNode(node.handler, node);
        setParentForNode(node.finalizer, node);
        bindNode(node.block);
        bindNode(node.handler);
        bindNode(node.finalizer);
    },
    [SyntaxKinds.CatchClause]: function bindCatchClause(node: CatchClause) {
        setParentForNode(node.param, node);
        setParentForNode(node.body, node);
        bindNode(node.param);
        bindNode(node.body);
    },
    [SyntaxKinds.ThrowStatement]: function bindThrowStatement(node: ThrowStatement) {
        setParentForNode(node.argu, node);
        bindNode(node.argu);
    },
    [SyntaxKinds.WithStatement]: function bindWithStatement(node: WithStatement) {
        setParentForNode(node.object, node);
        setParentForNode(node.body, node);
        bindNode(node.object);
        bindNode(node.body);
    },
    [SyntaxKinds.DebuggerStatement]: function bindDebuggerStatement(node: DebuggerStatement) {
        return;
    },
    [SyntaxKinds.ForStatement]: function bindForStatement(node: ForStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.init, node);
        setParentForNode(node.update, node);
        setParentForNode(node.body, node);
        bindNode(node.test);
        bindNode(node.init);
        bindNode(node.update);
        bindNode(node.body);
    },
    [SyntaxKinds.ForInStatement]: function bindForInStatement(node: ForInStatement) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        setParentForNode(node.body, node);
        bindNode(node.left);
        bindNode(node.right);
        bindNode(node.body);
    },
    [SyntaxKinds.ForOfStatement]: function bindForOfStatement(node: ForOfStatement) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        setParentForNode(node.body, node);
        bindNode(node.left);
        bindNode(node.right);
        bindNode(node.body);
    },
    [SyntaxKinds.VariableDeclaration]: function bindVariableDeclaration(node: VariableDeclaration) {
        setParentForNodes(node.declarations, node);
        bindNodes(node.declarations);
    },
    [SyntaxKinds.VariableDeclarator]: function bindVariableDeclarator(node: VariableDeclarator) {
        setParentForNode(node.id, node);
        setParentForNode(node.init, node);
        bindNode(node.id);
        bindNode(node.init);
    },
    [SyntaxKinds.FunctionBody]: function bindFunctionBody(node: FunctionBody) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    },
    [SyntaxKinds.FunctionDeclaration]: function bindFunctionDeclaration(node: FunctionDeclaration) {
        setParentForNode(node.name, node);
        setParentForNodes(node.params, node);
        setParentForNode(node.body, node);
        bindNode(node.name);
        bindNodes(node.params);
        bindNode(node.body);
    },
    [SyntaxKinds.ClassBody]: function bindClassBody(node: ClassBody) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    },
    [SyntaxKinds.ClassProperty]: function bindClassProperty(node: ClassProperty) {
        setParentForNode(node.key, node);
        setParentForNode(node.value, node);
        bindNode(node.key);
        bindNode(node.value);
    },
    [SyntaxKinds.ClassMethodDefinition]: function bindClassMethodDefiniton(node: ClassMethodDefinition) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNode(node.body);
        bindNodes(node.params);
    },
    [SyntaxKinds.ClassConstructor]: function bindClassConstructor(node: ClassConstructor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNode(node.body);
        bindNodes(node.params);
    },
    [SyntaxKinds.ClassAccessor]: function bindClassAccessor(node: ClassAccessor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNode(node.body);
        bindNodes(node.params);
    },
    [SyntaxKinds.ClassDeclaration]: function bindClassDeclaration(node: ClassDeclaration) {
        setParentForNode(node.id, node);
        setParentForNode(node.superClass, node);
        setParentForNode(node.body, node);
        bindNode(node.id);
        bindNode(node.superClass);
        bindNode(node.body);
    },
    [SyntaxKinds.ImportDeclaration]: function bindImportDeclaration(node: ImportDeclaration) {
        setParentForNode(node.source, node);
        setParentForNodes(node.specifiers, node);
        bindNode(node.source);
        bindNodes(node.specifiers);
    },
    [SyntaxKinds.ImportDefaultSpecifier]: function bindImportDefaultSpecifier(node: ImportDefaultSpecifier) {
        setParentForNode(node.imported, node);
        bindNode(node.imported);
    },
    [SyntaxKinds.ImportSpecifier]: function bindImportSpecifier(node: ImportSpecifier) {
        setParentForNode(node.imported, node);
        setParentForNode(node.local, node);
        bindNode(node.imported);
        bindNode(node.local);
    },
    [SyntaxKinds.ImportNamespaceSpecifier]: function bindImportNamespaceSpecifier(node: ImportNamespaceSpecifier) {
        setParentForNode(node.imported, node);
        bindNode(node.imported);
    },
    [SyntaxKinds.ExportNamedDeclaration]: function bindExportNameDeclaration(node: ExportNamedDeclarations) {
        setParentForNode(node.declaration, node);
        setParentForNodes(node.specifiers, node);
        bindNode(node.declaration);
        bindNodes(node.specifiers);
    },
    [SyntaxKinds.ExportSpecifier]: function bindExportSpecifier(node: ExportSpecifier) {
        setParentForNode(node.exported, node);
        setParentForNode(node.local, node);
        bindNode(node.exported);
        bindNode(node.local);
    },
    [SyntaxKinds.ExportDefaultDeclaration]: function bindExportDefaultDeclaration(node: ExportDefaultDeclaration) {
        setParentForNode(node.declaration, node);
        bindNode(node.declaration);
    },
    [SyntaxKinds.ExportAllDeclaration]: function bindExportAllDeclaration(node: ExportAllDeclaration) {
        setParentForNode(node.exported, node);
        setParentForNode(node.source, node);
        bindNode(node.exported);
        bindNode(node.source);
    }
};

function setParentForNodes(nodes: Array<ModuleItem>, parent: ModuleItem) {
    nodes.forEach(node => node.parent = parent);
}
function setParentForNode(node: ModuleItem | null, parent: ModuleItem) {
    if(node) {
        node.parent = parent;
    }
}
function bindNode(node: ModuleItem) {
    const handler = BindingTable[node.kind];
    if(handler) {
        handler(node);
    }
}
function bindNodes(nodes: Array<ModuleItem>) {
    nodes.forEach(node => bindNode(node));
}
/**
 * binder would binding parent node for child,
 * and create symbol table.
 * @param program this program ast
 * @returns 
 */
export function createBinder(program: Program) {
    return {
        bind: () => bindNode(program)
    }
}

/**
 *  this function is for test performance
 */

function createSwitchCaseBinder(program: Program) {
    return {
        bind: () => bindNode(program)
    }
    /*
    function setParentForNodes(nodes: Array<ModuleItem>, parent: ModuleItem) {
        nodes.forEach(node => node.parent = parent);
    }
    function setParentForNode(node: ModuleItem | null, parent: ModuleItem) {
        if(node) {
            node.parent = parent;
        }
    }
    function bindNode(node: ModuleItem | null) {
        if(!node) {
            return;
        }
        switch(node.kind) {
            case SyntaxKinds.Program:
                return bindProgram(node as Program);
            case SyntaxKinds.Super:
                return bindSuper(node as Super);
            case SyntaxKinds.ThisExpression:
                return bindThisExpression(node as ThisExpression);
            case SyntaxKinds.PrivateName:
                return bindPrivateName(node as PrivateName);
            case SyntaxKinds.NumberLiteral:
                return;
            case SyntaxKinds.StringLiteral:
                return;
            case SyntaxKinds.TemplateLiteral:
                return bindTemplateLiteral(node as TemplateLiteral);
            case SyntaxKinds.TemplateElement:
                return bindTemplateElement(node as TemplateElement);
            case SyntaxKinds.ObjectExpression:
                return bindObjectExpression(node as ObjectExpression);
            case SyntaxKinds.ObjectProperty:
                return bindObjectProperty(node as ObjectProperty);
            case SyntaxKinds.ObjectMethodDefintion:
                return bindObjectMethodDefintion(node as ObjectMethodDefinition);
            case SyntaxKinds.BinaryExpression:
                return bindBinaryExpression(node as BinaryExpression);
            case SyntaxKinds.ObjectAccessor:
                return bindObjectAccessor(node as ObjectAccessor);
            case SyntaxKinds.SpreadElement:
                return bindSpreadElement(node as SpreadElement);
            case SyntaxKinds.ClassExpression:
                return bindClassExpression(node as ClassExpression);
            case SyntaxKinds.ArrayExpression:
                return bindArrayExpression(node as ArrayExpression);
            case SyntaxKinds.FunctionExpression:
                return bindFunctionExpression(node as FunctionExpression);
            case SyntaxKinds.ArrowFunctionExpression:
                return bindArrowFunctionExpression(node as ArrorFunctionExpression);
            case SyntaxKinds.MetaProperty:
                return bindMetaProperty(node as MetaProperty);
            case SyntaxKinds.AwaitExpression:
                return bindAwaitExpression(node as AwaitExpression);
            case SyntaxKinds.NewExpression:
                return bindNewExpression(node as NewExpression);
            case SyntaxKinds.MemberExpression:
                return bindMemberExpression(node as MemberExpression);
            case SyntaxKinds.CallExpression:
                return bindCallExpression(node as CallExpression);
            case SyntaxKinds.TaggedTemplateExpression:
                return bindTaggTemplateExpression(node as TaggedTemplateExpression);
            case SyntaxKinds.ChainExpression:
                return bindChainExpression(node as ChainExpression);
            case SyntaxKinds.UpdateExpression:
                return bindUpdateExpression(node as UpdateExpression);
            case SyntaxKinds.UnaryExpression:
                return bindUnaryExpression(node as UnaryExpression);
            case SyntaxKinds.ConditionalExpression:
                return bindConditionalExpression(node as ConditionalExpression);
            case SyntaxKinds.YieldExpression:
                return bindYieldExpression(node as YieldExpression);
            case SyntaxKinds.AssigmentExpression:
                return bindAssignmentExpression(node as AssigmentExpression);
            case SyntaxKinds.SequenceExpression:
                return bindSequenceExpression(node as SequenceExpression);
            case SyntaxKinds.ObjectPattern:
                return bindObjectPattern(node as ObjectPattern);
            case SyntaxKinds.ObjectPatternProperty:
                return bindObjectPatternProperty(node as ObjectPatternProperty);
            case SyntaxKinds.ArrayPattern:
                return bindArrayPattern(node as ArrayPattern);
            case SyntaxKinds.AssignmentPattern:
                return bindAssigmentPattern(node as AssignmentPattern);
            case SyntaxKinds.RestElement:
                return bindRestElement(node as RestElement);
            case SyntaxKinds.IfStatement:
                return bindIfStatement(node as IfStatement);
            case SyntaxKinds.BlockStatement:
                return bindBlockStatement(node as BlockStatement);
            case SyntaxKinds.SwitchStatement:
                return bindSwitchStatement(node as SwitchStatement);
            case SyntaxKinds.SwitchCase:
                return bindSwitchCase(node as SwitchCase);
            case SyntaxKinds.ContinueStatement:
                return bindContinueStatement(node as ContinueStatement);
            case SyntaxKinds.BreakStatement:
                return bindBreakStatement(node as BreakStatement);
            case SyntaxKinds.ReturnStatement:
                return bindReturnStatement(node as ReturnStatement);
            case SyntaxKinds.LabeledStatement:
                return bindLabeledStatement(node as LabeledStatement);
            case SyntaxKinds.WhileStatement:
                return bindWhileStatement(node as WhileStatement);
            case SyntaxKinds.DoWhileStatement:
                return bindDoWhileStatement(node as DoWhileStatement);
            case SyntaxKinds.TryStatement:
                return bindTryStatement(node as TryStatement);
            case SyntaxKinds.CatchClause:
                return bindCatchClause(node as CatchClause);
            case SyntaxKinds.ThrowKeyword:
                return bindThrowStatement(node as ThrowStatement);
            case SyntaxKinds.WithStatement:
                return bindWithStatement(node as WithStatement);
            case SyntaxKinds.DebuggerStatement:
                return bindDebuggerStatement(node as DebuggerStatement);
            case SyntaxKinds.ForStatement:
                return bindForStatement(node as ForStatement);
            case SyntaxKinds.ForInStatement:
                return bindForInStatement(node as ForInStatement);
            case SyntaxKinds.ForOfStatement:
                return bindForOfStatement(node as ForOfStatement);
            case SyntaxKinds.VariableDeclaration:
                return bindVariableDeclaration(node as VariableDeclaration);
            case SyntaxKinds.VariableDeclarator:
                return bindVariableDeclarator(node as VariableDeclarator);
            case SyntaxKinds.FunctionBody:
                return bindFunctionBody(node as FunctionBody);
            case SyntaxKinds.FunctionDeclaration:
                return bindFunctionDeclaration(node as FunctionDeclaration);
            case SyntaxKinds.ClassBody:
                return bindClassBody(node as ClassBody);
            case SyntaxKinds.ClassProperty:
                return bindClassProperty(node as ClassProperty);
            case SyntaxKinds.ClassMethodDefinition:
                return bindClassMethodDefiniton(node as ClassMethodDefinition);
            case SyntaxKinds.ClassConstructor:
                return bindClassConstructor(node as ClassConstructor);
            case SyntaxKinds.ClassAccessor:
                return bindClassConstructor(node as ClassConstructor);
            case SyntaxKinds.ImportDeclaration:
                return bindImportDeclaration(node as ImportDeclaration);
            case SyntaxKinds.ImportDefaultSpecifier:
                return bindImportDefaultSpecifier(node as ImportDefaultSpecifier);
            case SyntaxKinds.ImportSpecifier:
                return bindImportSpecifier(node as ImportSpecifier);
            case SyntaxKinds.ImportNamespaceSpecifier:
                return bindImportNamespaceSpecifier(node as ImportNamespaceSpecifier);
            case SyntaxKinds.ExportNamedDeclaration:
                return bindExportNameDeclaration(node as ExportNamedDeclarations);
            case SyntaxKinds.ExportSpecifier:
                return bindExportSpecifier(node as ExportSpecifier);
            case SyntaxKinds.ExportDefaultDeclaration:
                return bindExportDefaultDeclaration(node as ExportDefaultDeclaration);
            case SyntaxKinds.ExportAllDeclaration:
                return bindExportAllDeclaration(node as ExportAllDeclaration);
            
        }
    }
    function bindNodes(nodes: Array<ModuleItem>) {
        nodes.forEach(node => bindNode(node));
    }

    function bindProgram(node: Program) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    }
    function bindSuper(node: Super) {
        return;
    }
    function bindThisExpression(node: ThisExpression) {
        return;
    }
    function bindPrivateName(node: PrivateName) {
        return;
    }
    function bindTemplateLiteral(node: TemplateLiteral) {
        setParentForNodes(node.expressions, node);
        setParentForNodes(node.quasis, node);
        bindNodes(node.expressions);
        bindNodes(node.quasis);
    }
    function bindTemplateElement(node: TemplateElement) {
        return;
    }
    function bindObjectExpression(node: ObjectExpression) {
        setParentForNodes(node.properties, node);
        bindNodes(node.properties);
    }
    function bindObjectProperty(node: ObjectProperty) {
        setParentForNode(node.key, node);
        setParentForNode(node.value, node);
        bindNode(node.key);
        bindNode(node.value);
    }
    function bindObjectMethodDefintion(node: ObjectMethodDefinition) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNodes(node.params);
        bindNode(node.body);
    }
    function bindObjectAccessor(node: ObjectAccessor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNodes(node.params);
        bindNode(node.body);
    }
    function bindSpreadElement(node: SpreadElement) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    }
    function bindClassExpression(node: ClassExpression) {
        setParentForNode(node.superClass, node);
        setParentForNode(node.id, node);
        setParentForNode(node.body, node);
        bindNode(node.id);
        bindNode(node.superClass);
        bindNode(node.body);
    }
    function bindArrayExpression(node: ArrayExpression) {
        setParentForNodes(node.elements, node);
        bindNodes(node.elements);
    }
    function bindFunctionExpression(node: FunctionExpression) {
        setParentForNode(node.name, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.name);
        bindNodes(node.params);
        bindNode(node.body);
    }
    function bindArrowFunctionExpression(node: ArrorFunctionExpression) {
        setParentForNode(node.body, node);
        setParentForNodes(node.arguments, node);
        bindNode(node.body);
        bindNodes(node.arguments);
    }
    function bindMetaProperty(node: MetaProperty) {
        setParentForNode(node.meta, node);
        setParentForNode(node.property, node);
        bindNode(node.meta);
        bindNode(node.property);
    }
    function bindAwaitExpression(node: AwaitExpression) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    }
    function bindNewExpression(node: NewExpression) {
        setParentForNode(node.callee, node);
        setParentForNodes(node.arguments, node);
        bindNode(node.callee);
        bindNodes(node.arguments);
    }
    function bindMemberExpression(node: MemberExpression) {
        setParentForNode(node.object, node);
        setParentForNode(node.property, node);
        bindNode(node.object);
        bindNode(node.property);
    }
    function bindCallExpression(node: CallExpression) {
        setParentForNode(node.callee, node);
        setParentForNodes(node.arguments, node);
        bindNode(node.callee);
        bindNodes(node.arguments);
    }
    function bindTaggTemplateExpression(node: TaggedTemplateExpression) {
        setParentForNode(node.tag, node);
        setParentForNode(node.quasi, node);
        bindNode(node.tag);
        bindNode(node.quasi);
    }
    function bindChainExpression(node: ChainExpression) {
        setParentForNode(node.expression, node);
        bindNode(node.expression);
    }
    function bindUpdateExpression(node: UpdateExpression) {
        setParentForNode(node.argument, node);
        bindNode(node);
    }
    function bindUnaryExpression(node: UnaryExpression) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    }
    function bindBinaryExpression(node: BinaryExpression) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        bindNode(node.left);
        bindNode(node.right);
    }
    function bindConditionalExpression(node: ConditionalExpression) {
        setParentForNode(node.test, node);
        setParentForNode(node.consequnce, node);
        setParentForNode(node.alter, node);
        bindNode(node.test);
        bindNode(node.consequnce);
        bindNode(node.alter);
    }
    function bindYieldExpression(node: YieldExpression) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    }
    function bindAssignmentExpression(node: AssigmentExpression) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        bindNode(node.left);
        bindNode(node.right);
    }
    function bindSequenceExpression(node: SequenceExpression) {
        setParentForNodes(node.exprs, node);
        bindNodes(node.exprs)
    }
    function bindObjectPattern(node: ObjectPattern) {
        setParentForNodes(node.properties, node);
        bindNodes(node.properties);
    } 
    function bindObjectPatternProperty(node: ObjectPatternProperty) {
        setParentForNode(node.key,node);
        setParentForNode(node.value, node);
        bindNode(node.key);
        bindNode(node.value);
    }
    function bindArrayPattern(node: ArrayPattern) {
        setParentForNodes(node.elements, node);
        bindNodes(node.elements);
    }
    function bindAssigmentPattern(node: AssignmentPattern) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        bindNode(node.left);
        bindNode(node.right);
    }
    function bindRestElement(node: RestElement) {
        setParentForNode(node.argument, node);
        bindNode(node.argument);
    }
    function bindIfStatement(node: IfStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.conseqence, node);
        setParentForNode(node.alternative, node);
        bindNode(node.test);
        bindNode(node.conseqence);
        bindNode(node.alternative);
    }
    function bindBlockStatement(node: BlockStatement) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    }
    function bindSwitchStatement(node: SwitchStatement) {
        setParentForNode(node.discriminant, node);
        setParentForNodes(node.cases, node);
        bindNode(node.discriminant);
        bindNodes(node.cases);
    }
    function bindSwitchCase(node: SwitchCase) {
        setParentForNode(node.test, node);
        setParentForNodes(node.consequence, node);
        bindNode(node.test);
        bindNodes(node.consequence);
    }
    function bindContinueStatement(node: ContinueStatement) {
        setParentForNode(node.label, node);
        bindNode(node.label);
    }
    function bindBreakStatement(node: BreakStatement) {
        setParentForNode(node.label, node);
        bindNode(node.label);
    }
    function bindReturnStatement(node: ReturnStatement) {
        setParentForNode(node.argu, node);
        bindNode(node.argu);
    }
    function bindLabeledStatement(node: LabeledStatement) {
        setParentForNode(node.label, node);
        setParentForNode(node.body, node);
        bindNode(node.label);
        bindNode(node.body);
    }
    function bindWhileStatement(node: WhileStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.body, node);
        bindNode(node.test);
        bindNode(node.body);
    }
    function bindDoWhileStatement(node: DoWhileStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.body, node);
        bindNode(node.test);
        bindNode(node.body);
    }
    function bindTryStatement(node: TryStatement) {
        setParentForNode(node.block, node);
        setParentForNode(node.handler, node);
        setParentForNode(node.finalizer, node);
        bindNode(node.block);
        bindNode(node.handler);
        bindNode(node.finalizer);
    }
    function bindCatchClause(node: CatchClause) {
        setParentForNode(node.param, node);
        setParentForNode(node.body, node);
        bindNode(node.param);
        bindNode(node.body);
    }
    function bindThrowStatement(node: ThrowStatement) {
        setParentForNode(node.argu, node);
        bindNode(node.argu);
    }
    function bindWithStatement(node: WithStatement) {
        setParentForNode(node.object, node);
        setParentForNode(node.body, node);
        bindNode(node.object);
        bindNode(node.body);
    }
    function bindDebuggerStatement(node: DebuggerStatement) {
        return;
    }
    function bindForStatement(node: ForStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.init, node);
        setParentForNode(node.update, node);
        setParentForNode(node.body, node);
        bindNode(node.test);
        bindNode(node.init);
        bindNode(node.update);
        bindNode(node.body);
    }
    function bindForInStatement(node: ForInStatement) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        setParentForNode(node.body, node);
        bindNode(node.left);
        bindNode(node.right);
        bindNode(node.body);
    }
    function bindForOfStatement(node: ForOfStatement) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        setParentForNode(node.body, node);
        bindNode(node.left);
        bindNode(node.right);
        bindNode(node.body);
    }
    function bindVariableDeclaration(node: VariableDeclaration) {
        setParentForNodes(node.declarations, node);
        bindNodes(node.declarations);
    }
    function bindVariableDeclarator(node: VariableDeclarator) {
        setParentForNode(node.id, node);
        setParentForNode(node.init, node);
        bindNode(node.id);
        bindNode(node.init);
    }
    function bindFunctionBody(node: FunctionBody) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    }
    function bindFunctionDeclaration(node: FunctionDeclaration) {
        setParentForNode(node.name, node);
        setParentForNodes(node.params, node);
        setParentForNode(node.body, node);
        bindNode(node.name);
        bindNodes(node.params);
        bindNode(node.body);
    }
    function bindClassBody(node: ClassBody) {
        setParentForNodes(node.body, node);
        bindNodes(node.body);
    }
    function bindClassProperty(node: ClassProperty) {
        setParentForNode(node.key, node);
        setParentForNode(node.value, node);
        bindNode(node.key);
        bindNode(node.value);
    }
    function bindClassMethodDefiniton(node: ClassMethodDefinition) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNode(node.body);
        bindNodes(node.params);
    }
    function bindClassConstructor(node: ClassConstructor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNode(node.body);
        bindNodes(node.params);
    }
    function bindClassAccessor(node: ClassAccessor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
        bindNode(node.key);
        bindNode(node.body);
        bindNodes(node.params);
    }
    function bindClassDeclaration(node: ClassDeclaration) {
        setParentForNode(node.id, node);
        setParentForNode(node.superClass, node);
        setParentForNode(node.body, node);
        bindNode(node.id);
        bindNode(node.superClass);
        bindNode(node.body);
    }
    function bindImportDeclaration(node: ImportDeclaration) {
        setParentForNode(node.source, node);
        setParentForNodes(node.specifiers, node);
        bindNode(node.source);
        bindNodes(node.specifiers);
    }
    function bindImportDefaultSpecifier(node: ImportDefaultSpecifier) {
        setParentForNode(node.imported, node);
        bindNode(node.imported);
    }
    function bindImportSpecifier(node: ImportSpecifier) {
        setParentForNode(node.imported, node);
        setParentForNode(node.local, node);
        bindNode(node.imported);
        bindNode(node.local);
    }
    function bindImportNamespaceSpecifier(node: ImportNamespaceSpecifier) {
        setParentForNode(node.imported, node);
        bindNode(node.imported);
    }
    function bindExportNameDeclaration(node: ExportNamedDeclarations) {
        setParentForNode(node.declaration, node);
        setParentForNodes(node.specifiers, node);
        bindNode(node.declaration);
        bindNodes(node.specifiers);
    }
    function bindExportSpecifier(node: ExportSpecifier) {
        setParentForNode(node.exported, node);
        setParentForNode(node.local, node);
        bindNode(node.exported);
        bindNode(node.local);
    }
    function bindExportDefaultDeclaration(node: ExportDefaultDeclaration) {
        setParentForNode(node.declaration, node);
        bindNode(node.declaration);
    }
    function bindExportAllDeclaration(node: ExportAllDeclaration) {
        setParentForNode(node.exported, node);
        setParentForNode(node.source, node);
        bindNode(node.exported);
        bindNode(node.source);
    }
    */
}