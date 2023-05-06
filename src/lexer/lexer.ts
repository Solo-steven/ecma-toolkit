import { SyntaxKinds } from "@/src/syntax/kinds";
import { SourcePosition, cloneSourcePosition, createSourcePosition } from "@/src/utils/position";
import { LexicalLiteral, KeywordMapSyntaxKind } from "@/src/syntax/charcode";

interface Context {
    code: string;
    sourcePosition: SourcePosition;
    sourceValue: string;
    token: SyntaxKinds;

    startPosition: SourcePosition;
    endPosition: SourcePosition;

    templateStringStackCounter: number;
}

function cloneContext(source: Context) {
    return {
        ...source,
        sourcePosition: cloneSourcePosition(source.sourcePosition),
        startPosition: cloneSourcePosition(source.startPosition),
        endPosition: cloneSourcePosition(source.endPosition)
    }
}

interface Lexer {
    getSourceValue: () => string;
    getStartPosition: () => SourcePosition;
    getEndPosition: () => SourcePosition;
    getToken: () => SyntaxKinds;
    nextToken: () => SyntaxKinds;
    lookahead: () => SyntaxKinds;
}

export function createLexer(code: string): Lexer {
/**
 *  Public API
 */
    let context: Context = {
        code,
        sourcePosition: createSourcePosition(),
        sourceValue: "",
        token: null,
        startPosition: createSourcePosition(),
        endPosition: createSourcePosition(),
        templateStringStackCounter: 0,
    };
    function getSourceValue() {
        return context.sourceValue;
    }
    function getStartPosition() {
        return context.startPosition;
    }
    function getEndPosition() {
        return context.endPosition;
    }
    function getToken() {
        if(context.token === null) {
            context.token = lex();
        }
        return context.token;
    }
    function nextToken() {
        context.token = lex();
        return context.token;
    }
    function lookahead() {
        const lastContext = cloneContext(context);
        const next = nextToken();
        context = lastContext;
        return next;
    }
    return {
        getSourceValue,
        getStartPosition,
        getEndPosition,
        getToken,
        nextToken,
        lookahead,
    }
/**
 *  Private utils function 
 */
    function startToken() {
        context.startPosition = cloneSourcePosition(context.sourcePosition);
    }
    function finishToken(kind: SyntaxKinds, value: string): SyntaxKinds {
        context.token = kind;
        context.sourceValue = value;
        context.endPosition = cloneSourcePosition(context.sourcePosition);
        return kind;
    }
    function getChar(n = 1): string {
        if(n < 1) {
            throw new Error(`[Error]: param 'n' at get function need to >= 1. but now get ${n}.`)
        }
        if(context.sourcePosition.index >= context.code.length) {
            return "";
        }
        return context.code.slice(context.sourcePosition.index, context.sourcePosition.index + n);
    }
    function eatChar(n = 1): string {
        if(n < 1) {
            throw new Error(`[Error]: param 'n' at eat function need to >= 1. but now get ${n}.`)
        }
        const char = getChar(n);
        for(const ch of char) {
            if(ch === "\n") {
                context.sourcePosition.row ++;
                context.sourcePosition.col = 0;
            } else {
                context.sourcePosition.col ++;
            }
            context.sourcePosition.index ++;
        }
        return char;
    }
    function startWith(char: string): boolean {
        return context.code.startsWith(char, context.sourcePosition.index)
    }
    function startWithSet(chars: Array<string>): boolean {
        for(const value of chars) {
            if(value.length === 0) {
                throw new Error(`[Error]: is function can't access empty string.`);
            }
            if(context.code.startsWith(value, context.sourcePosition.index)) {
                return true;
            }
        }
        return false;
    }
    function eof() {
        return getChar() === "";
    }
    function skipWhiteSpaceChangeLine() {
        while(
            !eof() && ( startWith("\n") || startWith('\t') || startWith(" "))
        ) {
            eatChar();
        }
    }
/**
 * Main Worker Logic 
 */
    function lex(): SyntaxKinds {
        skipWhiteSpaceChangeLine();
        const char = getChar();
        startToken();
        switch(char) {
            case "":
                return finishToken(SyntaxKinds.EOFToken, "eof");
            /** ==========================================
             *              Punctuators
             *  ==========================================
             */
            case "{":
                eatChar();
                return finishToken(SyntaxKinds.BracesLeftPunctuator, "{");
            case "}":
                if(context.templateStringStackCounter) {
                    return readTemplateMiddleORTail();
                }
                eatChar();
                return finishToken(SyntaxKinds.BracesRightPunctuator, "}");
            case "[":
                eatChar();
                return finishToken(SyntaxKinds.BracketLeftPunctuator, "[");
            case "]":
                eatChar();
                return finishToken(SyntaxKinds.BracketRightPunctuator,"]");
            case "(":
                eatChar();
                return finishToken(SyntaxKinds.ParenthesesLeftPunctuator, "(");
            case ")":
                eatChar();
                return finishToken(SyntaxKinds.ParenthesesRightPunctuator, ")");
            case ":":
                eatChar();
                return finishToken(SyntaxKinds.ColonPunctuator, ":");
            case ";":
                eatChar();
                return finishToken(SyntaxKinds.SemiPunctuator, ";");
            /** ==========================================
             *                Operators
             *  ==========================================
             */
            case "+": {
                // '+', '+=', '++' 
                return readPlusStart();
            }
            case "-": {
                // '-', '-=', '--'
                return readMinusStart();
            }
            case "*": {
                // '*' , '**', '*=', '**=', 
                return readMultiplyStart();
            }
            case "%": {
                // '%', '%='
                return readModStart();
            }
            case "/": {
                // '/' '// comment' '/* comments */'
                return readSlashStart();
            }
            case ">": {
                // '>', '>>', '>>>' '>=', ">>=",  ">>>="
                return readGTStart();
            }
            case "<": {
                // '<', '<<', '<=', '<<='
                return readLTStart();
            }
            case '=': {
                // '=', '==', '===', 
                return readAssignStart();
            }
            case "!": {
                // '!', '!=', '!=='
                return readExclamationStart();
            }
            case ",": {
                // ','
                eatChar();
                return finishToken(SyntaxKinds.CommaToken, ",");
            }
            case "&": {
                // '&', '&&', '&=', '&&='
                return readANDStart();
            }
            case "|": {
                // '|', "||", '|=', '||='
                return readORStart();
            }
            case "?": {
                // '?', '?.' '??'
                return readQustionStart();
            }
            case "^": {
                // '^', '^='
                return readUpArrowStart();
            }
            case "~": {
                return readTildeStart();
            }
            case ".": {
                // '.', '...', 'float-literal', Sub State Machine 2
                return readDotStart();
            }
            case '`': {
                return readTemplateHeadORNoSubstitution();
            }
            /** ==========================================
             *  Keyword, Id, Literal
             *   -> start from 0 ~ 9 , is number literal.
             *   -> start from " or ', is string
             *   -> oterview, read string literal
             *       ->  string maybe match the keyword or operator, or literal (bool)
             *       ->   id lterial
             *  ==========================================
             */
            case "0": case "1": case "2": case "3": case "4": case "5":
            case "6": case "7": case "8": case "9": {
                // Number Literal
                return readNumberLiteral();
            }
            case "\"":
            case "\'": {
                // String Literal
                return readStringLiteral();
            }
            default: {
                // Word -> Id or Keyword
                return readString();
            }
        }
    }
    /**
     * sunStateMachineError is used for return a format error to developer that Sub State Machine
     * expect start chars that is not show in current code string.
     * @param {string} name - name of sub state machine
     * @param {string} char - chars that sub state machine is expected
     * @returns {Error} - a error object
     */
    function subStateMachineError(name: string, char: string): Error {
        return new Error(`[Error]: ${name} state machine should only be called when currnet position is ${char}. `);
    }
    /**
     * lexicalError is used for tokenizer unexecpt char happended. ex: string start with " can't find end ""
     * @param {string} content - error message
     * @returns {Error} - a error object
     */
    function lexicalError(content: string): Error {
        return new Error(`[Error]: Lexical Error, ${content}, position is ${context.sourcePosition.row}, ${context.sourcePosition.col}`);
    }
    /** ======================================
     *      Operators State Machine
     *  ======================================
     */
    function readPlusStart() {
        // read any token start with '+', '+=', '++'
        // MUST call when current char is '+'
        if(!startWith("+")) {
            throw subStateMachineError("readPlusStart", "+")
        }
        if(startWith("+=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.PlusAssignOperator, "+=");
        }
        if(startWith("++")) {
            eatChar(2);
            return finishToken(SyntaxKinds.IncreOperator, "++");
        }
        eatChar();
        return finishToken(SyntaxKinds.PlusOperator, "+");
    }
    function readMinusStart() {
        // read any token start with '-', '-=', '--'
        // MUST call when current char is '-'
        if(!startWith("-")) {
            throw subStateMachineError("readMinusStart", "-");
        }
        if(startWith("-=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.MultiplyAssignOperator, "-=");
        }
        if(startWith("--")) {
            eatChar(2);
            return finishToken(SyntaxKinds.DecreOperator, "--");
        }
        eatChar();
        return finishToken(SyntaxKinds.MinusOperator,"-");
    }
    function readMultiplyStart() {
        // read any token start with '*', '*=', '**', '**='
        // MUST call when current char is '*'
        if(!startWith("*")) {
            throw subStateMachineError("readMutiplyStart", "*");
        }
        if(startWith("**=")) {
            eatChar(3);
            return finishToken(SyntaxKinds.ExponAssignOperator, "**=");
        }
        if(startWith("**")) {
            eatChar(2);
            return finishToken(SyntaxKinds.ExponOperator, "**");
        }
        if(startWith("*=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.MultiplyAssignOperator,"*=");
        }
        eatChar();
        return finishToken(SyntaxKinds.MultiplyOperator, "*");
    }
    function readSlashStart() {
        // read any token start with '/', '/=', 'single-line-comment', 'block-comment'
        // MUST call when current char is '/'
        if(!startWith("/")) {
            throw subStateMachineError("readSlashStart", "/");
        }
        if(startWith("//")) {
            return readComment();
        }
        if(startWith("/*")) {
            return readCommentBlock();
        }
        if(startWith("/=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.DivideAssignOperator, "//");
        }
        eatChar();
        return finishToken(SyntaxKinds.DivideOperator, "/");
    }
    function readComment() {
        if(!startWith("//")) {
            throw subStateMachineError("readComment", "//");
        }
        // eat '//'
        eatChar(2);
        let comment = "";
        while(!startWith("\n") && !eof()) {
            comment += eatChar();
        }
        return finishToken(SyntaxKinds.Comment, comment);
    }
    function readCommentBlock() {
        if(!startWith("/*")) {
            throw new Error(``);
        }
        // Eat '/*'
        eatChar(2);
        let comment = "";
        while(!startWith("*/") && !eof()) {
            comment += eatChar();
        }
        if(eof()) {
            // lexical error, no close */ to comment.
            throw lexicalError("block comment can't find close '*/'");
        }
        // eat '*/'
        eatChar(2);
        return finishToken(SyntaxKinds.BlockComment, comment);
    }
    function readModStart() {
        // read any token start with '%', '%='
        // MUST call when current char is '%'
        if(!startWith("%")) {
            throw subStateMachineError("readModStart", "%");
        }
        if(startWith("%=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.ModAssignOperator,"%=");
        }
        eatChar();
        return finishToken(SyntaxKinds.ModOperator, "%");
    }
    function readGTStart() {
        // read any token start with '>', '>=', '>>', '>>=', '>>>', '>>>='
        // MUST call when current char is '>'
        if(!startWith(">")) {
            throw subStateMachineError("readGTStart", ">");
        }
        if(startWith(">>>=")) {
            eatChar(4);
            finishToken(SyntaxKinds.BitwiseRightShiftFillAssginOperator, ">>>=");
        }
        if(startWith(">>>")) {
            eatChar(3);
            return finishToken(SyntaxKinds.BitwiseRightShiftFillOperator, ">>>");
        }
        if(startWith(">>=")) {
            eatChar(3);
            return finishToken(SyntaxKinds.BitwiseRightShiftAssginOperator, ">>=");
        }
        if(startWith(">>")) {
            eatChar(2);
            return finishToken(SyntaxKinds.BitwiseRightShiftOperator, ">>")
        }
        if(startWith(">=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.GeqtOperator, ">=");
        }
        eatChar();
        return finishToken(SyntaxKinds.GtOperator, ">");
    }
    function readLTStart() {
        // read any token start with '<', '<=', '<<', '<<='
        // MUST call when current char is '<'
        if(!startWith("<")) {
            throw subStateMachineError("readLTStart", "<");
        }
        eatChar();
        if(startWith("<<=")) {
            eatChar(3);
            return finishToken(SyntaxKinds.BitwiseLeftShiftAssginOperator, "<<=");
        }
        if(startWith("<<")) {
            eatChar(2);
            return finishToken(SyntaxKinds.BitwiseLeftShiftOperator, "<<");
        }
        if(startWith("<=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.LeqtOperator, "<=");
        }
        eatChar();
        return finishToken(SyntaxKinds.LtOperator, "<");
    }
    function readAssignStart() {
        // [READ]: '=', '==', '==='
        // [MUST]: call when current char is '=' 
        if(!startWith("=")) {
            throw subStateMachineError("readAssginStart", "=");
        }
        if(startWith("===")) {
            eatChar(3);
            return finishToken(SyntaxKinds.StrictEqOperator, "===");
        }
        if(startWith("==")) {
            eatChar(3);
            return finishToken(SyntaxKinds.EqOperator, "==");
        }
        eatChar();
        return finishToken(SyntaxKinds.AssginOperator, "=");
    }
    function readExclamationStart() {
        // [READ]: '!', '!=', '!=='
        // [MUST]: call when current char is '!'
        if(!startWith("!")) {
            throw subStateMachineError("readExclamationStart", "!");
        }
        if(startWith("!==")) {
            eatChar(3);
            return finishToken(SyntaxKinds.StrictNotEqOperator, "!==");
        }
        if(startWith("!=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.NotEqOperator, "!=");
        }
        eatChar();
        return finishToken(SyntaxKinds.LogicalNOTOperator, "!");
    }
    function readANDStart() {
        // [READ]: '&', '&&', '&=', '&&='
        // [MUST]: call when current char is '&' 
        if(!startWith("&")) {
            throw subStateMachineError("readANDStart", "&");
        }
        if(startWith("&&=")) {
            eatChar(3);
            return finishToken(SyntaxKinds.logicalANDAssginOperator, "&&=");
        }
        if(startWith("&&")) {
            eatChar(2);
            return finishToken(SyntaxKinds.LogicalANDOperator, "&&");
        }
        if(startWith("&=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.BitwiseANDAssginOperator, "&=");
        }
        eatChar();
        return finishToken(SyntaxKinds.BitwiseANDOperator, "&");
    }
    function readORStart() {
        // [READ]: '|', '||', '|=', '||='
        // [MUST]: call when current char is '|' 
        if(!startWith("|")) {
            throw subStateMachineError("readORStart", "|");
        }
        if(startWith("||=")) {
            eatChar(3);
            return finishToken(SyntaxKinds.LogicalORAssignOperator,"||=");
        }
        if(startWith("|=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.BitwiseORAssginOperator,"|=");
        }
        if(startWith("||")) {
            eatChar(2);
            return finishToken(SyntaxKinds.LogicalOROperator,"||");
        }
        eatChar();
        return finishToken(SyntaxKinds.BitwiseOROperator,"|");
    }
    function readQustionStart() {
        // [READ]: '?', '?.' '??'
        // [MUST]: call when current char is '?'
        if(!startWith("?")) {
            throw subStateMachineError("readQustionStart", "?");
        } 
        eatChar();
        if(startWith("?.")) {
            eatChar(2);
            return finishToken(SyntaxKinds.QustionDotOperator,"?.");
        }
        if(startWith("??")) {
            // TODO
        }
        eatChar();
        return finishToken(SyntaxKinds.QustionOperator, "?");
    }
    function readDotStart() {
        // [READ]: '.', '...'
        // [MUST]: call when current char is '.'
        if(!startWith(".")) {
            throw subStateMachineError("readDotStart", ".");
        } 
        if(startWith("...")) {
            eatChar(3);
            return finishToken(SyntaxKinds.SpreadOperator, "...");
        }
        if(startWith(".")) {
            eatChar();
            return finishToken(SyntaxKinds.DotOperator, ".");
        }
        // TODO not . , ...
        throw new Error();
    }
    function readTildeStart() {
        // [READ]: '^', '^='
        // [MUST]: call when current char is '^'
        if(startWith("^=")) {
            eatChar(1);
            return finishToken(SyntaxKinds.BitwiseNOTAssginOperator, "^=");
        }
        eatChar();
        return finishToken(SyntaxKinds.BitwiseNOTOperator, "^");
    }
    function readUpArrowStart() {
        // [READ]: '~', '~='
        // [MUST]: call when current char is '~'
        if(!startWith("~")) {
            throw subStateMachineError("readWaveStart", "~");
        } 
        if(startWith("~=")) {
            eatChar(2);
            return finishToken(SyntaxKinds.BitwiseXORAssginOperator, "~=");
        }
        eatChar();
        return finishToken(SyntaxKinds.BitwiseXOROperator, "~");
    }
    /** ================================================
     *     Template
     *  ================================================
     */
    function readTemplateHeadORNoSubstitution() {
        if(!startWith("`")) {
            throw subStateMachineError("readTemplateHeadORNoSubstitution", "`");
        }
        eatChar(1);
        let wordString = "";
        while(!startWithSet(["${", "`"])&& !eof() ) {
            wordString += eatChar();
        }
        if(eof()) {
            throw lexicalError("template string not closed with '`'");
        }
        if(startWith("${")) {
            eatChar(2);
            context.templateStringStackCounter ++;
            return  finishToken(SyntaxKinds.TemplateHead, wordString);
        }
        eatChar(1);
        return finishToken(SyntaxKinds.TemplateNoSubstitution, wordString);
    }
    function readTemplateMiddleORTail() {
        if(!startWith("}")) {
            throw subStateMachineError("eadTemplateMiddleORTail", "}");
        }
        eatChar(1);
        let wordString = "";
        while(!startWithSet(["${", "`"])&& !eof() ) {
            wordString += eatChar();
        }
        if(eof()) {
            throw lexicalError("template string not closed with '`'");
        }
        context.sourceValue = wordString;
        if(startWith("${")) {
            eatChar(2);
            context.templateStringStackCounter ++;
            return  finishToken(SyntaxKinds.TemplateMiddle, wordString);
        }
        eatChar(1);
        return finishToken(SyntaxKinds.TemplateTail, wordString);
    }

    /** ================================================
     *     Id, Literal, Keywords State Machine
     *  ================================================
     */
    function readNumberLiteral() {
        // Start With 0
        if(startWith("0")) {
            eatChar();
            let floatWord = "";
            if(startWith(".")) {
                while(startWithSet(LexicalLiteral.numberChars)) {
                    floatWord += eatChar();
                }
                return finishToken(SyntaxKinds.NumberLiteral, `0.${floatWord}`);
            }
            throw new Error(`[Error]: Not Support 0x 0b Number`)
        }
        // Start With Non 0
        let intWord = "";
        let floatWord = "";
        while(startWithSet(LexicalLiteral.numberChars) && !eof()) {
            intWord += eatChar();
        }
        if(startWith(".")) {
            while(startWithSet(LexicalLiteral.numberChars) && !eof()) {
                floatWord += eatChar();
            }
            return finishToken(SyntaxKinds.NumberLiteral, `${intWord}.${floatWord}`);
        }
        return finishToken(SyntaxKinds.NumberLiteral, `${intWord}`);
    }
    function readStringLiteral() {
        let mode = "";
        if(startWith("\'")) {
            mode = "\'";
        }else if(startWith("\"")) {
            mode = "\""
        }
        eatChar();
        let word = "";
        while(!startWith(mode) && !eof()) {
            word += eatChar()
        }
        if(eof()) {
            throw lexicalError(`string literal start with ${mode} can't find closed char`);
        }
        eatChar();
        return finishToken(SyntaxKinds.StringLiteral, word);
    }
    function readString() {
        let word = "";
        let start = eatChar();
        while(!startWithSet(
            [ ...LexicalLiteral.punctuators,
                ...LexicalLiteral.operator, 
                ...LexicalLiteral.newLineChars, 
                ...LexicalLiteral.whiteSpaceChars
            ]
        ) && !eof()) {
            word += eatChar();
        }
        const w = start + word;
        if((new Set(LexicalLiteral.keywords)).has(w)) {
            if(KeywordMapSyntaxKind[w] == null) {
                throw new Error(`[Error]: Keyword ${w} have no match method to create token`);
            }
            return finishToken(KeywordMapSyntaxKind[w], w);
        }
        if((new Set(LexicalLiteral.BooleanLiteral)).has(w)) {
            if(w === "true") {
                return finishToken(SyntaxKinds.TrueKeyword, w);
            }
            if(w === "false") {
                return finishToken(SyntaxKinds.FalseKeyword, w);
            }
            throw new Error(`[Error]: Boolean Lieral ${w} have no match method to create token`);
        }
        if((new Set(LexicalLiteral.NullLiteral)).has(w)) {
            return finishToken(SyntaxKinds.NullKeyword, w);
        }
        if((new Set(LexicalLiteral.UndefinbedLiteral)).has(w)) {
            return finishToken(SyntaxKinds.UndefinedKeyword, w);
        }
        return finishToken(SyntaxKinds.Identifier, w);
    }
}