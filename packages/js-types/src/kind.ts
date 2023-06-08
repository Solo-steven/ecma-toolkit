export enum SyntaxKinds {
/** ======================================
 *         Tokens
 * =======================================
 */
    // ============= Keyword ===========
    AwaitKeyword = 10010,
    BreakKeyword,
    CaseKeyword,
    CatchKeyword,
    ClassKeyword,
    ConstKeyword,
    ContinueKeyword,
    DebuggerKeyword,
    DefaultKeyword,
    DoKeyword,
    ElseKeyword,
    EnumKeyword,
    ExportKeyword,
    ExtendsKeyword,
    FinallyKeyword,
    ForKeyword,
    FunctionKeyword,
    IfKeyword,
    ImportKeyword,
    LetKeyword,
    NewKeyword,
    ReturnKeyword,
    SuperKeyword,
    SwitchKeyword,
    ThisKeyword,
    ThrowKeyword,
    TryKeyword,
    VarKeyword,
    WithKeyword,
    WhileKeyword,
    YieldKeyword,
    DeleteKeyword,
    VoidKeyword,
    TypeofKeyword,
    InKeyword,
    InstanceofKeyword,
    // ========== Operators ==========
    PlusOperator,       // +
    MinusOperator,      // -
    DivideOperator,     // /
    MultiplyOperator,   // *
    ModOperator,    // %
    IncreOperator,  // ++
    DecreOperator,  // --
    ExponOperator,  // **
    GtOperator,     // >
    LtOperator,     // <
    EqOperator,     // ==
    NotEqOperator,  // !=
    GeqtOperator,   // >=
    LeqtOperator,   // <=
    ArrowOperator, //  =>
    StrictEqOperator,       // ===
    StrictNotEqOperator,    // !==
    BitwiseOROperator,      // |
    BitwiseANDOperator,     // &
    BitwiseNOTOperator,     // ~
    BitwiseXOROperator,     // ^
    BitwiseLeftShiftOperator,   // <<
    BitwiseRightShiftOperator,  // >>
    BitwiseRightShiftFillOperator,  // >>>
    LogicalOROperator,      // ||
    LogicalANDOperator,     // &&
    LogicalNOTOperator,     // !
    SpreadOperator,         // ...
    QustionOperator,        // ?
    QustionDotOperator,     // ?.
    DotOperator,            // .
    AssginOperator,         // =
    PlusAssignOperator,     // +=
    MinusAssignOperator,    // -=
    ModAssignOperator,      // %=
    DivideAssignOperator,   // /=
    MultiplyAssignOperator, // *=
    ExponAssignOperator,    // **=
    BitwiseORAssginOperator,    // |=
    BitwiseANDAssginOperator,   // &=
    BitwiseNOTAssginOperator,   // ~=
    BitwiseXORAssginOperator,   // ^=
    LogicalORAssignOperator,    // ||=
    logicalANDAssginOperator,   // &&=
    BitwiseLeftShiftAssginOperator,     // <<=
    BitwiseRightShiftAssginOperator,    // >>=
    BitwiseRightShiftFillAssginOperator,// >>>=
    // ========= Token (Maybe Punctuator and Operator) =====
    CommaToken,
    // ========== Punctuator ===========
    BracesLeftPunctuator,   // {
    BracesRightPunctuator,  // }
    BracketLeftPunctuator,  // [
    BracketRightPunctuator, // ]
    ParenthesesLeftPunctuator,  // (
    ParenthesesRightPunctuator, // )
    SingleQuotationPunctuator,  // '
    DoubleQuotationPunctuator,  // "
    SemiPunctuator, // ;
    ColonPunctuator,    // :
    HashTagPunctuator,  // #
    // ========== Template ===========
    TemplateHead,
    TemplateTail,
    TemplateMiddle,
    TemplateNoSubstitution,
    // ========== Literal ===========
    TrueKeyword,
    FalseKeyword,
    NullKeyword,
    UndefinedKeyword,
    StringLiteral,
    NumberLiteral,
    // =========== Comment =============
    Comment,
    BlockComment,
    // ========= Identifier ===========
    Identifier,
    PrivateName,
    // ========== EOF ==========
    EOFToken,
/** ======================================
 *          AST Node
 * ======================================
 */
    // =========== Top Level ===========
    Program,
    // =========== Statement ===========
    IfStatement,
    BlockStatement,
    SwitchStatement,
    SwitchCase,
    LabeledStatement,
    BreakStatement,
    ContinueStatement,
    ReturnStatement,
    WhileStatement,
    DoWhileStatement,
    TryStatement,
    CatchClause,
    ThrowStatement,
    DebuggerStatement,
    WithStatement,
    ForInStatement,
    ForOfStatement,
    ForStatement,
    // =========== Declaration ===========
    VariableDeclaration,
    VariableDeclarator,
    Function,
    FunctionDeclaration,
    FunctionBody,
    ClassDeclaration,
    ClassBody,
    // ========== Expression ==========
    MetaProperty,
    Super,
    ThisExpression,
    SpreadElement,
    ArrayExpression,
    ObjectExpression,
    ObjectProperty,
    ObjectAccessor,
    ObjectMethodDefintion,
    ClassExpression,
    ClassProperty,
    ClassAccessor,
    ClassConstructor,
    ClassMethodDefinition,
    FunctionExpression,
    TemplateLiteral,
    TemplateElement,
    ArrowFunctionExpression,
    Property,
    ChainExpression,
    NewExpression,
    MemberExpression,
    TaggedTemplateExpression,
    AwaitExpression,
    CallExpression,
    UpdateExpression,
    UnaryExpression,
    BinaryExpression,
    YieldExpression,
    AssigmentExpression,
    ConditionalExpression,
    SequenceExpression,
    ExpressionStatement,
    // =========== Pattern ==========
    AssignmentPattern,
    ObjectPattern,
    ObjectPatternProperty,
    ArrayPattern,
    RestElement,
    // ========= ImportDeclaration ==========
    ImportDeclaration,
    ImportSpecifier,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    // ========= ImportDeclaration ==========
    ExportNamedDeclaration,
    ExportSpecifier,
    ExportDefaultDeclaration,
    ExportAllDeclaration,

}
export const LexicalLiteral = {
    whiteSpaceChars: [" ", "\t"],
    newLineChars: ["\n"],
    numberChars: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    punctuators: [
        "{", "}",
        "[", "]",
        "(", ")",
        ":", ";",
        "'", "\"", 
        "#"
    ],
    operator: [
        // Arithmetic operators
        "+", "-", "*", "/", "%", "++", "--", "**",
        // Compare operators
        ">", "<", "==", "!=", "<=", ">=", "===", "!==",
        // Bitwise operators
        "|", "&", "~", "^", "<<", ">>", ">>>",
        // Logical operators
        "||", "&&", "!", "??",
        // Comma operators
        ",",
        // 
        "...",
        // Optional Chaining, Chaining
        "?.", ".",
        // Template Literal
        "`",
        // Assignment operator,
        "=", "+=", "-=", "*=", "%=", "**=",
        "|=", "&=", ">>=", "<<=", ">>>=", "^=", "~=",
        "||=", "&&=", "??="
    ],
    BooleanLiteral: ["true", "false"],
    NullLiteral: ["null"],
    UndefinbedLiteral: ["undefined"],
    keywords: [
        "await", "break", "case", "catch", "class",
        "const", "continue", "debugger", "default", "do",
        "else", "enum", "export", "extends", "finally",
        "for", "function", "if", "import", "new",
        "return", "super", "switch", "this", "throw",
        "try", "var", "with", "while", "yield","let",
        // Unary operators
        "delete", "void", "typeof",
        // Relation operators
        "in", "instanceof",
    ]
};


export const KeywordLiteralMapSyntaxKind = {
    ["await"]: SyntaxKinds.AwaitKeyword,
    ["break"]: SyntaxKinds.BreakKeyword, 
    ["case"]: SyntaxKinds.CaseKeyword,
    ["catch"]: SyntaxKinds.CatchKeyword,
    ["class"]: SyntaxKinds.ClassKeyword,
    ["const"]: SyntaxKinds.ConstKeyword,
    ["continue"]: SyntaxKinds.ContinueKeyword,
    ["debugger"]: SyntaxKinds.DebuggerKeyword, 
    ["default"]: SyntaxKinds.DefaultKeyword,
    ["do"]: SyntaxKinds.DoKeyword,
    ["else"]: SyntaxKinds.ElseKeyword,
    ["enum"]: SyntaxKinds.EnumKeyword,
    ["export"]: SyntaxKinds.ExportKeyword,
    ["extends"]: SyntaxKinds.ExtendsKeyword,
    ["finally"]: SyntaxKinds.FinallyKeyword,
    ["for"]: SyntaxKinds.ForKeyword,
    ["function"]: SyntaxKinds.FunctionKeyword,
    ["if"]: SyntaxKinds.IfKeyword,
    ["import"]: SyntaxKinds.ImportKeyword,
    ["new"]: SyntaxKinds.NewKeyword,
    ["return"]: SyntaxKinds.ReturnKeyword,
    ["super"]: SyntaxKinds.SuperKeyword,
    ["switch"]: SyntaxKinds.SwitchKeyword, 
    ["this"]: SyntaxKinds.ThisKeyword,
    ["throw"]: SyntaxKinds.ThrowKeyword,
    ["try"]: SyntaxKinds.TryKeyword,
    ["var"]: SyntaxKinds.VarKeyword,
    ["with"]: SyntaxKinds.WithKeyword,
    ["while"]: SyntaxKinds.WhileKeyword,
    ["yield"]: SyntaxKinds.YieldKeyword,
    ["let"]: SyntaxKinds.LetKeyword,
    ["delete"]: SyntaxKinds.DeleteKeyword,
    ["void"]: SyntaxKinds.VoidKeyword,
    ["typeof"]: SyntaxKinds.TypeofKeyword,
    ["in"]: SyntaxKinds.InKeyword,
    ["instanceof"]: SyntaxKinds.InstanceofKeyword,   
}
/*
*          Union SytaxKinds
* ======================================
*/
export type AssigmentOperatorKinds = 
    SyntaxKinds.AssginOperator |
    SyntaxKinds.PlusAssignOperator |
    SyntaxKinds.MinusAssignOperator |
    SyntaxKinds.ExponAssignOperator |
    SyntaxKinds.DivideAssignOperator |
    SyntaxKinds.MultiplyAssignOperator |
    SyntaxKinds.ModAssignOperator |
    SyntaxKinds.BitwiseORAssginOperator |    // |=
    SyntaxKinds.BitwiseANDAssginOperator |   // &=
    SyntaxKinds.BitwiseNOTAssginOperator |   // ~=
    SyntaxKinds.BitwiseXORAssginOperator |   // ^=
    SyntaxKinds.LogicalORAssignOperator  |   // ||=
    SyntaxKinds.logicalANDAssginOperator |   // &&=
    SyntaxKinds.BitwiseLeftShiftAssginOperator |     // <<=
    SyntaxKinds.BitwiseRightShiftAssginOperator |    // >>=
    SyntaxKinds.BitwiseRightShiftFillAssginOperator // >>>=
;
export const AssigmentOperators = [
    SyntaxKinds.AssginOperator,
    SyntaxKinds.PlusAssignOperator,
    SyntaxKinds.MinusAssignOperator,
    SyntaxKinds.ExponAssignOperator,
    SyntaxKinds.DivideAssignOperator,
    SyntaxKinds.MultiplyAssignOperator,
    SyntaxKinds.ModAssignOperator,
    SyntaxKinds.BitwiseORAssginOperator,    // |=
    SyntaxKinds.BitwiseANDAssginOperator,   // &=
    SyntaxKinds.BitwiseNOTAssginOperator,   // ~=
    SyntaxKinds.BitwiseXORAssginOperator,   // ^=
    SyntaxKinds.LogicalORAssignOperator ,   // ||=
    SyntaxKinds.logicalANDAssginOperator,   // &&=
    SyntaxKinds.BitwiseLeftShiftAssginOperator,     // <<=
    SyntaxKinds.BitwiseRightShiftAssginOperator,    // >>=
    SyntaxKinds.BitwiseRightShiftFillAssginOperator // >>>=
];
export type BinaryOperatorKinds = 
    SyntaxKinds.PlusOperator |       // +
    SyntaxKinds.MinusOperator |      // -
    SyntaxKinds.DivideOperator |     // /
    SyntaxKinds.MultiplyOperator |   // *
    SyntaxKinds.ModOperator |    // %
    SyntaxKinds.IncreOperator |  // ++
    SyntaxKinds.DecreOperator |  // --
    SyntaxKinds.ExponOperator |  // **
    SyntaxKinds.GtOperator |     // >
    SyntaxKinds.LtOperator |     // <
    SyntaxKinds.EqOperator |     // ==
    SyntaxKinds.NotEqOperator |  // !=
    SyntaxKinds.GeqtOperator |   // >=
    SyntaxKinds.LeqtOperator |   // <=
    SyntaxKinds.StrictEqOperator |       // ===
    SyntaxKinds.StrictNotEqOperator |    // !==
    SyntaxKinds.BitwiseOROperator |      // |
    SyntaxKinds.BitwiseANDOperator |     // &
    SyntaxKinds.BitwiseLeftShiftOperator |      // <<
    SyntaxKinds.BitwiseRightShiftOperator |     // >>
    SyntaxKinds.BitwiseRightShiftFillOperator |  // >>>
    SyntaxKinds.CommaToken     // ,
;
export const BinaryOperators = [
    SyntaxKinds.PlusOperator,       // +
    SyntaxKinds.MinusOperator,      // -
    SyntaxKinds.DivideOperator,     // /
    SyntaxKinds.MultiplyOperator,   // *
    SyntaxKinds.ModOperator,    // %
    SyntaxKinds.IncreOperator,  // ++
    SyntaxKinds.DecreOperator,  // --
    SyntaxKinds.ExponOperator,  // **
    SyntaxKinds.GtOperator,     // >
    SyntaxKinds.LtOperator,     // <
    SyntaxKinds.EqOperator,     // ==
    SyntaxKinds.NotEqOperator,  // !=
    SyntaxKinds.GeqtOperator,   // >=
    SyntaxKinds.LeqtOperator,   // <=
    SyntaxKinds.StrictEqOperator,       // ===
    SyntaxKinds.StrictNotEqOperator,    // !==
    SyntaxKinds.BitwiseOROperator,      // |
    SyntaxKinds.BitwiseANDOperator,     // &
    SyntaxKinds.BitwiseLeftShiftOperator,      // <<
    SyntaxKinds.BitwiseRightShiftOperator,     // >>
    SyntaxKinds.BitwiseRightShiftFillOperator,  // >>>
    SyntaxKinds.CommaToken     // ,
]
export type UpdateOperatorKinds = 
    SyntaxKinds.IncreOperator |
    SyntaxKinds.DecreOperator 
;
export const UpdateOperators = [
    SyntaxKinds.IncreOperator,
    SyntaxKinds.DecreOperator
]
export type UnaryOperatorKinds = 
    SyntaxKinds.LogicalNOTOperator |   // !
    SyntaxKinds.BitwiseNOTOperator |     // ~
    SyntaxKinds.BitwiseXOROperator |     // ^
    SyntaxKinds.PlusOperator |       // +
    SyntaxKinds.MinusOperator |       // -
    SyntaxKinds.DeleteKeyword |     // delete
    SyntaxKinds.VoidKeyword |       // void
    SyntaxKinds.TypeofKeyword       // typeof
;
export const UnaryOperators = [
    SyntaxKinds.LogicalNOTOperator,   // !
    SyntaxKinds.BitwiseNOTOperator,     // ~
    SyntaxKinds.BitwiseXOROperator,     // ^
    SyntaxKinds.PlusOperator,       // +
    SyntaxKinds.MinusOperator,       // -
    SyntaxKinds.DeleteKeyword,     // delete
    SyntaxKinds.VoidKeyword,       // void
    SyntaxKinds.TypeofKeyword       // typeof
]

export const Keywords = [
    SyntaxKinds.AwaitKeyword,
    SyntaxKinds.BreakKeyword,
    SyntaxKinds.CaseKeyword,
    SyntaxKinds.CatchKeyword,
    SyntaxKinds.ClassKeyword,
    SyntaxKinds.ConstKeyword,
    SyntaxKinds.ContinueKeyword,
    SyntaxKinds.DebuggerKeyword,
    SyntaxKinds.DefaultKeyword,
    SyntaxKinds.DoKeyword,
    SyntaxKinds.ElseKeyword,
    SyntaxKinds.EnumKeyword,
    SyntaxKinds.ExportKeyword,
    SyntaxKinds.ExtendsKeyword,
    SyntaxKinds.FinallyKeyword,
    SyntaxKinds.ForKeyword,
    SyntaxKinds.FunctionKeyword,
    SyntaxKinds.IfKeyword,
    SyntaxKinds.ImportKeyword,
    SyntaxKinds.LetKeyword,
    SyntaxKinds.NewKeyword,
    SyntaxKinds.ReturnKeyword,
    SyntaxKinds.SuperKeyword,
    SyntaxKinds.SwitchKeyword,
    SyntaxKinds.ThisKeyword,
    SyntaxKinds.ThrowKeyword,
    SyntaxKinds.TryKeyword,
    SyntaxKinds.VarKeyword,
    SyntaxKinds.WithKeyword,
    SyntaxKinds.YieldKeyword,
    SyntaxKinds.DeleteKeyword,
    SyntaxKinds.VoidKeyword,
    SyntaxKinds.TypeofKeyword,
    SyntaxKinds.InKeyword,
    SyntaxKinds.InstanceofKeyword,
]