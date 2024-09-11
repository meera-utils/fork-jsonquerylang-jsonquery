export type JSONQueryPipe = JSONQuery[]
export type JSONQueryFunction = [name: string, ...args: JSONQuery[]]
export type JSONQueryObject = { [key: string]: JSONQuery }
export type JSONQueryPrimitive = string | number | boolean | null
export type JSONQuery = JSONQueryFunction | JSONQueryPipe | JSONQueryObject | JSONQueryPrimitive

export type JSONPath = string[]
export type JSONProperty = ['get', path: JSONPath]

export interface JSONQueryOptions {
  functions?: FunctionsMap
}

export type Evaluator = (data: unknown) => unknown
export type FunctionCompiler = (...args: JSONQuery[]) => Evaluator
export type FunctionsMap = Record<string, FunctionCompiler>
export type Getter = [key: string, Evaluator]
