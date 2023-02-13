import RequestMethod from '../constants/RequestMethod.enum';
export type ParamType = Record<string, string | number>;
export interface HttpServiceInterface<DataType = any> {
    name: string;
    comments: string[];
    pathParameters?: ParamType;
    return: DataType;
    url: string;
    method: RequestMethod;
    data?: DataType;
    header?: Record<string, string>;
}
export declare type HTTPServiceModule = {
    className: string;
    moduleName: string;
    filePath: string;
    services: Array<HttpServiceInterface>;
    dependencies: Array<string>;
};
