export interface MetaData<MetaType, MetaValue = MetaDataValueType> {
    name: string;
    type: MetaType;
    path: string;
    desc: string;
    value: MetaValue;
}
export type MetaDataObject = {
    [identifier: string]: MetaDataValueType;
} | Record<string, any>;
export type MetaDataValueType = MetaDataObject | Array<MetaDataObject> | string | boolean | number;
