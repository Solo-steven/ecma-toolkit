/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-nocheck 
import { 
    BinaryExpression,
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
    SyntaxKinds,
    Visitor, 
    SytaxKindsMapLexicalLiteral,
    traversal,
    ExpressionStatement
} from "js-types";

const VisitorTable: Visitor = {
    [SyntaxKinds.Program]: function Program(node: Program) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.Program];
    },
    [SyntaxKinds.NumberLiteral]: function NumberString(node: NumberLiteral) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.NumberLiteral]
    },
    [SyntaxKinds.StringLiteral]: function StringLiteral(node: StringLiteral) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.StringLiteral];
    },
    [SyntaxKinds.Identifier]: function Identifier(node: Identifier) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.Identifier];
    },
    [SyntaxKinds.Super]: function Super(node: Super) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.Super];
    },
    [SyntaxKinds.ThisExpression]: function ThisExpression(node: ThisExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ThisExpression];
    },
    [SyntaxKinds.PrivateName]: function PrivateName(node: PrivateName) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.PrivateName];
    },
    [SyntaxKinds.TemplateLiteral]: function TemplateLiteral(node: TemplateLiteral) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.TemplateLiteral];
    },
    [SyntaxKinds.TemplateElement]: function TemplateElement(node: TemplateElement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.TemplateElement];
    },
    [SyntaxKinds.ObjectExpression]: function ObjectExpression(node: ObjectExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ObjectExpression];
    },
    [SyntaxKinds.ObjectProperty]: function ObjectProperty(node: ObjectProperty) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ObjectProperty];
    },
    [SyntaxKinds.ObjectMethodDefintion]: function ObjectMethodDefintion(node: ObjectMethodDefinition) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ObjectMethodDefintion];
    },
    [SyntaxKinds.ObjectAccessor]: function ObjectAccessor(node: ObjectAccessor) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ObjectAccessor];
    },
    [SyntaxKinds.SpreadElement]: function SpreadElement(node: SpreadElement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.SpreadElement];
    },
    [SyntaxKinds.ClassExpression]: function ClassExpression(node: ClassExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ClassExpression];
    },
    [SyntaxKinds.ArrayExpression]: function ArrayExpression(node: ArrayExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ArrayExpression];
    },
    [SyntaxKinds.FunctionExpression]: function FunctionExpression(node: FunctionExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.FunctionExpression];
    },
    [SyntaxKinds.ArrowFunctionExpression]: function ArrowFunctionExpression(node: ArrorFunctionExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ArrowFunctionExpression];
    },
    [SyntaxKinds.MetaProperty]: function MetaProperty(node: MetaProperty) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.MetaProperty];
    },
    [SyntaxKinds.AwaitExpression]: function AwaitExpression(node: AwaitExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.AwaitExpression];
    },
    [SyntaxKinds.NewExpression]: function NewExpression(node: NewExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.NewExpression];
    },
    [SyntaxKinds.MemberExpression]: function MemberExpression(node: MemberExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.MemberExpression];
    },
    [SyntaxKinds.CallExpression]: function CallExpression(node: CallExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.CallExpression];
    },
    [SyntaxKinds.TaggedTemplateExpression]: function TaggTemplateExpression(node: TaggedTemplateExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.TaggedTemplateExpression]
    },
    [SyntaxKinds.ChainExpression]: function ChainExpression(node: ChainExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ChainExpression];
    },
    [SyntaxKinds.UpdateExpression]: function UpdateExpression(node: UpdateExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.UpdateExpression];
        node.operator = SytaxKindsMapLexicalLiteral[node.operator];
    },
    [SyntaxKinds.UnaryExpression]: function UnaryExpression(node: UnaryExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.UnaryExpression];
        node.operator = SytaxKindsMapLexicalLiteral[node.operator];
    },
    [SyntaxKinds.BinaryExpression]: function BinaryExpression(node: BinaryExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.BinaryExpression];
        node.operator = SytaxKindsMapLexicalLiteral[node.operator];
    },
    [SyntaxKinds.ConditionalExpression]: function ConditionalExpression(node: ConditionalExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ConditionalExpression];
    },
    [SyntaxKinds.YieldExpression]: function YieldExpression(node: YieldExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.YieldExpression];
    },
    [SyntaxKinds.AssigmentExpression]: function AssignmentExpression(node: AssigmentExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.AssigmentExpression];
        node.operator = SytaxKindsMapLexicalLiteral[node.operator];
    },
    [SyntaxKinds.SequenceExpression]: function SequenceExpression(node: SequenceExpression) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.SequenceExpression];
    },
    [SyntaxKinds.ExpressionStatement]: function ExpressionStatement(node: ExpressionStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ExpressionStatement];
    },
    [SyntaxKinds.ObjectPattern]: function ObjectPattern(node: ObjectPattern) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ObjectPattern];
    },
    [SyntaxKinds.ObjectPatternProperty]: function ObjectPatternProperty(node: ObjectPatternProperty) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ObjectPatternProperty];
    },
    [SyntaxKinds.ArrayPattern]: function ArrayPattern(node: ArrayPattern) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ArrayExpression];
    },
    [SyntaxKinds.AssignmentPattern]: function AssigmentPattern(node: AssignmentPattern) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.AssignmentPattern];
    },
    [SyntaxKinds.RestElement]: function RestElement(node: RestElement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.RestElement];
    },
    [SyntaxKinds.IfStatement]: function IfStatement(node: IfStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.IfStatement];
    },
    [SyntaxKinds.BlockStatement]: function BlockStatement(node: BlockStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.BlockStatement];
    },
    [SyntaxKinds.SwitchStatement]: function SwitchStatement(node: SwitchStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.SwitchStatement]
    },
    [SyntaxKinds.SwitchCase]: function SwitchCase(node: SwitchCase) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.SwitchCase];
    },
    [SyntaxKinds.ContinueStatement]: function ContinueStatement(node: ContinueStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ContinueStatement];
    },
    [SyntaxKinds.BreakStatement]: function BreakStatement(node: BreakStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.BreakStatement];
    },
    [SyntaxKinds.ReturnStatement]: function ReturnStatement(node: ReturnStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ReturnStatement];
    },
    [SyntaxKinds.LabeledStatement]: function LabeledStatement(node: LabeledStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.LabeledStatement];
    },
    [SyntaxKinds.WhileStatement]: function WhileStatement(node: WhileStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.WhileStatement];
    },
    [SyntaxKinds.DoWhileStatement]: function DoWhileStatement(node: DoWhileStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.DoWhileStatement];
    },
    [SyntaxKinds.TryStatement]: function TryStatement(node: TryStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.TryStatement];
    },
    [SyntaxKinds.CatchClause]: function CatchClause(node: CatchClause) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.CatchClause];
    },
    [SyntaxKinds.ThrowStatement]: function ThrowStatement(node: ThrowStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ThrowStatement];
    },
    [SyntaxKinds.WithStatement]: function WithStatement(node: WithStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.WithStatement];
    },
    [SyntaxKinds.DebuggerStatement]: function DebuggerStatement(node: DebuggerStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.DebuggerStatement];
    },
    [SyntaxKinds.ForStatement]: function ForStatement(node: ForStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ForStatement];
    },
    [SyntaxKinds.ForInStatement]: function ForInStatement(node: ForInStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ForInStatement];
    },
    [SyntaxKinds.ForOfStatement]: function ForOfStatement(node: ForOfStatement) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ForOfStatement];
    },
    [SyntaxKinds.VariableDeclaration]: function VariableDeclaration(node: VariableDeclaration) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.VariableDeclaration];
    },
    [SyntaxKinds.VariableDeclarator]: function VariableDeclarator(node: VariableDeclarator) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.VariableDeclarator];
    },
    [SyntaxKinds.FunctionBody]: function FunctionBody(node: FunctionBody) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.FunctionBody];
    },
    [SyntaxKinds.FunctionDeclaration]: function FunctionDeclaration(node: FunctionDeclaration) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.FunctionDeclaration];
    },
    [SyntaxKinds.ClassBody]: function ClassBody(node: ClassBody) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ClassBody];
    },
    [SyntaxKinds.ClassProperty]: function ClassProperty(node: ClassProperty) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ClassProperty];
    },
    [SyntaxKinds.ClassMethodDefinition]: function ClassMethodDefiniton(node: ClassMethodDefinition) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ClassMethodDefinition];
    },
    [SyntaxKinds.ClassConstructor]: function ClassConstructor(node: ClassConstructor) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ClassConstructor];
    },
    [SyntaxKinds.ClassAccessor]: function ClassAccessor(node: ClassAccessor) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ClassAccessor];
    },
    [SyntaxKinds.ClassDeclaration]: function ClassDeclaration(node: ClassDeclaration) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ClassDeclaration];
    },
    [SyntaxKinds.ImportDeclaration]: function ImportDeclaration(node: ImportDeclaration) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ImportDeclaration];
    },
    [SyntaxKinds.ImportDefaultSpecifier]: function ImportDefaultSpecifier(node: ImportDefaultSpecifier) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ImportDefaultSpecifier];
    },
    [SyntaxKinds.ImportSpecifier]: function ImportSpecifier(node: ImportSpecifier) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ImportSpecifier];
    },
    [SyntaxKinds.ImportNamespaceSpecifier]: function ImportNamespaceSpecifier(node: ImportNamespaceSpecifier) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ImportNamespaceSpecifier];
    },
    [SyntaxKinds.ExportNamedDeclaration]: function ExportNameDeclaration(node: ExportNamedDeclarations) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ExportNamedDeclaration];
    },
    [SyntaxKinds.ExportSpecifier]: function ExportSpecifier(node: ExportSpecifier) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ExportSpecifier];
    },
    [SyntaxKinds.ExportDefaultDeclaration]: function ExportDefaultDeclaration(node: ExportDefaultDeclaration) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ExportDefaultDeclaration];
    },
    [SyntaxKinds.ExportAllDeclaration]: function ExportAllDeclaration(node: ExportAllDeclaration) {
        node.kind = SytaxKindsMapLexicalLiteral[SyntaxKinds.ExportAllDeclaration];
    }
};

export function transformSyntaxKindToLiteral(program: Program): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    traversal(program, VisitorTable);
}