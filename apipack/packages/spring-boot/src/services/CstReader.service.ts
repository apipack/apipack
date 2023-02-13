import debug from 'debug'
import { DependencyMetaData } from '@apipack/core'
import {
  AnnotationCtx,
  ClassDeclarationCtx,
  ClassMemberDeclarationCtx,
  FieldDeclarationCtx,
  FieldModifierCstNode,
  FormalParameterListCstNode,
  ImportDeclarationCtx,
  MethodDeclarationCtx,
  MethodDeclaratorCtx,
  MethodHeaderCstNode,
  PackageDeclarationCtx,
  ResultCtx,
  VariableModifierCstNode,
  VariableParaRegularParameterCtx
} from 'java-parser'
import { ReadCstServiceInterface } from '../interfaces/CstReader.interface'
import MetaType from '../constants/MetaType.enum'
import {
  VarType,
  TypeName,
  FieldType,
  MethodType,
  getAnnotation,
  createTypeName,
  getVariableList,
  getFirstKeyOfCtx,
  typeNameToString,
  getUnannTypeName,
  joinIdentifierName,
  extractNodeChildren,
  extractNodeChildrenByPath
} from '../utils/parser.utils'

const name = 'ReadCstServiceImpl'
const logger = debug(name)

type ClassMemberDeclarationCtxKey = Exclude<
  keyof ClassMemberDeclarationCtx,
  'Semicolon'
>

export default class ReadCstServiceImpl
  implements ReadCstServiceInterface<MetaType>
{
  packageDeclaration(ctx: PackageDeclarationCtx): DependencyMetaData<MetaType> {
    const packageName = joinIdentifierName(ctx.Identifier)

    return {
      name: packageName,
      type: MetaType.Package
    }
  }

  importDeclaration(ctx: ImportDeclarationCtx): DependencyMetaData<MetaType> {
    const children = extractNodeChildren(ctx.packageOrTypeName)
    const importName = joinIdentifierName(children?.Identifier!)

    return {
      name: importName,
      type: MetaType.Import
    }
  }

  classDeclaration(ctx: ClassDeclarationCtx): DependencyMetaData<MetaType> {
    const children = extractNodeChildren(ctx.normalClassDeclaration)
    const typeIdentifier = extractNodeChildren(children?.typeIdentifier)
    const className = joinIdentifierName(typeIdentifier?.Identifier!)

    return {
      name: className,
      type: MetaType.Class
    }
  }

  annotation(ctx: AnnotationCtx): DependencyMetaData<MetaType> {
    const { annotationName, annotationValue } = getAnnotation(ctx)
    // logger(annotationName, JSON.stringify(annotationValue))

    return {
      name: annotationName,
      type: MetaType.Annotation,
      value: annotationValue
    }
  }

  classMemberDeclaration(
    ctx: ClassMemberDeclarationCtx
  ): DependencyMetaData<MetaType> {
    const nextKey = getFirstKeyOfCtx(ctx) as ClassMemberDeclarationCtxKey
    const nextObj = ctx[nextKey]
    let name = ''

    if (nextObj?.length) {
      const { name: nodeName, fullName } = nextObj[0]
      name = fullName || nodeName
    }

    return {
      name,
      type: MetaType.Member,
      value: ''
    }
  }

  fieldDeclaration(
    ctx: FieldDeclarationCtx
  ): DependencyMetaData<MetaType, FieldType> {
    const { fieldModifier, unannType, variableDeclaratorList } = ctx

    let varTypeName: VarType[] = []
    let result: FieldType = {
      fieldModifier: [],
      unannType: {
        baseName: '',
        argumentsName: []
      },
      variableDeclaratorList: []
    }

    if (fieldModifier?.length) {
      fieldModifier.forEach(modifier => {
        const annotation = extractNodeChildrenByPath<
          AnnotationCtx,
          FieldModifierCstNode
        >(modifier, 'annotation')

        if (annotation) {
          result.fieldModifier.push(getAnnotation(annotation))
        }
      })
    }

    if (unannType?.length) {
      result.unannType = getUnannTypeName(unannType)
    }

    if (variableDeclaratorList?.length) {
      varTypeName = result.variableDeclaratorList = getVariableList(
        variableDeclaratorList
      )
    }

    return {
      name: varTypeName[0] as string,
      type: MetaType.Member,
      value: result
    }
  }

  methodDeclaration(
    ctx: MethodDeclarationCtx
  ): DependencyMetaData<MetaType, string> {
    const { methodHeader } = ctx
    const methodDeclarator = extractNodeChildrenByPath<
      MethodDeclaratorCtx,
      MethodHeaderCstNode
    >(methodHeader, 'methodDeclarator')
    const name = joinIdentifierName(methodDeclarator.Identifier)

    return {
      name,
      type: MetaType.Method,
      value: ''
    }
  }

  methodDeclarator(
    ctx: MethodDeclaratorCtx
  ): DependencyMetaData<MetaType, MethodType[]> {
    const { formalParameterList, Identifier } = ctx
    let name = joinIdentifierName(Identifier)
    const results: MethodType[] = []

    if (formalParameterList?.length) {
      const result: MethodType = {
        variableModifier: [],
        variableDeclaratorId: '',
        unannType: {
          baseName: '',
          argumentsName: []
        }
      }

      formalParameterList.forEach(() => {
        const node = extractNodeChildrenByPath<
          VariableParaRegularParameterCtx,
          FormalParameterListCstNode
        >(formalParameterList, 'formalParameter.variableParaRegularParameter')
        const { variableModifier, unannType, variableDeclaratorId } = node

        if (variableModifier?.length) {
          const annotation = extractNodeChildrenByPath<
            AnnotationCtx,
            VariableModifierCstNode
          >(variableModifier, 'annotation')

          if (annotation) {
            try {
              result.variableModifier.push(getAnnotation(annotation))
            } catch (error) {
              logger(error)
              // logger(annotation)
            }
          }
        }

        if (unannType?.length) {
          result.unannType = getUnannTypeName(unannType)
        }

        if (variableDeclaratorId?.length) {
          const node = extractNodeChildren(variableDeclaratorId)

          result.variableDeclaratorId = joinIdentifierName(node?.Identifier!)
          name = result.variableDeclaratorId
        }

        results.push(result)
      })
    }

    logger(name, JSON.stringify(results))

    return {
      name: name,
      type: MetaType.Parameter,
      value: results
    }
  }

  result(ctx: ResultCtx): DependencyMetaData<MetaType, TypeName> {
    const { unannType, Void } = ctx
    let typeName = createTypeName('')

    if (unannType?.length) {
      typeName = getUnannTypeName(unannType)
    } else if (Void?.length) {
      typeName.baseName = joinIdentifierName(Void)
    }

    return {
      name: typeNameToString(typeName),
      type: MetaType.Return,
      value: typeName
    }
  }
}
