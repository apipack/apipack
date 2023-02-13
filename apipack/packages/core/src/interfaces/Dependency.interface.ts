import { MetaData, MetaDataValueType } from './MetaData.interface'

export declare interface DependencyMetaData<
  MetaType,
  MetaValue = MetaDataValueType
> extends Partial<MetaData<MetaType, MetaValue>> {}

export declare interface DependencyConstructor<
  MetaType,
  MetaValue = MetaDataValueType
> {
  new (metadata: DependencyMetaData<MetaType, MetaValue>): DependencyInterface<
    MetaType,
    MetaValue
  >
}

export declare interface DependencyInterface<
  MetaType,
  MetaValue = MetaDataValueType
> {
  dependencies: Set<DependencyInterface<MetaType, MetaValue>>
  metadata: Partial<MetaData<MetaType, MetaValue>>
  name: string
  addDependency(dependency: DependencyInterface<MetaType, MetaValue>): void
  deleteDependency(dependency: DependencyInterface<MetaType, MetaValue>): void
}
