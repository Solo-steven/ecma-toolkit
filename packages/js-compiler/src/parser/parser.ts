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
    ObjectAccessor,
    ClassAccessor,
    StringLiteral,
    ClassConstructor,
    ObjectPatternProperty,
    SyntaxKinds ,
    UnaryOperators,
    BinaryOperators,
    AssigmentOperators,
    AssigmentOperatorKinds,
    BinaryOperatorKinds,
    UnaryOperatorKinds,
    UpdateOperators,
    UpdateOperatorKinds,
    Keywords,
    SourcePosition,
    cloneSourcePosition,
    Factory,
    isBinaryExpression,
} from "js-types";
import { getBinaryPrecedence, isBinaryOps } from "./helper";
import { ErrorMessageMap } from "./error";
import { createLexer } from "../lexer/index";
import { transformSyntaxKindToLiteral } from "../tests/transform";

/** ========================
 *  Context for parser
 * =========================
 */
interface Context {
    maybeArrow: boolean;
    inAsync: boolean;
    inClass: boolean,
}

interface ASTArrayWithMetaData<T> {
    nodes: Array<T>;
    start: SourcePosition;
    end: SourcePosition;
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
     * Get start position of token
     * @return {SourcePosition}
     */
    function getStartPosition(): SourcePosition {
        return lexer.getStartPosition();
    }
    /**
     * Get End position of token
     * @return {SourcePosition}
     */
    function getEndPosition(): SourcePosition {
        return lexer.getEndPosition();
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
     */
    function expect(kind: SyntaxKinds, message = "")  {
        if(match(kind)) {
            const metaData = {
                value: getValue(),
                start: getStartPosition(),
                end: getEndPosition()
            }
            nextToken();
            return metaData;
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
    function expectGuard(startTokens: Array<SyntaxKinds>, shouldEat = true): { 
        value: ReturnType<typeof getValue>,
        start: ReturnType<typeof getStartPosition>
        end: ReturnType<typeof getEndPosition>
    }| undefined {
        if(!matchSet(startTokens)) {
            throw createUnreachError(startTokens);
        }
        if(shouldEat) {
            const metaData = {
                value: getValue(),
                start: getStartPosition(),
                end: getEndPosition()
            }
            nextToken();
            return metaData;
        }
    }
    /**
     * Some AST maybe end up with semi or line terminate
     * so you can call this function for checking
     */
    function maybeSemi() {
        if(match(SyntaxKinds.SemiPunctuator)) {
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
    function createUnexpectError(expectToken: SyntaxKinds | null, messsage = ""): Error {
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
        const body: Array<ModuleItem> = [];
        while(!match(SyntaxKinds.EOFToken)) {
            body.push(parseModuleItem());
        }
        return Factory.createProgram(body, body.length === 0 ? getStartPosition() : cloneSourcePosition(body[0].start), getEndPosition());
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
                        statement = Factory.createExpressionStatement(arrowExpr, cloneSourcePosition(arrowExpr.start), cloneSourcePosition(arrowExpr.end));
                    }else {
                        statement = Factory.createExpressionStatement(
                            Factory.createIdentifier("async", getStartPosition(), getEndPosition()), 
                            getStartPosition(), getEndPosition()
                        );
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
        const { start: keywordStart }  = expectGuard([SyntaxKinds.ForKeyword]);
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
        /* dirty solution when there is a expression left in for-in statement, example like `for(i in array) {}` */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        if(isBinaryExpression(leftOrInit)) {
            if(leftOrInit.operator === SyntaxKinds.InKeyword) {
                expect(SyntaxKinds.ParenthesesRightPunctuator);
                const body = parseStatement();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                return Factory.createForInStatement(leftOrInit.left, leftOrInit.right,body, keywordStart, cloneSourcePosition(body.end));
            }
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
            return Factory.createForStatement(body,leftOrInit, test, update, keywordStart, cloneSourcePosition(body.end));
        }else if (match(SyntaxKinds.InKeyword)) {
            // ForInStatement when left is variableDeclaration.
            nextToken();
            const right = parseAssigmentExpression();
            expect(SyntaxKinds.ParenthesesRightPunctuator);
            const body = parseStatement();
            return Factory.createForInStatement(leftOrInit, right, body, keywordStart, cloneSourcePosition(body.end));
        }else if(getValue() === "of") {
            // ForOfStatement
            nextToken();
            const right = parseAssigmentExpression();
            expect(SyntaxKinds.ParenthesesRightPunctuator);
            const body = parseStatement();
            return Factory.createForOfStatement(isAwait,leftOrInit, right, body, keywordStart, cloneSourcePosition(body.end));
        }
   }
   function parseIfStatement(): IfStatement {
      const {start: keywordStart} = expectGuard([SyntaxKinds.IfKeyword]);
      expect(SyntaxKinds.ParenthesesLeftPunctuator);
      const test = parseExpression();
      expect(SyntaxKinds.ParenthesesRightPunctuator);
      const consequnce = parseStatement();
      if(match(SyntaxKinds.ElseKeyword)) {
        nextToken();
        const alter = parseStatement();
        return Factory.createIfStatement(test, consequnce, alter, keywordStart, cloneSourcePosition(alter.end));
      }
      return Factory.createIfStatement(test, consequnce, null, keywordStart, cloneSourcePosition(consequnce.end));
   }
   function parseWhileStatement(): WhileStatement {
        const { start: keywordStart } = expectGuard([SyntaxKinds.WhileKeyword]);
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const test = parseExpression();
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        const body = parseStatement();
        return Factory.createWhileStatement(test, body, keywordStart, cloneSourcePosition(body.end));
    }
    function parseDoWhileStatement(): DoWhileStatement {
        const { start: keywordStart } =  expectGuard([SyntaxKinds.DoKeyword]);
        const body = parseStatement();
        expect(SyntaxKinds.WhileKeyword, "do while statement should has while condition");
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const test = parseExpression();
        const { end: punctEnd } =  expect(SyntaxKinds.ParenthesesRightPunctuator);
        maybeSemi();
        return Factory.createDoWhileStatement(test, body, keywordStart, punctEnd);
    }
   function parseBlockStatement() {
        const { start: puncStart } =  expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        const body: Array<StatementListItem> = [];
        while(!match(SyntaxKinds.BracesRightPunctuator) &&  !match(SyntaxKinds.EOFToken) ) {
            body.push(parseStatementListItem());
        }
        const { end: puncEnd } =  expect(SyntaxKinds.BracesRightPunctuator, "block statement must wrapped by bracket");
        return Factory.createBlockStatement(body, puncStart, puncEnd);
   }
   function parseSwitchStatement() {
        const { start: keywordStart } =  expectGuard([SyntaxKinds.SwitchKeyword]);
        nextToken();
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const discriminant = parseExpression();
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        if(!match(SyntaxKinds.BracesLeftPunctuator)) {
            throw createUnexpectError(SyntaxKinds.BracesLeftPunctuator, "switch statement should has cases body");
        }
        const { nodes, end } = parseSwitchCases();
        return Factory.createSwitchStatement(discriminant, nodes, keywordStart, end );
    
   }
   function parseSwitchCases(): ASTArrayWithMetaData<SwitchCase> {
        const { start } = expectGuard([SyntaxKinds.BracketLeftPunctuator]);
        const cases: Array<SwitchCase> = [];
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            let test: Expression | null = null;
            const start = getStartPosition();
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
            const end = getStartPosition();
            cases.push(Factory.createSwitchCase(test, consequence, start, end));
        }
        if(match(SyntaxKinds.EOFToken)) {
            throw createMessageError("switch statement should wrapped by braces");
        }
        const { end } =  expect(SyntaxKinds.BracesRightPunctuator);
        // TODO: multi default
        return {
            nodes: cases, start, end
        }
   }
   function parseContinueStatement(): ContinueStatement {
        const { start: keywordStart, end: keywordEnd} =  expectGuard([SyntaxKinds.ContinueKeyword]);
        if(match(SyntaxKinds.Identifier)) {
            const id = parseIdentifer();
            return Factory.createContinueStatement(id, keywordStart, cloneSourcePosition(id.end));
        }
        maybeSemi();
        return Factory.createContinueStatement(null, keywordStart,  keywordEnd);
   }
   function parseBreakStatement(): BreakStatement {
        const { start, end } = expectGuard([SyntaxKinds.BreakKeyword]);
        if(match(SyntaxKinds.Identifier)) {
            const label = parseIdentifer();
            return Factory.createBreakStatement(label, start, end);
        }
        maybeSemi();
        return Factory.createBreakStatement(null, start, end);
   }
   function parseLabeledStatement(): LabeledStatement {
        if(!match(SyntaxKinds.Identifier) || lookahead() !== SyntaxKinds.ColonPunctuator) {
            // TODO: unreach
        }
        const label = parseIdentifer();
        expect(SyntaxKinds.ColonPunctuator);
        if(match(SyntaxKinds.FunctionKeyword)) {
            const delcar = parseFunctionDeclaration();
            return Factory.createLabeledStatement(label, delcar, cloneSourcePosition(label.start), cloneSourcePosition(delcar.end));
        }else {
            const statement = parseStatement();
            return Factory.createLabeledStatement(label, parseStatement(), cloneSourcePosition(label.start), cloneSourcePosition(statement.end));
        }
   } 
   function parseReturnStatement(): ReturnStatement {
       const { start, end } =  expectGuard([SyntaxKinds.ReturnKeyword]);
       // TODO: make it can predi expression
       if(matchSet([SyntaxKinds.Identifier, SyntaxKinds.StringLiteral, SyntaxKinds.NumberLiteral])) {
            const expr = parseExpression();
            maybeSemi();
            return Factory.createReturnStatement(expr, start, cloneSourcePosition(expr.end));
       }
       maybeSemi();
       return Factory.createReturnStatement(null, start, end);
   }
   function parseTryStatement(): TryStatement {
        const { start: tryKeywordStart } = expectGuard([SyntaxKinds.TryKeyword]);
        const body = parseBlockStatement();
        let handler: CatchClause | null = null, finalizer: BlockStatement | null = null;
        if(match(SyntaxKinds.CatchKeyword)) {
            const catchKeywordStart = getStartPosition();
            nextToken();
            if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
                nextToken();
                const param = parseBindingElement();
                expect(SyntaxKinds.ParenthesesRightPunctuator);
                const body = parseBlockStatement();
                handler = Factory.createCatchClause( param , body, catchKeywordStart, cloneSourcePosition(body.end));
            }else {
                const body = parseBlockStatement();
                handler = Factory.createCatchClause(null, body, catchKeywordStart, cloneSourcePosition(body.end));
            }
        }
        if(match(SyntaxKinds.FinallyKeyword)) {
            nextToken();
            finalizer = parseBlockStatement();
        }
        return Factory.createTryStatement(
            body, handler, finalizer, 
            tryKeywordStart, 
            cloneSourcePosition( finalizer ? finalizer.end : handler ? handler.end :  body.end )
        );
   }
   function parseThrowStatement() {
      const { start, } =  expectGuard([SyntaxKinds.ThrowKeyword]);
      const expr = parseExpression();
      maybeSemi();
      return Factory.createThrowStatement(expr, start, cloneSourcePosition(expr.end));
   }
   function parseWithStatement(): WithStatement {
        const {start }= expectGuard([SyntaxKinds.WithKeyword]);
        expect(SyntaxKinds.ParenthesesLeftPunctuator);
        const object = parseExpression();
        expect(SyntaxKinds.ParenthesesRightPunctuator);
        const body = parseStatement();
        return Factory.createWithStatement(object, body, start, cloneSourcePosition(body.end));
   }
   function parseDebuggerStatement(): DebuggerStatement {
       const {start, end } =  expectGuard([SyntaxKinds.DebuggerKeyword]);
       maybeSemi();
       return Factory.createDebuggerStatement(start, end);
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
        const { start: keywordStart, value: variant } = expectGuard([SyntaxKinds.VarKeyword, SyntaxKinds.ConstKeyword,SyntaxKinds.LetKeyword])
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
                declarations.push(Factory.createVariableDeclarator(id, init, cloneSourcePosition(id.start), cloneSourcePosition(init.end)));
                continue;
            }
            declarations.push(Factory.createVariableDeclarator(id, null, cloneSourcePosition(id.start), cloneSourcePosition(id.end)));
        }
        maybeSemi();
        return Factory.createVariableDeclaration(declarations, variant as VariableDeclaration['variant'], keywordStart, declarations[declarations.length - 1].end);
    }
    function parseFunctionDeclaration() {
        const func = parseFunction();
        if(func.name === null) {
            throw createMessageError("Function name of FunctionDeclaration can not be null");
        }
        return Factory.transFormFunctionToFunctionDeclaration(func);
    }
    /**
     * 
     * @returns 
     */
    function parseFunction() {
        const { start } = expectGuard([SyntaxKinds.FunctionKeyword]);
        let generator = false;
        if(match(SyntaxKinds.MultiplyOperator)) {
            generator = true;
            nextToken();
        }
        let name: Identifier | null = null;
        if(match(SyntaxKinds.Identifier)) {
            name = Factory.createIdentifier(getValue(), getStartPosition(), getEndPosition());
            nextToken();
        }
        const params = parseFunctionParam();
        const body = parseFunctionBody();
        return Factory.createFunction(name, body, params, generator, context.inAsync, start, cloneSourcePosition(body.end));
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
        const { start } = expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        const body : Array<StatementListItem>= [];
        while(!match(SyntaxKinds.BracesRightPunctuator) && !match(SyntaxKinds.EOFToken)) {
            body.push(parseStatementListItem());
        }
        const { end } = expect(SyntaxKinds.BracesRightPunctuator);
        return Factory.createFunctionBody(body, start, end);
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
        expectGuard([SyntaxKinds.ClassKeyword], false);
        const classDelcar = parseClass();
        if(classDelcar.id === null) {
            throw createMessageError("class declaration must have class id");
        }
        return Factory.transFormClassToClassDeclaration(classDelcar);
    }
    /**
     * Parse Class
     * ```
     * Class := 'class' identifer ('extends' LeftHandSideExpression) ClassBody
     * ```
     * @returns {Class}
     */
    function parseClass(): Class {
        const { start } = expectGuard([SyntaxKinds.ClassKeyword]);
        let name: Identifier | null = null;
        if(match(SyntaxKinds.Identifier)) {
            name = parseIdentifer();
        }
        let superClass: Expression | null  = null;
        if(match(SyntaxKinds.ExtendsKeyword)) {
            nextToken();
            superClass = parseLeftHandSideExpression();
            
        }
        const body = parseClassBody();
        return Factory.createClass(name, superClass, body, start, cloneSourcePosition(body.end));
    }
    /** 
     * Parse ClassBody
     * ```
     *  ClassBody := '{' [ClassElement] '}'
     * ```
     * @return {ClassBody}
     */
    function parseClassBody(): ClassBody {
        const { start } =  expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        const classbody: ClassBody['body'] = []
        while(!match(SyntaxKinds.BracesRightPunctuator) && ! match(SyntaxKinds.EOFToken)) {
            classbody.push(parseClassElement());
        }
        const { end } = expect(SyntaxKinds.BracesRightPunctuator);
        return Factory.createClassBody(classbody, cloneSourcePosition(start), cloneSourcePosition(end));
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
            const value = parseAssigmentExpression()
            return Factory.createClassProperty(key, value , isComputedRef.isComputed, isStatic, false, cloneSourcePosition(key.start), cloneSourcePosition(value.end));
        }
        return Factory.createClassProperty(key, undefined, isComputedRef.isComputed, isStatic, true, cloneSourcePosition(key.start), cloneSourcePosition(key.end));

    }
/** ====================================================================
 *  Parse Expression 
 *  entry point reference : https://tc39.es/ecma262/#sec-comma-operator
 * =====================================================================
 */
    function parseExpressionStatement() {
        const expr = parseExpression();
        maybeSemi();
        return Factory.createExpressionStatement(expr, cloneSourcePosition(expr.start), cloneSourcePosition(expr.end));
    }
    function parseExpression(): Expression {
        const exprs = [parseAssigmentExpression()];
        while(match(SyntaxKinds.CommaToken)) {
            nextToken();
            exprs.push(parseAssigmentExpression());
        }
        if(exprs.length === 1) {
            return exprs[0];
        }
        return Factory.createSequenceExpression(exprs, cloneSourcePosition(exprs[0].start), cloneSourcePosition(exprs[exprs.length -1].end));
    }
    function parseAssigmentExpression(): Expression {
        if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            context.maybeArrow = true;
        }
        if(match(SyntaxKinds.YieldKeyword)) {
            return parseYieldExpression();
        }
        const left = parseConditionalExpression();
        if (!matchSet(AssigmentOperators)) {
            return left;
        }
        const operator = getToken();
        nextToken();
        const right = parseAssigmentExpression();
        return Factory.createAssignmentExpression(left, right, operator as AssigmentOperatorKinds, cloneSourcePosition(left.start), cloneSourcePosition(right.end));
    }
    function parseYieldExpression() {
        const { start } = expectGuard([SyntaxKinds.YieldKeyword]);
        let delegate = false;
        if(match(SyntaxKinds.MultiplyOperator)) {
            nextToken();
            delegate = true;
        }
        // TODO: start with expression
        let argument: Expression | null = null;
        if(matchSet([SyntaxKinds.Identifier, SyntaxKinds.NumberLiteral, SyntaxKinds.StringLiteral])) {
            argument = parseAssigmentExpression();
        }
        return Factory.createYieldExpression(argument, delegate, start, cloneSourcePosition(argument ? argument.end : start ));
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
        return Factory.createConditionalExpression(test, conseq, alter, cloneSourcePosition(test.start), cloneSourcePosition(alter.end));
    }
    function parseBinaryExpression(): Expression {
        const atom = parseUnaryExpression();
        if(matchSet(BinaryOperators)) {
            return parseBinaryOps(atom);
        }
        return atom;
    }
    function parseBinaryOps(left: Expression , lastPre = 0): Expression {
        // eslint-disable-next-line no-constant-condition
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
            left = Factory.createBinaryExpression(left, right, currentOp as BinaryOperatorKinds, cloneSourcePosition(left.start), cloneSourcePosition(right.end));
        }
        return left;
    }
    function parseUnaryExpression(): Expression {
        if(matchSet(UnaryOperators)) {
            const operator = getToken() as UnaryOperatorKinds;
            const start = getStartPosition();
            nextToken();
            const argument = parseUnaryExpression();
            return Factory.createUnaryExpression(argument, operator, start, cloneSourcePosition(argument.end));
        }
        if(match(SyntaxKinds.AwaitKeyword)) {
            const start = getStartPosition();
            nextToken();
            const argu = parseUnaryExpression();
            return Factory.createAwaitExpression(argu, start, cloneSourcePosition(argu.end));
        }
        return parseUpdateExpression();
    }
    function parseUpdateExpression(): Expression {
        if(matchSet(UpdateOperators)) {
            const operator = getToken () as UpdateOperatorKinds;
            const start = getStartPosition();
            nextToken();
            const argument = parseLeftHandSideExpression();
            return Factory.createUpdateExpression(argument, operator, true, start, cloneSourcePosition(argument.end));
        }
        const argument = parseLeftHandSideExpression();
        if(matchSet(UpdateOperators)) {
            const operator = getToken() as UpdateOperatorKinds;
            const end = getEndPosition();
            nextToken();
            Factory.createUpdateExpression(argument, operator, false, cloneSourcePosition(argument.start), end);
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
            return Factory.createChainExpression(base, cloneSourcePosition(base.start), cloneSourcePosition(base.end));
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
        expectGuard([SyntaxKinds.ParenthesesLeftPunctuator], false);
        const { nodes, end } = parseArguments();
        return Factory.createCallExpression(callee, nodes, optional, cloneSourcePosition(callee.start), end);
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
    function parseArguments(): ASTArrayWithMetaData<Expression>  {
        const { start } = expectGuard([SyntaxKinds.ParenthesesLeftPunctuator]);
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
                const spreadElementStart = getStartPosition();
                nextToken();
                const argu = parseAssigmentExpression();
                callerArguments.push(Factory.createSpreadElement(argu, spreadElementStart, cloneSourcePosition(argu.end)));
                if(match(SyntaxKinds.CommaToken)) {
                    nextToken();
                }
                shouldStop = true;
                continue;
            }
            // case 3 : ',' AssigmentExpression
            callerArguments.push(parseAssigmentExpression());
        }
        const { end } = expect(SyntaxKinds.ParenthesesRightPunctuator);
        return { 
            end, start,
            nodes: callerArguments 
        };
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
            throw createUnreachError([SyntaxKinds.DotOperator, SyntaxKinds.BracketLeftPunctuator]);
        }
        if(match(SyntaxKinds.DotOperator)) {
            expect(SyntaxKinds.DotOperator);
            const property = parseIdentiferWithKeyword();
            return Factory.createMemberExpression(false, base, property, optional, cloneSourcePosition(base.start), cloneSourcePosition(property.end));
        }
        else if(match(SyntaxKinds.BracketLeftPunctuator)){
            expect(SyntaxKinds.BracketLeftPunctuator);
            const property = parseExpression();
            const { end } = expect(SyntaxKinds.BracketRightPunctuator)
            return Factory.createMemberExpression(true, base, property, optional, cloneSourcePosition(base.start), end);
        }else {
            const property = parseIdentiferWithKeyword();
            return Factory.createMemberExpression(false, base, property, optional, cloneSourcePosition(base.start), cloneSourcePosition(property.end));
        }
    }
    function parseTagTemplateExpression(base: Expression) {
        const quasi = parseTemplateLiteral();
        return Factory.createTagTemplateExpression(base, quasi, cloneSourcePosition(base.end), cloneSourcePosition(quasi.end));

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
            case SyntaxKinds.NewKeyword: {
                const lookaheadToken = lookahead();
                if(lookaheadToken === SyntaxKinds.DotOperator) {
                    return parseNewTarget();
                }
                return parseNewExpression();
            }
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
                    const argus = [parseIdentifer()];
                    return parseArrowFunctionExpression({
                        nodes: argus,
                        start: argus[0].start,
                        end: argus[0].end
                    });
                }
                return parseIdentifer();
            }
            default:
                throw createUnexpectError(null);
        }
    }
    function parseIdentifer(): Identifier {
        const { value, start, end } = expectGuard([SyntaxKinds.Identifier]);
        return Factory.createIdentifier(value, start, end);
    }
    function parseIdentiferWithKeyword() {
        const { value, start, end } = expectGuard([SyntaxKinds.Identifier, ...Keywords]);
        return Factory.createIdentifier(value, start, end);
    }
    function parsePrivateName() {
        const { value, start, end } = expectGuard([SyntaxKinds.PrivateName]);
        return Factory.createPrivateName(value, start, end);
    }
    function parseNumberLiteral() {
        const { start, end, value } = expectGuard([SyntaxKinds.NumberLiteral]);
        return Factory.createNumberLiteral(value, start, end);
    }
    function parseStringLiteral() {
        const { start, end, value } = expectGuard([SyntaxKinds.StringLiteral]);
        return Factory.createStringLiteral(value, start, end);
    }
    function parseTemplateLiteral() {
        if(!matchSet([SyntaxKinds.TemplateHead, SyntaxKinds.TemplateNoSubstitution])) {
            throw createUnreachError([SyntaxKinds.TemplateHead, SyntaxKinds.TemplateNoSubstitution]);
        }
        const templateLiteralStart = getStartPosition();
        if(match(SyntaxKinds.TemplateNoSubstitution)) {
            const value = getValue();
            const templateLiteralEnd = getEndPosition();
            nextToken();
            return Factory.createTemplateLiteral(
                [Factory.createTemplateElement(value, true, templateLiteralStart, templateLiteralEnd)], 
                [], 
                templateLiteralStart, templateLiteralEnd
            );
        }
        nextToken();
        const expressions = [parseExpression()];
        const quasis: Array<TemplateElement> = [];
        while(!match(SyntaxKinds.TemplateTail) && match(SyntaxKinds.TemplateMiddle) && !match(SyntaxKinds.EOFToken)) {
            quasis.push(Factory.createTemplateElement(getValue(), false, getStartPosition(), getEndPosition()));
            nextToken();
            expressions.push(parseExpression());
        }
        if(match(SyntaxKinds.EOFToken)) {
            throw createUnexpectError(SyntaxKinds.BracesLeftPunctuator);
        }
        quasis.push(Factory.createTemplateElement(getValue(), true, getStartPosition(), getEndPosition()));
        const templateLiteralEnd = getEndPosition();
        nextToken();
        return Factory.createTemplateLiteral(quasis, expressions, templateLiteralStart, templateLiteralEnd);

    }
    function parseImportMeta() {
        const { start, end } =  expectGuard([SyntaxKinds.ImportKeyword]);
        expect(SyntaxKinds.DotOperator);
        const property = parseIdentifer();
        return Factory.createMetaProperty(Factory.createIdentifier("import", start, end), property, start, cloneSourcePosition(property.end));
    }
    function parseNewTarget() {
        const { start, end } = expectGuard([SyntaxKinds.NewKeyword]);
        expect(SyntaxKinds.DotOperator);
        if(getValue() !== "target") {
            throw createUnexpectError(SyntaxKinds.Identifier, "new concat with dot should only be used in meta property");
        }
        const targetStart = getStartPosition();
        const targetEnd = getEndPosition();
        nextToken();
        return Factory.createMetaProperty(Factory.createIdentifier("new", start, end), Factory.createIdentifier("target", targetStart, targetEnd), start, targetEnd);
    }
    /**
     * Parse New Expression
     * new expression is a trick one, because is not always right to left, 
     * for a new expression, last the rightest component must be a CallExpression,
     * and before that CallExpression, it can be a series of MemberExpression,
     * or event another NewExpression
     * ```
     * NewExpression := 'new' NewExpression
     *               := 'new' MemberExpressionWithoutOptional Arugment?
     * ```
     * @returns {Expression}
     */
    function parseNewExpression():Expression {
        const { start } = expectGuard([SyntaxKinds.NewKeyword])
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
        // accpect New XXX -> No argument
        if(!match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            return Factory.createNewExpression(base, [], start, cloneSourcePosition(base.end));
        }
        const { end, nodes } = parseArguments()
        return Factory.createNewExpression(base, nodes, start, end );

    }
    function parseSuper() {
        const { start: keywordStart, end: keywordEnd } = expectGuard([SyntaxKinds.SuperKeyword]);
        const { nodes, end: argusEnd } = parseArguments();
        return Factory.createCallExpression(Factory.createSuper(keywordStart, keywordEnd), nodes, false, cloneSourcePosition(keywordStart) , argusEnd);
    }
    function parseThisExpression() {
        const { start, end } = expectGuard([SyntaxKinds.ThisKeyword]);
        return Factory.createThisExpression(start, end);
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
        const { start } =  expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        let isStart = true;
        const propertyDefinitionList: Array<PropertyDefinition> = [];
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
        const { end } = expect(SyntaxKinds.BracesRightPunctuator);
        return Factory.createObjectExpression(propertyDefinitionList, start, end);
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
            const spreadElementStart = getStartPosition();
            nextToken();
            const expr = parseAssigmentExpression();
            return Factory.createSpreadElement(expr, spreadElementStart, cloneSourcePosition(expr.end));
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
            const expr = parseAssigmentExpression()
            return Factory.createObjectProperty(propertyName, expr , isComputedRef.isComputed, false, cloneSourcePosition(propertyName.start), cloneSourcePosition(expr.end));
        }
        return Factory.createObjectProperty(propertyName, undefined, isComputedRef.isComputed, true, cloneSourcePosition(propertyName.start), cloneSourcePosition(propertyName.end));
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
     * @param {boolean} isStatic
     * @returns {ObjectMethodDefinition | ClassMethodDefinition | ObjectAccessor | ClassAccessor  | ClassConstructor}
     */
    function parseMethodDefintion(
        inClass = false, 
        withPropertyName: PropertyName | PrivateName | undefined = undefined, 
        isStatic = false
    ): ObjectMethodDefinition | ClassMethodDefinition | ObjectAccessor | ClassAccessor  | ClassConstructor{
        if(
            !(getValue() === "set" || getValue() === "get" || getValue() === "async" || match(SyntaxKinds.MultiplyOperator))
            && !withPropertyName
        ) {
            throw createUnreachError([SyntaxKinds.MultiplyAssignOperator, SyntaxKinds.Identifier]);
        }
        /**
         * Step 1 : if not with propertyName , parse modifier frist, otherwise, if with propertyName, it shouldn't do anything.
         * structure would be like : ('set' | 'get')? 'async' '*' PropertyName  ...., this strcuture isn't match the spec.
         * but in this structure, we can detect some syntax error more concies, like set and get can not use with async
         * or generator.
         */
        let type: MethodDefinition['type'] = "method";
        let isAsync: MethodDefinition['async'] = false;
        let generator: MethodDefinition['generator'] = false;
        let computed: MethodDefinition['computed'] = false;
        let start: SourcePosition | null = null;
        if(!withPropertyName) {
            // frist, is setter or getter
            if(getValue() === "set") {
                type = "set";
                start = getStartPosition();
                nextToken();
            }
            else if(getValue() === "get") {
                type = "get"
                start = getStartPosition();
                nextToken();
            }
            // second, parser async and is generator
            if(getValue() === "async" && lookahead() !== SyntaxKinds.ParenthesesLeftPunctuator) {
                start = getStartPosition();
                isAsync = true;
                nextToken();
                if(match(SyntaxKinds.MultiplyOperator)) {
                    nextToken();
                    generator = true;
                }
            }
            else if(match(SyntaxKinds.MultiplyOperator)) {
                start = getStartPosition();
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
        const parmas = parseFunctionParam();
        const body = parseFunctionBody();
        /**
         * Step 2: semantic and more concise syntax check instead just throw a unexpect
         * token error.
         */
        if(type === "get" && parmas.length > 0) {
            throw createMessageError(ErrorMessageMap.getter_should_never_has_params);
        }
        if(type === "set" && parmas.length === 0) {
            throw createMessageError(ErrorMessageMap.setter_should_has_at_last_one_params);
        }
        if(type === "get" && (isAsync || generator)) {
            throw createMessageError(ErrorMessageMap.getter_can_not_be_async_or_generator);
        }
        if(type === "set" && (isAsync || generator)) {
            throw createMessageError(ErrorMessageMap.setter_can_not_be_async_or_generator);
        }
        if(withPropertyName.kind === SyntaxKinds.Identifier) {
            if(withPropertyName.name === "constructor" && context.inClass) {
                if(isAsync || generator || isStatic) {
                    throw createMessageError(ErrorMessageMap.constructor_can_not_be_async_or_generator);
                }
                return Factory.createClassConstructor(withPropertyName, body, parmas, start, cloneSourcePosition(body.end));
            }
        }
        /**
         * Step 3 return based on type, if accessor or methodDefintion
         */
        if(inClass) {
            if(type === "set" || type === "get") {
                return Factory.createClassAccessor(withPropertyName, body, parmas, type, computed, start, cloneSourcePosition(body.end));
            }
            return Factory.createClassMethodDefintion(
                withPropertyName, body, parmas, isAsync, generator, computed, isStatic,
                start ? start : cloneSourcePosition(withPropertyName.start), 
                cloneSourcePosition(body.end)
            );
        }
        if(type === "set" || type === "get") {
            return Factory.createObjectAccessor(withPropertyName, body, parmas, type, computed, start, cloneSourcePosition(body.end));
        }
        return Factory.createObjectMethodDefintion(
            withPropertyName, body, parmas, isAsync, generator, computed, 
            start ? start : cloneSourcePosition(withPropertyName.start), 
            cloneSourcePosition(body.end)
        );
    }
    function parseArrayExpression() {
        const { start } = expectGuard([SyntaxKinds.BracketLeftPunctuator]);
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
        const { end } = expect(SyntaxKinds.BracketRightPunctuator);
        return Factory.createArrayExpression(elements, start, end);
    }
    function parseFunctionExpression() {
        return Factory.transFormFunctionToFunctionExpression(parseFunction());
    }
    function parseClassExpression() {
        return Factory.transFormClassToClassExpression(parseClass());
    }
    function parseCoverExpressionORArrowFunction() {
        if(!match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            throw createUnreachError([SyntaxKinds.ParenthesesLeftPunctuator]);
        }
        const { start, end, nodes } = parseArguments();
        if(!context.maybeArrow || !match(SyntaxKinds.ArrowOperator)) {
            // transfor to sequence or signal expression
            if(nodes.length === 1) {
                return nodes[0];
            }
            return Factory.createSequenceExpression(nodes, start, end);
        }
        return parseArrowFunctionExpression({start, end, nodes});
    }
    function parseArrowFunctionExpression(metaData: ASTArrayWithMetaData<Expression>) {
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
        return Factory.createArrowExpression(isExpression, body,  metaData.nodes, context.inAsync, cloneSourcePosition(metaData.start), cloneSourcePosition(body.end));
    }
/** ================================================================================
 *  Parse Pattern
 *  entry point: https://tc39.es/ecma262/#sec-destructuring-binding-patterns
 * ==================================================================================
 */
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
            return Factory.createAssignmentPattern(left, right, cloneSourcePosition(left.start), cloneSourcePosition(right.end));
        }
        return left;
    }
    function parseRestElement(): RestElement {
        const { start } =  expectGuard([SyntaxKinds.SpreadOperator]);
        const id = parseIdentifer()
        return Factory.createRestElement(id, start, cloneSourcePosition(id.end));
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
        const { start } =  expectGuard([SyntaxKinds.BracesLeftPunctuator]);
        let isStart = false;
        const properties: Array<ObjectPatternProperty | RestElement> = [];
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
                const start = getStartPosition();
                nextToken();
                if(match(SyntaxKinds.Identifier)) {
                    const id = parseIdentifer();
                    properties.push(Factory.createRestElement(id, start, cloneSourcePosition(id.end)));
                }else {
                    const pattern = parseBindingPattern();
                    properties.push(Factory.createRestElement(pattern, start, cloneSourcePosition(pattern.end)));
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
                properties.push(Factory.createObjectPatternProperty(propertyName, expr, isComputedRef.isComputed, false, cloneSourcePosition(propertyName.start), cloneSourcePosition(expr.end)))
                continue;
            }
            if(match(SyntaxKinds.ColonPunctuator)) {
                nextToken();
                const pattern = parseBindingElement();
                properties.push(Factory.createObjectPatternProperty(propertyName, pattern, isComputedRef.isComputed, false, cloneSourcePosition(propertyName.start), cloneSourcePosition(pattern.end)));
                continue;
            }
            properties.push(Factory.createObjectPatternProperty(propertyName, undefined, isComputedRef.isComputed, true, cloneSourcePosition(propertyName.start), cloneSourcePosition(propertyName.end)));
        }
        const { end } =  expect(SyntaxKinds.BracesRightPunctuator);
        return Factory.createObjectPattern(properties, start, end);
    }
    function parseArrayPattern(): ArrayPattern {
        const { start } = expectGuard([SyntaxKinds.BracketLeftPunctuator])
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
        const { end } =  expect(SyntaxKinds.BracketRightPunctuator);
        return Factory.createArrayPattern(elements, start, end);
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
        const { start } =  expectGuard([SyntaxKinds.ImportKeyword])
        const specifiers: Array<ImportDefaultSpecifier | ImportNamespaceSpecifier | ImportSpecifier> = [];
        if(match(SyntaxKinds.StringLiteral)) {
            const source = parseStringLiteral();
            expectFormKeyword();
            return Factory.createImportDeclaration(specifiers, source, start, cloneSourcePosition(source.end));
        }
        if(match(SyntaxKinds.MultiplyOperator)) {
            specifiers.push(parseImportNamespaceSpecifier());
            expectFormKeyword();
            const source = parseStringLiteral();
            return Factory.createImportDeclaration(specifiers, source, start, cloneSourcePosition(source.end));
        }
        if(match(SyntaxKinds.BracesLeftPunctuator)) {
            parseImportSpecifiers(specifiers);
            expectFormKeyword();
            const source = parseStringLiteral();
            return Factory.createImportDeclaration(specifiers, source, start, cloneSourcePosition(source.end));
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
        maybeSemi();
        return Factory.createImportDeclaration(specifiers, source, start, cloneSourcePosition(source.end));
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
        return Factory.createImportDefaultSpecifier(name, cloneSourcePosition(name.start), cloneSourcePosition(name.end));
    }
    /**
     * Parse namespace import 
     * ```
     * ImportNamespace := '*' 'as' Identifer
     * ```
     * @returns {ImportNamespaceSpecifier}
     */
    function parseImportNamespaceSpecifier(): ImportNamespaceSpecifier {
        const { start } =  expectGuard([SyntaxKinds.MultiplyOperator]);
        if(getValue()!== "as") {
            throw createMessageError("import namespace specifier must has 'as'");
        }
        nextToken();
        const id = parseIdentifer()
        return Factory.createImportNamespaceSpecifier(id, start, cloneSourcePosition(id.end));
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
                specifiers.push(Factory.createImportSpecifier(imported, local, cloneSourcePosition(imported.start), cloneSourcePosition(local.end)));
            }else if(match(SyntaxKinds.StringLiteral)) {
                const imported = parseStringLiteral();
                if(getValue() !== "as") {
                    createUnexpectError(SyntaxKinds.Identifier, "if import specifier start with string literal, must has 'as' clause");
                }
                nextToken();
                const local = parseIdentifer();
                specifiers.push(Factory.createImportSpecifier(imported, local, cloneSourcePosition(imported.start), cloneSourcePosition(local.end)));
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
     * ExportDeclaration := 'export' ExportNamedDeclaration ';'?
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
        const {start} = expectGuard([SyntaxKinds.ExportKeyword]);
        if(match(SyntaxKinds.DefaultKeyword)) {
            return parseExportDefaultDeclaration(start);
        }
        if(match(SyntaxKinds.MultiplyOperator)) {
            return parseExportAllDeclaration(start);
        }
        if(match(SyntaxKinds.BracesLeftPunctuator)) {
            return parseExportNamedDeclaration(start);
        }
        const declaration = match(SyntaxKinds.VarKeyword) ? parseVariableDeclaration() : parseDeclaration();
        return Factory.createExportNamedDeclaration([], declaration, null, start, cloneSourcePosition(declaration.end));
    }
    function parseExportDefaultDeclaration(start: SourcePosition): ExportDefaultDeclaration{
        expectGuard([SyntaxKinds.DefaultKeyword]);
        if(match(SyntaxKinds.ClassKeyword)) {
            let classDeclar = parseClass();
            if(classDeclar.id === null) {
                classDeclar = Factory.transFormClassToClassExpression(classDeclar)
            }else {
                classDeclar = Factory.transFormClassToClassDeclaration(classDeclar);
            }
            return Factory.createExportDefaultDeclaration(classDeclar as ClassDeclaration | ClassExpression, start, cloneSourcePosition(classDeclar.end));
        }
        if(match(SyntaxKinds.FunctionKeyword)) {
            let funDeclar = parseFunction()
            if(funDeclar.name === null) {
                funDeclar = Factory.transFormFunctionToFunctionExpression(funDeclar)
            }else {
                funDeclar = Factory.transFormFunctionToFunctionDeclaration(funDeclar);
            }
            return Factory.createExportDefaultDeclaration(funDeclar as FunctionDeclaration | FunctionExpression, start, cloneSourcePosition(funDeclar.end));
        }   
        if(getValue() === "async" && lookahead() === SyntaxKinds.FunctionKeyword) {
            nextToken();
            context.inAsync = true;
            const funDeclar = parseFunctionDeclaration();
            context.inAsync = false;
            return Factory.createExportDefaultDeclaration(funDeclar, start, cloneSourcePosition(funDeclar.end));
        }
        const expr = parseAssigmentExpression();
        maybeSemi();
        return Factory.createExportDefaultDeclaration(expr, start, cloneSourcePosition(expr.end));
    }
    function parseExportNamedDeclaration(start: SourcePosition): ExportNamedDeclarations {
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
                specifier.push(Factory.createExportSpecifier(exported, local, cloneSourcePosition(exported.start), cloneSourcePosition(local.end)));
                continue;
            }
            specifier.push(Factory.createExportSpecifier(exported, null, cloneSourcePosition(exported.start), cloneSourcePosition(exported.end)));
        }
        expect(SyntaxKinds.BracesRightPunctuator);
        let source: StringLiteral | null = null;
        if(getValue () === "from") {
            nextToken();
            source = parseStringLiteral();
        }
        maybeSemi();
        return Factory.createExportNamedDeclaration(specifier, null, source, start, cloneSourcePosition(source.end));
    }
    function parseExportAllDeclaration(start: SourcePosition): ExportAllDeclaration {
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
        maybeSemi();
        return Factory.createExportAllDeclaration(exported, source, start, cloneSourcePosition(source.end));
    }
}