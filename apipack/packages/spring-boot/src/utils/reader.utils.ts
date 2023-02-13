import debug from 'debug'
import { DependencyInterface, HttpServiceImpl, ParamType } from '@apipack/core'
import MetaType from '../constants/MetaType.enum'
import { ReadDepServiceInterface } from '../interfaces/DepReader.interface'
import RequestMapping, {
  RequestMappingKeys
} from '../constants/RequestMapping.enum'
import { MethodType, TypeName, typeNameToString } from './parser.utils'
import Annotation from '../constants/Annotation.enum'

const name = 'reader.utils'
const logger = debug(name)

export function defaultFileFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType>
) {
  reader.filePath = dep.metadata.path as string
}

export function defaultPackageFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType>
) {
  reader.moduleName = dep.name as string
}

export function defaultImportFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType>
) {
  reader.dependencies.push(dep.name)
}

export function defaultClassFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType>
) {
  reader.className = dep.name
}

export function defaultMemberFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType>
) {
  // do nothing here...
  // console.log('Member(dep): ', dep)
}

export function defaultAnnotationFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType, string>
) {
  if (reader.currentService) {
    const method = RequestMapping[dep.metadata.name as RequestMappingKeys]

    if (method) {
      reader.currentService.method = method
      reader.currentService.url = dep.metadata.value!
    } else {
      const comment = `${convertValueToString(dep)}`

      if (comment) {
        reader.currentService.comments.push(comment)
      }
    }
  }
}

export function defaultMethodFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType>
) {
  // create a new instance of HttpServiceImpl
  reader.currentService = new HttpServiceImpl({
    name: dep.name
  })
}

export function defaultParameterFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType, MethodType[]>
) {
  if (reader.currentService) {
    const params = dep.metadata.value

    if (params?.length) {
      params.forEach(param => {
        if (param.variableModifier?.length) {
          const modifier = param.variableModifier[0]

          switch (modifier.annotationName) {
            case Annotation.RequestBody:
              reader.currentService!.data = param.unannType
              break
            case Annotation.PathVariable:
              reader.currentService!.pathParameters = {
                ...reader.currentService!.pathParameters,
                [param.variableDeclaratorId as string]: typeNameToString(
                  param.unannType
                )
              }
              break
            default:
              logger(
                `Current annotationName: '${modifier.annotationName}' without any handler function, please implements it`
              )
              break
          }
        }
      })
    }
  }
}

export function defaultReturnFn(
  reader: ReadDepServiceInterface,
  dep: DependencyInterface<MetaType, TypeName>
) {
  // clean current instance of HttpServiceImpl
  if (reader.currentService) {
    reader.currentService.return = dep.metadata.value as TypeName
    reader.services.push(reader.currentService)

    delete reader.currentService
  }
}

function convertValueToString(dep: DependencyInterface<MetaType>) {
  const value = dep.metadata.value

  if (!value) return ''

  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'object') {
    return Object.entries(value).reduce((str, [key, value]) => {
      return (str += `${value}`)
    }, '')
  }

  return value.toString()
}

const PATH_VARIABLE_REGEXP = /\{(\w*)\}/g

export function getPathParameter(path: string) {
  const regexp = PATH_VARIABLE_REGEXP
  const matched = Array.from(path.matchAll(regexp))
  let keys: Array<{ str: string; key: string; pos?: number }> = []

  matched.forEach(match => {
    const pos = match.index
    const [str, key] = match

    keys.push({
      str,
      key,
      pos
    })
  })

  return keys
}
