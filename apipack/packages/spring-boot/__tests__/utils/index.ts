import { DependencyInterface } from '@apipack/core'
import debug from 'debug'
import MetaType from '../../src/constants/MetaType.enum'
import { readFileSync } from 'fs'

const logger = debug(`DependencyInterfaceLogger`)

export function log(dep: DependencyInterface<MetaType>) {
  dep.dependencies.forEach(dependency => {
    logger(`----------------------------------`)
    logger(JSON.stringify(dependency.metadata))
    logger(``)

    if (dependency.dependencies.size) {
      dependency.dependencies.forEach(logger)
    }

    logger(``)
    logger(`----------------------------------`)
    logger(dependency)
  })
}

export function readFileContent(path: string) {
  return readFileSync(path)
}

export function blobToString(blob: Buffer) {
  return blob.toString()
}
