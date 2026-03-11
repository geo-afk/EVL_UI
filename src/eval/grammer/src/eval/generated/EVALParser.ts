
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { EVALParserListener } from "./EVALParserListener.js";
// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class EVALParser extends antlr.Parser {
    public static readonly INT = 1;
    public static readonly FLOAT = 2;
    public static readonly STRING_TYPE = 3;
    public static readonly BOOL = 4;
    public static readonly CONST = 5;
    public static readonly IF = 6;
    public static readonly ELSE = 7;
    public static readonly FOR = 8;
    public static readonly WHILE = 9;
    public static readonly BREAK = 10;
    public static readonly CONTINUE = 11;
    public static readonly RETURN = 12;
    public static readonly TRY = 13;
    public static readonly CATCH = 14;
    public static readonly NULL = 15;
    public static readonly TRUE = 16;
    public static readonly FALSE = 17;
    public static readonly PRINT = 18;
    public static readonly CAST = 19;
    public static readonly POW = 20;
    public static readonly SQRT = 21;
    public static readonly MIN = 22;
    public static readonly MAX = 23;
    public static readonly ROUND = 24;
    public static readonly ABS = 25;
    public static readonly PI = 26;
    public static readonly DAYS_IN_WEEK = 27;
    public static readonly HOURS_IN_DAY = 28;
    public static readonly YEAR = 29;
    public static readonly AND_OP = 30;
    public static readonly OR_OP = 31;
    public static readonly NOT_OP = 32;
    public static readonly INCREMENT = 33;
    public static readonly DECREMENT = 34;
    public static readonly PLUS_ASSIGN = 35;
    public static readonly MINUS_ASSIGN = 36;
    public static readonly MULTI_ASSIGN = 37;
    public static readonly DIV_ASSIGN = 38;
    public static readonly PLUS = 39;
    public static readonly MINUS = 40;
    public static readonly MULTI = 41;
    public static readonly DIVIDE = 42;
    public static readonly MODULUS = 43;
    public static readonly EQ = 44;
    public static readonly NEQ = 45;
    public static readonly LTE = 46;
    public static readonly GTE = 47;
    public static readonly LT = 48;
    public static readonly GT = 49;
    public static readonly ASSIGN = 50;
    public static readonly LBRACE = 51;
    public static readonly RBRACE = 52;
    public static readonly LPAREN = 53;
    public static readonly RPAREN = 54;
    public static readonly LBRACKET = 55;
    public static readonly RBRACKET = 56;
    public static readonly COMMA = 57;
    public static readonly SEMICOLON = 58;
    public static readonly REAL = 59;
    public static readonly INTEGER = 60;
    public static readonly STRING = 61;
    public static readonly IDENTIFIER = 62;
    public static readonly WS = 63;
    public static readonly LINE_COMMENT = 64;
    public static readonly BLOCK_COMMENT = 65;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_block = 2;
    public static readonly RULE_variableDeclaration = 3;
    public static readonly RULE_constDeclaration = 4;
    public static readonly RULE_assignment = 5;
    public static readonly RULE_assignOp = 6;
    public static readonly RULE_incrementDecrement = 7;
    public static readonly RULE_breakStatement = 8;
    public static readonly RULE_continueStatement = 9;
    public static readonly RULE_type = 10;
    public static readonly RULE_expression = 11;
    public static readonly RULE_builtinFunc = 12;
    public static readonly RULE_builtinCallStatement = 13;
    public static readonly RULE_castCall = 14;
    public static readonly RULE_powCall = 15;
    public static readonly RULE_sqrtCall = 16;
    public static readonly RULE_minCall = 17;
    public static readonly RULE_maxCall = 18;
    public static readonly RULE_roundCall = 19;
    public static readonly RULE_absCall = 20;
    public static readonly RULE_macroValue = 21;
    public static readonly RULE_printStatement = 22;
    public static readonly RULE_printArg = 23;
    public static readonly RULE_ifStatement = 24;
    public static readonly RULE_whileStatement = 25;
    public static readonly RULE_tryStatement = 26;

    public static readonly literalNames = [
        null, "'int'", "'float'", "'string'", "'bool'", "'const'", "'if'", 
        "'else'", "'for'", "'while'", "'break'", "'continue'", "'return'", 
        "'try'", "'catch'", "'null'", "'true'", "'false'", "'print'", "'cast'", 
        "'pow'", "'sqrt'", "'min'", "'max'", "'round'", "'abs'", "'PI'", 
        "'DAYS_IN_WEEK'", "'HOURS_IN_DAY'", "'YEAR'", "'&&'", "'||'", "'!'", 
        "'++'", "'--'", "'+='", "'-='", "'*='", "'/='", "'+'", "'-'", "'*'", 
        "'/'", "'%'", "'=='", "'!='", "'<='", "'>='", "'<'", "'>'", "'='", 
        "'{'", "'}'", "'('", "')'", "'['", "']'", "','", "';'"
    ];

    public static readonly symbolicNames = [
        null, "INT", "FLOAT", "STRING_TYPE", "BOOL", "CONST", "IF", "ELSE", 
        "FOR", "WHILE", "BREAK", "CONTINUE", "RETURN", "TRY", "CATCH", "NULL", 
        "TRUE", "FALSE", "PRINT", "CAST", "POW", "SQRT", "MIN", "MAX", "ROUND", 
        "ABS", "PI", "DAYS_IN_WEEK", "HOURS_IN_DAY", "YEAR", "AND_OP", "OR_OP", 
        "NOT_OP", "INCREMENT", "DECREMENT", "PLUS_ASSIGN", "MINUS_ASSIGN", 
        "MULTI_ASSIGN", "DIV_ASSIGN", "PLUS", "MINUS", "MULTI", "DIVIDE", 
        "MODULUS", "EQ", "NEQ", "LTE", "GTE", "LT", "GT", "ASSIGN", "LBRACE", 
        "RBRACE", "LPAREN", "RPAREN", "LBRACKET", "RBRACKET", "COMMA", "SEMICOLON", 
        "REAL", "INTEGER", "STRING", "IDENTIFIER", "WS", "LINE_COMMENT", 
        "BLOCK_COMMENT"
    ];
    public static readonly ruleNames = [
        "program", "statement", "block", "variableDeclaration", "constDeclaration", 
        "assignment", "assignOp", "incrementDecrement", "breakStatement", 
        "continueStatement", "type", "expression", "builtinFunc", "builtinCallStatement", 
        "castCall", "powCall", "sqrtCall", "minCall", "maxCall", "roundCall", 
        "absCall", "macroValue", "printStatement", "printArg", "ifStatement", 
        "whileStatement", "tryStatement",
    ];

    public get grammarFileName(): string { return "EVALParser.g4"; }
    public get literalNames(): (string | null)[] { return EVALParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return EVALParser.symbolicNames; }
    public get ruleNames(): string[] { return EVALParser.ruleNames; }
    public get serializedATN(): number[] { return EVALParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, EVALParser._ATN, EVALParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public program(): ProgramContext {
        let localContext = new ProgramContext(this.context, this.state);
        this.enterRule(localContext, 0, EVALParser.RULE_program);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 57;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 274046) !== 0) || _la === 51 || _la === 62) {
                {
                {
                this.state = 54;
                this.statement();
                }
                }
                this.state = 59;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 60;
            this.match(EVALParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public statement(): StatementContext {
        let localContext = new StatementContext(this.context, this.state);
        this.enterRule(localContext, 2, EVALParser.RULE_statement);
        try {
            this.state = 73;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 62;
                this.variableDeclaration();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 63;
                this.constDeclaration();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 64;
                this.assignment();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 65;
                this.incrementDecrement();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 66;
                this.ifStatement();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 67;
                this.whileStatement();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 68;
                this.tryStatement();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 69;
                this.breakStatement();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 70;
                this.continueStatement();
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 71;
                this.builtinCallStatement();
                }
                break;
            case 11:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 72;
                this.block();
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public block(): BlockContext {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 4, EVALParser.RULE_block);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 75;
            this.match(EVALParser.LBRACE);
            this.state = 79;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 274046) !== 0) || _la === 51 || _la === 62) {
                {
                {
                this.state = 76;
                this.statement();
                }
                }
                this.state = 81;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 82;
            this.match(EVALParser.RBRACE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public variableDeclaration(): VariableDeclarationContext {
        let localContext = new VariableDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 6, EVALParser.RULE_variableDeclaration);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 84;
            this.type_();
            this.state = 85;
            this.match(EVALParser.IDENTIFIER);
            this.state = 86;
            this.match(EVALParser.ASSIGN);
            this.state = 87;
            this.expression(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public constDeclaration(): ConstDeclarationContext {
        let localContext = new ConstDeclarationContext(this.context, this.state);
        this.enterRule(localContext, 8, EVALParser.RULE_constDeclaration);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 89;
            this.match(EVALParser.CONST);
            this.state = 90;
            this.variableDeclaration();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assignment(): AssignmentContext {
        let localContext = new AssignmentContext(this.context, this.state);
        this.enterRule(localContext, 10, EVALParser.RULE_assignment);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 92;
            this.match(EVALParser.IDENTIFIER);
            this.state = 93;
            this.assignOp();
            this.state = 94;
            this.expression(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public assignOp(): AssignOpContext {
        let localContext = new AssignOpContext(this.context, this.state);
        this.enterRule(localContext, 12, EVALParser.RULE_assignOp);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 96;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & 32783) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public incrementDecrement(): IncrementDecrementContext {
        let localContext = new IncrementDecrementContext(this.context, this.state);
        this.enterRule(localContext, 14, EVALParser.RULE_incrementDecrement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 98;
            this.match(EVALParser.IDENTIFIER);
            this.state = 99;
            _la = this.tokenStream.LA(1);
            if(!(_la === 33 || _la === 34)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public breakStatement(): BreakStatementContext {
        let localContext = new BreakStatementContext(this.context, this.state);
        this.enterRule(localContext, 16, EVALParser.RULE_breakStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 101;
            this.match(EVALParser.BREAK);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public continueStatement(): ContinueStatementContext {
        let localContext = new ContinueStatementContext(this.context, this.state);
        this.enterRule(localContext, 18, EVALParser.RULE_continueStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 103;
            this.match(EVALParser.CONTINUE);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public type_(): TypeContext {
        let localContext = new TypeContext(this.context, this.state);
        this.enterRule(localContext, 20, EVALParser.RULE_type);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 105;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 30) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public expression(): ExpressionContext;
    public expression(_p: number): ExpressionContext;
    public expression(_p?: number): ExpressionContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExpressionContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 22;
        this.enterRecursionRule(localContext, 22, EVALParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 125;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case EVALParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 108;
                this.match(EVALParser.MINUS);
                this.state = 109;
                this.expression(12);
                }
                break;
            case EVALParser.NOT_OP:
                {
                localContext = new UnaryNotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 110;
                this.match(EVALParser.NOT_OP);
                this.state = 111;
                this.expression(11);
                }
                break;
            case EVALParser.LPAREN:
                {
                localContext = new ParenExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 112;
                this.match(EVALParser.LPAREN);
                this.state = 113;
                this.expression(0);
                this.state = 114;
                this.match(EVALParser.RPAREN);
                }
                break;
            case EVALParser.CAST:
            case EVALParser.POW:
            case EVALParser.SQRT:
            case EVALParser.MIN:
            case EVALParser.MAX:
            case EVALParser.ROUND:
            case EVALParser.ABS:
                {
                localContext = new BuiltinExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 116;
                this.builtinFunc();
                }
                break;
            case EVALParser.PI:
            case EVALParser.DAYS_IN_WEEK:
            case EVALParser.HOURS_IN_DAY:
            case EVALParser.YEAR:
                {
                localContext = new MacroExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 117;
                this.macroValue();
                }
                break;
            case EVALParser.IDENTIFIER:
                {
                localContext = new IdentExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 118;
                this.match(EVALParser.IDENTIFIER);
                }
                break;
            case EVALParser.INTEGER:
                {
                localContext = new IntLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 119;
                this.match(EVALParser.INTEGER);
                }
                break;
            case EVALParser.REAL:
                {
                localContext = new RealLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 120;
                this.match(EVALParser.REAL);
                }
                break;
            case EVALParser.STRING:
                {
                localContext = new StringLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 121;
                this.match(EVALParser.STRING);
                }
                break;
            case EVALParser.TRUE:
                {
                localContext = new TrueLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 122;
                this.match(EVALParser.TRUE);
                }
                break;
            case EVALParser.FALSE:
                {
                localContext = new FalseLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 123;
                this.match(EVALParser.FALSE);
                }
                break;
            case EVALParser.NULL:
                {
                localContext = new NullLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 124;
                this.match(EVALParser.NULL);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 147;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 5, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 145;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
                    case 1:
                        {
                        localContext = new LogicalOrExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 127;
                        if (!(this.precpred(this.context, 18))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 18)");
                        }
                        this.state = 128;
                        this.match(EVALParser.OR_OP);
                        this.state = 129;
                        this.expression(19);
                        }
                        break;
                    case 2:
                        {
                        localContext = new LogicalAndExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 130;
                        if (!(this.precpred(this.context, 17))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 17)");
                        }
                        this.state = 131;
                        this.match(EVALParser.AND_OP);
                        this.state = 132;
                        this.expression(18);
                        }
                        break;
                    case 3:
                        {
                        localContext = new EqualityExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 133;
                        if (!(this.precpred(this.context, 16))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 16)");
                        }
                        this.state = 134;
                        (localContext as EqualityExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 44 || _la === 45)) {
                            (localContext as EqualityExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 135;
                        this.expression(17);
                        }
                        break;
                    case 4:
                        {
                        localContext = new RelationalExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 136;
                        if (!(this.precpred(this.context, 15))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 15)");
                        }
                        this.state = 137;
                        (localContext as RelationalExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 15) !== 0))) {
                            (localContext as RelationalExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 138;
                        this.expression(16);
                        }
                        break;
                    case 5:
                        {
                        localContext = new AdditiveExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 139;
                        if (!(this.precpred(this.context, 14))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 14)");
                        }
                        this.state = 140;
                        (localContext as AdditiveExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 39 || _la === 40)) {
                            (localContext as AdditiveExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 141;
                        this.expression(15);
                        }
                        break;
                    case 6:
                        {
                        localContext = new MultiplicativeExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 142;
                        if (!(this.precpred(this.context, 13))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 13)");
                        }
                        this.state = 143;
                        (localContext as MultiplicativeExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 7) !== 0))) {
                            (localContext as MultiplicativeExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 144;
                        this.expression(14);
                        }
                        break;
                    }
                    }
                }
                this.state = 149;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 5, this.context);
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public builtinFunc(): BuiltinFuncContext {
        let localContext = new BuiltinFuncContext(this.context, this.state);
        this.enterRule(localContext, 24, EVALParser.RULE_builtinFunc);
        try {
            this.state = 157;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case EVALParser.CAST:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 150;
                this.castCall();
                }
                break;
            case EVALParser.POW:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 151;
                this.powCall();
                }
                break;
            case EVALParser.SQRT:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 152;
                this.sqrtCall();
                }
                break;
            case EVALParser.MIN:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 153;
                this.minCall();
                }
                break;
            case EVALParser.MAX:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 154;
                this.maxCall();
                }
                break;
            case EVALParser.ROUND:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 155;
                this.roundCall();
                }
                break;
            case EVALParser.ABS:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 156;
                this.absCall();
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public builtinCallStatement(): BuiltinCallStatementContext {
        let localContext = new BuiltinCallStatementContext(this.context, this.state);
        this.enterRule(localContext, 26, EVALParser.RULE_builtinCallStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 159;
            this.printStatement();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public castCall(): CastCallContext {
        let localContext = new CastCallContext(this.context, this.state);
        this.enterRule(localContext, 28, EVALParser.RULE_castCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 161;
            this.match(EVALParser.CAST);
            this.state = 162;
            this.match(EVALParser.LPAREN);
            this.state = 163;
            this.expression(0);
            this.state = 164;
            this.match(EVALParser.COMMA);
            this.state = 165;
            this.type_();
            this.state = 166;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public powCall(): PowCallContext {
        let localContext = new PowCallContext(this.context, this.state);
        this.enterRule(localContext, 30, EVALParser.RULE_powCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 168;
            this.match(EVALParser.POW);
            this.state = 169;
            this.match(EVALParser.LPAREN);
            this.state = 170;
            this.expression(0);
            this.state = 171;
            this.match(EVALParser.COMMA);
            this.state = 172;
            this.expression(0);
            this.state = 173;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public sqrtCall(): SqrtCallContext {
        let localContext = new SqrtCallContext(this.context, this.state);
        this.enterRule(localContext, 32, EVALParser.RULE_sqrtCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 175;
            this.match(EVALParser.SQRT);
            this.state = 176;
            this.match(EVALParser.LPAREN);
            this.state = 177;
            this.expression(0);
            this.state = 178;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public minCall(): MinCallContext {
        let localContext = new MinCallContext(this.context, this.state);
        this.enterRule(localContext, 34, EVALParser.RULE_minCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 180;
            this.match(EVALParser.MIN);
            this.state = 181;
            this.match(EVALParser.LPAREN);
            this.state = 182;
            this.expression(0);
            this.state = 183;
            this.match(EVALParser.COMMA);
            this.state = 184;
            this.expression(0);
            this.state = 185;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public maxCall(): MaxCallContext {
        let localContext = new MaxCallContext(this.context, this.state);
        this.enterRule(localContext, 36, EVALParser.RULE_maxCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 187;
            this.match(EVALParser.MAX);
            this.state = 188;
            this.match(EVALParser.LPAREN);
            this.state = 189;
            this.expression(0);
            this.state = 190;
            this.match(EVALParser.COMMA);
            this.state = 191;
            this.expression(0);
            this.state = 192;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public roundCall(): RoundCallContext {
        let localContext = new RoundCallContext(this.context, this.state);
        this.enterRule(localContext, 38, EVALParser.RULE_roundCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 194;
            this.match(EVALParser.ROUND);
            this.state = 195;
            this.match(EVALParser.LPAREN);
            this.state = 196;
            this.expression(0);
            this.state = 197;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public absCall(): AbsCallContext {
        let localContext = new AbsCallContext(this.context, this.state);
        this.enterRule(localContext, 40, EVALParser.RULE_absCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 199;
            this.match(EVALParser.ABS);
            this.state = 200;
            this.match(EVALParser.LPAREN);
            this.state = 201;
            this.expression(0);
            this.state = 202;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public macroValue(): MacroValueContext {
        let localContext = new MacroValueContext(this.context, this.state);
        this.enterRule(localContext, 42, EVALParser.RULE_macroValue);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 204;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 1006632960) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
            }
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public printStatement(): PrintStatementContext {
        let localContext = new PrintStatementContext(this.context, this.state);
        this.enterRule(localContext, 44, EVALParser.RULE_printStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 206;
            this.match(EVALParser.PRINT);
            this.state = 207;
            this.match(EVALParser.LPAREN);
            this.state = 208;
            this.printArg();
            this.state = 213;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 57) {
                {
                {
                this.state = 209;
                this.match(EVALParser.COMMA);
                this.state = 210;
                this.printArg();
                }
                }
                this.state = 215;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 216;
            this.match(EVALParser.RPAREN);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public printArg(): PrintArgContext {
        let localContext = new PrintArgContext(this.context, this.state);
        this.enterRule(localContext, 46, EVALParser.RULE_printArg);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 218;
            this.expression(0);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public ifStatement(): IfStatementContext {
        let localContext = new IfStatementContext(this.context, this.state);
        this.enterRule(localContext, 48, EVALParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 220;
            this.match(EVALParser.IF);
            this.state = 221;
            this.match(EVALParser.LPAREN);
            this.state = 222;
            this.expression(0);
            this.state = 223;
            this.match(EVALParser.RPAREN);
            this.state = 224;
            this.block();
            this.state = 234;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 8, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 225;
                    this.match(EVALParser.ELSE);
                    this.state = 226;
                    this.match(EVALParser.IF);
                    this.state = 227;
                    this.match(EVALParser.LPAREN);
                    this.state = 228;
                    this.expression(0);
                    this.state = 229;
                    this.match(EVALParser.RPAREN);
                    this.state = 230;
                    this.block();
                    }
                    }
                }
                this.state = 236;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 8, this.context);
            }
            this.state = 239;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7) {
                {
                this.state = 237;
                this.match(EVALParser.ELSE);
                this.state = 238;
                this.block();
                }
            }

            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public whileStatement(): WhileStatementContext {
        let localContext = new WhileStatementContext(this.context, this.state);
        this.enterRule(localContext, 50, EVALParser.RULE_whileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 241;
            this.match(EVALParser.WHILE);
            this.state = 242;
            this.match(EVALParser.LPAREN);
            this.state = 243;
            this.expression(0);
            this.state = 244;
            this.match(EVALParser.RPAREN);
            this.state = 245;
            this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public tryStatement(): TryStatementContext {
        let localContext = new TryStatementContext(this.context, this.state);
        this.enterRule(localContext, 52, EVALParser.RULE_tryStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 247;
            this.match(EVALParser.TRY);
            this.state = 248;
            this.block();
            this.state = 249;
            this.match(EVALParser.CATCH);
            this.state = 250;
            this.match(EVALParser.LPAREN);
            this.state = 251;
            this.match(EVALParser.IDENTIFIER);
            this.state = 252;
            this.match(EVALParser.RPAREN);
            this.state = 253;
            this.block();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 11:
            return this.expression_sempred(localContext as ExpressionContext, predIndex);
        }
        return true;
    }
    private expression_sempred(localContext: ExpressionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 18);
        case 1:
            return this.precpred(this.context, 17);
        case 2:
            return this.precpred(this.context, 16);
        case 3:
            return this.precpred(this.context, 15);
        case 4:
            return this.precpred(this.context, 14);
        case 5:
            return this.precpred(this.context, 13);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,65,256,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        1,0,5,0,56,8,0,10,0,12,0,59,9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,3,1,74,8,1,1,2,1,2,5,2,78,8,2,10,2,12,2,81,9,
        2,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,6,1,
        6,1,7,1,7,1,7,1,8,1,8,1,9,1,9,1,10,1,10,1,11,1,11,1,11,1,11,1,11,
        1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,
        3,11,126,8,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,
        1,11,1,11,1,11,1,11,1,11,1,11,1,11,1,11,5,11,146,8,11,10,11,12,11,
        149,9,11,1,12,1,12,1,12,1,12,1,12,1,12,1,12,3,12,158,8,12,1,13,1,
        13,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,15,1,15,1,15,1,15,1,15,1,
        15,1,15,1,16,1,16,1,16,1,16,1,16,1,17,1,17,1,17,1,17,1,17,1,17,1,
        17,1,18,1,18,1,18,1,18,1,18,1,18,1,18,1,19,1,19,1,19,1,19,1,19,1,
        20,1,20,1,20,1,20,1,20,1,21,1,21,1,22,1,22,1,22,1,22,1,22,5,22,212,
        8,22,10,22,12,22,215,9,22,1,22,1,22,1,23,1,23,1,24,1,24,1,24,1,24,
        1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,5,24,233,8,24,10,24,12,24,
        236,9,24,1,24,1,24,3,24,240,8,24,1,25,1,25,1,25,1,25,1,25,1,25,1,
        26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,1,26,0,1,22,27,0,2,4,6,8,10,
        12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,0,
        8,2,0,35,38,50,50,1,0,33,34,1,0,1,4,1,0,44,45,1,0,46,49,1,0,39,40,
        1,0,41,43,1,0,26,29,266,0,57,1,0,0,0,2,73,1,0,0,0,4,75,1,0,0,0,6,
        84,1,0,0,0,8,89,1,0,0,0,10,92,1,0,0,0,12,96,1,0,0,0,14,98,1,0,0,
        0,16,101,1,0,0,0,18,103,1,0,0,0,20,105,1,0,0,0,22,125,1,0,0,0,24,
        157,1,0,0,0,26,159,1,0,0,0,28,161,1,0,0,0,30,168,1,0,0,0,32,175,
        1,0,0,0,34,180,1,0,0,0,36,187,1,0,0,0,38,194,1,0,0,0,40,199,1,0,
        0,0,42,204,1,0,0,0,44,206,1,0,0,0,46,218,1,0,0,0,48,220,1,0,0,0,
        50,241,1,0,0,0,52,247,1,0,0,0,54,56,3,2,1,0,55,54,1,0,0,0,56,59,
        1,0,0,0,57,55,1,0,0,0,57,58,1,0,0,0,58,60,1,0,0,0,59,57,1,0,0,0,
        60,61,5,0,0,1,61,1,1,0,0,0,62,74,3,6,3,0,63,74,3,8,4,0,64,74,3,10,
        5,0,65,74,3,14,7,0,66,74,3,48,24,0,67,74,3,50,25,0,68,74,3,52,26,
        0,69,74,3,16,8,0,70,74,3,18,9,0,71,74,3,26,13,0,72,74,3,4,2,0,73,
        62,1,0,0,0,73,63,1,0,0,0,73,64,1,0,0,0,73,65,1,0,0,0,73,66,1,0,0,
        0,73,67,1,0,0,0,73,68,1,0,0,0,73,69,1,0,0,0,73,70,1,0,0,0,73,71,
        1,0,0,0,73,72,1,0,0,0,74,3,1,0,0,0,75,79,5,51,0,0,76,78,3,2,1,0,
        77,76,1,0,0,0,78,81,1,0,0,0,79,77,1,0,0,0,79,80,1,0,0,0,80,82,1,
        0,0,0,81,79,1,0,0,0,82,83,5,52,0,0,83,5,1,0,0,0,84,85,3,20,10,0,
        85,86,5,62,0,0,86,87,5,50,0,0,87,88,3,22,11,0,88,7,1,0,0,0,89,90,
        5,5,0,0,90,91,3,6,3,0,91,9,1,0,0,0,92,93,5,62,0,0,93,94,3,12,6,0,
        94,95,3,22,11,0,95,11,1,0,0,0,96,97,7,0,0,0,97,13,1,0,0,0,98,99,
        5,62,0,0,99,100,7,1,0,0,100,15,1,0,0,0,101,102,5,10,0,0,102,17,1,
        0,0,0,103,104,5,11,0,0,104,19,1,0,0,0,105,106,7,2,0,0,106,21,1,0,
        0,0,107,108,6,11,-1,0,108,109,5,40,0,0,109,126,3,22,11,12,110,111,
        5,32,0,0,111,126,3,22,11,11,112,113,5,53,0,0,113,114,3,22,11,0,114,
        115,5,54,0,0,115,126,1,0,0,0,116,126,3,24,12,0,117,126,3,42,21,0,
        118,126,5,62,0,0,119,126,5,60,0,0,120,126,5,59,0,0,121,126,5,61,
        0,0,122,126,5,16,0,0,123,126,5,17,0,0,124,126,5,15,0,0,125,107,1,
        0,0,0,125,110,1,0,0,0,125,112,1,0,0,0,125,116,1,0,0,0,125,117,1,
        0,0,0,125,118,1,0,0,0,125,119,1,0,0,0,125,120,1,0,0,0,125,121,1,
        0,0,0,125,122,1,0,0,0,125,123,1,0,0,0,125,124,1,0,0,0,126,147,1,
        0,0,0,127,128,10,18,0,0,128,129,5,31,0,0,129,146,3,22,11,19,130,
        131,10,17,0,0,131,132,5,30,0,0,132,146,3,22,11,18,133,134,10,16,
        0,0,134,135,7,3,0,0,135,146,3,22,11,17,136,137,10,15,0,0,137,138,
        7,4,0,0,138,146,3,22,11,16,139,140,10,14,0,0,140,141,7,5,0,0,141,
        146,3,22,11,15,142,143,10,13,0,0,143,144,7,6,0,0,144,146,3,22,11,
        14,145,127,1,0,0,0,145,130,1,0,0,0,145,133,1,0,0,0,145,136,1,0,0,
        0,145,139,1,0,0,0,145,142,1,0,0,0,146,149,1,0,0,0,147,145,1,0,0,
        0,147,148,1,0,0,0,148,23,1,0,0,0,149,147,1,0,0,0,150,158,3,28,14,
        0,151,158,3,30,15,0,152,158,3,32,16,0,153,158,3,34,17,0,154,158,
        3,36,18,0,155,158,3,38,19,0,156,158,3,40,20,0,157,150,1,0,0,0,157,
        151,1,0,0,0,157,152,1,0,0,0,157,153,1,0,0,0,157,154,1,0,0,0,157,
        155,1,0,0,0,157,156,1,0,0,0,158,25,1,0,0,0,159,160,3,44,22,0,160,
        27,1,0,0,0,161,162,5,19,0,0,162,163,5,53,0,0,163,164,3,22,11,0,164,
        165,5,57,0,0,165,166,3,20,10,0,166,167,5,54,0,0,167,29,1,0,0,0,168,
        169,5,20,0,0,169,170,5,53,0,0,170,171,3,22,11,0,171,172,5,57,0,0,
        172,173,3,22,11,0,173,174,5,54,0,0,174,31,1,0,0,0,175,176,5,21,0,
        0,176,177,5,53,0,0,177,178,3,22,11,0,178,179,5,54,0,0,179,33,1,0,
        0,0,180,181,5,22,0,0,181,182,5,53,0,0,182,183,3,22,11,0,183,184,
        5,57,0,0,184,185,3,22,11,0,185,186,5,54,0,0,186,35,1,0,0,0,187,188,
        5,23,0,0,188,189,5,53,0,0,189,190,3,22,11,0,190,191,5,57,0,0,191,
        192,3,22,11,0,192,193,5,54,0,0,193,37,1,0,0,0,194,195,5,24,0,0,195,
        196,5,53,0,0,196,197,3,22,11,0,197,198,5,54,0,0,198,39,1,0,0,0,199,
        200,5,25,0,0,200,201,5,53,0,0,201,202,3,22,11,0,202,203,5,54,0,0,
        203,41,1,0,0,0,204,205,7,7,0,0,205,43,1,0,0,0,206,207,5,18,0,0,207,
        208,5,53,0,0,208,213,3,46,23,0,209,210,5,57,0,0,210,212,3,46,23,
        0,211,209,1,0,0,0,212,215,1,0,0,0,213,211,1,0,0,0,213,214,1,0,0,
        0,214,216,1,0,0,0,215,213,1,0,0,0,216,217,5,54,0,0,217,45,1,0,0,
        0,218,219,3,22,11,0,219,47,1,0,0,0,220,221,5,6,0,0,221,222,5,53,
        0,0,222,223,3,22,11,0,223,224,5,54,0,0,224,234,3,4,2,0,225,226,5,
        7,0,0,226,227,5,6,0,0,227,228,5,53,0,0,228,229,3,22,11,0,229,230,
        5,54,0,0,230,231,3,4,2,0,231,233,1,0,0,0,232,225,1,0,0,0,233,236,
        1,0,0,0,234,232,1,0,0,0,234,235,1,0,0,0,235,239,1,0,0,0,236,234,
        1,0,0,0,237,238,5,7,0,0,238,240,3,4,2,0,239,237,1,0,0,0,239,240,
        1,0,0,0,240,49,1,0,0,0,241,242,5,9,0,0,242,243,5,53,0,0,243,244,
        3,22,11,0,244,245,5,54,0,0,245,246,3,4,2,0,246,51,1,0,0,0,247,248,
        5,13,0,0,248,249,3,4,2,0,249,250,5,14,0,0,250,251,5,53,0,0,251,252,
        5,62,0,0,252,253,5,54,0,0,253,254,3,4,2,0,254,53,1,0,0,0,10,57,73,
        79,125,145,147,157,213,234,239
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!EVALParser.__ATN) {
            EVALParser.__ATN = new antlr.ATNDeserializer().deserialize(EVALParser._serializedATN);
        }

        return EVALParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(EVALParser.literalNames, EVALParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return EVALParser.vocabulary;
    }

    private static readonly decisionsToDFA = EVALParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class ProgramContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(EVALParser.EOF, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_program;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterProgram) {
             listener.enterProgram(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitProgram) {
             listener.exitProgram(this);
        }
    }
}


export class StatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public variableDeclaration(): VariableDeclarationContext | null {
        return this.getRuleContext(0, VariableDeclarationContext);
    }
    public constDeclaration(): ConstDeclarationContext | null {
        return this.getRuleContext(0, ConstDeclarationContext);
    }
    public assignment(): AssignmentContext | null {
        return this.getRuleContext(0, AssignmentContext);
    }
    public incrementDecrement(): IncrementDecrementContext | null {
        return this.getRuleContext(0, IncrementDecrementContext);
    }
    public ifStatement(): IfStatementContext | null {
        return this.getRuleContext(0, IfStatementContext);
    }
    public whileStatement(): WhileStatementContext | null {
        return this.getRuleContext(0, WhileStatementContext);
    }
    public tryStatement(): TryStatementContext | null {
        return this.getRuleContext(0, TryStatementContext);
    }
    public breakStatement(): BreakStatementContext | null {
        return this.getRuleContext(0, BreakStatementContext);
    }
    public continueStatement(): ContinueStatementContext | null {
        return this.getRuleContext(0, ContinueStatementContext);
    }
    public builtinCallStatement(): BuiltinCallStatementContext | null {
        return this.getRuleContext(0, BuiltinCallStatementContext);
    }
    public block(): BlockContext | null {
        return this.getRuleContext(0, BlockContext);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_statement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterStatement) {
             listener.enterStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitStatement) {
             listener.exitStatement(this);
        }
    }
}


export class BlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBRACE(): antlr.TerminalNode {
        return this.getToken(EVALParser.LBRACE, 0)!;
    }
    public RBRACE(): antlr.TerminalNode {
        return this.getToken(EVALParser.RBRACE, 0)!;
    }
    public statement(): StatementContext[];
    public statement(i: number): StatementContext | null;
    public statement(i?: number): StatementContext[] | StatementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementContext);
        }

        return this.getRuleContext(i, StatementContext);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_block;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterBlock) {
             listener.enterBlock(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitBlock) {
             listener.exitBlock(this);
        }
    }
}


export class VariableDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(EVALParser.IDENTIFIER, 0)!;
    }
    public ASSIGN(): antlr.TerminalNode {
        return this.getToken(EVALParser.ASSIGN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_variableDeclaration;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterVariableDeclaration) {
             listener.enterVariableDeclaration(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitVariableDeclaration) {
             listener.exitVariableDeclaration(this);
        }
    }
}


export class ConstDeclarationContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CONST(): antlr.TerminalNode {
        return this.getToken(EVALParser.CONST, 0)!;
    }
    public variableDeclaration(): VariableDeclarationContext {
        return this.getRuleContext(0, VariableDeclarationContext)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_constDeclaration;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterConstDeclaration) {
             listener.enterConstDeclaration(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitConstDeclaration) {
             listener.exitConstDeclaration(this);
        }
    }
}


export class AssignmentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(EVALParser.IDENTIFIER, 0)!;
    }
    public assignOp(): AssignOpContext {
        return this.getRuleContext(0, AssignOpContext)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_assignment;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterAssignment) {
             listener.enterAssignment(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitAssignment) {
             listener.exitAssignment(this);
        }
    }
}


export class AssignOpContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.ASSIGN, 0);
    }
    public PLUS_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.PLUS_ASSIGN, 0);
    }
    public MINUS_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.MINUS_ASSIGN, 0);
    }
    public MULTI_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.MULTI_ASSIGN, 0);
    }
    public DIV_ASSIGN(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.DIV_ASSIGN, 0);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_assignOp;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterAssignOp) {
             listener.enterAssignOp(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitAssignOp) {
             listener.exitAssignOp(this);
        }
    }
}


export class IncrementDecrementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(EVALParser.IDENTIFIER, 0)!;
    }
    public INCREMENT(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.INCREMENT, 0);
    }
    public DECREMENT(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.DECREMENT, 0);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_incrementDecrement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterIncrementDecrement) {
             listener.enterIncrementDecrement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitIncrementDecrement) {
             listener.exitIncrementDecrement(this);
        }
    }
}


export class BreakStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public BREAK(): antlr.TerminalNode {
        return this.getToken(EVALParser.BREAK, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_breakStatement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterBreakStatement) {
             listener.enterBreakStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitBreakStatement) {
             listener.exitBreakStatement(this);
        }
    }
}


export class ContinueStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CONTINUE(): antlr.TerminalNode {
        return this.getToken(EVALParser.CONTINUE, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_continueStatement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterContinueStatement) {
             listener.enterContinueStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitContinueStatement) {
             listener.exitContinueStatement(this);
        }
    }
}


export class TypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public INT(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.INT, 0);
    }
    public FLOAT(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.FLOAT, 0);
    }
    public STRING_TYPE(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.STRING_TYPE, 0);
    }
    public BOOL(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.BOOL, 0);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_type;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterType) {
             listener.enterType(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitType) {
             listener.exitType(this);
        }
    }
}


export class ExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_expression;
    }
    public override copyFrom(ctx: ExpressionContext): void {
        super.copyFrom(ctx);
    }
}
export class UnaryMinusExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public MINUS(): antlr.TerminalNode {
        return this.getToken(EVALParser.MINUS, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterUnaryMinusExpr) {
             listener.enterUnaryMinusExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitUnaryMinusExpr) {
             listener.exitUnaryMinusExpr(this);
        }
    }
}
export class UnaryNotExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NOT_OP(): antlr.TerminalNode {
        return this.getToken(EVALParser.NOT_OP, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterUnaryNotExpr) {
             listener.enterUnaryNotExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitUnaryNotExpr) {
             listener.exitUnaryNotExpr(this);
        }
    }
}
export class ParenExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterParenExpr) {
             listener.enterParenExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitParenExpr) {
             listener.exitParenExpr(this);
        }
    }
}
export class BuiltinExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public builtinFunc(): BuiltinFuncContext {
        return this.getRuleContext(0, BuiltinFuncContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterBuiltinExpr) {
             listener.enterBuiltinExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitBuiltinExpr) {
             listener.exitBuiltinExpr(this);
        }
    }
}
export class MacroExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public macroValue(): MacroValueContext {
        return this.getRuleContext(0, MacroValueContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterMacroExpr) {
             listener.enterMacroExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitMacroExpr) {
             listener.exitMacroExpr(this);
        }
    }
}
export class IdentExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(EVALParser.IDENTIFIER, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterIdentExpr) {
             listener.enterIdentExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitIdentExpr) {
             listener.exitIdentExpr(this);
        }
    }
}
export class IntLiteralContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public INTEGER(): antlr.TerminalNode {
        return this.getToken(EVALParser.INTEGER, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterIntLiteral) {
             listener.enterIntLiteral(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitIntLiteral) {
             listener.exitIntLiteral(this);
        }
    }
}
export class RealLiteralContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public REAL(): antlr.TerminalNode {
        return this.getToken(EVALParser.REAL, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterRealLiteral) {
             listener.enterRealLiteral(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitRealLiteral) {
             listener.exitRealLiteral(this);
        }
    }
}
export class StringLiteralContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public STRING(): antlr.TerminalNode {
        return this.getToken(EVALParser.STRING, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterStringLiteral) {
             listener.enterStringLiteral(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitStringLiteral) {
             listener.exitStringLiteral(this);
        }
    }
}
export class TrueLiteralContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public TRUE(): antlr.TerminalNode {
        return this.getToken(EVALParser.TRUE, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterTrueLiteral) {
             listener.enterTrueLiteral(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitTrueLiteral) {
             listener.exitTrueLiteral(this);
        }
    }
}
export class FalseLiteralContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public FALSE(): antlr.TerminalNode {
        return this.getToken(EVALParser.FALSE, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterFalseLiteral) {
             listener.enterFalseLiteral(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitFalseLiteral) {
             listener.exitFalseLiteral(this);
        }
    }
}
export class NullLiteralContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public NULL(): antlr.TerminalNode {
        return this.getToken(EVALParser.NULL, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterNullLiteral) {
             listener.enterNullLiteral(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitNullLiteral) {
             listener.exitNullLiteral(this);
        }
    }
}
export class LogicalOrExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public OR_OP(): antlr.TerminalNode {
        return this.getToken(EVALParser.OR_OP, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterLogicalOrExpr) {
             listener.enterLogicalOrExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitLogicalOrExpr) {
             listener.exitLogicalOrExpr(this);
        }
    }
}
export class LogicalAndExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public AND_OP(): antlr.TerminalNode {
        return this.getToken(EVALParser.AND_OP, 0)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterLogicalAndExpr) {
             listener.enterLogicalAndExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitLogicalAndExpr) {
             listener.exitLogicalAndExpr(this);
        }
    }
}
export class EqualityExprContext extends ExpressionContext {
    public _op?: Token | null;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public EQ(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.EQ, 0);
    }
    public NEQ(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.NEQ, 0);
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterEqualityExpr) {
             listener.enterEqualityExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitEqualityExpr) {
             listener.exitEqualityExpr(this);
        }
    }
}
export class RelationalExprContext extends ExpressionContext {
    public _op?: Token | null;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public LT(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.LT, 0);
    }
    public GT(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.GT, 0);
    }
    public LTE(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.LTE, 0);
    }
    public GTE(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.GTE, 0);
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterRelationalExpr) {
             listener.enterRelationalExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitRelationalExpr) {
             listener.exitRelationalExpr(this);
        }
    }
}
export class AdditiveExprContext extends ExpressionContext {
    public _op?: Token | null;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public PLUS(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.PLUS, 0);
    }
    public MINUS(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.MINUS, 0);
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterAdditiveExpr) {
             listener.enterAdditiveExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitAdditiveExpr) {
             listener.exitAdditiveExpr(this);
        }
    }
}
export class MultiplicativeExprContext extends ExpressionContext {
    public _op?: Token | null;
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public MULTI(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.MULTI, 0);
    }
    public DIVIDE(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.DIVIDE, 0);
    }
    public MODULUS(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.MODULUS, 0);
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterMultiplicativeExpr) {
             listener.enterMultiplicativeExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitMultiplicativeExpr) {
             listener.exitMultiplicativeExpr(this);
        }
    }
}


export class BuiltinFuncContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public castCall(): CastCallContext | null {
        return this.getRuleContext(0, CastCallContext);
    }
    public powCall(): PowCallContext | null {
        return this.getRuleContext(0, PowCallContext);
    }
    public sqrtCall(): SqrtCallContext | null {
        return this.getRuleContext(0, SqrtCallContext);
    }
    public minCall(): MinCallContext | null {
        return this.getRuleContext(0, MinCallContext);
    }
    public maxCall(): MaxCallContext | null {
        return this.getRuleContext(0, MaxCallContext);
    }
    public roundCall(): RoundCallContext | null {
        return this.getRuleContext(0, RoundCallContext);
    }
    public absCall(): AbsCallContext | null {
        return this.getRuleContext(0, AbsCallContext);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_builtinFunc;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterBuiltinFunc) {
             listener.enterBuiltinFunc(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitBuiltinFunc) {
             listener.exitBuiltinFunc(this);
        }
    }
}


export class BuiltinCallStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public printStatement(): PrintStatementContext {
        return this.getRuleContext(0, PrintStatementContext)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_builtinCallStatement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterBuiltinCallStatement) {
             listener.enterBuiltinCallStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitBuiltinCallStatement) {
             listener.exitBuiltinCallStatement(this);
        }
    }
}


export class CastCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public CAST(): antlr.TerminalNode {
        return this.getToken(EVALParser.CAST, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(EVALParser.COMMA, 0)!;
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_castCall;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterCastCall) {
             listener.enterCastCall(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitCastCall) {
             listener.exitCastCall(this);
        }
    }
}


export class PowCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public POW(): antlr.TerminalNode {
        return this.getToken(EVALParser.POW, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(EVALParser.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_powCall;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterPowCall) {
             listener.enterPowCall(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitPowCall) {
             listener.exitPowCall(this);
        }
    }
}


export class SqrtCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public SQRT(): antlr.TerminalNode {
        return this.getToken(EVALParser.SQRT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_sqrtCall;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterSqrtCall) {
             listener.enterSqrtCall(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitSqrtCall) {
             listener.exitSqrtCall(this);
        }
    }
}


export class MinCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public MIN(): antlr.TerminalNode {
        return this.getToken(EVALParser.MIN, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(EVALParser.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_minCall;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterMinCall) {
             listener.enterMinCall(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitMinCall) {
             listener.exitMinCall(this);
        }
    }
}


export class MaxCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public MAX(): antlr.TerminalNode {
        return this.getToken(EVALParser.MAX, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public COMMA(): antlr.TerminalNode {
        return this.getToken(EVALParser.COMMA, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_maxCall;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterMaxCall) {
             listener.enterMaxCall(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitMaxCall) {
             listener.exitMaxCall(this);
        }
    }
}


export class RoundCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ROUND(): antlr.TerminalNode {
        return this.getToken(EVALParser.ROUND, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_roundCall;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterRoundCall) {
             listener.enterRoundCall(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitRoundCall) {
             listener.exitRoundCall(this);
        }
    }
}


export class AbsCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public ABS(): antlr.TerminalNode {
        return this.getToken(EVALParser.ABS, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_absCall;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterAbsCall) {
             listener.enterAbsCall(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitAbsCall) {
             listener.exitAbsCall(this);
        }
    }
}


export class MacroValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PI(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.PI, 0);
    }
    public DAYS_IN_WEEK(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.DAYS_IN_WEEK, 0);
    }
    public HOURS_IN_DAY(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.HOURS_IN_DAY, 0);
    }
    public YEAR(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.YEAR, 0);
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_macroValue;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterMacroValue) {
             listener.enterMacroValue(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitMacroValue) {
             listener.exitMacroValue(this);
        }
    }
}


export class PrintStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public PRINT(): antlr.TerminalNode {
        return this.getToken(EVALParser.PRINT, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public printArg(): PrintArgContext[];
    public printArg(i: number): PrintArgContext | null;
    public printArg(i?: number): PrintArgContext[] | PrintArgContext | null {
        if (i === undefined) {
            return this.getRuleContexts(PrintArgContext);
        }

        return this.getRuleContext(i, PrintArgContext);
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public COMMA(): antlr.TerminalNode[];
    public COMMA(i: number): antlr.TerminalNode | null;
    public COMMA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(EVALParser.COMMA);
    	} else {
    		return this.getToken(EVALParser.COMMA, i);
    	}
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_printStatement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterPrintStatement) {
             listener.enterPrintStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitPrintStatement) {
             listener.exitPrintStatement(this);
        }
    }
}


export class PrintArgContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_printArg;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterPrintArg) {
             listener.enterPrintArg(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitPrintArg) {
             listener.exitPrintArg(this);
        }
    }
}


export class IfStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public IF(): antlr.TerminalNode[];
    public IF(i: number): antlr.TerminalNode | null;
    public IF(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(EVALParser.IF);
    	} else {
    		return this.getToken(EVALParser.IF, i);
    	}
    }
    public LPAREN(): antlr.TerminalNode[];
    public LPAREN(i: number): antlr.TerminalNode | null;
    public LPAREN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(EVALParser.LPAREN);
    	} else {
    		return this.getToken(EVALParser.LPAREN, i);
    	}
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public RPAREN(): antlr.TerminalNode[];
    public RPAREN(i: number): antlr.TerminalNode | null;
    public RPAREN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(EVALParser.RPAREN);
    	} else {
    		return this.getToken(EVALParser.RPAREN, i);
    	}
    }
    public block(): BlockContext[];
    public block(i: number): BlockContext | null;
    public block(i?: number): BlockContext[] | BlockContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BlockContext);
        }

        return this.getRuleContext(i, BlockContext);
    }
    public ELSE(): antlr.TerminalNode[];
    public ELSE(i: number): antlr.TerminalNode | null;
    public ELSE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(EVALParser.ELSE);
    	} else {
    		return this.getToken(EVALParser.ELSE, i);
    	}
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_ifStatement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterIfStatement) {
             listener.enterIfStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitIfStatement) {
             listener.exitIfStatement(this);
        }
    }
}


export class WhileStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public WHILE(): antlr.TerminalNode {
        return this.getToken(EVALParser.WHILE, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public block(): BlockContext {
        return this.getRuleContext(0, BlockContext)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_whileStatement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterWhileStatement) {
             listener.enterWhileStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitWhileStatement) {
             listener.exitWhileStatement(this);
        }
    }
}


export class TryStatementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TRY(): antlr.TerminalNode {
        return this.getToken(EVALParser.TRY, 0)!;
    }
    public block(): BlockContext[];
    public block(i: number): BlockContext | null;
    public block(i?: number): BlockContext[] | BlockContext | null {
        if (i === undefined) {
            return this.getRuleContexts(BlockContext);
        }

        return this.getRuleContext(i, BlockContext);
    }
    public CATCH(): antlr.TerminalNode {
        return this.getToken(EVALParser.CATCH, 0)!;
    }
    public LPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.LPAREN, 0)!;
    }
    public IDENTIFIER(): antlr.TerminalNode {
        return this.getToken(EVALParser.IDENTIFIER, 0)!;
    }
    public RPAREN(): antlr.TerminalNode {
        return this.getToken(EVALParser.RPAREN, 0)!;
    }
    public override get ruleIndex(): number {
        return EVALParser.RULE_tryStatement;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterTryStatement) {
             listener.enterTryStatement(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitTryStatement) {
             listener.exitTryStatement(this);
        }
    }
}
