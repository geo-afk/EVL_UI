
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
    public static readonly RULE_breakStatement = 7;
    public static readonly RULE_continueStatement = 8;
    public static readonly RULE_type = 9;
    public static readonly RULE_expression = 10;
    public static readonly RULE_builtinFunc = 11;
    public static readonly RULE_builtinCallStatement = 12;
    public static readonly RULE_castCall = 13;
    public static readonly RULE_powCall = 14;
    public static readonly RULE_sqrtCall = 15;
    public static readonly RULE_minCall = 16;
    public static readonly RULE_maxCall = 17;
    public static readonly RULE_roundCall = 18;
    public static readonly RULE_absCall = 19;
    public static readonly RULE_macroValue = 20;
    public static readonly RULE_printStatement = 21;
    public static readonly RULE_printArg = 22;
    public static readonly RULE_ifStatement = 23;
    public static readonly RULE_whileStatement = 24;
    public static readonly RULE_tryStatement = 25;

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
        "assignment", "assignOp", "breakStatement", "continueStatement", 
        "type", "expression", "builtinFunc", "builtinCallStatement", "castCall", 
        "powCall", "sqrtCall", "minCall", "maxCall", "roundCall", "absCall", 
        "macroValue", "printStatement", "printArg", "ifStatement", "whileStatement", 
        "tryStatement",
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
            this.state = 55;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 274046) !== 0) || _la === 51 || _la === 62) {
                {
                {
                this.state = 52;
                this.statement();
                }
                }
                this.state = 57;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 58;
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
            this.state = 70;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case EVALParser.INT:
            case EVALParser.FLOAT:
            case EVALParser.STRING_TYPE:
            case EVALParser.BOOL:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 60;
                this.variableDeclaration();
                }
                break;
            case EVALParser.CONST:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 61;
                this.constDeclaration();
                }
                break;
            case EVALParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 62;
                this.assignment();
                }
                break;
            case EVALParser.IF:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 63;
                this.ifStatement();
                }
                break;
            case EVALParser.WHILE:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 64;
                this.whileStatement();
                }
                break;
            case EVALParser.TRY:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 65;
                this.tryStatement();
                }
                break;
            case EVALParser.BREAK:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 66;
                this.breakStatement();
                }
                break;
            case EVALParser.CONTINUE:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 67;
                this.continueStatement();
                }
                break;
            case EVALParser.PRINT:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 68;
                this.builtinCallStatement();
                }
                break;
            case EVALParser.LBRACE:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 69;
                this.block();
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
    public block(): BlockContext {
        let localContext = new BlockContext(this.context, this.state);
        this.enterRule(localContext, 4, EVALParser.RULE_block);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 72;
            this.match(EVALParser.LBRACE);
            this.state = 76;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 274046) !== 0) || _la === 51 || _la === 62) {
                {
                {
                this.state = 73;
                this.statement();
                }
                }
                this.state = 78;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 79;
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
            this.state = 81;
            this.type_();
            this.state = 82;
            this.match(EVALParser.IDENTIFIER);
            this.state = 83;
            this.match(EVALParser.ASSIGN);
            this.state = 84;
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
            this.state = 86;
            this.match(EVALParser.CONST);
            this.state = 87;
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
            this.state = 89;
            this.match(EVALParser.IDENTIFIER);
            this.state = 90;
            this.assignOp();
            this.state = 91;
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
            this.state = 93;
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
    public breakStatement(): BreakStatementContext {
        let localContext = new BreakStatementContext(this.context, this.state);
        this.enterRule(localContext, 14, EVALParser.RULE_breakStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 95;
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
        this.enterRule(localContext, 16, EVALParser.RULE_continueStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 97;
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
        this.enterRule(localContext, 18, EVALParser.RULE_type);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 99;
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
        let _startState = 20;
        this.enterRecursionRule(localContext, 20, EVALParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 119;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case EVALParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 102;
                this.match(EVALParser.MINUS);
                this.state = 103;
                this.expression(12);
                }
                break;
            case EVALParser.NOT_OP:
                {
                localContext = new UnaryNotExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 104;
                this.match(EVALParser.NOT_OP);
                this.state = 105;
                this.expression(11);
                }
                break;
            case EVALParser.LPAREN:
                {
                localContext = new ParenExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 106;
                this.match(EVALParser.LPAREN);
                this.state = 107;
                this.expression(0);
                this.state = 108;
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
                this.state = 110;
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
                this.state = 111;
                this.macroValue();
                }
                break;
            case EVALParser.IDENTIFIER:
                {
                localContext = new IdentExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 112;
                this.match(EVALParser.IDENTIFIER);
                }
                break;
            case EVALParser.INTEGER:
                {
                localContext = new IntLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 113;
                this.match(EVALParser.INTEGER);
                }
                break;
            case EVALParser.REAL:
                {
                localContext = new RealLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 114;
                this.match(EVALParser.REAL);
                }
                break;
            case EVALParser.STRING:
                {
                localContext = new StringLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 115;
                this.match(EVALParser.STRING);
                }
                break;
            case EVALParser.TRUE:
                {
                localContext = new TrueLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 116;
                this.match(EVALParser.TRUE);
                }
                break;
            case EVALParser.FALSE:
                {
                localContext = new FalseLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 117;
                this.match(EVALParser.FALSE);
                }
                break;
            case EVALParser.NULL:
                {
                localContext = new NullLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 118;
                this.match(EVALParser.NULL);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 141;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 5, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 139;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
                    case 1:
                        {
                        localContext = new LogicalOrExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 121;
                        if (!(this.precpred(this.context, 18))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 18)");
                        }
                        this.state = 122;
                        this.match(EVALParser.OR_OP);
                        this.state = 123;
                        this.expression(19);
                        }
                        break;
                    case 2:
                        {
                        localContext = new LogicalAndExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 124;
                        if (!(this.precpred(this.context, 17))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 17)");
                        }
                        this.state = 125;
                        this.match(EVALParser.AND_OP);
                        this.state = 126;
                        this.expression(18);
                        }
                        break;
                    case 3:
                        {
                        localContext = new EqualityExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 127;
                        if (!(this.precpred(this.context, 16))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 16)");
                        }
                        this.state = 128;
                        (localContext as EqualityExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 44 || _la === 45)) {
                            (localContext as EqualityExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 129;
                        this.expression(17);
                        }
                        break;
                    case 4:
                        {
                        localContext = new RelationalExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 130;
                        if (!(this.precpred(this.context, 15))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 15)");
                        }
                        this.state = 131;
                        (localContext as RelationalExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 46)) & ~0x1F) === 0 && ((1 << (_la - 46)) & 15) !== 0))) {
                            (localContext as RelationalExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 132;
                        this.expression(16);
                        }
                        break;
                    case 5:
                        {
                        localContext = new AdditiveExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 133;
                        if (!(this.precpred(this.context, 14))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 14)");
                        }
                        this.state = 134;
                        (localContext as AdditiveExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 39 || _la === 40)) {
                            (localContext as AdditiveExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 135;
                        this.expression(15);
                        }
                        break;
                    case 6:
                        {
                        localContext = new MultiplicativeExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 136;
                        if (!(this.precpred(this.context, 13))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 13)");
                        }
                        this.state = 137;
                        (localContext as MultiplicativeExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 41)) & ~0x1F) === 0 && ((1 << (_la - 41)) & 7) !== 0))) {
                            (localContext as MultiplicativeExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 138;
                        this.expression(14);
                        }
                        break;
                    }
                    }
                }
                this.state = 143;
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
        this.enterRule(localContext, 22, EVALParser.RULE_builtinFunc);
        try {
            this.state = 151;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case EVALParser.CAST:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 144;
                this.castCall();
                }
                break;
            case EVALParser.POW:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 145;
                this.powCall();
                }
                break;
            case EVALParser.SQRT:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 146;
                this.sqrtCall();
                }
                break;
            case EVALParser.MIN:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 147;
                this.minCall();
                }
                break;
            case EVALParser.MAX:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 148;
                this.maxCall();
                }
                break;
            case EVALParser.ROUND:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 149;
                this.roundCall();
                }
                break;
            case EVALParser.ABS:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 150;
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
        this.enterRule(localContext, 24, EVALParser.RULE_builtinCallStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 153;
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
        this.enterRule(localContext, 26, EVALParser.RULE_castCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 155;
            this.match(EVALParser.CAST);
            this.state = 156;
            this.match(EVALParser.LPAREN);
            this.state = 157;
            this.expression(0);
            this.state = 158;
            this.match(EVALParser.COMMA);
            this.state = 159;
            this.type_();
            this.state = 160;
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
        this.enterRule(localContext, 28, EVALParser.RULE_powCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 162;
            this.match(EVALParser.POW);
            this.state = 163;
            this.match(EVALParser.LPAREN);
            this.state = 164;
            this.expression(0);
            this.state = 165;
            this.match(EVALParser.COMMA);
            this.state = 166;
            this.expression(0);
            this.state = 167;
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
        this.enterRule(localContext, 30, EVALParser.RULE_sqrtCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 169;
            this.match(EVALParser.SQRT);
            this.state = 170;
            this.match(EVALParser.LPAREN);
            this.state = 171;
            this.expression(0);
            this.state = 172;
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
        this.enterRule(localContext, 32, EVALParser.RULE_minCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 174;
            this.match(EVALParser.MIN);
            this.state = 175;
            this.match(EVALParser.LPAREN);
            this.state = 176;
            this.expression(0);
            this.state = 177;
            this.match(EVALParser.COMMA);
            this.state = 178;
            this.expression(0);
            this.state = 179;
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
        this.enterRule(localContext, 34, EVALParser.RULE_maxCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 181;
            this.match(EVALParser.MAX);
            this.state = 182;
            this.match(EVALParser.LPAREN);
            this.state = 183;
            this.expression(0);
            this.state = 184;
            this.match(EVALParser.COMMA);
            this.state = 185;
            this.expression(0);
            this.state = 186;
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
        this.enterRule(localContext, 36, EVALParser.RULE_roundCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 188;
            this.match(EVALParser.ROUND);
            this.state = 189;
            this.match(EVALParser.LPAREN);
            this.state = 190;
            this.expression(0);
            this.state = 191;
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
        this.enterRule(localContext, 38, EVALParser.RULE_absCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 193;
            this.match(EVALParser.ABS);
            this.state = 194;
            this.match(EVALParser.LPAREN);
            this.state = 195;
            this.expression(0);
            this.state = 196;
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
        this.enterRule(localContext, 40, EVALParser.RULE_macroValue);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 198;
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
        this.enterRule(localContext, 42, EVALParser.RULE_printStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 200;
            this.match(EVALParser.PRINT);
            this.state = 201;
            this.match(EVALParser.LPAREN);
            this.state = 202;
            this.printArg();
            this.state = 207;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 57) {
                {
                {
                this.state = 203;
                this.match(EVALParser.COMMA);
                this.state = 204;
                this.printArg();
                }
                }
                this.state = 209;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 210;
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
        this.enterRule(localContext, 44, EVALParser.RULE_printArg);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 212;
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
        this.enterRule(localContext, 46, EVALParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 214;
            this.match(EVALParser.IF);
            this.state = 215;
            this.match(EVALParser.LPAREN);
            this.state = 216;
            this.expression(0);
            this.state = 217;
            this.match(EVALParser.RPAREN);
            this.state = 218;
            this.block();
            this.state = 228;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 8, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 219;
                    this.match(EVALParser.ELSE);
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
                    }
                    }
                }
                this.state = 230;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 8, this.context);
            }
            this.state = 233;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7) {
                {
                this.state = 231;
                this.match(EVALParser.ELSE);
                this.state = 232;
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
        this.enterRule(localContext, 48, EVALParser.RULE_whileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 235;
            this.match(EVALParser.WHILE);
            this.state = 236;
            this.match(EVALParser.LPAREN);
            this.state = 237;
            this.expression(0);
            this.state = 238;
            this.match(EVALParser.RPAREN);
            this.state = 239;
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
        this.enterRule(localContext, 50, EVALParser.RULE_tryStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 241;
            this.match(EVALParser.TRY);
            this.state = 242;
            this.block();
            this.state = 243;
            this.match(EVALParser.CATCH);
            this.state = 244;
            this.match(EVALParser.LPAREN);
            this.state = 245;
            this.match(EVALParser.IDENTIFIER);
            this.state = 246;
            this.match(EVALParser.RPAREN);
            this.state = 247;
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
        case 10:
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
        4,1,65,250,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,1,0,5,0,54,
        8,0,10,0,12,0,57,9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,3,1,71,8,1,1,2,1,2,5,2,75,8,2,10,2,12,2,78,9,2,1,2,1,2,1,3,1,
        3,1,3,1,3,1,3,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,6,1,6,1,7,1,7,1,8,1,
        8,1,9,1,9,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,
        1,10,1,10,1,10,1,10,1,10,1,10,1,10,3,10,120,8,10,1,10,1,10,1,10,
        1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,10,
        1,10,1,10,5,10,140,8,10,10,10,12,10,143,9,10,1,11,1,11,1,11,1,11,
        1,11,1,11,1,11,3,11,152,8,11,1,12,1,12,1,13,1,13,1,13,1,13,1,13,
        1,13,1,13,1,14,1,14,1,14,1,14,1,14,1,14,1,14,1,15,1,15,1,15,1,15,
        1,15,1,16,1,16,1,16,1,16,1,16,1,16,1,16,1,17,1,17,1,17,1,17,1,17,
        1,17,1,17,1,18,1,18,1,18,1,18,1,18,1,19,1,19,1,19,1,19,1,19,1,20,
        1,20,1,21,1,21,1,21,1,21,1,21,5,21,206,8,21,10,21,12,21,209,9,21,
        1,21,1,21,1,22,1,22,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,1,23,
        1,23,1,23,1,23,5,23,227,8,23,10,23,12,23,230,9,23,1,23,1,23,3,23,
        234,8,23,1,24,1,24,1,24,1,24,1,24,1,24,1,25,1,25,1,25,1,25,1,25,
        1,25,1,25,1,25,1,25,0,1,20,26,0,2,4,6,8,10,12,14,16,18,20,22,24,
        26,28,30,32,34,36,38,40,42,44,46,48,50,0,7,2,0,35,38,50,50,1,0,1,
        4,1,0,44,45,1,0,46,49,1,0,39,40,1,0,41,43,1,0,26,29,260,0,55,1,0,
        0,0,2,70,1,0,0,0,4,72,1,0,0,0,6,81,1,0,0,0,8,86,1,0,0,0,10,89,1,
        0,0,0,12,93,1,0,0,0,14,95,1,0,0,0,16,97,1,0,0,0,18,99,1,0,0,0,20,
        119,1,0,0,0,22,151,1,0,0,0,24,153,1,0,0,0,26,155,1,0,0,0,28,162,
        1,0,0,0,30,169,1,0,0,0,32,174,1,0,0,0,34,181,1,0,0,0,36,188,1,0,
        0,0,38,193,1,0,0,0,40,198,1,0,0,0,42,200,1,0,0,0,44,212,1,0,0,0,
        46,214,1,0,0,0,48,235,1,0,0,0,50,241,1,0,0,0,52,54,3,2,1,0,53,52,
        1,0,0,0,54,57,1,0,0,0,55,53,1,0,0,0,55,56,1,0,0,0,56,58,1,0,0,0,
        57,55,1,0,0,0,58,59,5,0,0,1,59,1,1,0,0,0,60,71,3,6,3,0,61,71,3,8,
        4,0,62,71,3,10,5,0,63,71,3,46,23,0,64,71,3,48,24,0,65,71,3,50,25,
        0,66,71,3,14,7,0,67,71,3,16,8,0,68,71,3,24,12,0,69,71,3,4,2,0,70,
        60,1,0,0,0,70,61,1,0,0,0,70,62,1,0,0,0,70,63,1,0,0,0,70,64,1,0,0,
        0,70,65,1,0,0,0,70,66,1,0,0,0,70,67,1,0,0,0,70,68,1,0,0,0,70,69,
        1,0,0,0,71,3,1,0,0,0,72,76,5,51,0,0,73,75,3,2,1,0,74,73,1,0,0,0,
        75,78,1,0,0,0,76,74,1,0,0,0,76,77,1,0,0,0,77,79,1,0,0,0,78,76,1,
        0,0,0,79,80,5,52,0,0,80,5,1,0,0,0,81,82,3,18,9,0,82,83,5,62,0,0,
        83,84,5,50,0,0,84,85,3,20,10,0,85,7,1,0,0,0,86,87,5,5,0,0,87,88,
        3,6,3,0,88,9,1,0,0,0,89,90,5,62,0,0,90,91,3,12,6,0,91,92,3,20,10,
        0,92,11,1,0,0,0,93,94,7,0,0,0,94,13,1,0,0,0,95,96,5,10,0,0,96,15,
        1,0,0,0,97,98,5,11,0,0,98,17,1,0,0,0,99,100,7,1,0,0,100,19,1,0,0,
        0,101,102,6,10,-1,0,102,103,5,40,0,0,103,120,3,20,10,12,104,105,
        5,32,0,0,105,120,3,20,10,11,106,107,5,53,0,0,107,108,3,20,10,0,108,
        109,5,54,0,0,109,120,1,0,0,0,110,120,3,22,11,0,111,120,3,40,20,0,
        112,120,5,62,0,0,113,120,5,60,0,0,114,120,5,59,0,0,115,120,5,61,
        0,0,116,120,5,16,0,0,117,120,5,17,0,0,118,120,5,15,0,0,119,101,1,
        0,0,0,119,104,1,0,0,0,119,106,1,0,0,0,119,110,1,0,0,0,119,111,1,
        0,0,0,119,112,1,0,0,0,119,113,1,0,0,0,119,114,1,0,0,0,119,115,1,
        0,0,0,119,116,1,0,0,0,119,117,1,0,0,0,119,118,1,0,0,0,120,141,1,
        0,0,0,121,122,10,18,0,0,122,123,5,31,0,0,123,140,3,20,10,19,124,
        125,10,17,0,0,125,126,5,30,0,0,126,140,3,20,10,18,127,128,10,16,
        0,0,128,129,7,2,0,0,129,140,3,20,10,17,130,131,10,15,0,0,131,132,
        7,3,0,0,132,140,3,20,10,16,133,134,10,14,0,0,134,135,7,4,0,0,135,
        140,3,20,10,15,136,137,10,13,0,0,137,138,7,5,0,0,138,140,3,20,10,
        14,139,121,1,0,0,0,139,124,1,0,0,0,139,127,1,0,0,0,139,130,1,0,0,
        0,139,133,1,0,0,0,139,136,1,0,0,0,140,143,1,0,0,0,141,139,1,0,0,
        0,141,142,1,0,0,0,142,21,1,0,0,0,143,141,1,0,0,0,144,152,3,26,13,
        0,145,152,3,28,14,0,146,152,3,30,15,0,147,152,3,32,16,0,148,152,
        3,34,17,0,149,152,3,36,18,0,150,152,3,38,19,0,151,144,1,0,0,0,151,
        145,1,0,0,0,151,146,1,0,0,0,151,147,1,0,0,0,151,148,1,0,0,0,151,
        149,1,0,0,0,151,150,1,0,0,0,152,23,1,0,0,0,153,154,3,42,21,0,154,
        25,1,0,0,0,155,156,5,19,0,0,156,157,5,53,0,0,157,158,3,20,10,0,158,
        159,5,57,0,0,159,160,3,18,9,0,160,161,5,54,0,0,161,27,1,0,0,0,162,
        163,5,20,0,0,163,164,5,53,0,0,164,165,3,20,10,0,165,166,5,57,0,0,
        166,167,3,20,10,0,167,168,5,54,0,0,168,29,1,0,0,0,169,170,5,21,0,
        0,170,171,5,53,0,0,171,172,3,20,10,0,172,173,5,54,0,0,173,31,1,0,
        0,0,174,175,5,22,0,0,175,176,5,53,0,0,176,177,3,20,10,0,177,178,
        5,57,0,0,178,179,3,20,10,0,179,180,5,54,0,0,180,33,1,0,0,0,181,182,
        5,23,0,0,182,183,5,53,0,0,183,184,3,20,10,0,184,185,5,57,0,0,185,
        186,3,20,10,0,186,187,5,54,0,0,187,35,1,0,0,0,188,189,5,24,0,0,189,
        190,5,53,0,0,190,191,3,20,10,0,191,192,5,54,0,0,192,37,1,0,0,0,193,
        194,5,25,0,0,194,195,5,53,0,0,195,196,3,20,10,0,196,197,5,54,0,0,
        197,39,1,0,0,0,198,199,7,6,0,0,199,41,1,0,0,0,200,201,5,18,0,0,201,
        202,5,53,0,0,202,207,3,44,22,0,203,204,5,57,0,0,204,206,3,44,22,
        0,205,203,1,0,0,0,206,209,1,0,0,0,207,205,1,0,0,0,207,208,1,0,0,
        0,208,210,1,0,0,0,209,207,1,0,0,0,210,211,5,54,0,0,211,43,1,0,0,
        0,212,213,3,20,10,0,213,45,1,0,0,0,214,215,5,6,0,0,215,216,5,53,
        0,0,216,217,3,20,10,0,217,218,5,54,0,0,218,228,3,4,2,0,219,220,5,
        7,0,0,220,221,5,6,0,0,221,222,5,53,0,0,222,223,3,20,10,0,223,224,
        5,54,0,0,224,225,3,4,2,0,225,227,1,0,0,0,226,219,1,0,0,0,227,230,
        1,0,0,0,228,226,1,0,0,0,228,229,1,0,0,0,229,233,1,0,0,0,230,228,
        1,0,0,0,231,232,5,7,0,0,232,234,3,4,2,0,233,231,1,0,0,0,233,234,
        1,0,0,0,234,47,1,0,0,0,235,236,5,9,0,0,236,237,5,53,0,0,237,238,
        3,20,10,0,238,239,5,54,0,0,239,240,3,4,2,0,240,49,1,0,0,0,241,242,
        5,13,0,0,242,243,3,4,2,0,243,244,5,14,0,0,244,245,5,53,0,0,245,246,
        5,62,0,0,246,247,5,54,0,0,247,248,3,4,2,0,248,51,1,0,0,0,10,55,70,
        76,119,139,141,151,207,228,233
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
