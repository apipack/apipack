import { IToken, CstNode, ElementValueCstNode, ElementValuePairListCstNode, AnnotationCtx, TypeArgumentListCstNode, UnannTypeCstNode, VariableDeclaratorIdCstNode, VariableDeclaratorListCstNode } from 'java-parser';
export type TypeName = {
    baseName: string;
    argumentsName: TypeName[];
};
export type VarType = string | {
    varName: string;
    typeName: TypeName;
};
export type AnnotationType<ValueType = any> = {
    annotationName: string;
    annotationValue: ValueType;
};
export type FieldType = {
    fieldModifier: AnnotationType[];
    unannType: TypeName;
    variableDeclaratorList: VarType[];
};
export type MethodType = {
    variableModifier: AnnotationType[];
    unannType: TypeName;
    variableDeclaratorId: VarType;
};
export declare const joinIdentifierName: (array: IToken[], separator?: string) => string;
export declare function extractNodeChildren<T extends CstNode>(cstNode?: T): T | null;
export declare function extractNodeChildren<T extends CstNode>(cstNode?: T[]): T['children'] | null;
export declare function getFirstKeyOfCtx(obj: Record<string, CstNode[] | IToken[]>): string;
export declare function getFirstCstNode<T extends CstNode>(cstNode: T | T[]): T;
export declare function extractNodeChildrenByPath<R, T extends CstNode>(cstNode: T | T[], keyPath: string): R;
export declare function getElementValue<R extends IToken>(elementValue: ElementValueCstNode, keyPath?: string): string;
export declare function getElementPairListValue(elementValuePairListCstNode: ElementValuePairListCstNode[]): Record<string, any>;
export declare function createTypeName(baseName: string): TypeName;
export declare function typeNameToString(typeName: TypeName): string;
export declare function geneTypeArgumentListName(argumentList: TypeArgumentListCstNode[]): TypeName[];
export declare function getAnnotation(ctx: AnnotationCtx): AnnotationType;
export declare function getUnannTypeName(unannType: UnannTypeCstNode[]): TypeName;
export declare function getVariableList(variableDeclaratorList: VariableDeclaratorListCstNode[]): VarType[];
export declare function getVariableName(variableDeclaratorId: VariableDeclaratorIdCstNode[]): VarType;
