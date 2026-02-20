
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
    public static readonly WHILE = 8;
    public static readonly TRY = 9;
    public static readonly CATCH = 10;
    public static readonly TRUE = 11;
    public static readonly FALSE = 12;
    public static readonly PRINT = 13;
    public static readonly CAST = 14;
    public static readonly POW = 15;
    public static readonly SQRT = 16;
    public static readonly MIN = 17;
    public static readonly MAX = 18;
    public static readonly ROUND = 19;
    public static readonly ABS = 20;
    public static readonly PI = 21;
    public static readonly DAYS_IN_WEEK = 22;
    public static readonly HOURS_IN_DAY = 23;
    public static readonly YEAR = 24;
    public static readonly PLUS = 25;
    public static readonly MINUS = 26;
    public static readonly MULTI = 27;
    public static readonly DIVIDE = 28;
    public static readonly MODULUS = 29;
    public static readonly PLUS_ASSIGN = 30;
    public static readonly MINUS_ASSIGN = 31;
    public static readonly MULTI_ASSIGN = 32;
    public static readonly DIV_ASSIGN = 33;
    public static readonly EQ = 34;
    public static readonly NEQ = 35;
    public static readonly LT = 36;
    public static readonly GT = 37;
    public static readonly LTE = 38;
    public static readonly GTE = 39;
    public static readonly ASSIGN = 40;
    public static readonly LBRACE = 41;
    public static readonly RBRACE = 42;
    public static readonly LPAREN = 43;
    public static readonly RPAREN = 44;
    public static readonly COMMA = 45;
    public static readonly REAL = 46;
    public static readonly INTEGER = 47;
    public static readonly STRING = 48;
    public static readonly IDENTIFIER = 49;
    public static readonly WS = 50;
    public static readonly LINE_COMMENT = 51;
    public static readonly BLOCK_COMMENT = 52;
    public static readonly RULE_program = 0;
    public static readonly RULE_statement = 1;
    public static readonly RULE_block = 2;
    public static readonly RULE_variableDeclaration = 3;
    public static readonly RULE_constDeclaration = 4;
    public static readonly RULE_assignment = 5;
    public static readonly RULE_assignOp = 6;
    public static readonly RULE_type = 7;
    public static readonly RULE_expression = 8;
    public static readonly RULE_castCall = 9;
    public static readonly RULE_powCall = 10;
    public static readonly RULE_sqrtCall = 11;
    public static readonly RULE_minCall = 12;
    public static readonly RULE_maxCall = 13;
    public static readonly RULE_roundCall = 14;
    public static readonly RULE_absCall = 15;
    public static readonly RULE_macroValue = 16;
    public static readonly RULE_printStatement = 17;
    public static readonly RULE_printArg = 18;
    public static readonly RULE_ifStatement = 19;
    public static readonly RULE_whileStatement = 20;
    public static readonly RULE_tryStatement = 21;

    public static readonly literalNames = [
        null, "'int'", "'float'", "'string'", "'bool'", "'const'", "'if'", 
        "'else'", "'while'", "'try'", "'catch'", "'true'", "'false'", "'print'", 
        "'cast'", "'pow'", "'sqrt'", "'min'", "'max'", "'round'", "'abs'", 
        "'PI'", "'DAYS_IN_WEEK'", "'HOURS_IN_DAY'", "'YEAR'", "'+'", "'-'", 
        "'*'", "'/'", "'%'", "'+='", "'-='", "'*='", "'/='", "'=='", "'!='", 
        "'<'", "'>'", "'<='", "'>='", "'='", "'{'", "'}'", "'('", "')'", 
        "','"
    ];

    public static readonly symbolicNames = [
        null, "INT", "FLOAT", "STRING_TYPE", "BOOL", "CONST", "IF", "ELSE", 
        "WHILE", "TRY", "CATCH", "TRUE", "FALSE", "PRINT", "CAST", "POW", 
        "SQRT", "MIN", "MAX", "ROUND", "ABS", "PI", "DAYS_IN_WEEK", "HOURS_IN_DAY", 
        "YEAR", "PLUS", "MINUS", "MULTI", "DIVIDE", "MODULUS", "PLUS_ASSIGN", 
        "MINUS_ASSIGN", "MULTI_ASSIGN", "DIV_ASSIGN", "EQ", "NEQ", "LT", 
        "GT", "LTE", "GTE", "ASSIGN", "LBRACE", "RBRACE", "LPAREN", "RPAREN", 
        "COMMA", "REAL", "INTEGER", "STRING", "IDENTIFIER", "WS", "LINE_COMMENT", 
        "BLOCK_COMMENT"
    ];
    public static readonly ruleNames = [
        "program", "statement", "block", "variableDeclaration", "constDeclaration", 
        "assignment", "assignOp", "type", "expression", "castCall", "powCall", 
        "sqrtCall", "minCall", "maxCall", "roundCall", "absCall", "macroValue", 
        "printStatement", "printArg", "ifStatement", "whileStatement", "tryStatement",
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
            this.state = 47;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 9086) !== 0) || _la === 41 || _la === 49) {
                {
                {
                this.state = 44;
                this.statement();
                }
                }
                this.state = 49;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 50;
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
            this.state = 60;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case EVALParser.INT:
            case EVALParser.FLOAT:
            case EVALParser.STRING_TYPE:
            case EVALParser.BOOL:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 52;
                this.variableDeclaration();
                }
                break;
            case EVALParser.CONST:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 53;
                this.constDeclaration();
                }
                break;
            case EVALParser.IDENTIFIER:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 54;
                this.assignment();
                }
                break;
            case EVALParser.PRINT:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 55;
                this.printStatement();
                }
                break;
            case EVALParser.IF:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 56;
                this.ifStatement();
                }
                break;
            case EVALParser.WHILE:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 57;
                this.whileStatement();
                }
                break;
            case EVALParser.TRY:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 58;
                this.tryStatement();
                }
                break;
            case EVALParser.LBRACE:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 59;
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
            this.state = 62;
            this.match(EVALParser.LBRACE);
            this.state = 66;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 9086) !== 0) || _la === 41 || _la === 49) {
                {
                {
                this.state = 63;
                this.statement();
                }
                }
                this.state = 68;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 69;
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
            this.state = 71;
            this.type_();
            this.state = 72;
            this.match(EVALParser.IDENTIFIER);
            this.state = 73;
            this.match(EVALParser.ASSIGN);
            this.state = 74;
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
            this.state = 76;
            this.match(EVALParser.CONST);
            this.state = 77;
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
            this.state = 79;
            this.match(EVALParser.IDENTIFIER);
            this.state = 80;
            this.assignOp();
            this.state = 81;
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
            this.state = 83;
            _la = this.tokenStream.LA(1);
            if(!(((((_la - 30)) & ~0x1F) === 0 && ((1 << (_la - 30)) & 1039) !== 0))) {
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
    public type_(): TypeContext {
        let localContext = new TypeContext(this.context, this.state);
        this.enterRule(localContext, 14, EVALParser.RULE_type);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 85;
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
        let _startState = 16;
        this.enterRecursionRule(localContext, 16, EVALParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 108;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case EVALParser.MINUS:
                {
                localContext = new UnaryMinusExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;

                this.state = 88;
                this.match(EVALParser.MINUS);
                this.state = 89;
                this.expression(16);
                }
                break;
            case EVALParser.LPAREN:
                {
                localContext = new ParenExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 90;
                this.match(EVALParser.LPAREN);
                this.state = 91;
                this.expression(0);
                this.state = 92;
                this.match(EVALParser.RPAREN);
                }
                break;
            case EVALParser.CAST:
                {
                localContext = new CastExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 94;
                this.castCall();
                }
                break;
            case EVALParser.POW:
                {
                localContext = new PowExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 95;
                this.powCall();
                }
                break;
            case EVALParser.SQRT:
                {
                localContext = new SqrtExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 96;
                this.sqrtCall();
                }
                break;
            case EVALParser.MIN:
                {
                localContext = new MinExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 97;
                this.minCall();
                }
                break;
            case EVALParser.MAX:
                {
                localContext = new MaxExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 98;
                this.maxCall();
                }
                break;
            case EVALParser.ROUND:
                {
                localContext = new RoundExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 99;
                this.roundCall();
                }
                break;
            case EVALParser.ABS:
                {
                localContext = new AbsExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 100;
                this.absCall();
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
                this.state = 101;
                this.macroValue();
                }
                break;
            case EVALParser.IDENTIFIER:
                {
                localContext = new IdentExprContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 102;
                this.match(EVALParser.IDENTIFIER);
                }
                break;
            case EVALParser.INTEGER:
                {
                localContext = new IntLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 103;
                this.match(EVALParser.INTEGER);
                }
                break;
            case EVALParser.REAL:
                {
                localContext = new RealLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 104;
                this.match(EVALParser.REAL);
                }
                break;
            case EVALParser.STRING:
                {
                localContext = new StringLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 105;
                this.match(EVALParser.STRING);
                }
                break;
            case EVALParser.TRUE:
                {
                localContext = new TrueLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 106;
                this.match(EVALParser.TRUE);
                }
                break;
            case EVALParser.FALSE:
                {
                localContext = new FalseLiteralContext(localContext);
                this.context = localContext;
                previousContext = localContext;
                this.state = 107;
                this.match(EVALParser.FALSE);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 124;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 5, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 122;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 4, this.context) ) {
                    case 1:
                        {
                        localContext = new EqualityExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 110;
                        if (!(this.precpred(this.context, 20))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 20)");
                        }
                        this.state = 111;
                        (localContext as EqualityExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 34 || _la === 35)) {
                            (localContext as EqualityExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 112;
                        this.expression(21);
                        }
                        break;
                    case 2:
                        {
                        localContext = new RelationalExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 113;
                        if (!(this.precpred(this.context, 19))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 19)");
                        }
                        this.state = 114;
                        (localContext as RelationalExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 36)) & ~0x1F) === 0 && ((1 << (_la - 36)) & 15) !== 0))) {
                            (localContext as RelationalExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 115;
                        this.expression(20);
                        }
                        break;
                    case 3:
                        {
                        localContext = new AdditiveExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 116;
                        if (!(this.precpred(this.context, 18))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 18)");
                        }
                        this.state = 117;
                        (localContext as AdditiveExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 25 || _la === 26)) {
                            (localContext as AdditiveExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 118;
                        this.expression(19);
                        }
                        break;
                    case 4:
                        {
                        localContext = new MultiplicativeExprContext(new ExpressionContext(parentContext, parentState));
                        this.pushNewRecursionContext(localContext, _startState, EVALParser.RULE_expression);
                        this.state = 119;
                        if (!(this.precpred(this.context, 17))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 17)");
                        }
                        this.state = 120;
                        (localContext as MultiplicativeExprContext)._op = this.tokenStream.LT(1);
                        _la = this.tokenStream.LA(1);
                        if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 939524096) !== 0))) {
                            (localContext as MultiplicativeExprContext)._op = this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 121;
                        this.expression(18);
                        }
                        break;
                    }
                    }
                }
                this.state = 126;
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
    public castCall(): CastCallContext {
        let localContext = new CastCallContext(this.context, this.state);
        this.enterRule(localContext, 18, EVALParser.RULE_castCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 127;
            this.match(EVALParser.CAST);
            this.state = 128;
            this.match(EVALParser.LPAREN);
            this.state = 129;
            this.expression(0);
            this.state = 130;
            this.match(EVALParser.COMMA);
            this.state = 131;
            this.type_();
            this.state = 132;
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
        this.enterRule(localContext, 20, EVALParser.RULE_powCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 134;
            this.match(EVALParser.POW);
            this.state = 135;
            this.match(EVALParser.LPAREN);
            this.state = 136;
            this.expression(0);
            this.state = 137;
            this.match(EVALParser.COMMA);
            this.state = 138;
            this.expression(0);
            this.state = 139;
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
        this.enterRule(localContext, 22, EVALParser.RULE_sqrtCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 141;
            this.match(EVALParser.SQRT);
            this.state = 142;
            this.match(EVALParser.LPAREN);
            this.state = 143;
            this.expression(0);
            this.state = 144;
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
        this.enterRule(localContext, 24, EVALParser.RULE_minCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 146;
            this.match(EVALParser.MIN);
            this.state = 147;
            this.match(EVALParser.LPAREN);
            this.state = 148;
            this.expression(0);
            this.state = 149;
            this.match(EVALParser.COMMA);
            this.state = 150;
            this.expression(0);
            this.state = 151;
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
        this.enterRule(localContext, 26, EVALParser.RULE_maxCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 153;
            this.match(EVALParser.MAX);
            this.state = 154;
            this.match(EVALParser.LPAREN);
            this.state = 155;
            this.expression(0);
            this.state = 156;
            this.match(EVALParser.COMMA);
            this.state = 157;
            this.expression(0);
            this.state = 158;
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
        this.enterRule(localContext, 28, EVALParser.RULE_roundCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 160;
            this.match(EVALParser.ROUND);
            this.state = 161;
            this.match(EVALParser.LPAREN);
            this.state = 162;
            this.expression(0);
            this.state = 163;
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
        this.enterRule(localContext, 30, EVALParser.RULE_absCall);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 165;
            this.match(EVALParser.ABS);
            this.state = 166;
            this.match(EVALParser.LPAREN);
            this.state = 167;
            this.expression(0);
            this.state = 168;
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
        this.enterRule(localContext, 32, EVALParser.RULE_macroValue);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 170;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 31457280) !== 0))) {
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
        this.enterRule(localContext, 34, EVALParser.RULE_printStatement);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 172;
            this.match(EVALParser.PRINT);
            this.state = 173;
            this.match(EVALParser.LPAREN);
            this.state = 174;
            this.printArg();
            this.state = 179;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 45) {
                {
                {
                this.state = 175;
                this.match(EVALParser.COMMA);
                this.state = 176;
                this.printArg();
                }
                }
                this.state = 181;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 182;
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
        this.enterRule(localContext, 36, EVALParser.RULE_printArg);
        try {
            this.state = 186;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 7, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 184;
                this.match(EVALParser.STRING);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 185;
                this.expression(0);
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
    public ifStatement(): IfStatementContext {
        let localContext = new IfStatementContext(this.context, this.state);
        this.enterRule(localContext, 38, EVALParser.RULE_ifStatement);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 188;
            this.match(EVALParser.IF);
            this.state = 189;
            this.match(EVALParser.LPAREN);
            this.state = 190;
            this.expression(0);
            this.state = 191;
            this.match(EVALParser.RPAREN);
            this.state = 192;
            this.block();
            this.state = 202;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 8, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 193;
                    this.match(EVALParser.ELSE);
                    this.state = 194;
                    this.match(EVALParser.IF);
                    this.state = 195;
                    this.match(EVALParser.LPAREN);
                    this.state = 196;
                    this.expression(0);
                    this.state = 197;
                    this.match(EVALParser.RPAREN);
                    this.state = 198;
                    this.block();
                    }
                    }
                }
                this.state = 204;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 8, this.context);
            }
            this.state = 207;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 7) {
                {
                this.state = 205;
                this.match(EVALParser.ELSE);
                this.state = 206;
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
        this.enterRule(localContext, 40, EVALParser.RULE_whileStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 209;
            this.match(EVALParser.WHILE);
            this.state = 210;
            this.match(EVALParser.LPAREN);
            this.state = 211;
            this.expression(0);
            this.state = 212;
            this.match(EVALParser.RPAREN);
            this.state = 213;
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
        this.enterRule(localContext, 42, EVALParser.RULE_tryStatement);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 215;
            this.match(EVALParser.TRY);
            this.state = 216;
            this.block();
            this.state = 217;
            this.match(EVALParser.CATCH);
            this.state = 218;
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
        case 8:
            return this.expression_sempred(localContext as ExpressionContext, predIndex);
        }
        return true;
    }
    private expression_sempred(localContext: ExpressionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 20);
        case 1:
            return this.precpred(this.context, 19);
        case 2:
            return this.precpred(this.context, 18);
        case 3:
            return this.precpred(this.context, 17);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,52,221,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,1,0,5,0,46,8,0,10,0,12,0,49,9,0,1,0,1,0,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,1,3,1,61,8,1,1,2,1,2,5,2,65,8,2,10,2,12,2,68,
        9,2,1,2,1,2,1,3,1,3,1,3,1,3,1,3,1,4,1,4,1,4,1,5,1,5,1,5,1,5,1,6,
        1,6,1,7,1,7,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,
        1,8,1,8,1,8,1,8,1,8,1,8,1,8,1,8,3,8,109,8,8,1,8,1,8,1,8,1,8,1,8,
        1,8,1,8,1,8,1,8,1,8,1,8,1,8,5,8,123,8,8,10,8,12,8,126,9,8,1,9,1,
        9,1,9,1,9,1,9,1,9,1,9,1,10,1,10,1,10,1,10,1,10,1,10,1,10,1,11,1,
        11,1,11,1,11,1,11,1,12,1,12,1,12,1,12,1,12,1,12,1,12,1,13,1,13,1,
        13,1,13,1,13,1,13,1,13,1,14,1,14,1,14,1,14,1,14,1,15,1,15,1,15,1,
        15,1,15,1,16,1,16,1,17,1,17,1,17,1,17,1,17,5,17,178,8,17,10,17,12,
        17,181,9,17,1,17,1,17,1,18,1,18,3,18,187,8,18,1,19,1,19,1,19,1,19,
        1,19,1,19,1,19,1,19,1,19,1,19,1,19,1,19,5,19,201,8,19,10,19,12,19,
        204,9,19,1,19,1,19,3,19,208,8,19,1,20,1,20,1,20,1,20,1,20,1,20,1,
        21,1,21,1,21,1,21,1,21,1,21,0,1,16,22,0,2,4,6,8,10,12,14,16,18,20,
        22,24,26,28,30,32,34,36,38,40,42,0,7,2,0,30,33,40,40,1,0,1,4,1,0,
        34,35,1,0,36,39,1,0,25,26,1,0,27,29,1,0,21,24,230,0,47,1,0,0,0,2,
        60,1,0,0,0,4,62,1,0,0,0,6,71,1,0,0,0,8,76,1,0,0,0,10,79,1,0,0,0,
        12,83,1,0,0,0,14,85,1,0,0,0,16,108,1,0,0,0,18,127,1,0,0,0,20,134,
        1,0,0,0,22,141,1,0,0,0,24,146,1,0,0,0,26,153,1,0,0,0,28,160,1,0,
        0,0,30,165,1,0,0,0,32,170,1,0,0,0,34,172,1,0,0,0,36,186,1,0,0,0,
        38,188,1,0,0,0,40,209,1,0,0,0,42,215,1,0,0,0,44,46,3,2,1,0,45,44,
        1,0,0,0,46,49,1,0,0,0,47,45,1,0,0,0,47,48,1,0,0,0,48,50,1,0,0,0,
        49,47,1,0,0,0,50,51,5,0,0,1,51,1,1,0,0,0,52,61,3,6,3,0,53,61,3,8,
        4,0,54,61,3,10,5,0,55,61,3,34,17,0,56,61,3,38,19,0,57,61,3,40,20,
        0,58,61,3,42,21,0,59,61,3,4,2,0,60,52,1,0,0,0,60,53,1,0,0,0,60,54,
        1,0,0,0,60,55,1,0,0,0,60,56,1,0,0,0,60,57,1,0,0,0,60,58,1,0,0,0,
        60,59,1,0,0,0,61,3,1,0,0,0,62,66,5,41,0,0,63,65,3,2,1,0,64,63,1,
        0,0,0,65,68,1,0,0,0,66,64,1,0,0,0,66,67,1,0,0,0,67,69,1,0,0,0,68,
        66,1,0,0,0,69,70,5,42,0,0,70,5,1,0,0,0,71,72,3,14,7,0,72,73,5,49,
        0,0,73,74,5,40,0,0,74,75,3,16,8,0,75,7,1,0,0,0,76,77,5,5,0,0,77,
        78,3,6,3,0,78,9,1,0,0,0,79,80,5,49,0,0,80,81,3,12,6,0,81,82,3,16,
        8,0,82,11,1,0,0,0,83,84,7,0,0,0,84,13,1,0,0,0,85,86,7,1,0,0,86,15,
        1,0,0,0,87,88,6,8,-1,0,88,89,5,26,0,0,89,109,3,16,8,16,90,91,5,43,
        0,0,91,92,3,16,8,0,92,93,5,44,0,0,93,109,1,0,0,0,94,109,3,18,9,0,
        95,109,3,20,10,0,96,109,3,22,11,0,97,109,3,24,12,0,98,109,3,26,13,
        0,99,109,3,28,14,0,100,109,3,30,15,0,101,109,3,32,16,0,102,109,5,
        49,0,0,103,109,5,47,0,0,104,109,5,46,0,0,105,109,5,48,0,0,106,109,
        5,11,0,0,107,109,5,12,0,0,108,87,1,0,0,0,108,90,1,0,0,0,108,94,1,
        0,0,0,108,95,1,0,0,0,108,96,1,0,0,0,108,97,1,0,0,0,108,98,1,0,0,
        0,108,99,1,0,0,0,108,100,1,0,0,0,108,101,1,0,0,0,108,102,1,0,0,0,
        108,103,1,0,0,0,108,104,1,0,0,0,108,105,1,0,0,0,108,106,1,0,0,0,
        108,107,1,0,0,0,109,124,1,0,0,0,110,111,10,20,0,0,111,112,7,2,0,
        0,112,123,3,16,8,21,113,114,10,19,0,0,114,115,7,3,0,0,115,123,3,
        16,8,20,116,117,10,18,0,0,117,118,7,4,0,0,118,123,3,16,8,19,119,
        120,10,17,0,0,120,121,7,5,0,0,121,123,3,16,8,18,122,110,1,0,0,0,
        122,113,1,0,0,0,122,116,1,0,0,0,122,119,1,0,0,0,123,126,1,0,0,0,
        124,122,1,0,0,0,124,125,1,0,0,0,125,17,1,0,0,0,126,124,1,0,0,0,127,
        128,5,14,0,0,128,129,5,43,0,0,129,130,3,16,8,0,130,131,5,45,0,0,
        131,132,3,14,7,0,132,133,5,44,0,0,133,19,1,0,0,0,134,135,5,15,0,
        0,135,136,5,43,0,0,136,137,3,16,8,0,137,138,5,45,0,0,138,139,3,16,
        8,0,139,140,5,44,0,0,140,21,1,0,0,0,141,142,5,16,0,0,142,143,5,43,
        0,0,143,144,3,16,8,0,144,145,5,44,0,0,145,23,1,0,0,0,146,147,5,17,
        0,0,147,148,5,43,0,0,148,149,3,16,8,0,149,150,5,45,0,0,150,151,3,
        16,8,0,151,152,5,44,0,0,152,25,1,0,0,0,153,154,5,18,0,0,154,155,
        5,43,0,0,155,156,3,16,8,0,156,157,5,45,0,0,157,158,3,16,8,0,158,
        159,5,44,0,0,159,27,1,0,0,0,160,161,5,19,0,0,161,162,5,43,0,0,162,
        163,3,16,8,0,163,164,5,44,0,0,164,29,1,0,0,0,165,166,5,20,0,0,166,
        167,5,43,0,0,167,168,3,16,8,0,168,169,5,44,0,0,169,31,1,0,0,0,170,
        171,7,6,0,0,171,33,1,0,0,0,172,173,5,13,0,0,173,174,5,43,0,0,174,
        179,3,36,18,0,175,176,5,45,0,0,176,178,3,36,18,0,177,175,1,0,0,0,
        178,181,1,0,0,0,179,177,1,0,0,0,179,180,1,0,0,0,180,182,1,0,0,0,
        181,179,1,0,0,0,182,183,5,44,0,0,183,35,1,0,0,0,184,187,5,48,0,0,
        185,187,3,16,8,0,186,184,1,0,0,0,186,185,1,0,0,0,187,37,1,0,0,0,
        188,189,5,6,0,0,189,190,5,43,0,0,190,191,3,16,8,0,191,192,5,44,0,
        0,192,202,3,4,2,0,193,194,5,7,0,0,194,195,5,6,0,0,195,196,5,43,0,
        0,196,197,3,16,8,0,197,198,5,44,0,0,198,199,3,4,2,0,199,201,1,0,
        0,0,200,193,1,0,0,0,201,204,1,0,0,0,202,200,1,0,0,0,202,203,1,0,
        0,0,203,207,1,0,0,0,204,202,1,0,0,0,205,206,5,7,0,0,206,208,3,4,
        2,0,207,205,1,0,0,0,207,208,1,0,0,0,208,39,1,0,0,0,209,210,5,8,0,
        0,210,211,5,43,0,0,211,212,3,16,8,0,212,213,5,44,0,0,213,214,3,4,
        2,0,214,41,1,0,0,0,215,216,5,9,0,0,216,217,3,4,2,0,217,218,5,10,
        0,0,218,219,3,4,2,0,219,43,1,0,0,0,10,47,60,66,108,122,124,179,186,
        202,207
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
    public printStatement(): PrintStatementContext | null {
        return this.getRuleContext(0, PrintStatementContext);
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
export class CastExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public castCall(): CastCallContext {
        return this.getRuleContext(0, CastCallContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterCastExpr) {
             listener.enterCastExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitCastExpr) {
             listener.exitCastExpr(this);
        }
    }
}
export class PowExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public powCall(): PowCallContext {
        return this.getRuleContext(0, PowCallContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterPowExpr) {
             listener.enterPowExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitPowExpr) {
             listener.exitPowExpr(this);
        }
    }
}
export class SqrtExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public sqrtCall(): SqrtCallContext {
        return this.getRuleContext(0, SqrtCallContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterSqrtExpr) {
             listener.enterSqrtExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitSqrtExpr) {
             listener.exitSqrtExpr(this);
        }
    }
}
export class MinExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public minCall(): MinCallContext {
        return this.getRuleContext(0, MinCallContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterMinExpr) {
             listener.enterMinExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitMinExpr) {
             listener.exitMinExpr(this);
        }
    }
}
export class MaxExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public maxCall(): MaxCallContext {
        return this.getRuleContext(0, MaxCallContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterMaxExpr) {
             listener.enterMaxExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitMaxExpr) {
             listener.exitMaxExpr(this);
        }
    }
}
export class RoundExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public roundCall(): RoundCallContext {
        return this.getRuleContext(0, RoundCallContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterRoundExpr) {
             listener.enterRoundExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitRoundExpr) {
             listener.exitRoundExpr(this);
        }
    }
}
export class AbsExprContext extends ExpressionContext {
    public constructor(ctx: ExpressionContext) {
        super(ctx.parent, ctx.invokingState);
        super.copyFrom(ctx);
    }
    public absCall(): AbsCallContext {
        return this.getRuleContext(0, AbsCallContext)!;
    }
    public override enterRule(listener: EVALParserListener): void {
        if(listener.enterAbsExpr) {
             listener.enterAbsExpr(this);
        }
    }
    public override exitRule(listener: EVALParserListener): void {
        if(listener.exitAbsExpr) {
             listener.exitAbsExpr(this);
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
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(EVALParser.STRING, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
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
