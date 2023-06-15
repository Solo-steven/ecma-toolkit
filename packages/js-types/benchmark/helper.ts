import { 
    ModuleItem,
    Program,
    BinaryExpression, 
    ObjectExpression,
    ObjectMethodDefinition,
    ObjectProperty,
    ObjectAccessor,
    PrivateName,
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
    ClassConstructor,
    SyntaxKinds,
    SytaxKindsMapLexicalLiteral,
    ExpressionStatement
} from "@/src/index";
import { traversal as DeclarativeTraversal } from "@/src/visitor/declarative";
import { performance } from "node:perf_hooks";
import fs from "fs/promises";
import path from "path";

export function benchmark(callback: CallableFunction, prefix: string) {
    const startStr = `${prefix}-start`;
    const endStr = `${prefix}-end`;
    performance.mark(startStr);
    callback();
    performance.mark(endStr);
    console.log(performance.measure(prefix, startStr, endStr));
}

export function validParent(program: Program) {
    let isWrong = false;
    function checkWrong(node: ModuleItem) {
        // console.log(SytaxKindsMapLexicalLiteral[node.kind]);
        if(!node.parent) {
            console.log(SytaxKindsMapLexicalLiteral[node.kind]);
            isWrong = true;
        }
        return;
    }
    DeclarativeTraversal(program, {
        [SyntaxKinds.Program]: function bindProgram(node: Program) {
            if(node.parent) {
                isWrong = true;
            }
        },
        [SyntaxKinds.Super]: checkWrong,
        [SyntaxKinds.ThisExpression]: checkWrong,
        [SyntaxKinds.PrivateName]: checkWrong,
        [SyntaxKinds.TemplateLiteral]: checkWrong,
        [SyntaxKinds.TemplateElement]: checkWrong,
        [SyntaxKinds.ObjectExpression]: checkWrong,
        [SyntaxKinds.ObjectProperty]: checkWrong,
        [SyntaxKinds.ObjectMethodDefintion]: checkWrong,
        [SyntaxKinds.ObjectAccessor]: checkWrong,
        [SyntaxKinds.SpreadElement]: checkWrong,
        [SyntaxKinds.ClassExpression]: checkWrong,
        [SyntaxKinds.ArrayExpression]: checkWrong,
        [SyntaxKinds.FunctionExpression]: checkWrong,
        [SyntaxKinds.ArrowFunctionExpression]: checkWrong,
        [SyntaxKinds.MetaProperty]: checkWrong,
        [SyntaxKinds.AwaitExpression]: checkWrong,
        [SyntaxKinds.NewExpression]: checkWrong,
        [SyntaxKinds.MemberExpression]: checkWrong,
        [SyntaxKinds.CallExpression]: checkWrong,
        [SyntaxKinds.TaggedTemplateExpression]: checkWrong,
        [SyntaxKinds.ChainExpression]: checkWrong,
        [SyntaxKinds.UpdateExpression]: checkWrong,
        [SyntaxKinds.UnaryExpression]: checkWrong,
        [SyntaxKinds.BinaryExpression]: checkWrong,
        [SyntaxKinds.ConditionalExpression]: checkWrong,
        [SyntaxKinds.YieldExpression]: checkWrong,
        [SyntaxKinds.AssigmentExpression]: checkWrong,
        [SyntaxKinds.SequenceExpression]: checkWrong,
        [SyntaxKinds.ObjectPattern]: checkWrong,
        [SyntaxKinds.ObjectPatternProperty]: checkWrong,
        [SyntaxKinds.ArrayPattern]: checkWrong,
        [SyntaxKinds.AssignmentPattern]: checkWrong,
        [SyntaxKinds.RestElement]: checkWrong,
        [SyntaxKinds.IfStatement]: checkWrong,
        [SyntaxKinds.BlockStatement]: checkWrong,
        [SyntaxKinds.SwitchStatement]: checkWrong,
        [SyntaxKinds.SwitchCase]: checkWrong,
        [SyntaxKinds.ContinueStatement]: checkWrong,
        [SyntaxKinds.BreakStatement]: checkWrong,
        [SyntaxKinds.ReturnStatement]: checkWrong,
        [SyntaxKinds.LabeledStatement]: checkWrong,
        [SyntaxKinds.WhileStatement]: checkWrong,
        [SyntaxKinds.DoWhileStatement]: checkWrong,
        [SyntaxKinds.TryStatement]: checkWrong,
        [SyntaxKinds.CatchClause]: checkWrong,
        [SyntaxKinds.ThrowStatement]: checkWrong,
        [SyntaxKinds.WithStatement]: checkWrong,
        [SyntaxKinds.DebuggerStatement]: checkWrong,
        [SyntaxKinds.ForStatement]: checkWrong,
        [SyntaxKinds.ForInStatement]: checkWrong,
        [SyntaxKinds.ForOfStatement]: checkWrong,
        [SyntaxKinds.VariableDeclaration]: checkWrong,
        [SyntaxKinds.VariableDeclarator]: checkWrong,
        [SyntaxKinds.FunctionBody]: checkWrong,
        [SyntaxKinds.FunctionDeclaration]: checkWrong,
        [SyntaxKinds.ClassBody]: checkWrong,
        [SyntaxKinds.ClassProperty]: checkWrong,
        [SyntaxKinds.ClassMethodDefinition]: checkWrong,
        [SyntaxKinds.ClassConstructor]: checkWrong,
        [SyntaxKinds.ClassAccessor]: checkWrong,
        [SyntaxKinds.ClassDeclaration]: checkWrong,
        [SyntaxKinds.ImportDeclaration]: checkWrong,
        [SyntaxKinds.ImportDefaultSpecifier]: checkWrong,
        [SyntaxKinds.ImportSpecifier]: checkWrong,
        [SyntaxKinds.ImportNamespaceSpecifier]: checkWrong,
        [SyntaxKinds.ExportNamedDeclaration]: checkWrong,
        [SyntaxKinds.ExportSpecifier]: checkWrong,
        [SyntaxKinds.ExportDefaultDeclaration]: checkWrong,
        [SyntaxKinds.ExportAllDeclaration]: checkWrong,
    });
    return isWrong;
}

export async function createFakeAST(): Promise<Program> {
    const code = await fs.readFile(path.join(__dirname, "test.json"));
    return JSON.parse(code.toString()) as Program;
}

export const BindingTable: { [key: number ]: (node: ModuleItem) => void } = {
    [SyntaxKinds.Program]: function bindProgram(node: Program) {
        setParentForNodes(node.body, node);
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
    },
    [SyntaxKinds.TemplateElement]: function bindTemplateElement(node: TemplateElement) {
        return;
    },
    [SyntaxKinds.ObjectExpression]: function bindObjectExpression(node: ObjectExpression) {
        setParentForNodes(node.properties, node);
    },
    [SyntaxKinds.ObjectProperty]: function bindObjectProperty(node: ObjectProperty) {
        setParentForNode(node.key, node);
        setParentForNode(node.value, node);
    },
    [SyntaxKinds.ObjectMethodDefintion]: function bindObjectMethodDefintion(node: ObjectMethodDefinition) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
    },
    [SyntaxKinds.ObjectAccessor]: function bindObjectAccessor(node: ObjectAccessor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
    },
    [SyntaxKinds.SpreadElement]: function bindSpreadElement(node: SpreadElement) {
        setParentForNode(node.argument, node);
    },
    [SyntaxKinds.ClassExpression]: function bindClassExpression(node: ClassExpression) {
        setParentForNode(node.superClass, node);
        setParentForNode(node.id, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.ArrayExpression]: function bindArrayExpression(node: ArrayExpression) {
        setParentForNodes(node.elements, node);
    },
    [SyntaxKinds.FunctionExpression]: function bindFunctionExpression(node: FunctionExpression) {
        setParentForNode(node.name, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
    },
    [SyntaxKinds.ArrowFunctionExpression]: function bindArrowFunctionExpression(node: ArrorFunctionExpression) {
        setParentForNode(node.body, node);
        setParentForNodes(node.arguments, node);
    },
    [SyntaxKinds.MetaProperty]: function bindMetaProperty(node: MetaProperty) {
        setParentForNode(node.meta, node);
        setParentForNode(node.property, node);
    },
    [SyntaxKinds.AwaitExpression]: function bindAwaitExpression(node: AwaitExpression) {
        setParentForNode(node.argument, node);
    },
    [SyntaxKinds.NewExpression]: function bindNewExpression(node: NewExpression) {
        setParentForNode(node.callee, node);
        setParentForNodes(node.arguments, node);
    },
    [SyntaxKinds.MemberExpression]: function bindMemberExpression(node: MemberExpression) {
        setParentForNode(node.object, node);
        setParentForNode(node.property, node);
    },
    [SyntaxKinds.CallExpression]: function bindCallExpression(node: CallExpression) {
        setParentForNode(node.callee, node);
        setParentForNodes(node.arguments, node);
    },
    [SyntaxKinds.TaggedTemplateExpression]: function bindTaggTemplateExpression(node: TaggedTemplateExpression) {
        setParentForNode(node.tag, node);
        setParentForNode(node.quasi, node);
    },
    [SyntaxKinds.ChainExpression]: function bindChainExpression(node: ChainExpression) {
        setParentForNode(node.expression, node);
    },
    [SyntaxKinds.UpdateExpression]: function bindUpdateExpression(node: UpdateExpression) {
        setParentForNode(node.argument, node);
    },
    [SyntaxKinds.UnaryExpression]: function bindUnaryExpression(node: UnaryExpression) {
        setParentForNode(node.argument, node);
    },
    [SyntaxKinds.BinaryExpression]: function bindBinaryExpression(node: BinaryExpression) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
    },
    [SyntaxKinds.ConditionalExpression]: function bindConditionalExpression(node: ConditionalExpression) {
        setParentForNode(node.test, node);
        setParentForNode(node.consequnce, node);
        setParentForNode(node.alter, node);
    },
    [SyntaxKinds.YieldExpression]: function bindYieldExpression(node: YieldExpression) {
        setParentForNode(node.argument, node);
    },
    [SyntaxKinds.AssigmentExpression]: function bindAssignmentExpression(node: AssigmentExpression) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
    },
    [SyntaxKinds.SequenceExpression]: function bindSequenceExpression(node: SequenceExpression) {
        setParentForNodes(node.exprs, node);
    },
    [SyntaxKinds.ExpressionStatement]: function bindExpressionStatement(node: ExpressionStatement) {
        setParentForNode(node.expr, node);
    },
    [SyntaxKinds.ObjectPattern]: function bindObjectPattern(node: ObjectPattern) {
        setParentForNodes(node.properties, node);
    },
    [SyntaxKinds.ObjectPatternProperty]: function bindObjectPatternProperty(node: ObjectPatternProperty) {
        setParentForNode(node.key,node);
        setParentForNode(node.value, node);
    },
    [SyntaxKinds.ArrayPattern]: function bindArrayPattern(node: ArrayPattern) {
        setParentForNodes(node.elements, node);
    },
    [SyntaxKinds.AssignmentPattern]: function bindAssigmentPattern(node: AssignmentPattern) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
    },
    [SyntaxKinds.RestElement]: function bindRestElement(node: RestElement) {
        setParentForNode(node.argument, node);
    },
    [SyntaxKinds.IfStatement]: function bindIfStatement(node: IfStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.conseqence, node);
        setParentForNode(node.alternative, node);
    },
    [SyntaxKinds.BlockStatement]: function bindBlockStatement(node: BlockStatement) {
        setParentForNodes(node.body, node);
    },
    [SyntaxKinds.SwitchStatement]: function bindSwitchStatement(node: SwitchStatement) {
        setParentForNode(node.discriminant, node);
        setParentForNodes(node.cases, node);
    },
    [SyntaxKinds.SwitchCase]: function bindSwitchCase(node: SwitchCase) {
        setParentForNode(node.test, node);
        setParentForNodes(node.consequence, node);
    },
    [SyntaxKinds.ContinueStatement]: function bindContinueStatement(node: ContinueStatement) {
        setParentForNode(node.label, node);
    },
    [SyntaxKinds.BreakStatement]: function bindBreakStatement(node: BreakStatement) {
        setParentForNode(node.label, node);
    },
    [SyntaxKinds.ReturnStatement]: function bindReturnStatement(node: ReturnStatement) {
        setParentForNode(node.argu, node);
    },
    [SyntaxKinds.LabeledStatement]: function bindLabeledStatement(node: LabeledStatement) {
        setParentForNode(node.label, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.WhileStatement]: function bindWhileStatement(node: WhileStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.DoWhileStatement]: function bindDoWhileStatement(node: DoWhileStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.TryStatement]: function bindTryStatement(node: TryStatement) {
        setParentForNode(node.block, node);
        setParentForNode(node.handler, node);
        setParentForNode(node.finalizer, node);
    },
    [SyntaxKinds.CatchClause]: function bindCatchClause(node: CatchClause) {
        setParentForNode(node.param, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.ThrowStatement]: function bindThrowStatement(node: ThrowStatement) {
        setParentForNode(node.argu, node);
    },
    [SyntaxKinds.WithStatement]: function bindWithStatement(node: WithStatement) {
        setParentForNode(node.object, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.DebuggerStatement]: function bindDebuggerStatement(node: DebuggerStatement) {
        return;
    },
    [SyntaxKinds.ForStatement]: function bindForStatement(node: ForStatement) {
        setParentForNode(node.test, node);
        setParentForNode(node.init, node);
        setParentForNode(node.update, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.ForInStatement]: function bindForInStatement(node: ForInStatement) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.ForOfStatement]: function bindForOfStatement(node: ForOfStatement) {
        setParentForNode(node.left, node);
        setParentForNode(node.right, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.VariableDeclaration]: function bindVariableDeclaration(node: VariableDeclaration) {
        setParentForNodes(node.declarations, node);
    },
    [SyntaxKinds.VariableDeclarator]: function bindVariableDeclarator(node: VariableDeclarator) {
        setParentForNode(node.id, node);
        setParentForNode(node.init, node);
    },
    [SyntaxKinds.FunctionBody]: function bindFunctionBody(node: FunctionBody) {
        setParentForNodes(node.body, node);
    },
    [SyntaxKinds.FunctionDeclaration]: function bindFunctionDeclaration(node: FunctionDeclaration) {
        setParentForNode(node.name, node);
        setParentForNodes(node.params, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.ClassBody]: function bindClassBody(node: ClassBody) {
        setParentForNodes(node.body, node);
    },
    [SyntaxKinds.ClassProperty]: function bindClassProperty(node: ClassProperty) {
        setParentForNode(node.key, node);
        setParentForNode(node.value, node);
    },
    [SyntaxKinds.ClassMethodDefinition]: function bindClassMethodDefiniton(node: ClassMethodDefinition) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
    },
    [SyntaxKinds.ClassConstructor]: function bindClassConstructor(node: ClassConstructor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
    },
    [SyntaxKinds.ClassAccessor]: function bindClassAccessor(node: ClassAccessor) {
        setParentForNode(node.key, node);
        setParentForNode(node.body, node);
        setParentForNodes(node.params, node);
    },
    [SyntaxKinds.ClassDeclaration]: function bindClassDeclaration(node: ClassDeclaration) {
        setParentForNode(node.id, node);
        setParentForNode(node.superClass, node);
        setParentForNode(node.body, node);
    },
    [SyntaxKinds.ImportDeclaration]: function bindImportDeclaration(node: ImportDeclaration) {
        setParentForNode(node.source, node);
        setParentForNodes(node.specifiers, node);
    },
    [SyntaxKinds.ImportDefaultSpecifier]: function bindImportDefaultSpecifier(node: ImportDefaultSpecifier) {
        setParentForNode(node.imported, node);
    },
    [SyntaxKinds.ImportSpecifier]: function bindImportSpecifier(node: ImportSpecifier) {
        setParentForNode(node.imported, node);
        setParentForNode(node.local, node);
    },
    [SyntaxKinds.ImportNamespaceSpecifier]: function bindImportNamespaceSpecifier(node: ImportNamespaceSpecifier) {
        setParentForNode(node.imported, node);
    },
    [SyntaxKinds.ExportNamedDeclaration]: function bindExportNameDeclaration(node: ExportNamedDeclarations) {
        setParentForNode(node.declaration, node);
        setParentForNodes(node.specifiers, node);
    },
    [SyntaxKinds.ExportSpecifier]: function bindExportSpecifier(node: ExportSpecifier) {
        setParentForNode(node.exported, node);
        setParentForNode(node.local, node);
    },
    [SyntaxKinds.ExportDefaultDeclaration]: function bindExportDefaultDeclaration(node: ExportDefaultDeclaration) {
        setParentForNode(node.declaration, node);
    },
    [SyntaxKinds.ExportAllDeclaration]: function bindExportAllDeclaration(node: ExportAllDeclaration) {
        setParentForNode(node.exported, node);
        setParentForNode(node.source, node);
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