import { createLexer } from "@/src/lexer";
import * as factory from "@/src/syntax/factory";
import { 
    Expression, 
    FunctionBody, 
    Identifier, 
    ModuleItem, 
    Pattern, 
    PropertyDefinition,
    PropertyName, 
    MethodDefinition,
    TemplateElement, 
    PrivateName,
    ObjectMethodDefinition,
    ClassMethodDefinition,
    ClassElement,
    ClassBody,
    Class,
    VariableDeclaration,
    VariableDeclarator,
    ImportDeclaration,
    ImportDefaultSpecifier,
    ImportNamespaceSpecifier,
    ImportSpecifier,
    RestElement,
    ObjectPattern,
    ArrayPattern,
    StatementListItem,
    Declaration,
    Statement,
    IfStatement,
    SwitchCase,
    LabeledStatement,
    BreakStatement,
    ContinueStatement,
    ReturnStatement,
    WhileStatement,
    DoWhileStatement,
    TryStatement,
    CatchClause,
    BlockStatement,
    WithStatement,
    DebuggerStatement,
    ForStatement,
    ForInStatement,
    ForOfStatement,
    ExportDeclaration,
    ExportAllDeclaration,
    ExportNamedDeclarations,
    ExportSpecifier,
    ExportDefaultDeclaration,
    FunctionDeclaration,
    FunctionExpression,
    ClassDeclaration,
    ClassExpression,
} from "@/src/syntax/ast";
import { SyntaxKinds } from "@/src/syntax/kinds";
import { 
    UnaryOperators,
    BinaryOperators,
    AssigmentOperators,
    AssigmentOperatorKinds,
    BinaryOperatorKinds,
    UnaryOperatorKinds,
    UpdateOperators,
    UpdateOperatorKinds,
    Keywords,
 } from "@/src/syntax/operator";
import { getBinaryPrecedence, isBinaryOps } from "@/src/parser/helper";
import { ErrorMessageMap } from "@/src/parser/error";

/** ========================
 *  Context for parser
 * =========================
 */
interface Context {
    maybeArrow: boolean;
    inAsync: boolean;
    inClass: boolean,
}
/**
 * Create context for parser
 * @returns {Context}
 */
function createContext(): Context {
    return {
        maybeArrow: false,
        inAsync: false,
        inClass: false,
    }
}

export function createParser(code: string) {
    const lexer = createLexer(code);

/** =========================================================================
 *   Composition method from lexer, Context of parsr, Util helper for parser
 * ==========================================================================
 */
    const context = createContext();
    function parse() {
        return parseProgram();
    }
    return { parse };
    /**
     * Is current token match given kind
     * @param {SyntaxKinds} kind
     * @returns {boolean}
     */
    function match(kind: SyntaxKinds): boolean {
        return lexer.getToken() === kind;
    }
    /**
     * Is current token match any of given kinds
     * @param {Array<SyntaxKinds>} kinds 
     * @returns {boolean}
     */
    function matchSet(kinds: SyntaxKinds[]): boolean {
        return kinds.find(value => match(value)) > 0;
    }
    /**
     * Move to next token and return next token
     * @returns {SyntaxKinds}
     */
    function nextToken(): SyntaxKinds {
        return lexer.nextToken();
    }
    /**
     * Get current token in token stream
     * @returns {SyntaxKinds}
     */
    function getToken(): SyntaxKinds {
        return lexer.getToken();
    }
    /**
     * Get string value of current token
     * @returns {string}
     */
    function getValue(): string {
        return lexer.getSourceValue();
    }
    /**
     * Get next token but do not move to next token
     * @returns {SyntaxKinds}
     */
    function lookahead(): SyntaxKinds {
        return lexer.lookahead();
    }
    /**
     * expect a token kind, if it is, return token,
     * and move to next token
     * @return {SyntaxKinds}
     */
    function expect(kind: SyntaxKinds, message = ""): SyntaxKinds {
        if(match(kind)) {
            const kind = getToken();
            nextToken();
            return kind;
        }
        throw createUnexpectError(kind, message);
    }
    /**
     * Given that this parser is recurive decent parser, some
     * function must call with some start token, if function call
     * with unexecpt start token, it should throw this error.
     * @param {Array<SyntaxKinds>} startTokens
     * @returns {void}
     */
    function expectGuard(startTokens: Array<SyntaxKinds>, shouldEat: boolean = true): void {
        if(!matchSet(startTokens)) {
            throw createUnreachError(startTokens);
        }
        if(shouldEat) {
            nextToken();
        }
    }
    /**
     * Create a Message error from parser's error map.
     * @param {string} messsage 
     */
    function createMessageError(messsage: string) {
        return new Error(`[Syntax Error]: ${messsage}`);
    }
    /**
     * Create a error object with message tell developer that get a 
     * unexpect token.
     * @param {SyntaxKinds} expectToken 
     * @param {string?} messsage 
     * @returns {Error}
     */
    function createUnexpectError(expectToken: SyntaxKinds | null, messsage: string = ""): Error {
        return new Error(`[Syntax Error]: Unexpect token${expectToken ? `, expect ${expectToken}` : ""}, got ${getToken()}(${getValue()}).${messsage}`);
    }
    /**
     * Given that this parser is recurive decent parser, some
     * function must call with some start token, if function call
     * with unexecpt start token, it should throw this error.
     * @param {Array<SyntaxKinds>} startTokens
     * @returns {Error}
     */
    function createUnreachError(startTokens: Array<SyntaxKinds> = []): Error {
        let message = `[Unreach Zone]: this piece of code should not be reach, have a unexpect token ${getToken()} (${getValue()}).`;
        if(startTokens.length !== 0) {
                message += " it should call with start token["
                for(const token of startTokens) {
                    message += `${token}, `;
                }
                message += "]"
        }
        message += ", please report to developer.";
        return new Error(message);
    }
/** ==================================================
 *  Top level parse function 
 *  ==================================================
 */
    function parseProgram() {
        const body = [];
        while(!match(SyntaxKinds.EOFToken)) {
            body.push(parseModuleItem());
        }
        return factory.createProgram(body);
    }
    function parseModuleItem(): ModuleItem {
        const token = getToken();
        switch(token) {
            case SyntaxKinds.ImportKeyword:
                if(lookahead() === SyntaxKinds.DotOperator || lookahead () === SyntaxKinds.ParenthesesLeftPunctuator) {
                    return parseStatementListItem();
                }
                return parseImportDeclaration();
            case SyntaxKinds.ExportKeyword:
                return parseExportDeclaration();
            default:
                return parseStatementListItem();
        }
    }
    function parseStatementListItem(): StatementListItem {
        const token = getToken();
        switch(token) {
            // 'aync' maybe is
            // 1. aync function  -> declaration
            // 2. aync arrow function -> statement(expressionStatement)
            // 3. identifer -> statement (expressionStatement)
            case SyntaxKinds.Identifier:
                if(getValue() === "async" && lookahead() === SyntaxKinds.FunctionKeyword) {
                    return parseDeclaration();
                }
                return parseStatement();
            case SyntaxKinds.ConstKeyword:
            case SyntaxKinds.LetKeyword:
            case SyntaxKinds.FunctionKeyword: 
            case SyntaxKinds.ClassKeyword:
                return parseDeclaration();
            default:
                return parseStatement();
        }
    }
    /**
     * Parse Declaration
     * 
     * ```
     *  Declaration := ('let' | 'const') BindingLst
     *              := FunctionDeclaration
     *              := FunctionGeneratorDeclaration
     *              := 'async' FunctionDeclaration
     *              := 'async' FunctionGeneratorDeclaration
     *              := ClassDeclaration
     * ```
     * when call parseDeclaration, please make sure currentToken is
     * - `let` or `const` keyword
     * - `function` keyword
     * - `class` keyword
     * - `async` with `function` keyword 
     * 
     * ref: https://tc39.es/ecma262/#prod-Declaration
     * @returns 
     */
    function parseDeclaration(): Declaration {
        const token = getToken();
        switch(token) {
            // async function declaration
            case SyntaxKinds.Identifier:
                if(match(SyntaxKinds.Identifier) && getValue() === "async") {
                    nextToken();
                    context.inAsync = true;
                    const funDeclar = parseFunctionDeclaration();
                    context.inAsync = false;
                    return funDeclar;
                } else {
                   throw createUnreachError();
                }
            // function delcaration
            case SyntaxKinds.FunctionKeyword: 
                return parseFunctionDeclaration();
            case SyntaxKinds.ConstKeyword:
            case SyntaxKinds.LetKeyword:
                return parseVariableDeclaration();
            case SyntaxKinds.ClassKeyword:
                return parseClassDeclaration();
            default:
                throw createUnreachError([SyntaxKinds.ClassKeyword, SyntaxKinds.FunctionKeyword, SyntaxKinds.LetKeyword, SyntaxKinds.ConstKeyword]);
        }
    }
    /**
     * ref: https://tc39.es/ecma262/#prod-Statement
     */
    function parseStatement(): Statement {
        const token = getToken();
        switch(token) {
            case SyntaxKinds.SwitchKeyword:
                return parseSwitchStatement();
            case SyntaxKinds.ContinueKeyword:
                return parseContinueStatement();
            case SyntaxKinds.BreakKeyword:
                return parseBreakStatement();
            case SyntaxKinds.ReturnKeyword:
                return parseReturnStatement();
            case SyntaxKinds.BracesLeftPunctuator:
                return parseBlockStatement();
            case SyntaxKinds.TryKeyword:
                return parseTryStatement();
            case SyntaxKinds.ThrowKeyword:
                return parseThrowStatement();
            case SyntaxKinds.WithKeyword:
                return parseWithStatement();
            case SyntaxKinds.DebuggerKeyword:
                return parseDebuggerStatement();
            case SyntaxKinds.IfKeyword:
                return parseIfStatement();
            case SyntaxKinds.ForKeyword:
                return parseForStatement();
            case SyntaxKinds.WhileKeyword:
                return parseWhileStatement();
            case SyntaxKinds.DoKeyword:
                return parseDoWhileStatement();
            case SyntaxKinds.VarKeyword:
                return parseVariableDeclaration();
            default:
                if(getValue() === "async") {
                    nextToken();
                    context.inAsync = true;
                    let statement: Statement | undefined;
                    if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
                        context.maybeArrow = true;
                        const arrowExpr = parseCoverExpressionORArrowFunction();
                        context.maybeArrow = false;
                        statement = factory.createExpressionStatement(arrowExpr);
                    }else {
                        statement = factory.createExpressionStatement(factory.createIdentifier("async"));
                    }
                    context.inAsync = false;
                    return statement;
                }
                if(match(SyntaxKinds.Identifier)  && lookahead() === SyntaxKinds.ColonPunctuator ) {
                    return parseLabeledStatement();
                }
                return parseExpressionStatement();
        }
    }
/** =================================================================
 * Parse Statement
 * entry point reference: https://tc39.es/ecma262/#prod-Statement
 * ==================================================================
 */
    /**
     * 
     */
   function parseForStatement(): ForStatement | ForInStatement | ForOfStatement {
        expectGuard([SyntaxKinds.ForKeyword]);
        let isAwait = false, leftOrInit: VariableDeclaration | Expression | null = null;
        if(match(SyntaxKinds.AwaitKeyword)) {
            nextToken();
            isAwait = true;
        }
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        if(matchSet([SyntaxKinds.LetKeyword, SyntaxKinds.ConstKeyword, SyntaxKinds.VarKeyword])) {
            leftOrInit = parseVariableDeclaration();
        }else if (match(SyntaxKinds.SemiPunctuator)) {
            leftOrInit = null;
        }else {
            leftOrInit = parseExpression();
        }
        // branch
        if(match(SyntaxKinds.SemiPunctuator)) {
            // ForStatement
            nextToken();
            let test: Expression | null = null, update: Expression | null = null;
            if(!match(SyntaxKinds.SemiPunctuator)) {
                test = parseExpression();
            }
            if(!match(SyntaxKinds.SemiPunctuator)) {
                throw createUnexpectError(SyntaxKinds.SemiPunctuator, "for statement test expression must concat a semi");
            }
            nextToken();
            if(!match(SyntaxKinds.ParenthesesRightPunctuator)) {
                update = parseExpression();
            }
            expect(SyntaxKinds.ParenthesesRightPunctuator)
            const body = parseStatement();
            console.log(body);
            return factory.createForStatement(body,leftOrInit, test, update);
        }else if (match(SyntaxKinds.InKeyword)) {
            // ForInStatement
            nextToken();
            const right = parseAssigmentExpression();
            expect(SyntaxKinds.ParenthesesRightPunctuator);
            const body = parseStatement();
            return factory.createForInStatement(leftOrInit, right, body);
        }else if(getValue() === "of") {
            // ForOfStatement
            nextToken();
            const right = parseAssigmentExpression();
            expect(SyntaxKinds.ParenthesesRightPunctuator);
            const body = parseStatement();
            return factory.createForOfStatement(isAwait,leftOrInit, right, body);
        }
   }
   function parseIfStatement(): IfStatement {
      expectGuard([SyntaxKinds.IfKeyword]);
      expect(SyntaxKinds.ParenthesesLeftPunctuator);
      const test = parseExpression();
      expect(SyntaxKinds.ParenthesesRightPunctuator);
      const consequnce = parseStatement();
      if(match(SyntaxKinds.ElseKeyword)) {
        nextToken();
        const alter = parseStatement();
        return factory.createIfStatement(test, consequnce, alter);
      }
      return factory.createIfStatement(test, consequnce);
   }
   function parseWhileStatement(): WhileStatement {
        expectGuard([SyntaxKinds.WhileKeyword]);
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const test = parseExpression();
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        const body = parseStatement();
        return factory.createWhileStatement(test, body);
    }
    function parseDoWhileStatement(): DoWhileStatement {
        expectGuard([SyntaxKinds.DoKeyword]);
        const body = parseStatement();
        expect(SyntaxKinds.WhileKeyword, "do while statement should has while condition");
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const test = parseExpression();
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        return factory.createDoWhileStatement(test, body);
    }
   function parseBlockStatement() {
        expectGuard([SyntaxKinds.BracketLeftPunctuator]);
        const body: Array<StatementListItem> = [];
        while(!match(SyntaxKinds.BracesRightPunctuator) &&  !match(SyntaxKinds.EOFToken) ) {
            body.push(parseStatementListItem());
        }
        expect(SyntaxKinds.BracketRightPunctuator, "block statement must wrapped by bracket");
        return factory.createBlockStatement(body);
   }
   function parseSwitchStatement() {
        expectGuard([SyntaxKinds.SwitchKeyword]);
        nextToken();
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const discriminant = parseExpression();
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        if(!match(SyntaxKinds.BracesLeftPunctuator)) {
            throw createUnexpectError(SyntaxKinds.BracesLeftPunctuator, "switch statement should has cases body");
        }
        const cases = parseSwitchCases();
        return factory.createSwitchStatement(discriminant, cases);
    
   }
   function parseSwitchCases(): Array<SwitchCase>  {
        expectGuard([SyntaxKinds.BracketLeftPunctuator]);
        const cases: Array<SwitchCase> = [];
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            let test: Expression | null = null;
            if(match(SyntaxKinds.CaseKeyword)) {
                nextToken();
                test = parseExpression();
            } else if(match(SyntaxKinds.DefaultKeyword)) {
                nextToken();
            }
            expect(SyntaxKinds.ColonPunctuator, "switch case should has colon")
            const consequence: Array<StatementListItem> = []
            while(!matchSet([SyntaxKinds.BracesRightPunctuator, SyntaxKinds.EOFToken, SyntaxKinds.CaseKeyword, SyntaxKinds.DefaultKeyword])) {
                consequence.push(parseStatementListItem());
            }
            if(match(SyntaxKinds.EOFToken)) {
                throw createMessageError("switch case should wrapped by braces");
            }
            cases.push(factory.createSwitchCase(test, consequence));
        }
        if(match(SyntaxKinds.EOFToken)) {
            throw createMessageError("switch statement should wrapped by braces");
        }
        // TODO: multi default
        nextToken();
        return cases;
   }
   function parseContinueStatement(): ContinueStatement {
        expectGuard([SyntaxKinds.ContinueKeyword]);
        if(match(SyntaxKinds.Identifier)) {
            return factory.createContinueStatement(parseIdentifer());
        }
        return factory.createContinueStatement();
   }
   function parseBreakStatement(): BreakStatement {
        expectGuard([SyntaxKinds.BreakKeyword]);
        if(match(SyntaxKinds.Identifier)) {
            return factory.createBreakStatement(parseIdentifer());
        }
        return factory.createBreakStatement();
   }
   function parseLabeledStatement(): LabeledStatement {
        if(!match(SyntaxKinds.Identifier) || lookahead() !== SyntaxKinds.ColonPunctuator) {
            // TODO: unreach
        }
        const label = parseIdentifer();
        expect(SyntaxKinds.ColonPunctuator);
        if(match(SyntaxKinds.FunctionKeyword)) {
            return factory.createLabeledStatement(label, parseFunctionDeclaration());
        }else {
            return factory.createLabeledStatement(label, parseStatement());
        }
   } 
   function parseReturnStatement(): ReturnStatement {
       expectGuard([SyntaxKinds.ReturnKeyword]);
       // TODO: make it can predi expression
       if(match(SyntaxKinds.Identifier)) {
            return factory.createReturnStatement(parseExpression());
       }
       return factory.createReturnStatement(null);
   }
   function parseTryStatement(): TryStatement {
        expectGuard([SyntaxKinds.TryKeyword]);
        const body = parseBlockStatement();
        let handler: CatchClause | null = null, finalizer: BlockStatement | null = null;
        if(match(SyntaxKinds.CatchKeyword)) {
            nextToken();
            if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
                nextToken();
                const param = parseBindingElement();
                expect(SyntaxKinds.ParenthesesRightPunctuator);
                handler = factory.createCatchClause( param , parseBlockStatement());
            }else {
                handler = factory.createCatchClause(null, parseBlockStatement());
            }
        }
        if(match(SyntaxKinds.FinallyKeyword)) {
            nextToken();
            finalizer = parseBlockStatement();
        }
        return factory.createTryStatement(body, handler, finalizer);
   }
   function parseThrowStatement() {
      expectGuard([SyntaxKinds.ThrowKeyword]);
      return factory.createThrowStatement(parseExpression());
   }
   function parseWithStatement(): WithStatement {
        expectGuard([SyntaxKinds.WithKeyword]);
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const object = parseExpression();
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        const body = parseStatement();
        return factory.createWithStatement(object, body);
   }
   function parseDebuggerStatement(): DebuggerStatement {
       expectGuard([SyntaxKinds.DebuggerKeyword]);
       return factory.createDebuggerStatement();
   }
/** =================================================================
 * Parse Delcarations
 * entry point reference: https://tc39.es/ecma262/#prod-Declaration
 * ==================================================================
 */
    /**
     * 
     * @returns {VariableDeclaration}
     */
    function parseVariableDeclaration():VariableDeclaration {
        if(!matchSet([SyntaxKinds.VarKeyword, SyntaxKinds.ConstKeyword,SyntaxKinds.LetKeyword])) {
            throw createUnreachError([SyntaxKinds.VarKeyword, SyntaxKinds.ConstKeyword,SyntaxKinds.LetKeyword]);
        }
        const variant = getValue() as VariableDeclaration['variant'];
        nextToken();
        let shouldStop = false, isStart = true;
        const declarations: Array<VariableDeclarator> = [];
        while(!shouldStop) {
            if(isStart) {
                isStart = false;
            }else {
                if(!match(SyntaxKinds.CommaToken)) {
                    shouldStop = true;
                    continue;
                }
                nextToken();
            }
            // parseBindingElement is not equal to parseBindingPattern or identifier
            let id: Pattern ;
            if(match(SyntaxKinds.Identifier)) {
                id = parseIdentifer();
            }else {
                id = parseBindingPattern();
            }
            if(match(SyntaxKinds.AssginOperator)) {
                nextToken();
                const init = parseAssigmentExpression();
                declarations.push(factory.createVariableDeclarator(id, init));
                continue;
            }
            declarations.push(factory.createVariableDeclarator(id, null));
        }
        return factory.createVariableDeclaration(declarations, variant);
    }
    function parseFunctionDeclaration() {
        const func = parseFunction();
        if(func.name === null) {
            throw createMessageError("Function name of FunctionDeclaration can not be null");
        }
        return factory.transFormFunctionToFunctionDeclaration(func);
    }
    /**
     * 
     * @returns 
     */
    function parseFunction() {
        expectGuard([SyntaxKinds.FunctionKeyword]);
        let generator = false;
        if(match(SyntaxKinds.MultiplyOperator)) {
            generator = true;
            nextToken();
        }
        let name: Identifier | null = null;
        if(match(SyntaxKinds.Identifier)) {
            name = factory.createIdentifier(getValue());
            nextToken();
        }
        const params = parseFunctionParam();
        const body = parseFunctionBody();
        return factory.createFunction(name, body, params, generator, context.inAsync);
    }
    /**
     * Parse Function Body
     * ```
     *  FunctionBody  := '{' StatementList '}'
     *  StatementList := StatementList StatementListItem
     *                := StatementListItem 
     * ```
     * @return {FunctionBody}
     */
    function parseFunctionBody(): FunctionBody {
        expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        const body : Array<StatementListItem>= [];
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            body.push(parseStatementListItem());
        }
        if(match(SyntaxKinds.EOFToken)) {
            throw createUnexpectError(SyntaxKinds.BracesLeftPunctuator);
        }
        nextToken();
        return factory.createFunctionBody(body);
    }
    /**
     * Parse Function Params
     * ```
     * FunctionParams := '(' FunctionParamsList ')'
     *                := '(' FunctionParamsList ',' ')' 
     *                := '(' FunctionPramsList ',' RestElement ')'
     *                := '(' RestElement ')'
     * FunctiinParamList := FunctionParamList ',' FunctionParam
     *                   := FunctionParam
     * FunctionParam := BindingElement
     * ```
     */
    function parseFunctionParam(): Array<Pattern> {
        expectGuard([SyntaxKinds.ParenthesesLeftPunctuator]);
        let isStart = true;
        let isEndWithRest = false;
        const params: Array<Pattern> = [];
        while(!match(SyntaxKinds.ParenthesesRightPunctuator)) {
            if(isStart) {
                isStart = false;
            }else {
                expect(SyntaxKinds.CommaToken)
            }
            if(match(SyntaxKinds.ParenthesesRightPunctuator)) {
                continue;
            }
            // parse SpreadElement (identifer, Object, Array)
            if(match(SyntaxKinds.SpreadOperator)) {
                isEndWithRest = true;
                params.push(parseRestElement());
                break;
            }
            params.push(parseBindingElement());
        }
        if(!match(SyntaxKinds.ParenthesesRightPunctuator)) {
            if(isEndWithRest && match(SyntaxKinds.CommaToken)) {
                throw createMessageError(ErrorMessageMap.rest_element_can_not_end_with_comma);
            }
            throw createUnexpectError(SyntaxKinds.ParenthesesRightPunctuator, "params list must end up with ParenthesesRight");
        }   
        nextToken();
        return params;
    }
    /**
     * 
     */
    function parseClassDeclaration(): ClassDeclaration {
        expectGuard([SyntaxKinds.ClassKeyword]);
        const classDelcar = parseClass();
        if(classDelcar.id === null) {
            throw createMessageError("class declaration must have class id");
        }
        return factory.transFormClassToClassDeclaration(classDelcar);
    }
    /**
     * Parse Class
     * ```
     * Class := 'class' identifer ('extends' LeftHandSideExpression) ClassBody
     * ```
     * @returns {Class}
     */
    function parseClass(): Class {
        expectGuard([SyntaxKinds.ClassKeyword]);
        let name: Identifier | null = null;
        if(match(SyntaxKinds.Identifier)) {
            name = parseIdentifer();
        }
        // TODO: parse ClassExtends
        return factory.createClass(name, null, parseClassBody());
    }
    /** 
     * Parse ClassBody
     * ```
     *  ClassBody := '{' [ClassElement] '}'
     * ```
     * @return {ClassBody}
     */
    function parseClassBody(): ClassBody {
        expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        const classbody: ClassBody['body'] = []
        while(!match(SyntaxKinds.BracesRightPunctuator) && ! match(SyntaxKinds.EOFToken)) {
            classbody.push(parseClassElement());
        }
        expect(SyntaxKinds.BracesRightPunctuator);
        return factory.createClassBody(classbody);
    }
    /**
     * Parse ClassElement
     * ```
     * ClassElement := MethodDefinition
     *              := 'static' MethodDefinition
     *              := FieldDefintion
     *              := 'static' FieldDefintion
     *              := ClassStaticBlock
     * FieldDefintion := ClassElementName ('=' AssignmentExpression)?
     * ```
     * - frist, parse 'static' keyword if possible, next follow cases
     *   1. start with some method modifier like 'set', 'get', 'async', '*' must be methodDefintion
     *   2. start with '{', must be static block
     * - then parse ClassElement
     *    1. if next token is '(', must be MethodDefintion,
     *    2. else this only case is FieldDefinition with init or not. 
     * @returns {ClassElement}
     */
    function parseClassElement(): ClassElement {
        // parse static modifier
        let isStatic = false;
        if(getValue() === "static") {
            nextToken();
            isStatic = true;
        }    
        if(getValue() === "set" || getValue() === "get" || getValue() === "async" || match(SyntaxKinds.MultiplyOperator)) {
            return parseMethodDefintion(true, undefined, isStatic) as ClassMethodDefinition;
        }
        if(match(SyntaxKinds.BracesLeftPunctuator)) {
            // TODO: parse static block
        }
        // parse ClassElementName 
        const isComputedRef = { isComputed: false };
        let key: PropertyName | PrivateName | undefined;
        if(match(SyntaxKinds.PrivateName)) {
            key = parsePrivateName();
        }else {
            key = parsePropertyName(isComputedRef);
        }
        if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            return parseMethodDefintion(true, key, isStatic) as ClassMethodDefinition;
        }
        if(matchSet([SyntaxKinds.AssginOperator])) {
            nextToken();
            return factory.createClassProperty(key, parseAssigmentExpression(), isComputedRef.isComputed, isStatic, false);
        }
        return factory.createClassProperty(key, undefined, isComputedRef.isComputed, isStatic, true);

    }
/** ====================================================================
 *  Parse Expression 
 *  entry point reference : https://tc39.es/ecma262/#sec-comma-operator
 * =====================================================================
 */
    function parseExpressionStatement() {
        return factory.createExpressionStatement(parseExpression());
    }
    function parseExpression(): Expression {
        const exprs = [parseAssigmentExpression()];
        while(match(SyntaxKinds.CommaToken)) {
            exprs.push(parseAssigmentExpression());
        }
        if(exprs.length === 1) {
            return exprs[0];
        }
        return factory.createSequenceExpression(exprs);
    }
    function parseAssigmentExpression(): Expression {
        if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            context.maybeArrow = true;
        }
        const left = parseConditionalExpression();
        if (!matchSet(AssigmentOperators)) {
            return left;
        }
        const operator = nextToken();
        const right = parseAssigmentExpression();
        return factory.createAssignmentExpression(left, right, operator as AssigmentOperatorKinds);
    }
    function parseConditionalExpression(): Expression {
        const test = parseBinaryExpression();
        if(!match(SyntaxKinds.QustionOperator)) {
            return test;
        }
        nextToken();
        const conseq = parseBinaryExpression();
        if(!match(SyntaxKinds.ColonPunctuator)) {
            throw createUnexpectError(SyntaxKinds.ColonPunctuator, "conditional operator must and conseq and alter case");
        }
        nextToken();
        const alter = parseBinaryExpression();
        return factory.createConditionalExpression(test, conseq, alter);
    }
    function parseBinaryExpression(): Expression {
        const atom = parseUnaryExpression();
        if(matchSet(BinaryOperators)) {
            return parseBinaryOps(atom);
        }
        return atom;
    }
    function parseBinaryOps(left: Expression , lastPre = 0): Expression {
        while(1) {
            const currentOp = getToken();
            if(!isBinaryOps(currentOp) || getBinaryPrecedence(currentOp) < lastPre) {
                break;
            }
            nextToken();
            let right = parseUnaryExpression();
            const nextOp = getToken();
            if(isBinaryOps(nextOp) && (getBinaryPrecedence(nextOp) > getBinaryPrecedence(currentOp))) {
                right =  parseBinaryOps(right, getBinaryPrecedence(nextOp));
            }
            left = factory.createBinaryExpression(left, right, currentOp as BinaryOperatorKinds);
        }
        return left;
    }
    function parseUnaryExpression(): Expression {
        if(matchSet(UnaryOperators)) {
            const operator = getToken() as UnaryOperatorKinds;
            nextToken();
            const argument = parseUnaryExpression();
            return factory.createUnaryExpression(argument, operator)
        }
        if(match(SyntaxKinds.AwaitKeyword)) {
            nextToken();
            const argu = parseUnaryExpression();
            return factory.createAwaitExpression(argu);
        }
        return parseUpdateExpression();
    }
    function parseUpdateExpression(): Expression {
        if(matchSet(UpdateOperators)) {
            const operator = nextToken() as UpdateOperatorKinds;
            const argument = parseLeftHandSideExpression();
            return factory.createUpdateExpression(argument, operator, true);
        }
        const argument = parseLeftHandSideExpression();
        if(matchSet(UpdateOperators)) {
            const operator = nextToken() as UpdateOperatorKinds;
            factory.createUpdateExpression(argument, operator, false);
        }
        return argument;
    }
    /**
     * Parse Left hand side Expression
     * ```
     *  LeftHandSideExpression := Atoms '?.' CallExpression
     *                         := Atoms '?.' MemberExpression
     *                         := Atoms TagTemplateExpression
     * // notes: this syntax is reference babel function, which is simplify original syntax of TS39
     * // notes: 'this' and super 'super' would be meanful when apper at start of atoms, which can be handle by parseAtoms.
     * // notes: NewExpression is a spacial case , because it can not using optionalChain, so i handle it into a atom.
     * ```
     * @returns {Expression}
     */
    function parseLeftHandSideExpression(): Expression {
        let base = parsePrimaryExpression();
        let shouldStop = false;
        let hasOptional = false;
        while(!shouldStop) {
            let optional = false;
            if(match(SyntaxKinds.QustionDotOperator)) {
                optional = true;
                hasOptional = true;
                nextToken();
            }
            if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
                // callexpression
                base = parseCallExpression(base, optional);
            }
            else if (match(SyntaxKinds.DotOperator) || match(SyntaxKinds.BracketLeftPunctuator) || optional) {
                // memberexpression 
                base = parseMemberExpression(base, optional);
            }
            else if (match(SyntaxKinds.TemplateHead) || match(SyntaxKinds.TemplateNoSubstitution)) {
                // tag template expressuin
                if(optional) {
                    throw createMessageError(ErrorMessageMap.tag_template_expression_can_not_use_option_chain);
                }
                base = parseTagTemplateExpression(base);
            }
            else {
                shouldStop = true;
            }
        }
        if(hasOptional) {
            return factory.createChainExpression(base);
        }
        return base;
    }
    /**
     * Parse CallExpression 
     * ```
     * CallExpresion := GivenBase(base, optional) '(' Arguments ')'
     * ```
     * @param {Expression} callee base expression 
     * @param {boolean} optional is this call optional ?
     * @returns {Expression}
     */
    function parseCallExpression(callee: Expression, optional: boolean): Expression {
        if(!match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            throw createUnreachError([SyntaxKinds.ParenthesesLeftPunctuator]);
        }
        const callerArguments = parseArguments();
        return {
            kind: SyntaxKinds.CallExpression,
            callee,
            arguments: callerArguments, optional
        }
    }
    /**
     * Parse Arguments
     * ```
     * Arguments := '(' ArgumentList ')'
     * ArgumentList := ArgumentList AssigmentExpression
     *              := ArgumentList SpreadElement
     *              := AssignmentExpression
     *              := SpreadElement
     * ```
     * @returns {Array<Expression>}
     */
    function parseArguments(): Array<Expression> {
        expectGuard([SyntaxKinds.ParenthesesLeftPunctuator]);
        let isStart = true;
        let shouldStop = false;
        // TODO: refactor logic to remove shoulStop
        const callerArguments: Array<Expression> = [];
        while(!shouldStop && !match(SyntaxKinds.ParenthesesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            if(isStart) {
                isStart = false
            } else {
                expect(SyntaxKinds.CommaToken);
            }
            // case 1: ',' following by ')'
            if(match(SyntaxKinds.ParenthesesRightPunctuator)) {
                shouldStop = true;
                continue;
            }
            // case 2: ',' following by SpreadElement, maybe follwed by ','
            if(match(SyntaxKinds.SpreadOperator)) {
                nextToken();
                callerArguments.push({
                    kind: SyntaxKinds.SpreadElement,
                    argument: parseAssigmentExpression(),
                })
                if(match(SyntaxKinds.CommaToken)) {
                    nextToken();
                }
                shouldStop = true;
                continue;
            }
            // case 3 : ',' AssigmentExpression
            callerArguments.push(parseAssigmentExpression());
        }
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        return callerArguments;
    }
    /**
     * Parse MemberExpression with base
     * ```
     * MemberExpression := GivenBase(base ,optional) '.' IdentiferWithKeyword
     *                  := GivenBase(base, optional) '[' Expreession ']'
     *                  := GivenBase(base, optional) IdentiferWithKeyword
     * // for last condition, optional prope must be True
     * ```
     * @param {Expression} base base expression
     * @param {boolean} optional is base expression contain a optional
     * @returns {Expression}
     */
    function parseMemberExpression(base: Expression, optional: boolean): Expression {
        if(!match(SyntaxKinds.DotOperator) && !match(SyntaxKinds.BracketLeftPunctuator) && !optional) {
            throw createUnreachError([SyntaxKinds.DotOperator, SyntaxKinds.BracesLeftPunctuator]);
        }
        if(match(SyntaxKinds.DotOperator)) {
            nextToken();
            const property = parseIdentiferWithKeyword();
            return factory.createMemberExpression(false, base, property, optional);
        }
        else if(match(SyntaxKinds.BracesLeftPunctuator)){
            nextToken();
            const property = parseExpression();
            if(!match(SyntaxKinds.BracketRightPunctuator)) {
                throw createUnexpectError(SyntaxKinds.BracesRightPunctuator);
            }
            nextToken();
            return factory.createMemberExpression(true, base, property, optional);
        }else {
            const property = parseIdentiferWithKeyword();
            return factory.createMemberExpression(false, base, property, optional);
        }
    }
    function parseTagTemplateExpression(base: Expression) {
        const quasi = parseTemplateLiteral();
        return factory.createTagTemplateExpression(base, quasi);

    }
    function parsePrimaryExpression(): Expression {
        switch(getToken()) {
            case SyntaxKinds.NumberLiteral:
                return parseNumberLiteral();
            case SyntaxKinds.StringLiteral:
                return parseStringLiteral();
            case SyntaxKinds.TemplateHead:
            case SyntaxKinds.TemplateNoSubstitution:
                return parseTemplateLiteral();
            // TODO import call
            case SyntaxKinds.ImportKeyword:
                return parseImportMeta();
            case SyntaxKinds.NewKeyword:
                const lookaheadToken = lookahead();
                if(lookaheadToken === SyntaxKinds.DotOperator) {
                    return parseNewTarget();
                }
                return parseNewExpression();
            case SyntaxKinds.SuperKeyword:
                return parseSuper();
            case SyntaxKinds.ThisKeyword:
                return parseThisExpression();
            case SyntaxKinds.BracesLeftPunctuator:
                return parseObjectExpression();
            case SyntaxKinds.BracketLeftPunctuator:
                return parseArrayExpression();
            case SyntaxKinds.FunctionKeyword:
                return parseFunctionExpression();
            case SyntaxKinds.ClassKeyword:
                return parseClassExpression();
            case SyntaxKinds.ParenthesesLeftPunctuator:
                return parseCoverExpressionORArrowFunction();
            // TODO: consider wrap as function or default case ?
            case SyntaxKinds.PrivateName:
                return parsePrivateName();
            case SyntaxKinds.Identifier: {
                if(lookahead() === SyntaxKinds.ArrowOperator) {
                    const argus = [factory.createIdentifier(getValue())];
                    nextToken();
                    return parseArrowFunctionExpression(argus);
                }
                return parseIdentifer();
            }
            default:
                throw createUnexpectError(null);
        }
    }
    function parseIdentifer(): Identifier {
        if(getToken() !== SyntaxKinds.Identifier) {
            throw createUnreachError([SyntaxKinds.Identifier]);
        }
        const name = getValue();
        nextToken();
        return factory.createIdentifier(name);
    }
    function parseIdentiferWithKeyword() {
        if(!matchSet([SyntaxKinds.Identifier,...Keywords])) {
            throw createUnreachError( [SyntaxKinds.Identifier,...Keywords]);
        }
        const name = getValue();
        nextToken();
        return factory.createIdentifier(name);
    }
    function parsePrivateName() {
        if(!match(SyntaxKinds.PrivateName)) {
            throw createUnreachError([SyntaxKinds.PrivateName]);
        }
        const name = getValue();
        nextToken();
        return factory.createPrivateName(name);
    }
    function parseNumberLiteral() {
        if(!match(SyntaxKinds.NumberLiteral)) {
            throw createUnreachError([SyntaxKinds.NumberLiteral]);
        }
        const value = getValue();
        nextToken();
        return factory.createNumberLiteral(value);
    }
    function parseStringLiteral() {
        if(!match(SyntaxKinds.StringLiteral)) {
            throw createUnreachError([SyntaxKinds.StringLiteral]);
        }
        const value = getValue();
        nextToken();
        return factory.createStringLiteral(value);
    }
    function parseTemplateLiteral() {
        if(!matchSet([SyntaxKinds.TemplateHead, SyntaxKinds.TemplateNoSubstitution])) {
            throw createUnreachError([SyntaxKinds.TemplateHead, SyntaxKinds.TemplateNoSubstitution]);
        }
        if(match(SyntaxKinds.TemplateNoSubstitution)) {
            const value = getValue();
            nextToken();
            return factory.createTemplateLiteral([factory.createTemplateElement(value, true)], []);
        }
        nextToken();
        const expressions = [parseExpression()];
        const quasis: Array<TemplateElement> = [];
        while(!match(SyntaxKinds.TemplateTail) && match(SyntaxKinds.TemplateMiddle) && !match(SyntaxKinds.EOFToken)) {
            quasis.push(factory.createTemplateElement(getValue(), false));
            nextToken();
            expressions.push(parseExpression());
        }
        if(match(SyntaxKinds.EOFToken)) {
            throw createUnexpectError(SyntaxKinds.BracesLeftPunctuator);
        }
        quasis.push(factory.createTemplateElement(getValue(), true));
        nextToken();
        return factory.createTemplateLiteral(quasis, expressions);

    }
    function parseImportMeta() {
        expectGuard([SyntaxKinds.ImportKeyword]);
        expect(SyntaxKinds.DotOperator);
        const property = parseIdentifer();
        return factory.createMetaProperty(factory.createIdentifier("import"), property);
    }
    function parseNewTarget() {
        expectGuard([SyntaxKinds.NewKeyword]);
        expect(SyntaxKinds.DotOperator);
        if(getValue() !== "target") {
            throw createUnexpectError(SyntaxKinds.Identifier, "new concat with dot should only be used in meta property");
        }
        nextToken();
        return factory.createMetaProperty(factory.createIdentifier("new"), factory.createIdentifier("target"));
    }
    /**
     * Parse New Expression
     * new expression is a trick one, because is not always right to left, 
     * for a new expression, last the rightest component must be a CallExpression,
     * and before that CallExpression, it can be a series of MemberExpression,
     * or event another NewExpression
     * ```
     * NewExpression := 'new' NewExpression
     *               := 'new' MemberExpressionWithoutOptional Arugment 
     * ```
     * @returns {Expression}
     */
    function parseNewExpression():Expression {
        expectGuard([SyntaxKinds.NewKeyword])
        if(match(SyntaxKinds.NewKeyword)) {
            return parseNewExpression();
        }
        let base = parsePrimaryExpression();
        // TODO: refactor this loop to with function -> parseNewExpressionCallee ?
        while(match(SyntaxKinds.DotOperator) || match(SyntaxKinds.BracketLeftPunctuator) || match(SyntaxKinds.QustionDotOperator)) {
            if(match(SyntaxKinds.QustionDotOperator)) {
                throw createMessageError(ErrorMessageMap.new_expression_cant_using_optional_chain);
            }
            base = parseMemberExpression(base, false);
        }
        return factory.createNewExpression(base, parseArguments());

    }
    function parseSuper() {
        expectGuard([SyntaxKinds.SuperKeyword]);
        return factory.createCallExpression(factory.createSuper(), [], false);
    }
    function parseThisExpression() {
        nextToken();
        return factory.createThisExpression();
    }
    /**
     * Parse ObjectLiterial
     * ```text
     *   ObjectLiteral := '{' PropertyDefinitionList ','? '}'
     *   PropertyDefinitionList := PropertyDefinitionList ',' PropertyDefinition
     *                          := PropertyDefinition
     * ```
     * @returns {Expression} actually is `ObjectExpression`
     */
    function parseObjectExpression(): Expression {
        expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        let isStart = true;
        const propertyDefinitionList = [];
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            if(isStart) {
                propertyDefinitionList.push(parsePropertyDefinition());
                isStart = false;
                continue;
            }
            expect(SyntaxKinds.CommaToken);
            if(match(SyntaxKinds.BracesRightPunctuator) || match(SyntaxKinds.EOFToken)) {
                break;
            }
            propertyDefinitionList.push(parsePropertyDefinition());
        }
        expect(SyntaxKinds.BracesRightPunctuator);
        return factory.createObjectExpression(propertyDefinitionList);
    }
    /**
     * Parse PropertyDefinition
     * ```
     *  PropertyDefinition := MethodDefintion
     *                     := Property
     *                     := SpreadElement
     * Property := PropertyName '=' AssignmentExpression
     * SpreadElement := '...' AssigmentExpression
     * ```
     * ### How to parse
     * - start with `...` operator, must be SpreadElment
     * - start with some method modifier like `set`, `get`, `async`, `*` must be MethodDefintion
     * then parse PropertyName frist
     *   - start with `(`, must be MethodDefintion
     *   - otherwise, is ObjectProperty with or without init. 
     * #### ref: https://tc39.es/ecma262/#prod-PropertyDefinition
     */
    function parsePropertyDefinition(): PropertyDefinition {
        // semantics check for private 
        if(match(SyntaxKinds.PrivateName)) {
            throw createMessageError(ErrorMessageMap.private_field_can_not_use_in_object);
        }
        // spreadElement
        if(match(SyntaxKinds.SpreadOperator)) {
            nextToken();
            return factory.createSpreadElement(parseAssigmentExpression());
        }
        // if token match '*', 'async', 'set', 'get' or privateName, is must be MethodDefintion
        if(getValue() === "set" || getValue() === "get" || getValue() === "async" || match(SyntaxKinds.MultiplyOperator)) {
            return parseMethodDefintion() as ObjectMethodDefinition;
        }
        // otherwise, it would be Property start with PropertyName or MethodDeinftion start with PropertyName 
        const isComputedRef = { isComputed: false };
        const propertyName = parsePropertyName(isComputedRef);
        if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            return parseMethodDefintion(false, propertyName) as ObjectMethodDefinition;
        }
        if(match(SyntaxKinds.ColonPunctuator)) {
            nextToken();
            return factory.createObjectProperty(propertyName, parseAssigmentExpression(), isComputedRef.isComputed, false);
        }
        return factory.createObjectProperty(propertyName, undefined, isComputedRef.isComputed, true);
    }
    /**
     * Parse PropertyName, using Context to record this property is computed or not.
     * ```
     * PropertyName := Identifer
     *              := NumberLiteral
     *              := StringLiteral
     *              := ComputedPropertyName
     * ComputedPropertyName := '[' AssignmentExpression ']'
     * ```
     * ref: https://tc39.es/ecma262/#prod-PropertyName
     * @returns {PropertyName}
     */
    function parsePropertyName(isComputedRef: { isComputed: boolean }): PropertyName {
        if(!matchSet([SyntaxKinds.Identifier, SyntaxKinds.BracketLeftPunctuator, SyntaxKinds.NumberLiteral, SyntaxKinds.StringLiteral])) {
            throw createUnreachError([SyntaxKinds.Identifier, SyntaxKinds.BracketLeftPunctuator, SyntaxKinds.NumberLiteral, SyntaxKinds.StringLiteral]);
        }
        if(match(SyntaxKinds.StringLiteral)) {
            return parseStringLiteral();
        }
        if(match(SyntaxKinds.NumberLiteral)) {
            return parseNumberLiteral();
        }
        if(match(SyntaxKinds.Identifier)) {
            return parseIdentifer();
        }
        nextToken();
        const expr = parseAssigmentExpression();
        if(match(SyntaxKinds.BracketRightPunctuator)) {
            nextToken();
            isComputedRef.isComputed = true;
            return expr;
        }
        throw createUnexpectError(SyntaxKinds.BracketRightPunctuator, "com");
    }
    /** Parse MethodDefintion
     * ```
     * MethodDefintion := ClassElementName BindingList FunctionBody
     *                 := AyncMethod
     *                 := GeneratorMethod
     *                 := AsyncGeneratorMethod
     *                 := 'set' ClassElementName BindingList FunctionBody
     *                 := 'get' ClassElementName '('')' FunctionBody
     * AyncMethod := 'async' ClassElementName BindingList FunctionBody
     * GeneratorMethod := '*' ClassElementName BindingList FunctionBody
     * AsyncGeneratorMethod := 'async' '*' ClassElementName BindingList FunctionBody
     * ClassElementName := PropertyName
     *                   := PrivateName
     * ```
     * this method should allow using when in class or in object literal, ClassElement can be PrivateName, when it 
     * used in object literal, it should throw a error.
     * @param {boolean} inClass is used in class or not. 
     * @param {PropertyNameundefined} withPropertyName parse methodDeinfition with exited propertyName or not
     * @returns {MethodDefinition}
     */
    function parseMethodDefintion(
        inClass: boolean = false, 
        withPropertyName: PropertyName | PrivateName | undefined = undefined, 
        isStatic: boolean = false
    ): ObjectMethodDefinition | ClassMethodDefinition {
        if(
            !(getValue() === "set" || getValue() === "get" || getValue() === "async" || match(SyntaxKinds.MultiplyOperator))
            && !withPropertyName
        ) {
            throw createUnreachError([SyntaxKinds.MultiplyAssignOperator, SyntaxKinds.Identifier]);
        }
        let type: MethodDefinition['type'] = "method";
        let isAsync: MethodDefinition['async'] = false;
        let generator: MethodDefinition['generator'] = false;
        let computed: MethodDefinition['computed'] = false;
        // if not with propertyName , parse modifier frist
        // otherwise, if with propertyName, it shouldn't do anything.
        if(!withPropertyName) {
            if(getValue() === "set") {
                // setter
                type = "set";
                nextToken();
            }
            else if(getValue() === "get") {
                // getter
                type = "get"
                nextToken();
            }
            else if(getValue() === "async") {
                // aync or aync generator
                isAsync = true;
                type = "method";
                nextToken();
                if(match(SyntaxKinds.MultiplyOperator)) {
                    nextToken();
                    generator = true;
                }
            }
            else if(match(SyntaxKinds.MultiplyOperator)) {
                // generator
                type = "method";
                generator = true;
                nextToken();
            }
            if(match(SyntaxKinds.PrivateName)) {
                withPropertyName = parsePrivateName();
            }else {
                const isComputedRef = { isComputed: false };
                withPropertyName = parsePropertyName(isComputedRef);
                computed = isComputedRef.isComputed
            }
        }
        const parmas = parseBindingElmentList();
        const body = parseFunctionBody();
        // semantics check and operation
        if(type === "get" && parmas.length > 0) {
            throw createMessageError(ErrorMessageMap.getter_should_never_has_params);
        }
        // object literal can has method which name is constructor, but in which case ,
        // is not a constructor method, it just a method name as constructor.
        if(withPropertyName.kind === SyntaxKinds.Identifier) {
            if(withPropertyName.name === "constructor" && context.inClass) {
                type = "constructor";
            }
        }
        if(inClass) {
            return factory.createClassMethodDefintion(withPropertyName, body, parmas, isAsync, type, generator, computed, isStatic);
        }
        return factory.createObjectMethodDefintion(withPropertyName, body, parmas, isAsync, type as ObjectMethodDefinition['type'], generator, computed);
    }
    function parseArrayExpression() {
        expectGuard([SyntaxKinds.BracketLeftPunctuator]);
        const elements: Array<Expression | null> = [];
        while(!match(SyntaxKinds.BracketRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            if(match(SyntaxKinds.CommaToken)) {
                nextToken();
                elements.push(null);
                continue;
            }
            const expr = parseAssigmentExpression();
            elements.push(expr);
            if(match(SyntaxKinds.CommaToken)) {
                nextToken();
            }
        }
        expect(SyntaxKinds.BracketRightPunctuator);
        return factory.createArrayExpression(elements);
    }
    function parseFunctionExpression() {
        return factory.transFormFunctionToFunctionExpression(parseFunction());
    }
    function parseClassExpression() {
        return factory.transFormClassToClassExpression(parseClass());
    }
    function parseCoverExpressionORArrowFunction() {
        if(!match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            throw createUnreachError([SyntaxKinds.ParenthesesLeftPunctuator]);
        }
        const maybeArguments = parseArguments();
        if(!context.maybeArrow || !match(SyntaxKinds.ArrowOperator)) {
            // transfor to sequence or signal expression
            if(maybeArguments.length === 1) {
                return maybeArguments[0];
            }
            return factory.createSequenceExpression(maybeArguments);
        }
        return parseArrowFunctionExpression(maybeArguments);
    }
    function parseArrowFunctionExpression(argus: Array<Expression>) {
        if(!match(SyntaxKinds.ArrowOperator)) {
            throw createUnexpectError(SyntaxKinds.ArrowOperator);
        }
        nextToken();
        let body: Expression | FunctionBody | undefined; 
        let isExpression = false;
        if(match(SyntaxKinds.BracesLeftPunctuator)) {
            body = parseFunctionBody();
        }else {
            body = parseExpression();
            isExpression = true;
        }
        return factory.createArrowExpression(isExpression, body, argus, context.inAsync);
    }
/** ================================================================================
 *  Parse Pattern
 *  entry point: https://tc39.es/ecma262/#sec-destructuring-binding-patterns
 * ==================================================================================
 */
    /**
     *  parse `'(' BindingElement? [',' BindingElement?]  ')'`
     *  TODO: deprecated
     */
    function parseBindingElmentList() {
        expectGuard([SyntaxKinds.ParenthesesLeftPunctuator]);
        let isStart = true;
        const params: Array<Pattern> = [];
        while(!match(SyntaxKinds.ParenthesesRightPunctuator)) {
            if(isStart) {
                isStart = false;
            }else {
                expect(SyntaxKinds.CommaToken)
            }
            if(match(SyntaxKinds.ParenthesesRightPunctuator)) {
                continue;
            }
            // parse SpreadElement (identifer, Object, Array)
            if(match(SyntaxKinds.SpreadOperator)) {
                nextToken();
                switch(getToken()) {
                    case SyntaxKinds.Identifier:
                        params.push(factory.createRestElement(parseIdentifer()));
                        break;
                    case SyntaxKinds.BracesLeftPunctuator:
                        params.push(factory.createRestElement(parseObjectExpression()));
                        break;
                    case SyntaxKinds.BracketLeftPunctuator:
                        params.push(factory.createRestElement(parseArrayExpression()));
                        break;
                    default:
                        throw createMessageError("spread param list in function should be Identifier, objectLiteral, or ArrayLiteral ")
                }
                break;
            }
            // parse identifier '=' AssigmentExpression
            const left = parseIdentifer();
            if(match(SyntaxKinds.AssginOperator)) {
                nextToken();
                const right = parseAssigmentExpression();
                params.push(factory.createAssignmentPattern(left, right));
            }
            params.push(left);
        }
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        return params;
    }
    /**
     * Parse BindingElement
     * ```
     * BindingElemet := Identifer ('=' AssigmentExpression)?
     *               := BindingPattern ('=' AssigmentExpression)?
     * ```
     * @returns 
     */
    function parseBindingElement(): Pattern {
        if(!matchSet([SyntaxKinds.Identifier, SyntaxKinds.BracesLeftPunctuator, SyntaxKinds.BracketLeftPunctuator])) {
            throw createUnreachError([SyntaxKinds.Identifier, SyntaxKinds.BracesLeftPunctuator, SyntaxKinds.BracesLeftPunctuator]);
        }
        let left: Pattern | undefined ;
        if(match(SyntaxKinds.Identifier)) {
            left = parseIdentifer();
        }else {
            left = parseBindingPattern();
        }
        if(match(SyntaxKinds.AssginOperator)) {
            nextToken();
            const right = parseAssigmentExpression();
            return factory.createAssignmentPattern(left, right);
        }
        return left;
    }
    function parseRestElement(): RestElement {
        expectGuard([SyntaxKinds.SpreadOperator]);
        if(match(SyntaxKinds.Identifier)) {
            return factory.createRestElement(parseIdentifer());
        }
    }
    /**
     * Parse BindingPattern
     * ```
     * BindingPattern := ObjectPattern
     *                := ArrayPattern
     * ```
     */
    function parseBindingPattern(): ObjectPattern | ArrayPattern {
        expectGuard([SyntaxKinds.BracesLeftPunctuator, SyntaxKinds.BracketLeftPunctuator], false);
        if(match(SyntaxKinds.BracesLeftPunctuator)) {
            return parseObjectPattern();
        }
        return parseArrayPattern();
    }
    /** Parse Object Pattern
     * ```
     * ObjectPattern := '{' ObjectPatternProperties  '}'
     *               := '{' ObjtecPatternProperties ',' '}'
     *               := '{' ObjectPatternProperties ',' RestElement '}'
     *               := '{' RestElement '}
     * ObjectPatternProperties := ObjectPatternProperties ',' ObjectPatternProperty
     * ObjectPatternProperty   := Identifer ('=' AssigmentExpression)
     *                          := BindingPattern ('=' AssignmentExpression) 
     * ```
     * @return {ObjectPattern}
     */
    function parseObjectPattern(): ObjectPattern {
        expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        let isStart = false;
        const properties = [];
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            // eat comma.
            if(!isStart) {
                isStart = true;
            }else {
                expect(SyntaxKinds.CommaToken);
            }
            if(match(SyntaxKinds.BracesRightPunctuator) || match(SyntaxKinds.EOFToken)) {
               continue;
            }
            // parse Rest property
            if(match(SyntaxKinds.SpreadOperator)) {
                nextToken();
                if(match(SyntaxKinds.Identifier)) {
                    properties.push(factory.createRestElement(parseIdentifer()));
                }else {
                    properties.push(factory.createRestElement(parseBindingPattern()));
                }
                // sematic check, Rest Property Must be last,
                if(
                    !(
                        match(SyntaxKinds.BracesRightPunctuator) ||
                        match(SyntaxKinds.CommaToken) && lookahead() === SyntaxKinds.BracesRightPunctuator
                    )
                ) {
                    throw createMessageError(ErrorMessageMap.rest_element_should_be_last_property);
                }
                continue;
            }
            // parse Object pattern property
            const isComputedRef = { isComputed: false }
            const propertyName = parsePropertyName(isComputedRef);
            if(match(SyntaxKinds.AssginOperator)) {
                nextToken();
                const expr =  parseAssigmentExpression();
                properties.push(factory.createObjectPatternProperty(propertyName, expr, isComputedRef.isComputed, false))
                continue;
            }
            if(match(SyntaxKinds.ColonPunctuator)) {
                nextToken();
                const pattern = parseBindingElement();
                properties.push(factory.createObjectPatternProperty(propertyName, pattern, isComputedRef.isComputed, false));
                continue;
            }
            properties.push(factory.createObjectPatternProperty(propertyName, undefined, isComputedRef.isComputed, true));
        }
        expect(SyntaxKinds.BracesRightPunctuator);
        return factory.createObjectPattern(properties);
    }
    function parseArrayPattern(): ArrayPattern {
        expectGuard([SyntaxKinds.BracketLeftPunctuator])
        let isStart = true;
        const elements: Array<Pattern | null> = [];
        while(!match(SyntaxKinds.BracketRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            if(isStart) {
                isStart = false;
            }else {
                expect(SyntaxKinds.CommaToken)
            }
            if(match(SyntaxKinds.BracketLeftPunctuator) || match(SyntaxKinds.EOFToken)) {
                continue;
            }
            if(match(SyntaxKinds.CommaToken)) {
                elements.push(null);
                continue;
            }
            elements.push(parseBindingElement());
        }
        expect(SyntaxKinds.BracketRightPunctuator);
        return {
            kind: SyntaxKinds.ArrayPattern,
            elements,
        }
    }
/** ================================================================================
 *  Parse Import Declaration
 *  entry point: https://tc39.es/ecma262/#sec-imports
 * ==================================================================================
 */
    function expectFormKeyword() {
        if(getValue() !== "from") {
            throw createUnexpectError(SyntaxKinds.Identifier, "expect from keyword");
        }
        nextToken();
    }
    /**
     * Parse Import Declaration
     * ```
     * ImportDeclaration := 'import'  ImportClasue FromClause
     *                   := 'import'  StringLiteral
     * FromClause := 'from' StringLiteral
     * ImportClause := ImportDefaultBinding
     *              := ImportNamesapce
     *              := ImportNamed
     *              := ImportDefaultBindling ',' ImportNamed
     *              := ImportDefaultBindling ',' ImportNamespace
     * ```
     * - frist, eat import keyword
     *   1. if it is string literal, must be `import StringLiteral`
     *   2. if it start with `*`, must be import name space
     *   3. if it start with '{', must be import named 
     *   4. fallback case: default import with import named or import namesspace
     *      or nothing
     * @returns {ImportDeclaration}
     */
    function parseImportDeclaration(): ImportDeclaration {
        expectGuard([SyntaxKinds.ImportKeyword])
        const specifiers: Array<ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier> = [];
        if(match(SyntaxKinds.StringLiteral)) {
            const source = parseStringLiteral();
            expectFormKeyword();
            return factory.createImportDeclaration(specifiers, source);
        }
        if(match(SyntaxKinds.MultiplyOperator)) {
            specifiers.push(parseImportNamespaceSpecifier());
            expectFormKeyword();
            const source = parseStringLiteral();
            return factory.createImportDeclaration(specifiers, source);
        }
        if(match(SyntaxKinds.BracesLeftPunctuator)) {
            parseImportSpecifiers(specifiers);
            expectFormKeyword();
            const source = parseStringLiteral();
            return factory.createImportDeclaration(specifiers, source);
        }
        specifiers.push(parseImportDefaultSpecifier());
        if(match(SyntaxKinds.CommaToken)) {
            nextToken();
            if(match(SyntaxKinds.BracesLeftPunctuator)) {
                parseImportSpecifiers(specifiers);
            }else if (match(SyntaxKinds.MultiplyOperator)) {
                specifiers.push(parseImportNamespaceSpecifier());
            }else {
                throw createMessageError("import default specifier can only concat with namespace of import named specifier");
            }
        }
        expectFormKeyword();
        const source = parseStringLiteral();
        return factory.createImportDeclaration(specifiers, source);
    }
    /**
     * Parse Default import binding
     * ```
     * ImportDefaultBinding := Identifer
     * ```
     * @returns {ImportDefaultSpecifier}
     */
    function parseImportDefaultSpecifier(): ImportDefaultSpecifier {
        const name = parseIdentifer();
        return factory.createImportDefaultSpecifier(name);
    }
    /**
     * Parse namespace import 
     * ```
     * ImportNamespace := '*' 'as' Identifer
     * ```
     * @returns {ImportNamespaceSpecifier}
     */
    function parseImportNamespaceSpecifier(): ImportNamespaceSpecifier {
        expectGuard([SyntaxKinds.MultiplyOperator]);
        if(getValue()!== "as") {
            throw createMessageError("import namespace specifier must has 'as'");
        }
        nextToken();
        return factory.createImportNamespaceSpecifier(parseIdentifer());
    }
    /**
     * Parse Import Nameds
     * ```
     *  ImportNamed := '{' ImportList ','? '}'
     *  ImportList  := [ ImportItem ]
     *  ImportItem  := Identifer 
     *              := (Identifer | StringLiteral) 'as' Identifer
     * ```
     * @param specifiers
     * @return {void}
     */
    function parseImportSpecifiers(specifiers: Array<ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier>): void {
        expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        let isStart = true;
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            if(isStart) {
                isStart = false;
            }else {
                expect(SyntaxKinds.CommaToken);
            }
            if(match(SyntaxKinds.BracesRightPunctuator) || match(SyntaxKinds.EOFToken)) {
                break;
            }
            if(match(SyntaxKinds.Identifier)) {
                const imported = parseIdentifer();
                let local: Identifier | null = null ;
                if(getValue() == "as") {
                    nextToken();
                    local = parseIdentifer();
                }
                specifiers.push(factory.createImportSpecifier(imported, local));
            }else if(match(SyntaxKinds.StringLiteral)) {
                const imported = parseStringLiteral();
                if(getValue() !== "as") {
                    createUnexpectError(SyntaxKinds.Identifier, "if import specifier start with string literal, must has 'as' clause");
                }
                nextToken();
                const local = parseIdentifer();
                specifiers.push(factory.createImportSpecifier(imported, local));
            }else {
                createUnexpectError(SyntaxKinds.Identifier, "import specifier must start with strinhLiteral or identifer")
            }
        }
        expect(SyntaxKinds.BracesRightPunctuator);
    } 
/** ================================================================================
 *  Parse Export Declaration
 *  entry point: https://tc39.es/ecma262/#prod-ExportDeclaration
 * ==================================================================================
 */
    /**
     * Parse Export Declaration
     * ```
     * ExportDeclaration := 'export' ExportNamedDeclaration
     *                   := 'export' ExportDefaultDeclaration
     *                   := 'export' ExportAllDeclaration
     * ExportNamedDeclaration := '{' ExportList  '}' ('from' StringLiteral)?
     *                        := Declaration
     *                        := VarStatement
     * ExportAllDeclaration := '*' 'from' StringLiteral
     *                      := '*' 'as'  Identifer 'from' StringLiteral
     * ```
     * @returns {ExportDeclaration}
     */
    function parseExportDeclaration(): ExportDeclaration {
        expectGuard([SyntaxKinds.ExportKeyword]);
        if(match(SyntaxKinds.DefaultKeyword)) {
            return parseExportDefaultDeclaration();
        }
        if(match(SyntaxKinds.MultiplyOperator)) {
            return parseExportAllDeclaration();
        }
        if(match(SyntaxKinds.BracesLeftPunctuator)) {
            return parseExportNamedDeclaration();
        }
        const declaration = match(SyntaxKinds.VarKeyword) ? parseVariableDeclaration() : parseDeclaration();
        return factory.createExportNamedDeclaration([], declaration, null);
    }
    function parseExportDefaultDeclaration(): ExportDefaultDeclaration{
        expectGuard([SyntaxKinds.DefaultKeyword]);
        if(match(SyntaxKinds.ClassKeyword)) {
            let classDeclar = parseClass();
            if(classDeclar.id === null) {
                classDeclar = factory.transFormClassToClassExpression(classDeclar)
            }else {
                classDeclar = factory.transFormClassToClassDeclaration(classDeclar);
            }
            return factory.createExportDefaultDeclaration(classDeclar as ClassDeclaration | ClassExpression);
        }
        if(match(SyntaxKinds.FunctionKeyword)) {
            let funDeclar = parseFunction()
            if(funDeclar.name === null) {
                funDeclar = factory.transFormFunctionToFunctionExpression(funDeclar)
            }else {
                funDeclar = factory.transFormFunctionToFunctionDeclaration(funDeclar);
            }
            return factory.createExportDefaultDeclaration(funDeclar as FunctionDeclaration | FunctionExpression);
        }   
        if(getValue() === "async" && lookahead() === SyntaxKinds.FunctionKeyword) {
            nextToken();
            context.inAsync = true;
            const funDeclar = parseFunctionDeclaration();
            context.inAsync = false;
            return factory.createExportDefaultDeclaration(funDeclar);
        }
        const expr = parseAssigmentExpression();
        return factory.createExportDefaultDeclaration(expr);
    }
    function parseExportNamedDeclaration(): ExportNamedDeclarations {
        expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        const specifier: Array<ExportSpecifier> = []; 
        let isStart = true;
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            if(isStart) {
                isStart = false;
            }else {
                expect(SyntaxKinds.CommaToken);
            }
            if(match(SyntaxKinds.BracesRightPunctuator) || match(SyntaxKinds.EOFToken)) {
                break;
            }
            // TODO: reafacor into parseModuleName ?
            const exported = match(SyntaxKinds.Identifier) ? parseIdentifer() : parseStringLiteral();
            if(getValue() === "as") {
                nextToken();
                const local = match(SyntaxKinds.Identifier) ? parseIdentifer() : parseStringLiteral();
                specifier.push(factory.createExportSpecifier(exported, local));
                continue;
            }
            specifier.push(factory.createExportSpecifier(exported, null));
        }
        expect(SyntaxKinds.BracesRightPunctuator);
        expectFormKeyword();
        const source = parseStringLiteral();
        return factory.createExportNamedDeclaration(specifier, null, source);
    }
    function parseExportAllDeclaration(): ExportAllDeclaration {
        expectGuard([SyntaxKinds.MultiplyOperator]);
        let exported: Identifier | null = null;
        if(getValue() === "as") {
            nextToken();
            exported = parseIdentifer();
        }else {
            exported  = null;
        }
        expectFormKeyword();
        const source = parseStringLiteral();
        return factory.createExportAllDeclaration(exported, source);
    }
}