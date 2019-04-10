# ast-whitelist

Check an ECMAScript AST node against a whitelist or predicate

`npm install ast-whitelist`

## check

```js
const { check } = require( 'ast-whitelist' )

const unexpectedNodes = check( node, whitelist )

// or stop after the first bad node
const [ first ] = check( node, whitelist, true )
```

```js
import { check } from 'ast-whitelist'

const unexpectedNodes = check( node, whitelist )

// or stop after the first bad node
const [ first ] = check( node, whitelist, true )
```

```ts
( node: Node, whitelist: string[], stopOnFirst?: boolean ) => Node[]
```

## test

```js
const { test } = require( 'ast-whitelist' )

const unexpectedNodes = test( test, predicate )

// or stop after the first bad node
const [ first ] = test( node, predicate, true )
```

```js
import { test } from 'ast-whitelist'

const unexpectedNodes = test( node, predicate )

// or stop after the first bad node
const [ first ] = test( node, predicate, true )
```

```ts
( node: Node, predicate: NodePredicate, stopOnFirst?: boolean ) => Node[]
```

```ts
type NodePredicate = ( node: Node, parent: Node | null, root: Node ) => boolean
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
