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
    // ========== EOF ==========
    EOFToken,
/** ======================================
 *          AST Node
 * ======================================
 */
    MetaProperty,
    Super,
    SpreadElement,
    ArrayExpression,
    ObjectExpression,
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
    AssigmentExpression,
    ConditionalExpression,
    SequenceExpression,
    ExpressionStatement,
    Function,
    AssignmentPattern,
    RestElements,
    FunctionDeclaration,
    FunctionBody,
    Program,
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
        "\'", "\"", 
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
        "try", "var", "with", "yield","let",
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
    ["yield"]: SyntaxKinds.YieldKeyword,
    ["let"]: SyntaxKinds.LetKeyword,
    ["delete"]: SyntaxKinds.DeleteKeyword,
    ["void"]: SyntaxKinds.VoidKeyword,
    ["typeof"]: SyntaxKinds.TypeofKeyword,
    ["in"]: SyntaxKinds.InKeyword,
    ["instanceof"]: SyntaxKinds.InstanceofKeyword,   
}