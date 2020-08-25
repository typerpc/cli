// file deepcode ignore no-unused-expression: test file
// file deepcode ignore semicolon: conflict with eslint
import {Project} from 'ts-morph'
import {sourceWithValidImportAndInterface, validInterface} from './util'
import {validateSchemas} from '../../src/schema/validator'

let project: Project

beforeEach(() => {
  project = new Project()
})

const testName = (errCount: number, contains: string): string => `validateSchemas() returns ${errCount} Error when schema contains ${contains}`

const runTest = (project: Project, source: string, errLength: number): void => {
  project.createSourceFile('test.ts', source)
  expect(validateSchemas([project.getSourceFile('test.ts')!]).length).toBe(errLength)
}

test(testName(1, 'function'), () => {
  const source = `
  function name() {
  }
  `
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'multiple functions'), () => {
  const source = `
  function name() {
  }

  function name2() {
  }
  `
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'variable declaration'), () => {
  const source = `
  var names: string = 'gary'
  `
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'class declaration'), () => {
  const source = `
  class MyClass {
  private name: string = ''
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'extra imports'), () => {
  const source = `
  import * as path from 'path'
  `
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'aliased @typerpc import'), () => {
  const source = `
  import {t as v} from '@typerpc/types'
  ${validInterface}
  `
  runTest(project, source, 1)
})

test(testName(1, 'export'), () => {
  const source = `
  export default interface {
    name() : t.str;
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'namespace'), () => {
  const source = `
  namespace Cars {
    export type Fake = string | boolean
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'for loop'), () => {
  const source = `
  for (let q of [1,2,3]) {
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'enum'), () => {
  const source = `
  enum Colors {
    Red,
    Blue,
    Green,
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'generic type alias'), () => {
  const typeName = 'GenericType<T, S, V>'
  const source = `
type ${typeName} = {
  age: t.str;
}
  `
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'type alias with object literal property'), () => {
  const source = `
  type MyType = {
  name: t.str;
  cars: {
  model: t.str;
  }
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'type alias with array property'), () => {
  const source = `
  type MyType = {
  names: t.str[];
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'type alias with invalid type property'), () => {
  const source = `
  type MyType = {
    name: Name;
  }
  `
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'interface with zero methods'), () => {
  const source = `
  interface Me {
    name: t.str;
  }`

  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'generic interface'), () => {
  const source = `
  interface Namer<T> {
    getName(): t.str;
  }
`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'interface with extends'), () => {
  const source = `
  interface Person extends Object {
    getName(): t.str;
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'method with invalid param type'), () => {
  const source = `
  interface Person {
    getName(num: number): t.str;
  }`

  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'method with invalid return type'), () => {
  const source = `
  interface Person {
    getName(): string;
    }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'method with typeless param'), () => {
  const source = `
  interface Person {
    getName(num): t.unit;
  }`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'generic method'), () => {
  const source = `
  interface PersonService {
  getPeople<T>(person: t.str): t.str;
}`
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test(testName(1, 'non Object type alias'), () => {
  const nested = 't.Dict<t.str, People>'
  const source = `
  type PeopleMap = ${nested}
  `
  runTest(project, sourceWithValidImportAndInterface(source), 1)
})

test('validateSchema should return 0 error when given a valid schema file', () => {
  const people = 't.List<source>'
  const nested = 't.Dict<t.str, People>'
  const source = `
  type Person = {
    name: t.str;
    age: t.int8;
  }

  type PersonList = {
    list: ${people}
    }

  type PeopleMap = {
    map: ${nested}
    }

  interface PersonService {
    getPersonByName(name: t.str): Person;
    getPeopleAboveAge(age: t.int8): PersonList;
    getPeopleMap(): PeopleMap;
  }
  `
  runTest(project, sourceWithValidImportAndInterface(source), 0)
})