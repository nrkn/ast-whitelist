import { Node } from 'estree';
export declare const check: (node: Node, whitelist: string[], stopOnFirst?: boolean) => Node[];
export declare const test: (node: Node, predicate: NodePredicate, stopOnFirst?: boolean) => Node[];
export declare type NodePredicate = (node: Node, parent: Node | null, root: Node) => boolean;
