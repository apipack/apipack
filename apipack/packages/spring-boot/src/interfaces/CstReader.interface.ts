import { DependencyMetaData } from '@apipack/core'
import {
  AnnotationCtx,
  ClassDeclarationCtx,
  ClassMemberDeclarationCtx,
  ImportDeclarationCtx,
  MethodDeclarationCtx,
  PackageDeclarationCtx,
  MethodDeclaratorCtx,
  FieldDeclarationCtx,
  ResultCtx
} from 'java-parser'
import { FieldType, MethodType, TypeName } from '../utils/parser.utils'

export declare interface ReadCstServiceConstructor<MetaType> {
  new (): ReadCstServiceInterface<MetaType>
}

export declare interface ReadCstServiceInterface<MetaType> {
  /**
   * To visit packageDeclaration and add it to rootDependency
   * @param ctx
   */
  packageDeclaration(ctx: PackageDeclarationCtx): DependencyMetaData<MetaType>

  /**
   * To visit all importDeclarations and add them to rootDependency
   * @param ctx
   */
  importDeclaration(ctx: ImportDeclarationCtx): DependencyMetaData<MetaType>

  /**
   * To visit current classDeclaration, instantiate a ClassDependency and add it to rootDependency
   * @param ctx
   */
  classDeclaration(ctx: ClassDeclarationCtx): DependencyMetaData<MetaType>

  annotation(ctx: AnnotationCtx): DependencyMetaData<MetaType>

  classMemberDeclaration(
    ctx: ClassMemberDeclarationCtx
  ): DependencyMetaData<MetaType>

  fieldDeclaration(
    ctx: FieldDeclarationCtx
  ): DependencyMetaData<MetaType, FieldType>

  methodDeclaration(ctx: MethodDeclarationCtx): DependencyMetaData<MetaType>

  methodDeclarator(
    ctx: MethodDeclaratorCtx
  ): DependencyMetaData<MetaType, MethodType[]>

  result(ctx: ResultCtx): DependencyMetaData<MetaType, TypeName>
}