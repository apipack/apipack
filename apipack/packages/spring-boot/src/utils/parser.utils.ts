import debug from 'debug'
import {
  IToken,
  CstNode,
  ElementValueCstNode,
  ElementValuePairListCstNode,
  ClassTypeCtx,
  AnnotationCtx,
  TypeArgumentCstNode,
  TypeArgumentListCstNode,
  UnannTypeCstNode,
  UnannClassTypeCtx,
  VariableDeclaratorIdCtx,
  VariableDeclaratorCstNode,
  VariableDeclaratorIdCstNode,
  VariableDeclaratorListCstNode
} from 'java-parser'

const name = 'reader.utils'
const logger = debug(name)

export type TypeName = {
  baseName: string
  argumentsName: TypeName[]
}

export type VarType =
  | string
  | {
      varName: string
      typeName: TypeName
    }

export type AnnotationType<ValueType = any> = {
  annotationName: string
  annotationValue: ValueType
}

export type FieldType = {
  fieldModifier: AnnotationType[]
  unannType: TypeName
  variableDeclaratorList: VarType[]
}

export type MethodType = {
  variableModifier: AnnotationType[]
  unannType: TypeName
  variableDeclaratorId: VarType
}

export const joinIdentifierName = (
  array: IToken[],
  separator: string = '.'
) => {
  return array.map(identifier => identifier.image).join(separator)
}

export function extractNodeChildren<T extends CstNode>(cstNode?: T): T | null
export function extractNodeChildren<T extends CstNode>(
  cstNode?: T[]
): T['children'] | null
export function extractNodeChildren<T extends CstNode>(
  cstNode?: T
): T | T['children'] | null {
  if (cstNode) {
    let firstNode = getFirstCstNode(cstNode)

    if (firstNode && firstNode.children) {
      return firstNode.children as T['children']
    } else {
      return firstNode as T
    }
  }

  return null
}

export function getFirstKeyOfCtx(obj: Record<string, CstNode[] | IToken[]>) {
  if (obj && typeof obj === 'object') {
    return Object.keys(obj)[0]
  }
}

export function getFirstCstNode<T extends CstNode>(cstNode: T | T[]): T {
  if (Array.isArray(cstNode) && cstNode.length) {
    return cstNode[0]
  }

  return cstNode as T
}

export function extractNodeChildrenByPath<R, T extends CstNode>(
  cstNode: T | T[],
  keyPath: string
): R
export function extractNodeChildrenByPath<R, T extends CstNode>(
  cstNode: T,
  keyPath: string
): R {
  const keyPaths = keyPath.split('.')
  let nextNode = extractNodeChildren(cstNode)
  let nextKey = ''

  while (keyPaths.length && nextNode) {
    nextKey = keyPaths.shift() as keyof CstNode

    if (nextKey) {
      // @ts-ignore
      nextNode = extractNodeChildren(nextNode[nextKey] as CstNode)
    }
  }

  return nextNode as any as R
}

export function getElementValue<R extends IToken>(
  elementValue: ElementValueCstNode,
  keyPath: string = 'expression.ternaryExpression.binaryExpression.unaryExpression.primary.primaryPrefix.literal.StringLiteral'
): string {
  const finalNode = extractNodeChildrenByPath<R, ElementValueCstNode>(
    elementValue,
    keyPath
  )

  return finalNode?.image
}

export function getElementPairListValue(
  elementValuePairListCstNode: ElementValuePairListCstNode[]
) {
  const elementValuePairList = extractNodeChildren(elementValuePairListCstNode)
  let result: Record<string, any> = {}

  if (elementValuePairList?.elementValuePair.length) {
    elementValuePairList.elementValuePair.forEach(elementValuePair => {
      const key = joinIdentifierName(elementValuePair.children.Identifier)
      const val = getElementValue(
        getFirstCstNode(elementValuePair.children.elementValue)
      )

      result[key] = val
    })
  }

  return result
}

export function createTypeName(baseName: string): TypeName {
  return {
    baseName,
    argumentsName: []
  }
}

export function typeNameToString(typeName: TypeName): string {
  if (typeof typeName === 'string') return typeName

  if (typeName.argumentsName.length) {
    return (typeName.baseName +=
      '<' + typeName.argumentsName.map(typeNameToString).join(',') + '>')
  }

  return typeName.baseName
}

export function geneTypeArgumentListName(
  argumentList: TypeArgumentListCstNode[]
): TypeName[] {
  const typeArgumentListCtx = extractNodeChildren(argumentList)
  const typeArgument = typeArgumentListCtx?.typeArgument

  if (typeArgument?.length) {
    return typeArgument.map(type => {
      const typeName = createTypeName('')
      const node = extractNodeChildrenByPath<ClassTypeCtx, TypeArgumentCstNode>(
        type,
        'referenceType.classOrInterfaceType.classType'
      )
      typeName.baseName = joinIdentifierName(node.Identifier)

      if (node.typeArguments?.length) {
        const child = extractNodeChildren(node.typeArguments)

        if (child?.typeArgumentList?.length) {
          const childTypeName = geneTypeArgumentListName(child.typeArgumentList)

          if (childTypeName?.length) {
            typeName.argumentsName = childTypeName
          }
        }
      }

      return typeName
    })
  }

  return []
}

export function getAnnotation(ctx: AnnotationCtx): AnnotationType {
  const typeName = extractNodeChildren(ctx.typeName)
  const annotationName = joinIdentifierName(typeName?.Identifier!)
  let value: string | {} = ''

  if (ctx.elementValuePairList) {
    value = getElementPairListValue(ctx.elementValuePairList)
  } else if (ctx.elementValue) {
    value = getElementValue(getFirstCstNode(ctx.elementValue))
  }

  return {
    annotationName,
    annotationValue: value
  }
}

export function getUnannTypeName(unannType: UnannTypeCstNode[]): TypeName {
  const typeName = createTypeName('')
  const { Identifier, typeArguments } = extractNodeChildrenByPath<
    UnannClassTypeCtx,
    UnannTypeCstNode
  >(unannType, 'unannReferenceType.unannClassOrInterfaceType.unannClassType')

  typeName.baseName = joinIdentifierName(Identifier)

  if (typeArguments?.length) {
    const typeArgumentsCtx = extractNodeChildren(typeArguments)

    if (typeArgumentsCtx) {
      typeName.argumentsName = geneTypeArgumentListName(
        typeArgumentsCtx.typeArgumentList
      )
    }
  }

  return typeName
}

export function getVariableList(
  variableDeclaratorList: VariableDeclaratorListCstNode[]
): VarType[] {
  const variableDeclaratorListCtx = extractNodeChildren(variableDeclaratorList)
  const variableDeclarator = variableDeclaratorListCtx?.variableDeclarator
  let varTypeList: VarType[] = []

  if (variableDeclarator?.length) {
    variableDeclarator.forEach(varDeclarator => {
      const variableDeclaratorId = extractNodeChildrenByPath<
        VariableDeclaratorIdCtx,
        VariableDeclaratorCstNode
      >(varDeclarator, 'variableDeclaratorId')
      varTypeList.push(joinIdentifierName(variableDeclaratorId.Identifier))
    })
  }

  return varTypeList
}

export function getVariableName(
  variableDeclaratorId: VariableDeclaratorIdCstNode[]
): VarType {
  const node = extractNodeChildren(variableDeclaratorId)
  return joinIdentifierName(node?.Identifier!)
}