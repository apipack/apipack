import { DependencyInterface } from '../interfaces/Dependency.interface'
import { DependencyGraphInterface } from '../interfaces/DependencyGraph.interface'

export default class DependencyGraphImpl<MetaType>
  implements DependencyGraphInterface<MetaType>
{
  name: string
  dependenciesMap: Map<string, DependencyInterface<MetaType>>

  constructor(name: string = '') {
    this.name = name
    this.dependenciesMap = new Map<string, DependencyInterface<MetaType>>()
  }

  addDependency(dependency: DependencyInterface<MetaType>) {
    return this.dependenciesMap.set(dependency.name, dependency)
  }

  removeDependency(dependencyOrKey: DependencyInterface<MetaType> | string) {
    let dependencyKey = dependencyOrKey

    if (typeof dependencyKey !== 'string') {
      if (dependencyOrKey && typeof dependencyOrKey === 'object') {
        dependencyKey = dependencyOrKey.name
      }
    }

    return this.dependenciesMap.delete(dependencyKey as string)
  }
}