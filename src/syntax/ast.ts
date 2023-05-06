import { SyntaxKinds } from "./kinds";
import { 
    UpdateOperatorKinds, 
    UnaryOperatorKinds, 
    BinaryOperatorKinds, 
    AssigmentOperatorKinds
} from "./operator";
/** ======================================
 *          AST Node
 * ======================================
 */
interface NodeBase {}

export interface Identifier extends NodeBase  {
    kind: SyntaxKinds.Identifier;
    name: string;
}
export interface NumberLiteral extends NodeBase {
    kind: SyntaxKinds.NumberLiteral;
    value: string | number;
}
export interface ObjectExpression extends NodeBase {
    kind: SyntaxKinds.ObjectExpression;
    properties: Array<Property>;
}
export interface Property extends NodeBase {
    kind: SyntaxKinds.Property;
    key: Identifier;
    value: Expression; // actually is assignment expression,
    variant: "init" | "set" | "get";
}
export interface MemberExpression extends NodeBase {
    kind: SyntaxKinds.MemberExpression;
    object: Expression;
    property: Expression;
    computed: boolean;
}
export interface CallExpression extends NodeBase {
    kind: SyntaxKinds.CallExpression;
    callee: Expression;
    arguments: Array<Expression>;
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
    Identifier | NumberLiteral | ObjectExpression |
    CallExpression | MemberExpression |
    UpdateExpression | UnaryExpression | BinaryExpression |
    ConditionalExpression | AssigmentExpression | SequenceExpression
;