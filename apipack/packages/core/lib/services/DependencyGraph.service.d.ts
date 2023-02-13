import { DependencyInterface } from '../interfaces/Dependency.interface';
import { DependencyGraphInterface } from '../interfaces/DependencyGraph.interface';
export default class DependencyGraphImpl<MetaType> implements DependencyGraphInterface<MetaType> {
    name: string;
    dependenciesMap: Map<string, DependencyInterface<MetaType>>;
    constructor(name?: string);
    addDependency(dependency: DependencyInterface<MetaType>): Map<string, DependencyInterface<MetaType, import("..").MetaDataValueType>>;
    removeDependency(dependencyOrKey: DependencyInterface<MetaType> | string): boolean;
}
