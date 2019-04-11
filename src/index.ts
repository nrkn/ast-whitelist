import { Node } from 'estree'
import { traverse, VisitorOption } from 'estraverse'

export const check =
  ( node: Node, whitelist: string[], stopOnFirst = false ) =>
    test( node, node => whitelist.includes( node.type ), stopOnFirst )

export const test =
  ( node: Node, predicate: NodePredicate, stopOnFirst = false ) => {
    const unexpected: Node[] = []

    traverse( node, {
      enter: ( current, parent ) => {
        if ( !predicate( current, parent, node ) ) {
          unexpected.push( current )

          if ( stopOnFirst ) return VisitorOption.Break
        }
      }
    } )

    return unexpected
  }

export const testWithReason =
  <T = any>(
    node: Node, predicate: NodePredicateWithReason<T>, stopOnFirst = false
  ) => {
    const unexpected: NodeWithReason<T>[] = []

    traverse( node, {
      enter: ( current, parent ) => {
        const result = predicate( current, parent, node )

        if ( !result.valid ) {
          unexpected.push( {
            node: current,
            reason: result.reason
          } )

          if ( stopOnFirst ) return VisitorOption.Break
        }
      }
    } )

    return unexpected
  }

export interface NodeWithReason<T = string> {
  node: Node
  reason: T
}

export type NodePredicate =
  ( node: Node, parent: Node | null, root: Node ) => boolean

export type NodePredicateReasonResult<T = string> =
  NodePredicateReasonValid | NodePredicateReasonInvalid<T>

export type NodePredicateReasonValid = {
  valid: true
}

export type NodePredicateReasonInvalid<T = string> = {
  valid: false
  reason: T
}

export type NodePredicateWithReason<T = string> =
  ( node: Node, parent: Node | null, root: Node ) =>
    NodePredicateReasonResult<T>
