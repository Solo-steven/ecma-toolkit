import { SourcePosition } from "../utils/position";
import { 
    SyntaxKinds,
    UpdateOperatorKinds, 
    UnaryOperatorKinds, 
    BinaryOperatorKinds, 
    AssigmentOperatorKinds
} from "./kinds";
/** ======================================
 *    Shared, Basic, Top Level AST Node
 * ======================================
 */
export interface ModuleItem {
    start: SourcePosition,
    end: SourcePosition,
}
export type StatementListItem = Statement | Declaration;
export interface Program {
    kind: SyntaxKinds.Program;
    body: Array<ModuleItem>; //TODO: using StatementListItem
}
export type PropertyName = Identifier | StringLiteral | NumberLiteral | Expression;
export interface Property extends ModuleItem {
    kind: SyntaxKinds;
    key: PropertyName | PrivateName;
    value: Expression | undefined; // actually is assignment expression,
    computed: boolean;
    shorted: boolean;
    static: boolean;
}
export interface MethodDefinition extends ModuleItem {
    kind: SyntaxKinds;
    key: PropertyName | PrivateName;
    body: FunctionBody;
    params: Array<Pattern>
    type: "constructor" | "method" | "get" | "set";
    computed: boolean;
    generator: boolean;
    async: boolean;
    static: boolean;
}

/** =====================================
 *      Expression
 * ======================================
 */
export interface Super extends ModuleItem {
    kind: SyntaxKinds.Super;
    name: "super"
}
export interface ThisExpression extends ModuleItem {
    kind: SyntaxKinds.ThisExpression;
    name: "this",
}
export interface Identifier extends ModuleItem  {
    kind: SyntaxKinds.Identifier;
    name: string;
}
export interface PrivateName extends ModuleItem {
    kind: SyntaxKinds.PrivateName;
    name: string;
}
export interface NumberLiteral extends ModuleItem {
    kind: SyntaxKinds.NumberLiteral;
    value: string | number;
}
export interface StringLiteral extends ModuleItem {
    kind: SyntaxKinds.StringLiteral;
    value: string;
}
export interface TemplateLiteral extends ModuleItem {
    kind: SyntaxKinds.TemplateLiteral,
    quasis: Array<TemplateElement>;
    expressions: Array<Expression>;
}
export interface TemplateElement extends ModuleItem {
    kind: SyntaxKinds.TemplateElement;
    value: string;
    tail: boolean;
}
export interface ObjectExpression extends ModuleItem {
    kind: SyntaxKinds.ObjectExpression;
    properties: Array<PropertyDefinition>;
}
export type PropertyDefinition = ObjectProperty |  ObjectMethodDefinition | SpreadElement | ObjectAccessor;
export interface ObjectProperty extends Omit<Property, "static"> {
    kind: SyntaxKinds.ObjectProperty;
    key: PropertyName;
}
export interface ObjectMethodDefinition extends Omit<MethodDefinition, "static" | "type"> {
    kind: SyntaxKinds.ObjectMethodDefintion;
    key: PropertyName;
}
export interface ObjectAccessor extends Omit<MethodDefinition, "static" | "generator" | "async"> {
    kind: SyntaxKinds.ObjectAccessor;
    type: "get" | "set"
}
export interface SpreadElement extends ModuleItem {
    kind: SyntaxKinds.SpreadElement,
    argument: Expression,
}
export interface ClassExpression extends Class {
    kind: SyntaxKinds.ClassExpression
}
export interface ArrayExpression extends ModuleItem {
    kind: SyntaxKinds.ArrayExpression;
    elements: Array<Expression | null>; // actually need to be assigment expression;
}
export interface FunctionExpression extends ModuleItem, Function {
    kind: SyntaxKinds.FunctionExpression
}
// TODO: make arrowfunctionExpression extends form function
export interface ArrorFunctionExpression extends ModuleItem {
    kind: SyntaxKinds.ArrowFunctionExpression;
    expressionBody: boolean;
    async: boolean;
    arguments: Array<Expression>;
    body: Expression | FunctionBody;
}
export interface MetaProperty extends ModuleItem {
    kind: SyntaxKinds.MetaProperty;
    meta: Identifier;
    property: Identifier;
}
export interface AwaitExpression extends ModuleItem {
    kind: SyntaxKinds.AwaitExpression;
    argument: Expression; // actually is unary expression
}
export interface NewExpression extends ModuleItem {
    kind: SyntaxKinds.NewExpression,
    callee: Expression;
    arguments:Array<Expression>;
}
export interface MemberExpression extends ModuleItem {
    kind: SyntaxKinds.MemberExpression;
    object: Expression;
    property: Expression;
    computed: boolean;
    optional: boolean;
}
export interface CallExpression extends ModuleItem {
    kind: SyntaxKinds.CallExpression;
    callee: Expression;
    arguments: Array<Expression>;
    optional: boolean;
}
export interface TaggedTemplateExpression extends ModuleItem {
    kind: SyntaxKinds.TaggedTemplateExpression;
    quasi: TemplateLiteral;
    tag: Expression;
}
export interface ChainExpression extends ModuleItem {
    kind: SyntaxKinds.ChainExpression;
    expression: Expression;
  }
export interface UpdateExpression extends ModuleItem {
    kind: SyntaxKinds.UpdateExpression;
    argument: Expression;
    prefix: boolean;
    operator: UpdateOperatorKinds;
}
export interface UnaryExpression extends ModuleItem  {
    kind: SyntaxKinds.UnaryExpression;
    argument: Expression;
    operator: UnaryOperatorKinds;
}
export interface BinaryExpression extends ModuleItem {
    kind: SyntaxKinds.BinaryExpression;
    left: Expression;
    right: Expression;
    operator: BinaryOperatorKinds;
}
export interface ConditionalExpression extends ModuleItem {
    kind: SyntaxKinds.ConditionalExpression;
    test: Expression;
    consequnce: Expression;
    alter: Expression;
}
export interface AssigmentExpression extends ModuleItem {
    kind: SyntaxKinds.AssigmentExpression;
    left: Expression;
    right: Expression;
    operator: AssigmentOperatorKinds;
}
export interface SequenceExpression extends ModuleItem {
    kind: SyntaxKinds.SequenceExpression;
    exprs: Array<Expression>
}

export type Expression =
    // identifer and super and ThisExpression
    Identifier  | PrivateName | Super | ThisExpression |
    // literals 
    NumberLiteral | StringLiteral | TemplateLiteral |
    // structal literal
    ObjectExpression | ArrayExpression | ArrorFunctionExpression | FunctionExpression | ClassExpression |
    // meta property and spread element
    SpreadElement | MetaProperty |
    // other expression
    CallExpression | MemberExpression | TaggedTemplateExpression |  NewExpression | ChainExpression |
    UpdateExpression | UnaryExpression | AwaitExpression | BinaryExpression |
    ConditionalExpression | AssigmentExpression | SequenceExpression
;
export interface ExpressionStatement extends ModuleItem {
    kind: SyntaxKinds.ExpressionStatement;
    expr: Expression;
}

/** =================================
 *   Pattern
 * ==================================
 */
export interface ObjectPattern extends ModuleItem {
    kind: SyntaxKinds.ObjectPattern;
    properties: Array<ObjectPatternProperty | RestElement>;
}
export interface ObjectPatternProperty extends ModuleItem {
    kind: SyntaxKinds.ObjectPatternProperty;
    key: PropertyName;
    value: Pattern | Expression | undefined;
    computed: boolean;
    shorted: boolean;
}
export interface ArrayPattern extends ModuleItem {
    kind: SyntaxKinds.ArrayPattern;
    elements: Array<Pattern | null>;
}
export interface AssignmentPattern extends ModuleItem {
    kind: SyntaxKinds.AssignmentPattern;
    left: Pattern;
    right: Expression | undefined;
}
export interface RestElement extends ModuleItem {
    kind: SyntaxKinds.RestElement;
    argument: Expression | Pattern;
}

export type Pattern = RestElement | AssignmentPattern | ObjectPattern | ArrayPattern | Identifier;

/** ==========================
 * Statement
 * ===========================
 */
export interface IfStatement extends ModuleItem {
    kind: SyntaxKinds.IfStatement;
    test: Expression;
    conseqence: Statement;
    alternative: Statement;

}
export interface BlockStatement extends ModuleItem  {
    kind: SyntaxKinds.BlockStatement;
    body: Array<StatementListItem>;
}
export interface SwitchStatement extends ModuleItem {
    kind: SyntaxKinds.SwitchStatement;
    discriminant: Expression;
    cases: Array<SwitchCase>;
}
export interface SwitchCase extends ModuleItem {
    kind: SyntaxKinds.SwitchCase;
    test: Expression | null;
    consequence: Array<StatementListItem>;
}
export interface ContinueStatement extends ModuleItem {
    kind: SyntaxKinds.ContinueStatement;
    label?: Identifier;
}
export interface BreakStatement extends ModuleItem {
    kind: SyntaxKinds.BreakStatement;
    label?: Identifier;
}
export interface ReturnStatement extends ModuleItem {
    kind: SyntaxKinds.ReturnStatement;
    argu: Expression | null;
}
export interface LabeledStatement extends ModuleItem {
    kind: SyntaxKinds.LabeledStatement;
    label: Identifier;
    body: Statement | FunctionDeclaration;
}
export interface WhileStatement extends ModuleItem {
    kind: SyntaxKinds.WhileStatement;
    test: Expression;
    body: Statement;
}
export interface DoWhileStatement extends ModuleItem {
    kind: SyntaxKinds.DoWhileStatement;
    test: Expression;
    body: Statement;
}
export interface TryStatement extends ModuleItem {
    kind: SyntaxKinds.TryStatement;
    block: BlockStatement;
    handler: CatchClause | null,
    finalizer: BlockStatement | null;
}
export interface CatchClause extends ModuleItem {
    kind: SyntaxKinds.CatchClause;
    param: Pattern | null;
    body: BlockStatement;
}
export interface ThrowStatement extends ModuleItem {
    kind: SyntaxKinds.ThrowKeyword;
    argu: Expression;
}
export interface WithStatement extends ModuleItem {
    kind: SyntaxKinds.WithStatement;
    object: Expression;
    body: Statement;
}
export interface DebuggerStatement extends ModuleItem {
    kind: SyntaxKinds.DebuggerStatement;
}
export interface ForStatement extends ModuleItem {
    kind: SyntaxKinds.ForStatement;
    init: Expression | VariableDeclaration | null;
    test: Expression | null;
    update: Expression | null;
    body: Statement;
}
export interface ForOfStatement extends ModuleItem {
    kind: SyntaxKinds.ForOfStatement;
    left: Expression | VariableDeclaration;
    right: Expression;
    await: boolean;
    body: Statement;
}
export interface ForInStatement extends ModuleItem {
    kind: SyntaxKinds.ForInStatement;
    left: Expression | VariableDeclaration;
    right: Expression;
    body: Statement;
}
export type Statement = 
    IfStatement | BlockStatement | SwitchStatement |
    ForInStatement | ForOfStatement | ForStatement |
    BreakStatement | ContinueStatement | ReturnStatement | LabeledStatement |
    WhileStatement | DoWhileStatement |
    TryStatement | ThrowStatement |
    WithStatement | DebuggerStatement |
    ExpressionStatement | VariableDeclaration /** when is `var` */;

/** ================================
 *  Declaration
 * =================================
 */
export interface VariableDeclaration extends ModuleItem {
    kind: SyntaxKinds.VariableDeclaration;
    declarations: Array<VariableDeclarator>;
    variant: "let" | "const" | "var";
}
export interface VariableDeclarator extends ModuleItem {
    kind: SyntaxKinds.VariableDeclarator;
    id: Pattern;
    init: Expression | null;
}
export interface Function extends ModuleItem {
    name: Identifier | null;
    params: Array<Pattern>;
    body: FunctionBody;
    generator: boolean;
    async: boolean;
}
export interface FunctionBody extends ModuleItem {
    kind: SyntaxKinds.FunctionBody;
    body: Array<StatementListItem> //TODO: using StatementListItem
}
export interface FunctionDeclaration extends ModuleItem, Function {
    kind: SyntaxKinds.FunctionDeclaration;
    name: Identifier
}
export interface Class extends ModuleItem {
    id: Identifier | null;
    superClass: Expression | null;
    body: ClassBody;
}
export interface ClassBody extends ModuleItem {
    kind: SyntaxKinds.ClassBody;
    body: Array<ClassElement>;
}
export interface ClassProperty extends Property {
    kind: SyntaxKinds.ClassProperty;
}
export interface ClassMethodDefinition extends Omit<MethodDefinition, "type"> {
    kind: SyntaxKinds.ClassMethodDefinition;
}
export interface ClassConstructor extends Omit<MethodDefinition, "generator" | "async" | "static" | "computed" | "type"> {
    kind: SyntaxKinds.ClassConstructor;
    key: Identifier;
}
export interface ClassAccessor extends Omit<MethodDefinition, "generator" | "async" | "static"> {
    kind: SyntaxKinds.ClassAccessor;
    type: "get" | "set";
}
export type ClassElement = ClassProperty | ClassMethodDefinition | ClassAccessor | ClassConstructor;
export interface ClassDeclaration extends Class {
    kind: SyntaxKinds.ClassDeclaration;
}
export type Declaration = FunctionDeclaration | VariableDeclaration | ClassDeclaration ;

/** ==========================================
 * Import Declaration
 * ===========================================
 */
export interface ImportDeclaration extends ModuleItem  {
    kind: SyntaxKinds.ImportDeclaration;
    specifiers: Array<ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier>;
    source: StringLiteral;
}
export interface ImportDefaultSpecifier extends ModuleItem {
    kind: SyntaxKinds.ImportDefaultSpecifier;
    imported: Identifier;
}
export interface ImportSpecifier extends ModuleItem {
    kind: SyntaxKinds.ImportSpecifier;
    imported: Identifier | StringLiteral;
    local: Identifier | null;
}
export interface ImportNamespaceSpecifier extends ModuleItem {
    kind: SyntaxKinds.ImportNamespaceSpecifier;
    imported: Identifier;
}
/** ==========================================
 * export Declaration
 * ===========================================
 */

export interface ExportNamedDeclarations extends ModuleItem {
    kind: SyntaxKinds.ExportNamedDeclaration;
    specifiers: Array<ExportSpecifier>;
    declaration: Declaration | null;
    source: StringLiteral | null;
}
export interface ExportSpecifier extends ModuleItem {
    kind: SyntaxKinds.ExportSpecifier;
    exported: Identifier | StringLiteral;
    local: Identifier | StringLiteral | null;
}
export interface ExportDefaultDeclaration extends ModuleItem {
    kind: SyntaxKinds.ExportDefaultDeclaration;
    declaration: FunctionDeclaration | FunctionExpression | ClassDeclaration | ClassExpression | Expression;
}
export interface ExportAllDeclaration extends ModuleItem {
    kind: SyntaxKinds.ExportAllDeclaration;
    exported: Identifier | null;
    source: StringLiteral;
}
export type ExportDeclaration = ExportNamedDeclarations | ExportDefaultDeclaration | ExportAllDeclaration;