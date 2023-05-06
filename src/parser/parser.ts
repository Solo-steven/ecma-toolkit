import { createLexer } from "@/src/lexer";
import { Expression, Identifier, Property } from "@/src/syntax/ast";
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
 } from "@/src/syntax/operator";

import { getBinaryPrecedence, isBinaryOps } from "@/src/parser/utils";

export function createParser(code: string) {
    const lexer = createLexer(code);
    /**
     * 
     * @returns {}
     */
    function parse() {
        return parseExpression();
    }
    return { parse };
    function match(kind: SyntaxKinds) {
        return lexer.getToken() === kind;
    }
    function matchSet(kinds: SyntaxKinds[]) {
        return kinds.find(value => match(value));
    }
    function nextToken() {
        return lexer.nextToken();
    }
    function getToken() {
        return lexer.getToken();
    }
    function getValue() {
        return lexer.getSourceValue();
    }
    function lookahead() {
        return lexer.lookahead();
    }
    function parseProgram() {
        const body = [];
        while(!match(SyntaxKinds.EOFToken)) {
            body.push(parseStatementListItem());
        }
    }
    function parseStatementListItem() {
        const token = lexer.getToken();
        switch(token) {
            default:
                return parseExpression(); 
        }
    }
    function parseExpression(): Expression {
        const exprs = [parseAssigmentExpression()];
        while(match(SyntaxKinds.CommaToken)) {
            exprs.push(parseAssigmentExpression());
        }
        if(exprs.length === 1) {
            return exprs[0];
        }
        return {
            kind: SyntaxKinds.SequenceExpression,
            exprs,
        }
    }
    function parseAssigmentExpression(): Expression {
        const left = parseConditionalExpression();
        if (!matchSet(AssigmentOperators)) {
            return left;
        }
        const operator = nextToken();
        const right = parseConditionalExpression();
        return  {
            kind: SyntaxKinds.AssigmentExpression,
            left,
            right,
            operator: operator as AssigmentOperatorKinds,
        }
    }
    function parseConditionalExpression(): Expression {
        const condition = parseBinaryExpression();
        if(!match(SyntaxKinds.QustionOperator)) {
            return condition;
        }
        nextToken();
        const conseq = parseBinaryExpression();
        if(!match(SyntaxKinds.ColonPunctuator)) {
            throw new Error();
        }
        nextToken();
        const alter = parseBinaryExpression();
        return {
            kind: SyntaxKinds.ConditionalExpression,
            test: condition,
            consequnce: conseq,
            alter,
        }

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
            left = {
                kind: SyntaxKinds.BinaryExpression,
                left,
                right,
                operator: currentOp as BinaryOperatorKinds
            }
        }
        return left;
    }
    function parseUnaryExpression(): Expression {
        if(matchSet(UnaryOperators)) {
            const operator = nextToken();
            const argument = parseUnaryExpression();
            return {
                kind: SyntaxKinds.UnaryExpression,
                operator: operator as UnaryOperatorKinds,
                argument,
            }
        }
        return parseUpdateExpression();
    }
    function parseUpdateExpression(): Expression {
        if(matchSet(UpdateOperators)) {
            const operator = nextToken() as UpdateOperatorKinds;
            const argument = parseLeftHandSideExpression();
            return {
                kind: SyntaxKinds.UpdateExpression,
                prefix: true,
                operator,
                argument,
            }
        }
        const argument = parseLeftHandSideExpression();
        if(matchSet(UpdateOperators)) {
            const operator = nextToken() as UpdateOperatorKinds;
            return {
                kind: SyntaxKinds.UpdateExpression,
                prefix: false,
                operator,
                argument,
            }
        }
        return argument;
    }
    function parseLeftHandSideExpression(): Expression {
        let base = parsePrimaryExpression();
        while(1) {
            if(match(SyntaxKinds.ParenthesesLeftPunctuator)) {
                // callexpression
                base = parseCallExpression(base);
            }
            else if (match(SyntaxKinds.BracketLeftPunctuator)) {
                base = parseComputedMemberExpression(base);
            }
            else if (match(SyntaxKinds.DotOperator)) {
                // memberexpression
                base = parseMemberExpression(base);
            }
            else if (match(SyntaxKinds.NewKeyword)) {
                // new expression
                throw new Error()
            }
            else {
                break;
            }
        }
        return base;
    }
    function parseCallExpression(callee: Expression): Expression {
        if(!match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            throw new Error(`Unreach`);
        }
        const callExpressionArguments = parseCallExpressionArguments();
        return {
            kind: SyntaxKinds.CallExpression,
            callee,
            arguments: callExpressionArguments,
        }
    }
    /**
     * ##  Sytanx From Spec
     * ```
     * Arugment := '('')' 
     *          := '(' ArgumentList ')'
     *          := '(' ArgumentList ',' ')';
     * ArugmentList := AssigmentExpression
     *              := ...AssigmentExpression
     *              := ArugmentList ',' AssigmentExpression
     *              := ArgumentList ',' ... AssigmentExpression
     * ```
     * ## Transform above CFG grammer to following CFG grammer
     * ```
     * Arugment := '('  AssigmentExpression? [',' AssigmentExpression]? (',' | '...' AssigmentExpressiom ','?)? ')'
     * ```
     * which can be follwing spec, make it better for programming.
     * ```
     * Arugment := '(' ')'
     * Arugment := '(' AssigmentExpression NextArugmentList
     * NextArugmentList :=  ',' ')' 
     *                  :=" ',' '...' AssigmentExpression ','? ')'
     *                  :=  ',' AssigmentExpression NextArgumentList
     * ```
     * reference: 
     *  - https://tc39.es/ecma262/#prod-Arguments
     *  - https://tc39.es/ecma262/#prod-ArgumentList
     * @returns {Array<Expression>}
     */
    function parseCallExpressionArguments(): Array<Expression> {
        if(!match(SyntaxKinds.ParenthesesLeftPunctuator)) {
            throw new Error(`Unreach`);
        }
        nextToken();
        let isStart = true;
        let shouldStop = false;
        const callExpressionArguments: Array<Expression> = [];
        while(!shouldStop && !match(SyntaxKinds.ParenthesesRightPunctuator)) {
            if(isStart) {
                isStart = false
            } else {
                if(!match(SyntaxKinds.CommaToken)) {
                    throw new Error();
                }
                nextToken();
            }
            // case 1: ',' following by ')'
            if(match(SyntaxKinds.ParenthesesRightPunctuator)) {
                shouldStop = true;
                continue;
            }
            // case 2: ',' following by SpreadElement, maybe follwed by ','
            if(match(SyntaxKinds.SpreadOperator)) {
                nextToken();
                callExpressionArguments.push({
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
            callExpressionArguments.push(parseAssigmentExpression());
        }
        if(!match(SyntaxKinds.ParenthesesRightPunctuator)) {
            throw new Error();
        }
        nextToken();
        return callExpressionArguments;
    }
    function parseMemberExpression(base: Expression): Expression {
        if(!match(SyntaxKinds.DotOperator)) {
            throw new Error(`Unreach`);
        }
        nextToken();
        const property = parsePrimaryExpression();
        return {
            kind: SyntaxKinds.MemberExpression,
            computed: true,
            object: base,
            property,
        };
    }
    function parseComputedMemberExpression(base: Expression): Expression {
        if(!match(SyntaxKinds.BracketLeftPunctuator)) {
            throw new Error(`[Unreach]`);
        }
        nextToken();
        const property = parseExpression();
        if(!match(SyntaxKinds.BracketRightPunctuator)) {
            throw new Error(``);
        }
        nextToken();
        return {
            kind: SyntaxKinds.MemberExpression,
            computed: false,
            object: base,
            property,
        };
    }
    function parsePrimaryExpression(): Expression {
        switch(getToken()) {
            case SyntaxKinds.Identifier:
                // parse identifier.
                const name = getValue();
                nextToken();
                return {
                    kind: SyntaxKinds.Identifier,
                    name,
                }
            case SyntaxKinds.NumberLiteral:
                // parse number literal
                const value = getValue();
                nextToken();
                return {
                    kind: SyntaxKinds.NumberLiteral,
                    value,
                }
            case SyntaxKinds.BracesLeftPunctuator:
                // parse object expression (object literal)
                nextToken();
                const properties = parseProperties();
                if(!match(SyntaxKinds.BracesRightPunctuator)) {

                }
                return {
                    kind: SyntaxKinds.ObjectExpression,
                    properties,
                }
            case SyntaxKinds.ParenthesesLeftPunctuator:
                nextToken();
                const expr = parseExpression();
                if(!match(SyntaxKinds.ParenthesesRightPunctuator)) {
                    throw new Error(`[Error]: CoverExpression Must Close with ParenthesesRight.`);
                }
                nextToken();
                return expr;
            default:
                throw new Error(`${getToken()}`);
        }
    }
    function parseProperties(): Array<Property> {
        // parse properties as Property ` '{' Property [',' Property] ','?  '}' `
        const propertis: Array<Property> = [];
        let isStart = true;
        while(!match(SyntaxKinds.BracesRightPunctuator)) {
            if(isStart) {
                isStart  = false;
            }else {
                if(!match(SyntaxKinds.CommaToken)) {

                }
                nextToken();
            }
            if(match(SyntaxKinds.BracesRightPunctuator)) {
                break;
            }
            if(!match(SyntaxKinds.Identifier)) {

            }
            let variant: Property['variant'] = "init";
            const prefix = getValue();
            if(prefix === "set" || prefix === 'get') {
                nextToken();
                variant = prefix;
                if(!match(SyntaxKinds.Identifier)) {

                }
            }
            const key = {
                kind: SyntaxKinds.Identifier,
                name: getValue(),
            } as Identifier;
            nextToken();
            if(!match(SyntaxKinds.ColonPunctuator)) {

            }
            nextToken();
            const value = parseAssigmentExpression();
            propertis.push({
                kind: SyntaxKinds.Property,
                key,
                value,
                variant,
            })
        }
        return propertis;
    }
}