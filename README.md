# ast-whitelist

Check an ECMAScript AST node against a whitelist or predicate

`npm install ast-whitelist`

## check

```js
const { check } = require( 'ast-whitelist' )

// JSON node types
const whitelist = [
  'ObjectExpression', 'ArrayExpression', 'Property', 'Identifier', 'Literal'
]

// length will be zero if no bad nodes
const unexpectedNodes = check( node, whitelist )

// or stop after the first bad node - first will be undefined if no bad nodes
const [ first ] = check( node, whitelist, true )
```

Or using import syntax:
```js
import { check } from 'ast-whitelist'
```

### typing

```ts
const check = (
  node: Node,
  whitelist: string[],
  stopOnFirst?: boolean
) => Node[]
```

## test

```js
const { test } = require( 'ast-whitelist' )

// ban member expressions
const notMemberExpression = node => node.type !== 'MemberExpression'

const unexpectedNodes = test( test, notMemberExpression )

// or stop after the first bad node
const [ first ] = test( node, notMemberExpression, true )
```

The predicate you pass also recieves a parent node (`null` if the current node
is not the root node) and the root node, in case your predicate needs
some context:

```js
const predicate = ( node, parent, root ) => {
  if( parent && parent.type === 'VariableDeclarator' ) return false

  return true
}
```

### typing

```ts
const test = (
  node: Node,
  predicate: NodePredicate,
  stopOnFirst?: boolean
) => Node[]

type NodePredicate = (
  node: Node,
  parent: Node | null,
  root: Node
) => boolean
```

## testWithReason

Same as test, except instead of returning a boolean from your predicate you
return either:

```js
{ valid: true }
```

Or:
```js
{
  valid: false,
  reason: 'It was bad'
}
```

Instead of returning an array of unexpected nodes, it returns an array of:

```js
{
  node: { /*...*/ },
  reason: '...'
}
```

`reason` is a string by default but you can return anything:

```js
const { testWithReason } = require( 'ast-whitelist' )

const whitelist = [
  'ObjectExpression', 'ArrayExpression', 'Property', 'Identifier', 'Literal'
]

const predicate = node => {
  if( whitelist.includes( node.type ) ) return { valid: true }

  return {
    valid: false,
    reason: {
      errorType: 'Unexpected type',
      nodeType: node.type
    }
  }
}

const [ first ] = testWithReason( node, predicate, true )

if( first ){
  const { reason } = first
  const { errorType, nodeType } = reason

  throw Error( `${ errorType } ${ nodeType }` )
}
```

### typing

```ts
const testWithReason  = <T = string>(
  node: Node,
  predicate: NodePredicateWithReason<T>,
  stopOnFirst?: boolean
) => NodeWithReason<T>[]

interface NodeWithReason<T = string> {
  node: Node
  reason: T
}

type NodePredicateReasonResult<T = string> =
  NodePredicateReasonValid | NodePredicateReasonInvalid<T>

type NodePredicateReasonValid = {
  valid: true
}

type NodePredicateReasonInvalid<T = string> = {
  valid: false
  reason: T
}

type NodePredicateWithReason<T = string> =
  ( node: Node, parent: Node | null, root: Node ) =>
    NodePredicateReasonResult<T>
```

## license

MIT License

Copyright (c) 2019 Nik Coughlin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
