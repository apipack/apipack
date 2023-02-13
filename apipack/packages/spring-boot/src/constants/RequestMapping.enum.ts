import { RequestMethod } from '@apipack/core'

const RequestMapping = {
  GetMapping: RequestMethod.GET,
  PatchMapping: RequestMethod.PATCH,
  PostMapping: RequestMethod.POST,
  PutMapping: RequestMethod.PUT,
  DeleteMapping: RequestMethod.DELETE
}

export declare type RequestMappingKeys = keyof typeof RequestMapping

export default RequestMapping