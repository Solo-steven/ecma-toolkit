import { SyntaxKinds } from "@/src/syntax/kinds";

export function getBinaryPrecedence(kind: SyntaxKinds) {
    switch(kind) {
        case SyntaxKinds.LogicalOROperator:
            return 4;
        case SyntaxKinds.LogicalANDOperator:
            return 5;
        case SyntaxKinds.BitwiseOROperator:
            return 6;
        case SyntaxKinds.BitwiseXOROperator:
            return 7;
        case SyntaxKinds.BitwiseANDOperator:
            return 8;
        case SyntaxKinds.StrictEqOperator:
        case SyntaxKinds.StrictNotEqOperator:
        case SyntaxKinds.EqOperator:
        case SyntaxKinds.NotEqOperator:
            return 9;
        case SyntaxKinds.InKeyword:
        case SyntaxKinds.InstanceofKeyword:
        case SyntaxKinds.GtOperator:
        case SyntaxKinds.GeqtOperator:
        case SyntaxKinds.LeqtOperator:
        case SyntaxKinds.LtOperator:
            return 10;
        case SyntaxKinds.BitwiseLeftShiftOperator:
        case SyntaxKinds.BitwiseRightShiftOperator:
        case SyntaxKinds.BitwiseRightShiftFillOperator:
            return 11;
        case SyntaxKinds.PlusOperator:
        case SyntaxKinds.MinusOperator:
            return 12;
        case SyntaxKinds.ModOperator:
        case SyntaxKinds.DivideOperator:
        case SyntaxKinds.MultiplyOperator:
            return 13;
        case SyntaxKinds.ExponOperator:
            return 14;
        default:
            return -1;
    }
}

export function isBinaryOps(kind: SyntaxKinds) {
    return getBinaryPrecedence(kind) > 0;
}