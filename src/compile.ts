import { functions } from './functions'
import { isArray } from './is'
import type {
  Fun,
  FunctionBuildersMap,
  JSONQuery,
  JSONQueryCompileOptions,
  JSONQueryFunction
} from './types'

const functionsStack: FunctionBuildersMap[] = []

export function compile(query: JSONQuery, options?: JSONQueryCompileOptions): Fun {
  functionsStack.unshift({ ...functions, ...functionsStack[0], ...options?.functions })

  try {
    const exec = isArray(query)
      ? compileFunction(query as JSONQueryFunction, functionsStack[0]) // function
      : () => query // primitive value (string, number, boolean, null)

    // create a wrapper function which can attach a stack to the error
    return (data) => {
      try {
        return exec(data)
      } catch (err) {
        // attach a stack to the error
        err.jsonquery = [{ data, query }, ...(err.jsonquery ?? [])]

        throw err
      }
    }
  } finally {
    functionsStack.shift()
  }
}

function compileFunction(query: JSONQueryFunction, functions: FunctionBuildersMap) {
  const [fnName, ...args] = query

  const fnBuilder = functions[fnName]
  if (!fnBuilder) {
    throw new Error(`Unknown function '${fnName}'`)
  }

  return fnBuilder(...args)
}
