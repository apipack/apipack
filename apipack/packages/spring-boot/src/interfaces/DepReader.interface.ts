import {
  HTTPServiceModule,
  DependencyInterface,
  DependencyGraphInterface,
  HttpServiceInterface
} from '@apipack/core'
import MetaType from '../constants/MetaType.enum'
import { TypeName } from '../utils/parser.utils'

export declare type MetaTypeKey = keyof typeof MetaType

export declare interface ReadDepServiceConstructor {
  new (): ReadDepServiceInterface
}

export declare type ReadDepType<ValueType = any> = {
  before?: ReadDepHandler<ValueType>
  after?: ReadDepHandler<ValueType>
}

export declare type ReadDepHandler<ValueType = any> = (
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType, ValueType>
) => void

export declare type ReadDepService = {
  [key in MetaTypeKey]: Array<ReadDepHandler>
}

export declare interface ReadDepServiceInterface
  extends ReadDepService,
    HTTPServiceModule {
  currentService?: HttpServiceInterface<TypeName>

  services: Array<HttpServiceInterface<TypeName>>

  visit: (dep: DependencyInterface<MetaType, any>) => void

  extend: (type: MetaType, handler: ReadDepHandler) => void
}
