import path from 'path'
import { parse } from 'java-parser'
import { SpringBootCstVisitor } from '../src/index'
import { DependencyImpl, DependencyMetaData } from '@apipack/core'
import MetaType from '../src/constants/MetaType.enum'
import ReadCstServiceImpl from '../src/services/CstReader.service'
import { blobToString, readFileContent, log } from './utils/index'

const javaPath = path.resolve(__dirname, './BasicConfigController.java')
const fileText = blobToString(readFileContent(javaPath))

const CST = parse(fileText)

const controllerMetaData: DependencyMetaData<MetaType> = {
  name: 'BasicConfigController.java',
  path: javaPath,
  type: MetaType.File,
  desc: 'A test demo for SpringBootCstVisitor',
  value: fileText
}

const visitor = new SpringBootCstVisitor({
  metadata: controllerMetaData,
  DependencyImpl,
  ReadCstServiceImpl
})

visitor.visit(CST)

// const rootDep = visitor.dependency
