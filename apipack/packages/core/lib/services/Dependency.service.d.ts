import { DependencyMetaData, DependencyInterface } from '../interfaces/Dependency.interface';
export default class DependencyImpl<MetaType> implements DependencyInterface<MetaType> {
    dependencies: Set<DependencyInterface<MetaType>>;
    metadata: DependencyMetaData<MetaType>;
    name: string;
    constructor(metadata: DependencyMetaData<MetaType>, name?: string);
    addDependency(dependency: DependencyInterface<MetaType>): void;
    deleteDependency(dependency: DependencyInterface<MetaType>): void;
}
