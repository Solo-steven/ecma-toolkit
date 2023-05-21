import { SyntaxKinds } from "./kinds";
import { 
    UpdateOperatorKinds, 
    UnaryOperatorKinds, 
    BinaryOperatorKinds, 
    AssigmentOperatorKinds
} from "./operator";
/** ======================================
 *    Shared, Basic, Top Level AST Node
 * ======================================
 */
export interface NodeBase {}

export interface Function extends NodeBase {
    name: Identifier | null;
    params: Array<Pattern>;
    body: FunctionBody;
    generator: boolean;
    async: boolean;
}
export interface Class extends NodeBase {
    id: Identifier | null;
    superClass: Expression | null;
    body: ClassBody;
}
export interface Program {
    kind: SyntaxKinds.Program;
    body: Array<NodeBase>; //TODO: using StatementListItem
}

/** =====================================
 *      Expression
 * ======================================
 */

export interface Super extends NodeBase {
    kind: SyntaxKinds.Super;
    name: "super"
}
export interface ThisExpression extends NodeBase {
    kind: SyntaxKinds.ThisExpression;
    name: "this",
}
export interface Identifier extends NodeBase  {
    kind: SyntaxKinds.Identifier;
    name: string;
}
export interface NumberLiteral extends NodeBase {
    kind: SyntaxKinds.NumberLiteral;
    value: string | number;
}
export interface StringLiteral extends NodeBase {
    kind: SyntaxKinds.StringLiteral;
    value: string;
}
export interface TemplateLiteral extends NodeBase {
    kind: SyntaxKinds.TemplateLiteral,
    quasis: Array<TemplateElement>;
    expressions: Array<Expression>;
}
export interface TemplateElement extends NodeBase {
    kind: SyntaxKinds.TemplateElement;
    value: string;
    tail: boolean;
}
export interface ObjectExpression extends NodeBase {
    kind: SyntaxKinds.ObjectExpression;
    properties: Array<PropertyDefinition>;
}
export type PropertyDefinition = Property | SpreadElement | MethodDefinition | Identifier;
export type PropertyName = Identifier | StringLiteral | NumberLiteral | Expression;
export interface Property extends NodeBase {
    kind: SyntaxKinds.Property;
    key: PropertyName
    value: Expression; // actually is assignment expression,
    computed: boolean;
}
export interface MethodDefinition extends NodeBase {
    kind: SyntaxKinds.MethodDefinition,
    key: PropertyName; // 
    body: FunctionBody;
    params: Array<Pattern>
    type: "constructor" | "method" | "get" | "set";
    computed: boolean;
    generator: boolean;
    async: boolean;
    static: boolean;
}
export interface SpreadElement extends NodeBase {
    kind: SyntaxKinds.SpreadElement,
    argument: Expression,
}
export interface ArrayExpression extends NodeBase {
    kind: SyntaxKinds.ArrayExpression;
    elements: Array<Expression | null>; // actually need to be assigment expression;
}
export interface FunctionExpression extends NodeBase, Function {
    kind: SyntaxKinds.FunctionExpression
}
// TODO: make arrowfunctionExpression extends form function
export interface ArrorFunctionExpression extends NodeBase {
    kind: SyntaxKinds.ArrowFunctionExpression;
    expressionBody: boolean;
    async: boolean;
    arguments: Array<Expression>;
    body: Expression | FunctionBody;
}
export interface MetaProperty extends NodeBase {
    kind: SyntaxKinds.MetaProperty;
    meta: Identifier;
    property: Identifier;
}
export interface AwaitExpression extends NodeBase {
    kind: SyntaxKinds.AwaitExpression;
    argument: Expression; // actually is unary expression
}
export interface NewExpression extends NodeBase {
    kind: SyntaxKinds.NewExpression,
    callee: Expression;
    arguments:Array<Expression>;
}
export interface MemberExpression extends NodeBase {
    kind: SyntaxKinds.MemberExpression;
    object: Expression;
    property: Expression;
    computed: boolean;
    optional: boolean;
}
export interface CallExpression extends NodeBase {
    kind: SyntaxKinds.CallExpression;
    callee: Expression;
    arguments: Array<Expression>;
    optional: boolean;
}
export interface TaggedTemplateExpression extends NodeBase {
    kind: SyntaxKinds.TaggedTemplateExpression;
    quasi: TemplateLiteral;
    tag: Expression;
}
export interface ChainExpression extends NodeBase {
    kind: SyntaxKinds.ChainExpression;
    expression: Expression;
  }
export interface UpdateExpression extends NodeBase {
    kind: SyntaxKinds.UpdateExpression;
    argument: Expression;
    prefix: boolean;
    operator: UpdateOperatorKinds;
}
export interface UnaryExpression extends NodeBase  {
    kind: SyntaxKinds.UnaryExpression;
    argument: Expression;
    operator: UnaryOperatorKinds;
}
export interface BinaryExpression extends NodeBase {
    kind: SyntaxKinds.BinaryExpression;
    left: Expression;
    right: Expression;
    operator: BinaryOperatorKinds;
}
export interface ConditionalExpression extends NodeBase {
    kind: SyntaxKinds.ConditionalExpression;
    test: Expression;
    consequnce: Expression;
    alter: Expression;
}
export interface AssigmentExpression extends NodeBase {
    kind: SyntaxKinds.AssigmentExpression;
    left: Expression;
    right: Expression;
    operator: AssigmentOperatorKinds;
}
export interface SequenceExpression extends NodeBase {
    kind: SyntaxKinds.SequenceExpression;
    exprs: Array<Expression>
}

export type Expression =
    // identifer and super and ThisExpression
    Identifier | Super | ThisExpression |
    // literals 
    NumberLiteral | StringLiteral | TemplateLiteral |
    // structal literal
    ObjectExpression | ArrayExpression | ArrorFunctionExpression | FunctionExpression |
    // meta property and spread element
    SpreadElement | MetaProperty |
    // other expression
    CallExpression | MemberExpression | TaggedTemplateExpression |  NewExpression | ChainExpression |
    UpdateExpression | UnaryExpression | AwaitExpression | BinaryExpression |
    ConditionalExpression | AssigmentExpression | SequenceExpression
;
export interface ExpressionStatement  {
    kind: SyntaxKinds.ExpressionStatement;
    expr: Expression;
}

/** =================================
 *   Pattern
 * ==================================
 */
export interface Pattern extends NodeBase {};
export interface RestElements extends Pattern {
    kind: SyntaxKinds.RestElements;
    argument: Expression;
}
export interface AssignmentPattern extends Pattern {
    kind: SyntaxKinds.AssignmentPattern;
    left: Identifier;
    right: Expression;
}

/** ================================
 *  Declaration
 * =================================
 */
export interface FunctionBody extends NodeBase {
    kind: SyntaxKinds.FunctionBody;
    body: Array<NodeBase> //TODO: using StatementListItem
}
export interface FunctionDeclaration extends NodeBase, Function {
    kind: SyntaxKinds.FunctionDeclaration;
    name: Identifier
}

export interface Class extends NodeBase {
    id: Identifier | null;
    superClass: Expression | null;
    body: ClassBody;
}
interface ClassBody extends NodeBase {
    kind: SyntaxKinds.ClassBody;
    body: [ MethodDefinition ];
}
export type Declaration = FunctionDeclaration;