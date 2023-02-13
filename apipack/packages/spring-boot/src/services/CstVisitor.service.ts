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
import { extractNodeChildren } from '../utils/parser.utils'

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
  }: VisitorConstructor) {
    super()

    // static
    Visitor.DependencyImpl = DependencyImpl
    Visitor.ReadCstServiceImpl = ReadCstServiceImpl

    // public
    this.readCstService = new ReadCstServiceImpl()
    this.dependency = new DependencyImpl(metadata)

    this.validateVisitor()
  }

  packageDeclaration(ctx: PackageDeclarationCtx) {
    const metadata = this.readCstService.packageDeclaration(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    this.dependency.addDependency(dependency)
  }

  importDeclaration(ctx: ImportDeclarationCtx) {
    const metadata = this.readCstService.importDeclaration(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    this.dependency.addDependency(dependency)
  }

  classDeclaration(ctx: ClassDeclarationCtx) {
    const metadata = this.readCstService.classDeclaration(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    this.dependency.addDependency(dependency)

    // To visit @ClassModifier if needed
    if (ctx?.classModifier?.length) {
      ctx.classModifier.forEach(classModifier => {
        this.visit(classModifier, dependency)
      })
    }

    if (ctx?.normalClassDeclaration?.length) {
      this.visit(ctx.normalClassDeclaration, dependency)
    }
  }

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
  ) {
    // only visit all of annotations
    const annotation = ctx.annotation?.[0]

    if (annotation) {
      this.visit(annotation, parentDependency)
    }
  }

  annotation(
    ctx: AnnotationCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    const metadata = this.readCstService.annotation(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    parentDependency.addDependency(dependency)
  }

  normalClassDeclaration(
    ctx: NormalClassDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    if (ctx.classBody?.length) {
      const { classBodyDeclaration } = extractNodeChildren(ctx.classBody)! || {}

      if (classBodyDeclaration?.length) {
        classBodyDeclaration.forEach(classBodyDeclaration => {
          this.visit(classBodyDeclaration, parentDependency)
        })
      }
    }
  }

  classBodyDeclaration(
    ctx: ClassBodyDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    if (ctx.classMemberDeclaration) {
      this.visit(ctx.classMemberDeclaration, parentDependency)
    }
  }

  classMemberDeclaration(
    ctx: ClassMemberDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    const metadata = this.readCstService.classMemberDeclaration(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    parentDependency.addDependency(dependency)

    // we also need to read fieldDeclaration for VO classes
    if (ctx.fieldDeclaration?.length) {
      this.visit(ctx.fieldDeclaration, dependency)
    }

    // we only need to read methodDeclaration
    if (ctx.methodDeclaration?.length) {
      this.visit(ctx.methodDeclaration, dependency)
    }
  }

  fieldDeclaration(
    ctx: FieldDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    const metadata = this.readCstService.fieldDeclaration(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    parentDependency.addDependency(dependency)
  }

  fieldModifier(
    ctx: FieldModifierCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    // only visit annotations
    if (ctx.annotation?.length) {
      this.visit(ctx.annotation, parentDependency)
    }
  }

  variableDeclarator(
    ctx: VariableDeclaratorCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    console.log(ctx)
  }

  methodDeclaration(
    ctx: MethodDeclarationCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    const metadata = this.readCstService.methodDeclaration(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    parentDependency.addDependency(dependency)

    // To visit @MethodModifier if needed
    if (ctx.methodModifier?.length) {
      ctx.methodModifier.forEach(methodModifier => {
        this.visit(methodModifier, dependency)
      })
    }

    this.visit(ctx.methodHeader, dependency)
  }

  methodModifier(
    ctx: MethodModifierCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    // only visit annotations
    if (ctx.annotation?.length) {
      this.visit(ctx.annotation, parentDependency)
    }
  }

  methodHeader(
    ctx: MethodHeaderCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    const { result, methodDeclarator } = ctx

    this.visit(methodDeclarator, parentDependency)
    this.visit(result, parentDependency)
  }

  methodDeclarator(
    ctx: MethodDeclaratorCtx,
    parentDependency: DependencyInterface<MetaType>
  ) {
    const metadata = this.readCstService.methodDeclarator(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    parentDependency.addDependency(dependency)
  }

  result(ctx: ResultCtx, parentDependency: DependencyInterface<MetaType>) {
    const metadata = this.readCstService.result(ctx)
    const dependency = new Visitor.DependencyImpl(metadata)

    parentDependency.addDependency(dependency)
  }
}
