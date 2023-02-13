import debug from 'debug'
import { DependencyInterface, HttpServiceInterface } from '@apipack/core'
import MetaType from '../constants/MetaType.enum'
import {
  ReadDepType,
  ReadDepServiceInterface
} from '../interfaces/DepReader.interface'
import {
  defaultAnnotationFn,
  defaultClassFn,
  defaultFileFn,
  defaultImportFn,
  defaultMemberFn,
  defaultMethodFn,
  defaultPackageFn,
  defaultParameterFn,
  defaultReturnFn
} from '../utils/reader.utils'
import { TypeName } from '../utils/parser.utils'

const name = 'ReadDepServiceImpl'
const logger = debug(name)

export default class ReadDepServiceImpl implements ReadDepServiceInterface {
  className: string
  moduleName: string
  filePath: string
  services: Array<HttpServiceInterface>
  dependencies: Array<string>
  currentService?: HttpServiceInterface

  constructor(rootDep: DependencyInterface<MetaType>) {
    this.moduleName = ''
    this.className = ''
    this.filePath = ''

    this.services = []
    this.dependencies = []
    // this.currentService = undefined

    this.visit(rootDep)
    logger(this.services)

    // TODO
    // this.collect(rootDep)
  }

  visit(dep: DependencyInterface<MetaType, any>) {
    const metaType = dep.metadata.type!
    const visitCallbacksList = this[metaType]

    if (visitCallbacksList?.length) {
      visitCallbacksList.forEach(visitCallback => {
        visitCallback(this, dep)
      })
    }
    // logger(`${metaType}(dep): ${dep.name}`, dep.metadata)

    if (dep.dependencies.size) {
      dep.dependencies.forEach(subDep => {
        this.visit(subDep)
      })
    }
  }

  /* collect(dep: DependencyInterface<MetaType, any>) {
    this.services.forEach(service => {
      if (service.data?.length) {
        // service.data =
      }
    })
  } */

  extend(type: MetaType, handler: ReadDepType) {
    if (typeof handler === 'function') {
      this[type].push(handler)
    }

    if (typeof handler === 'object') {
      if (typeof handler.before === 'function') {
        this[type].unshift(handler.before)
      }

      if (typeof handler.after === 'function') {
        this[type].unshift(handler.after)
      }
    }
  }

  File = [defaultFileFn]

  Package = [defaultPackageFn]

  Import = [defaultImportFn]

  Class = [defaultClassFn]

  Member = [defaultMemberFn]

  Method = [defaultMethodFn]

  Annotation = [defaultAnnotationFn]

  Parameter = [defaultParameterFn]

  Return = [defaultReturnFn]
}
