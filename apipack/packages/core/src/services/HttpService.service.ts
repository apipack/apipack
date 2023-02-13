import RequestMethod from '../constants/RequestMethod.enum'
import {
  ParamType,
  HttpServiceInterface
} from '../interfaces/HttpService.interface'

export default class HttpServiceImpl implements HttpServiceInterface {
  name: string
  comments: string[]
  pathParameters?: ParamType | undefined
  return: any
  url: string
  method: RequestMethod
  data?: any
  header?: Record<string, string> | undefined

  constructor(options?: Partial<HttpServiceInterface>) {
    this.name = options?.name!
    this.url = options?.url!
    this.method = options?.method!
    this.data = {}
    this.header = {}
    this.comments = []
    this.pathParameters = {}
    this.return = void 0
  }
}