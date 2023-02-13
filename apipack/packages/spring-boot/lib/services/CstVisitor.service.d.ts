import {
  DependencyConstructor,
  DependencyInterface,
  DependencyMetaData
} from '@apipack/core'
import {
  AnnotationCtx,
  BaseJavaCstVisitorWithDefaults,
  ClassBodyDeclarationCtx,
  ClassDeclarationCtx,
  ClassMemberDeclarationCtx,
  ClassModifierCtx,
  FieldDeclarationCtx,
  FieldModifierCtx,
  ImportDeclarationCtx,
  MethodDeclarationCtx,
  MethodDeclaratorCtx,
  MethodHeaderCtx,
  MethodModifierCtx,
  NormalClassDeclarationCtx,
  PackageDeclarationCtx,
  ResultCtx,
  VariableDeclaratorCtx
} from 'java-parser'
import MetaType from '../constants/MetaType.enum'
import {
  ReadCstServiceConstructor,
  ReadCstServiceInterface
} from '../interfaces/CstReader.interface'
export declare type VisitorConstructor = {
  metadata: DependencyMetaData<MetaType>
  DependencyImpl: DependencyConstructor<MetaType>
  ReadCstServiceImpl: ReadCstServiceConstructor<MetaType>
}
/**
 * Visitor
 * To collect package, import, annotation and method declarations
 */
export default class Visitor extends BaseJavaCstVisitorWithDefaults {
  protected static DependencyImpl: VisitorConstructor['DependencyImpl']
  protected static ReadCstServiceImpl: VisitorConstructor['ReadCstServiceImpl']
  readCstService: ReadCstServiceInterface<MetaType>
  dependency: DependencyInterface<MetaType>
  constructor({
    metadata,
    DependencyImpl,
    ReadCstServiceImpl
  }: VisitorConstructor)
  packageDeclaration(ctx: PackageDeclarationCtx): void
  importDeclaration(ctx: ImportDeclarationCtx): void
  classDeclaration(ctx: ClassDeclarationCtx): void
  /**
   * classModifier must has parentDependency
   * Cause it was just a Modifier for a class
   *
   * @param ctx
   * @param parentDependency
   */
  classModifier(
    ctx: ClassModifierCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  annotation(
    ctx: AnnotationCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  normalClassDeclaration(
    ctx: NormalClassDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  classBodyDeclaration(
    ctx: ClassBodyDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  classMemberDeclaration(
    ctx: ClassMemberDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  fieldDeclaration(
    ctx: FieldDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  fieldModifier(
    ctx: FieldModifierCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  variableDeclarator(
    ctx: VariableDeclaratorCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  methodDeclaration(
    ctx: MethodDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  methodModifier(
    ctx: MethodModifierCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  methodHeader(
    ctx: MethodHeaderCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  methodDeclarator(
    ctx: MethodDeclaratorCtx,
    parentDependency: DependencyInterface<MetaType>
  ): void
  result(ctx: ResultCtx, parentDependency: DependencyInterface<MetaType>): void
}
