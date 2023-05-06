import { SyntaxKinds } from "./kinds";

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


export const KeywordMapSyntaxKind = {
    "await": SyntaxKinds.AwaitKeyword,
    "break": SyntaxKinds.BreakKeyword,
    "import": SyntaxKinds.ImportKeyword,
    "new": SyntaxKinds.NewKeyword,
    "super": SyntaxKinds.SuperKeyword,
}