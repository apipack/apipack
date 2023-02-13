/**
 * It was a little like Java annotation `public enum ElementType`
 */
enum MetaType {
  File = 'File',
  Package = 'Package',
  Import = 'Import',
  Class = 'Class',
  Member = 'Member',
  Method = 'Method',
  Annotation = 'Annotation',
  Parameter = 'Parameter',
  Return = 'Return'
}

export default MetaType