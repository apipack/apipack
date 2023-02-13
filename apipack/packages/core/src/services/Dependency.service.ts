import {
  DependencyMetaData,
  DependencyInterface
} from '../interfaces/Dependency.interface'

export default class DependencyImpl<MetaType>
  implements DependencyInterface<MetaType>
{
  dependencies: Set<DependencyInterface<MetaType>>
  metadata: DependencyMetaData<MetaType>
  name: string

  constructor(metadata: DependencyMetaData<MetaType>, name?: string) {
    this.dependencies = new Set<DependencyInterface<MetaType>>()

    this.metadata = metadata
    this.name = (name || metadata.name) as string
  }

  addDependency(dependency: DependencyInterface<MetaType>) {
    this.dependencies.add(dependency)
  }

  deleteDependency(dependency: DependencyInterface<MetaType>) {
    this.dependencies.delete(dependency)
  }
}