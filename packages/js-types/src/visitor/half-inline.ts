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
    ClassConstructor,
    ExpressionStatement,
    Identifier,
    NumberLiteral,
    StringLiteral,
    BoolLiteral,
    EmptyStatement,
    NullLiteral,
    UndefinbedLiteral,
} from "@/src/ast";
import { SyntaxKinds } from "@/src/kind";
import type { Visitor } from "./type";

/** */
const VisitorTable: { [key: number ]: (node: ModuleItem, visior: Visitor) => void } = {
    [SyntaxKinds.Program]: function visitProgram(node: Program, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.body, visitor);
    },
    [SyntaxKinds.NullLiteral]: function visitNullLiteral(node: NullLiteral, visitor: Visitor) {
        if(!node) return;
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.UndefinedLiteral]: function visitUndefinedLiteral(node: UndefinbedLiteral, visitor: Visitor) {
        if(!node) return;
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.BooleanLiteral]: function visitBoolLiteral(node: BoolLiteral, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.NumberLiteral]: function visitNumberString(node: NumberLiteral, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.StringLiteral]: function visitStringLiteral(node: StringLiteral, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.Identifier]: function bindIdentifier(node: Identifier, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.Super]: function bindSuper(node: Super, visitor: Visitor ) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.ThisExpression]: function bindThisExpression(node: ThisExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.PrivateName]: function bindPrivateName(node: PrivateName, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.TemplateLiteral]: function bindTemplateLiteral(node: TemplateLiteral, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.expressions, visitor);
        visitNodes(node.quasis, visitor);
    },
    [SyntaxKinds.TemplateElement]: function bindTemplateElement(node: TemplateElement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
    },
    [SyntaxKinds.ObjectExpression]: function bindObjectExpression(node: ObjectExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.properties, visitor);
    },
    [SyntaxKinds.ObjectProperty]: function bindObjectProperty(node: ObjectProperty, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNode(node.value, visitor);
    },
    [SyntaxKinds.ObjectMethodDefintion]: function bindObjectMethodDefintion(node: ObjectMethodDefinition, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNodes(node.params, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ObjectAccessor]: function bindObjectAccessor(node: ObjectAccessor, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNodes(node.params, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.SpreadElement]: function bindSpreadElement(node: SpreadElement, visitor: Visitor) {
       if(!node) return 
       if(visitor[node.kind]) {
        visitor[node.kind](node);
       }
       visitNode(node.argument, visitor)
    },
    [SyntaxKinds.ClassExpression]: function bindClassExpression(node: ClassExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.id, visitor);
        visitNode(node.superClass, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ArrayExpression]: function bindArrayExpression(node: ArrayExpression,visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.elements, visitor);
    },
    [SyntaxKinds.FunctionExpression]: function bindFunctionExpression(node: FunctionExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.name, visitor);
        visitNodes(node.params, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ArrowFunctionExpression]: function bindArrowFunctionExpression(node: ArrorFunctionExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.body, visitor);
        visitNodes(node.arguments, visitor);
    },
    [SyntaxKinds.MetaProperty]: function bindMetaProperty(node: MetaProperty, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.meta, visitor);
        visitNode(node.property, visitor);
    },
    [SyntaxKinds.AwaitExpression]: function bindAwaitExpression(node: AwaitExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.argument, visitor);
    },
    [SyntaxKinds.NewExpression]: function bindNewExpression(node: NewExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.callee, visitor);
        visitNodes(node.arguments, visitor);
    },
    [SyntaxKinds.MemberExpression]: function bindMemberExpression(node: MemberExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.object, visitor);
        visitNode(node.property, visitor);
    },
    [SyntaxKinds.CallExpression]: function bindCallExpression(node: CallExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.callee, visitor);
        visitNodes(node.arguments, visitor);
    },
    [SyntaxKinds.TaggedTemplateExpression]: function bindTaggTemplateExpression(node: TaggedTemplateExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.tag, visitor);
        visitNode(node.quasi, visitor);
    },
    [SyntaxKinds.ChainExpression]: function bindChainExpression(node: ChainExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.expression, visitor);
    },
    [SyntaxKinds.UpdateExpression]: function bindUpdateExpression(node: UpdateExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.argument, visitor);
    },
    [SyntaxKinds.UnaryExpression]: function bindUnaryExpression(node: UnaryExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.argument, visitor);
    },
    [SyntaxKinds.BinaryExpression]: function bindBinaryExpression(node: BinaryExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.left, visitor);
        visitNode(node.right, visitor);
    },
    [SyntaxKinds.ConditionalExpression]: function bindConditionalExpression(node: ConditionalExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.test, visitor);
        visitNode(node.consequnce, visitor);
        visitNode(node.alter, visitor);
    },
    [SyntaxKinds.YieldExpression]: function bindYieldExpression(node: YieldExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.argument, visitor);
    },
    [SyntaxKinds.AssigmentExpression]: function bindAssignmentExpression(node: AssigmentExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.left, visitor);
        visitNode(node.right, visitor);
    },
    [SyntaxKinds.SequenceExpression]: function bindSequenceExpression(node: SequenceExpression, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.exprs, visitor);
    },
    [SyntaxKinds.ExpressionStatement]: function bindExpressionStatement(node: ExpressionStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.expr, visitor);
    },
    [SyntaxKinds.ObjectPattern]: function bindObjectPattern(node: ObjectPattern, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.properties, visitor);
    },
    [SyntaxKinds.ObjectPatternProperty]: function bindObjectPatternProperty(node: ObjectPatternProperty, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNode(node.value, visitor);
    },
    [SyntaxKinds.ArrayPattern]: function bindArrayPattern(node: ArrayPattern, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.elements, visitor);
    },
    [SyntaxKinds.AssignmentPattern]: function bindAssigmentPattern(node: AssignmentPattern, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.left, visitor);
        visitNode(node.right, visitor);
    },
    [SyntaxKinds.RestElement]: function bindRestElement(node: RestElement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.argument, visitor);
    },
    [SyntaxKinds.IfStatement]: function bindIfStatement(node: IfStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.test, visitor);
        visitNode(node.conseqence, visitor);
        visitNode(node.alternative, visitor);
    },
    [SyntaxKinds.BlockStatement]: function bindBlockStatement(node: BlockStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.body, visitor);
    },
    [SyntaxKinds.SwitchStatement]: function bindSwitchStatement(node: SwitchStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.discriminant, visitor);
        visitNodes(node.cases, visitor);
    },
    [SyntaxKinds.SwitchCase]: function bindSwitchCase(node: SwitchCase, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.test, visitor);
        visitNodes(node.consequence, visitor);
    },
    [SyntaxKinds.ContinueStatement]: function bindContinueStatement(node: ContinueStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.label, visitor);
    },
    [SyntaxKinds.BreakStatement]: function bindBreakStatement(node: BreakStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.label, visitor);
    },
    [SyntaxKinds.ReturnStatement]: function bindReturnStatement(node: ReturnStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.argu, visitor);
    },
    [SyntaxKinds.LabeledStatement]: function bindLabeledStatement(node: LabeledStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.label, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.WhileStatement]: function bindWhileStatement(node: WhileStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.test, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.DoWhileStatement]: function bindDoWhileStatement(node: DoWhileStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.test, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.TryStatement]: function bindTryStatement(node: TryStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.block, visitor);
        visitNode(node.handler, visitor);
        visitNode(node.finalizer, visitor);
    },
    [SyntaxKinds.CatchClause]: function bindCatchClause(node: CatchClause, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.param, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ThrowStatement]: function bindThrowStatement(node: ThrowStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.argu, visitor);
    },
    [SyntaxKinds.WithStatement]: function bindWithStatement(node: WithStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.object, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.DebuggerStatement]: function bindDebuggerStatement(node: DebuggerStatement, visitor: Visitor) {
        return;
    },
    [SyntaxKinds.EmptyStatement]: function visitEmptyStatement(node: EmptyStatement, visior: Visitor) {
        return;
    },
    [SyntaxKinds.ForStatement]: function bindForStatement(node: ForStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.test, visitor);
        visitNode(node.init, visitor);
        visitNode(node.update, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ForInStatement]: function bindForInStatement(node: ForInStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.left, visitor);
        visitNode(node.right, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ForOfStatement]: function bindForOfStatement(node: ForOfStatement, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.left, visitor);
        visitNode(node.right, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.VariableDeclaration]: function bindVariableDeclaration(node: VariableDeclaration, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.declarations, visitor);
    },
    [SyntaxKinds.VariableDeclarator]: function bindVariableDeclarator(node: VariableDeclarator, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.id, visitor);
        visitNode(node.init, visitor);
    },
    [SyntaxKinds.FunctionBody]: function bindFunctionBody(node: FunctionBody, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.body, visitor);
    },
    [SyntaxKinds.FunctionDeclaration]: function bindFunctionDeclaration(node: FunctionDeclaration, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.name, visitor);
        visitNodes(node.params, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ClassBody]: function bindClassBody(node: ClassBody, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.body, visitor);
    },
    [SyntaxKinds.ClassProperty]: function bindClassProperty(node: ClassProperty, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNode(node.value, visitor);
    },
    [SyntaxKinds.ClassMethodDefinition]: function bindClassMethodDefiniton(node: ClassMethodDefinition, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNodes(node.params, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ClassConstructor]: function bindClassConstructor(node: ClassConstructor, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNodes(node.params, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ClassAccessor]: function bindClassAccessor(node: ClassAccessor, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.key, visitor);
        visitNodes(node.params, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ClassDeclaration]: function bindClassDeclaration(node: ClassDeclaration, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.id, visitor);
        visitNode(node.superClass, visitor);
        visitNode(node.body, visitor);
    },
    [SyntaxKinds.ImportDeclaration]: function bindImportDeclaration(node: ImportDeclaration, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNodes(node.specifiers, visitor);
        visitNode(node.source, visitor);
    },
    [SyntaxKinds.ImportDefaultSpecifier]: function bindImportDefaultSpecifier(node: ImportDefaultSpecifier, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.imported, visitor);
    },
    [SyntaxKinds.ImportSpecifier]: function bindImportSpecifier(node: ImportSpecifier, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.imported, visitor);
        visitNode(node.local, visitor);
    },
    [SyntaxKinds.ImportNamespaceSpecifier]: function bindImportNamespaceSpecifier(node: ImportNamespaceSpecifier, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.imported, visitor);
    },
    [SyntaxKinds.ExportNamedDeclaration]: function bindExportNameDeclaration(node: ExportNamedDeclarations, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.declaration, visitor);
        visitNodes(node.specifiers, visitor);
    },
    [SyntaxKinds.ExportSpecifier]: function bindExportSpecifier(node: ExportSpecifier, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.exported, visitor);
        visitNode(node.local, visitor);
    },
    [SyntaxKinds.ExportDefaultDeclaration]: function bindExportDefaultDeclaration(node: ExportDefaultDeclaration, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.declaration, visitor);
    },
    [SyntaxKinds.ExportAllDeclaration]: function bindExportAllDeclaration(node: ExportAllDeclaration, visitor: Visitor) {
        if(!node) return 
        if(visitor[node.kind]) {
            visitor[node.kind](node);
        }
        visitNode(node.exported, visitor);
        visitNode(node.source, visitor);
    }
};

export function traversal(program: Program, visior: Visitor) {
    visitNode(program, visior);
}
function visitNode(node: ModuleItem | null, visior: Visitor) {
    if(!node) return; 
    const handler = VisitorTable[node.kind];
    if(handler) {
        handler(node, visior);
    }else {
        throw new Error(`AST Not Existed, ${node.kind}`)
    }
}
function visitNodes(nodes: Array<ModuleItem>, visior: Visitor) {
    nodes.forEach(node => visitNode(node, visior));
}
