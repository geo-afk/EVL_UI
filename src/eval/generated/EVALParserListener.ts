
import { ErrorNode, ParseTreeListener, ParserRuleContext, TerminalNode } from "antlr4ng";


import { ProgramContext } from "./EVALParser.js";
import { StatementContext } from "./EVALParser.js";
import { BlockContext } from "./EVALParser.js";
import { VariableDeclarationContext } from "./EVALParser.js";
import { ConstDeclarationContext } from "./EVALParser.js";
import { AssignmentContext } from "./EVALParser.js";
import { AssignOpContext } from "./EVALParser.js";
import { TypeContext } from "./EVALParser.js";
import { UnaryMinusExprContext } from "./EVALParser.js";
import { ParenExprContext } from "./EVALParser.js";
import { CastExprContext } from "./EVALParser.js";
import { PowExprContext } from "./EVALParser.js";
import { SqrtExprContext } from "./EVALParser.js";
import { MinExprContext } from "./EVALParser.js";
import { MaxExprContext } from "./EVALParser.js";
import { RoundExprContext } from "./EVALParser.js";
import { AbsExprContext } from "./EVALParser.js";
import { MacroExprContext } from "./EVALParser.js";
import { IdentExprContext } from "./EVALParser.js";
import { IntLiteralContext } from "./EVALParser.js";
import { RealLiteralContext } from "./EVALParser.js";
import { StringLiteralContext } from "./EVALParser.js";
import { TrueLiteralContext } from "./EVALParser.js";
import { FalseLiteralContext } from "./EVALParser.js";
import { EqualityExprContext } from "./EVALParser.js";
import { RelationalExprContext } from "./EVALParser.js";
import { AdditiveExprContext } from "./EVALParser.js";
import { MultiplicativeExprContext } from "./EVALParser.js";
import { CastCallContext } from "./EVALParser.js";
import { PowCallContext } from "./EVALParser.js";
import { SqrtCallContext } from "./EVALParser.js";
import { MinCallContext } from "./EVALParser.js";
import { MaxCallContext } from "./EVALParser.js";
import { RoundCallContext } from "./EVALParser.js";
import { AbsCallContext } from "./EVALParser.js";
import { MacroValueContext } from "./EVALParser.js";
import { PrintStatementContext } from "./EVALParser.js";
import { PrintArgContext } from "./EVALParser.js";
import { IfStatementContext } from "./EVALParser.js";
import { WhileStatementContext } from "./EVALParser.js";
import { TryStatementContext } from "./EVALParser.js";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `EVALParser`.
 */
export class EVALParserListener implements ParseTreeListener {
    /**
     * Enter a parse tree produced by `EVALParser.program`.
     * @param ctx the parse tree
     */
    enterProgram?: (ctx: ProgramContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.program`.
     * @param ctx the parse tree
     */
    exitProgram?: (ctx: ProgramContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.statement`.
     * @param ctx the parse tree
     */
    enterStatement?: (ctx: StatementContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.statement`.
     * @param ctx the parse tree
     */
    exitStatement?: (ctx: StatementContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.block`.
     * @param ctx the parse tree
     */
    enterBlock?: (ctx: BlockContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.block`.
     * @param ctx the parse tree
     */
    exitBlock?: (ctx: BlockContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.variableDeclaration`.
     * @param ctx the parse tree
     */
    enterVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.variableDeclaration`.
     * @param ctx the parse tree
     */
    exitVariableDeclaration?: (ctx: VariableDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.constDeclaration`.
     * @param ctx the parse tree
     */
    enterConstDeclaration?: (ctx: ConstDeclarationContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.constDeclaration`.
     * @param ctx the parse tree
     */
    exitConstDeclaration?: (ctx: ConstDeclarationContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.assignment`.
     * @param ctx the parse tree
     */
    enterAssignment?: (ctx: AssignmentContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.assignment`.
     * @param ctx the parse tree
     */
    exitAssignment?: (ctx: AssignmentContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.assignOp`.
     * @param ctx the parse tree
     */
    enterAssignOp?: (ctx: AssignOpContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.assignOp`.
     * @param ctx the parse tree
     */
    exitAssignOp?: (ctx: AssignOpContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.type`.
     * @param ctx the parse tree
     */
    enterType?: (ctx: TypeContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.type`.
     * @param ctx the parse tree
     */
    exitType?: (ctx: TypeContext) => void;
    /**
     * Enter a parse tree produced by the `unaryMinusExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
    /**
     * Exit a parse tree produced by the `unaryMinusExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitUnaryMinusExpr?: (ctx: UnaryMinusExprContext) => void;
    /**
     * Enter a parse tree produced by the `parenExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterParenExpr?: (ctx: ParenExprContext) => void;
    /**
     * Exit a parse tree produced by the `parenExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitParenExpr?: (ctx: ParenExprContext) => void;
    /**
     * Enter a parse tree produced by the `castExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterCastExpr?: (ctx: CastExprContext) => void;
    /**
     * Exit a parse tree produced by the `castExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitCastExpr?: (ctx: CastExprContext) => void;
    /**
     * Enter a parse tree produced by the `powExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterPowExpr?: (ctx: PowExprContext) => void;
    /**
     * Exit a parse tree produced by the `powExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitPowExpr?: (ctx: PowExprContext) => void;
    /**
     * Enter a parse tree produced by the `sqrtExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterSqrtExpr?: (ctx: SqrtExprContext) => void;
    /**
     * Exit a parse tree produced by the `sqrtExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitSqrtExpr?: (ctx: SqrtExprContext) => void;
    /**
     * Enter a parse tree produced by the `minExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterMinExpr?: (ctx: MinExprContext) => void;
    /**
     * Exit a parse tree produced by the `minExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitMinExpr?: (ctx: MinExprContext) => void;
    /**
     * Enter a parse tree produced by the `maxExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterMaxExpr?: (ctx: MaxExprContext) => void;
    /**
     * Exit a parse tree produced by the `maxExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitMaxExpr?: (ctx: MaxExprContext) => void;
    /**
     * Enter a parse tree produced by the `roundExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterRoundExpr?: (ctx: RoundExprContext) => void;
    /**
     * Exit a parse tree produced by the `roundExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitRoundExpr?: (ctx: RoundExprContext) => void;
    /**
     * Enter a parse tree produced by the `absExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterAbsExpr?: (ctx: AbsExprContext) => void;
    /**
     * Exit a parse tree produced by the `absExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitAbsExpr?: (ctx: AbsExprContext) => void;
    /**
     * Enter a parse tree produced by the `macroExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterMacroExpr?: (ctx: MacroExprContext) => void;
    /**
     * Exit a parse tree produced by the `macroExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitMacroExpr?: (ctx: MacroExprContext) => void;
    /**
     * Enter a parse tree produced by the `identExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterIdentExpr?: (ctx: IdentExprContext) => void;
    /**
     * Exit a parse tree produced by the `identExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitIdentExpr?: (ctx: IdentExprContext) => void;
    /**
     * Enter a parse tree produced by the `intLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterIntLiteral?: (ctx: IntLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `intLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitIntLiteral?: (ctx: IntLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `realLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterRealLiteral?: (ctx: RealLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `realLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitRealLiteral?: (ctx: RealLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `stringLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterStringLiteral?: (ctx: StringLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `stringLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitStringLiteral?: (ctx: StringLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `trueLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterTrueLiteral?: (ctx: TrueLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `trueLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitTrueLiteral?: (ctx: TrueLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `falseLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterFalseLiteral?: (ctx: FalseLiteralContext) => void;
    /**
     * Exit a parse tree produced by the `falseLiteral`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitFalseLiteral?: (ctx: FalseLiteralContext) => void;
    /**
     * Enter a parse tree produced by the `equalityExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterEqualityExpr?: (ctx: EqualityExprContext) => void;
    /**
     * Exit a parse tree produced by the `equalityExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitEqualityExpr?: (ctx: EqualityExprContext) => void;
    /**
     * Enter a parse tree produced by the `relationalExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterRelationalExpr?: (ctx: RelationalExprContext) => void;
    /**
     * Exit a parse tree produced by the `relationalExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitRelationalExpr?: (ctx: RelationalExprContext) => void;
    /**
     * Enter a parse tree produced by the `additiveExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterAdditiveExpr?: (ctx: AdditiveExprContext) => void;
    /**
     * Exit a parse tree produced by the `additiveExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitAdditiveExpr?: (ctx: AdditiveExprContext) => void;
    /**
     * Enter a parse tree produced by the `multiplicativeExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    enterMultiplicativeExpr?: (ctx: MultiplicativeExprContext) => void;
    /**
     * Exit a parse tree produced by the `multiplicativeExpr`
     * labeled alternative in `EVALParser.expression`.
     * @param ctx the parse tree
     */
    exitMultiplicativeExpr?: (ctx: MultiplicativeExprContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.castCall`.
     * @param ctx the parse tree
     */
    enterCastCall?: (ctx: CastCallContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.castCall`.
     * @param ctx the parse tree
     */
    exitCastCall?: (ctx: CastCallContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.powCall`.
     * @param ctx the parse tree
     */
    enterPowCall?: (ctx: PowCallContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.powCall`.
     * @param ctx the parse tree
     */
    exitPowCall?: (ctx: PowCallContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.sqrtCall`.
     * @param ctx the parse tree
     */
    enterSqrtCall?: (ctx: SqrtCallContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.sqrtCall`.
     * @param ctx the parse tree
     */
    exitSqrtCall?: (ctx: SqrtCallContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.minCall`.
     * @param ctx the parse tree
     */
    enterMinCall?: (ctx: MinCallContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.minCall`.
     * @param ctx the parse tree
     */
    exitMinCall?: (ctx: MinCallContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.maxCall`.
     * @param ctx the parse tree
     */
    enterMaxCall?: (ctx: MaxCallContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.maxCall`.
     * @param ctx the parse tree
     */
    exitMaxCall?: (ctx: MaxCallContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.roundCall`.
     * @param ctx the parse tree
     */
    enterRoundCall?: (ctx: RoundCallContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.roundCall`.
     * @param ctx the parse tree
     */
    exitRoundCall?: (ctx: RoundCallContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.absCall`.
     * @param ctx the parse tree
     */
    enterAbsCall?: (ctx: AbsCallContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.absCall`.
     * @param ctx the parse tree
     */
    exitAbsCall?: (ctx: AbsCallContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.macroValue`.
     * @param ctx the parse tree
     */
    enterMacroValue?: (ctx: MacroValueContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.macroValue`.
     * @param ctx the parse tree
     */
    exitMacroValue?: (ctx: MacroValueContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.printStatement`.
     * @param ctx the parse tree
     */
    enterPrintStatement?: (ctx: PrintStatementContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.printStatement`.
     * @param ctx the parse tree
     */
    exitPrintStatement?: (ctx: PrintStatementContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.printArg`.
     * @param ctx the parse tree
     */
    enterPrintArg?: (ctx: PrintArgContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.printArg`.
     * @param ctx the parse tree
     */
    exitPrintArg?: (ctx: PrintArgContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.ifStatement`.
     * @param ctx the parse tree
     */
    enterIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.ifStatement`.
     * @param ctx the parse tree
     */
    exitIfStatement?: (ctx: IfStatementContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.whileStatement`.
     * @param ctx the parse tree
     */
    enterWhileStatement?: (ctx: WhileStatementContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.whileStatement`.
     * @param ctx the parse tree
     */
    exitWhileStatement?: (ctx: WhileStatementContext) => void;
    /**
     * Enter a parse tree produced by `EVALParser.tryStatement`.
     * @param ctx the parse tree
     */
    enterTryStatement?: (ctx: TryStatementContext) => void;
    /**
     * Exit a parse tree produced by `EVALParser.tryStatement`.
     * @param ctx the parse tree
     */
    exitTryStatement?: (ctx: TryStatementContext) => void;

    visitTerminal(node: TerminalNode): void {}
    visitErrorNode(node: ErrorNode): void {}
    enterEveryRule(node: ParserRuleContext): void {}
    exitEveryRule(node: ParserRuleContext): void {}
}

