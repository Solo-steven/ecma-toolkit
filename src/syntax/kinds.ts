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
    MemberExpression,
    CallExpression,
    UpdateExpression,
    UnaryExpression,
    BinaryExpression,
    AssigmentExpression,
    ConditionalExpression,
    SequenceExpression,
}

// TODO: fill all possible text
export function kindToText(kind: SyntaxKinds) {
    switch(kind) {
        case SyntaxKinds.AwaitKeyword:
            return "AwaitKeyword";
        case SyntaxKinds.BreakKeyword:
            return "BreakKeyword";
        case SyntaxKinds.CaseKeyword:
            return "Casekeyword";
        case SyntaxKinds.CatchKeyword:
            return "CatchKeyword";
        case SyntaxKinds.ClassKeyword:
            return "ClassKeyword";
        case SyntaxKinds.ConstKeyword:
            return "ConstKeyword";
        case SyntaxKinds.ContinueKeyword:
            return "ContineKeyword";
        case SyntaxKinds.DebuggerKeyword:
            return "DebuggerKeyword";
        
        
        
    }
}