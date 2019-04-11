import * as assert from 'assert'
import { Node } from 'estree'
import { check, NodePredicate, test, NodePredicateWithReason, testWithReason } from '..'

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

  describe( 'testWithReason', () => {
    const predicate: NodePredicateWithReason = ( node, parent, root ) => {
      if ( parent && node === root ) throw Error()

      if( whitelist.includes( node.type ) ) return { valid: true }

      return {
        valid: false,
        reason: `Unexpected type ${ node.type }`
      }
    }

    const validPredicate: NodePredicateWithReason = ( node, parent, root ) => {
      if ( root !== <Node>valid ) throw Error()

      return predicate( node, parent, root )
    }

    const invalidPredicate: NodePredicateWithReason = ( node, parent, root ) => {
      if ( root !== <Node>invalid ) throw Error()

      return predicate( node, parent, root )
    }

    it( 'valid', () => {
      const unexpected = testWithReason( <Node>valid, validPredicate )

      assert.strictEqual( unexpected.length, 0 )
    } )

    it( 'invalid returns all', () => {
      const unexpected = testWithReason( <Node>invalid, invalidPredicate )

      assert.strictEqual( unexpected.length, 2 )

      const [ first, second ] = unexpected

      assert.strictEqual( first.reason, 'Unexpected type VariableDeclaration' )
      assert.strictEqual( second.reason, 'Unexpected type VariableDeclarator' )
    } )

    it( 'invalid stops on first', () => {
      const unexpected = testWithReason( <Node>invalid, invalidPredicate, true )

      assert.strictEqual( unexpected.length, 1 )
    } )

    it( 'arbitary reason', () => {
      interface Result {
        errorType: 'Unexpected type'
        nodeType: string
      }

      const predicate: NodePredicateWithReason<Result> = node => {
        if( whitelist.includes( node.type ) ) return { valid: true }

        return {
          valid: false,
          reason: {
            errorType: 'Unexpected type',
            nodeType: node.type
          }
        }
      }

      const unexpected = testWithReason( <Node>invalid, predicate, true )

      assert.strictEqual( unexpected.length, 1 )

      const [ first ] = unexpected

      const { reason } = first

      assert.deepEqual( reason, {
        errorType: 'Unexpected type',
        nodeType: 'VariableDeclaration'
      })
    })
  })
} )
