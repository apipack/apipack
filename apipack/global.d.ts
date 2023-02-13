/// <reference path="node_modules/java-parser/api.d.ts" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'

interface CancellablePromise<T = any> extends Promise<T> {
  cancel: () => void
}

type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

type DeepReadonly<T> = T extends Date | NestedValue
  ? T
  : {
      readonly [K in keyof T]: DeepReadonly<T[K]>
    }

type ValueOf<T extends { [key: string | number]: any }> = T[keyof T]
