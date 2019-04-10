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

export type NodePredicate =
  ( node: Node, parent: Node | null, root: Node ) => boolean
