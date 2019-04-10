import * as assert from 'assert'
import { Node } from 'estree'
import { check, NodePredicate, test } from '..'

import * as valid from './fixtures/valid.json'
import * as invalid from './fixtures/invalid.json'

const whitelist = [
  'ObjectExpression', 'ArrayExpression', 'Property', 'Identifier', 'Literal'
]

describe( 'ast-whitelist', () => {
  describe( 'check', () => {
    it( 'valid', () => {
      const unexpected = check( <Node>valid, whitelist )

      assert.strictEqual( unexpected.length, 0 )
    } )

    it( 'invalid returns all', () => {
      const unexpected = check( <Node>invalid, whitelist )

      assert.strictEqual( unexpected.length, 2 )
    } )

    it( 'invalid stops on first', () => {
      const unexpected = check( <Node>invalid, whitelist, true )

      assert.strictEqual( unexpected.length, 1 )
    } )
  } )

  describe( 'test', () => {
    const predicate: NodePredicate = ( node, parent, root ) => {
      if ( parent && node === root ) throw Error()

      return whitelist.includes( node.type )
    }

    const validPredicate: NodePredicate = ( node, parent, root ) => {
      if ( root !== <Node>valid ) throw Error()

      return predicate( node, parent, root )
    }

    const invalidPredicate: NodePredicate = ( node, parent, root ) => {
      if ( root !== <Node>invalid ) throw Error()

      return predicate( node, parent, root )
    }

    it( 'valid', () => {
      const unexpected = test( <Node>valid, validPredicate )

      assert.strictEqual( unexpected.length, 0 )
    } )

    it( 'invalid returns all', () => {
      const unexpected = test( <Node>invalid, invalidPredicate )

      assert.strictEqual( unexpected.length, 2 )
    } )

    it( 'invalid stops on first', () => {
      const unexpected = test( <Node>invalid, invalidPredicate, true )

      assert.strictEqual( unexpected.length, 1 )
    } )
  } )
} )
