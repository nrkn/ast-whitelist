import { Node } from 'estree';
export declare const check: (node: Node, whitelist: string[], stopOnFirst?: boolean) => Node[];
export declare const test: (node: Node, predicate: NodePredicate, stopOnFirst?: boolean) => Node[];
export declare const testWithReason: <T = any>(node: Node, predicate: NodePredicateWithReason<T>, stopOnFirst?: boolean) => NodeWithReason<T>[];
export interface NodeWithReason<T = string> {
    node: Node;
    reason: T;
}
export declare type NodePredicate = (node: Node, parent: Node | null, root: Node) => boolean;
export declare type NodePredicateReasonResult<T = string> = NodePredicateReasonValid | NodePredicateReasonInvalid<T>;
export declare type NodePredicateReasonValid = {
    valid: true;
};
export declare type NodePredicateReasonInvalid<T = string> = {
    valid: false;
    reason: T;
};
export declare type NodePredicateWithReason<T = string> = (node: Node, parent: Node | null, root: Node) => NodePredicateReasonResult<T>;
