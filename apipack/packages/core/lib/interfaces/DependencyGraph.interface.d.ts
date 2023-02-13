import { DependencyInterface } from './Dependency.interface';
export declare type DependencyGraphMap<MetaType> = Map<string, DependencyInterface<MetaType>>;
export declare interface DependencyGraphConstructor<MetaType> {
    new (name: string): DependencyGraphInterface<MetaType>;
}
export declare interface DependencyGraphInterface<MetaType> {
    name: string;
    dependenciesMap: DependencyGraphMap<MetaType>;
    addDependency(dependency: DependencyInterface<MetaType>): DependencyGraphMap<MetaType>;
    removeDependency(dependencyOrKey: DependencyInterface<MetaType> | string): boolean;
}
