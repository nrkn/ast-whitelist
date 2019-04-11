"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const __1 = require("..");
const valid = require("./fixtures/valid.json");
const invalid = require("./fixtures/invalid.json");
const whitelist = [
    'ObjectExpression', 'ArrayExpression', 'Property', 'Identifier', 'Literal'
];
describe('ast-whitelist', () => {
    describe('check', () => {
        it('valid', () => {
            const unexpected = __1.check(valid, whitelist);
            assert.strictEqual(unexpected.length, 0);
        });
        it('invalid returns all', () => {
            const unexpected = __1.check(invalid, whitelist);
            assert.strictEqual(unexpected.length, 2);
        });
        it('invalid stops on first', () => {
            const unexpected = __1.check(invalid, whitelist, true);
            assert.strictEqual(unexpected.length, 1);
        });
    });
    describe('test', () => {
        const predicate = (node, parent, root) => {
            if (parent && node === root)
                throw Error();
            return whitelist.includes(node.type);
        };
        const validPredicate = (node, parent, root) => {
            if (root !== valid)
                throw Error();
            return predicate(node, parent, root);
        };
        const invalidPredicate = (node, parent, root) => {
            if (root !== invalid)
                throw Error();
            return predicate(node, parent, root);
        };
        it('valid', () => {
            const unexpected = __1.test(valid, validPredicate);
            assert.strictEqual(unexpected.length, 0);
        });
        it('invalid returns all', () => {
            const unexpected = __1.test(invalid, invalidPredicate);
            assert.strictEqual(unexpected.length, 2);
        });
        it('invalid stops on first', () => {
            const unexpected = __1.test(invalid, invalidPredicate, true);
            assert.strictEqual(unexpected.length, 1);
        });
    });
    describe('testWithReason', () => {
        const predicate = (node, parent, root) => {
            if (parent && node === root)
                throw Error();
            if (whitelist.includes(node.type))
                return { valid: true };
            return {
                valid: false,
                reason: `Unexpected type ${node.type}`
            };
        };
        const validPredicate = (node, parent, root) => {
            if (root !== valid)
                throw Error();
            return predicate(node, parent, root);
        };
        const invalidPredicate = (node, parent, root) => {
            if (root !== invalid)
                throw Error();
            return predicate(node, parent, root);
        };
        it('valid', () => {
            const unexpected = __1.testWithReason(valid, validPredicate);
            assert.strictEqual(unexpected.length, 0);
        });
        it('invalid returns all', () => {
            const unexpected = __1.testWithReason(invalid, invalidPredicate);
            assert.strictEqual(unexpected.length, 2);
            const [first, second] = unexpected;
            assert.strictEqual(first.reason, 'Unexpected type VariableDeclaration');
            assert.strictEqual(second.reason, 'Unexpected type VariableDeclarator');
        });
        it('invalid stops on first', () => {
            const unexpected = __1.testWithReason(invalid, invalidPredicate, true);
            assert.strictEqual(unexpected.length, 1);
        });
        it('arbitary reason', () => {
            const predicate = node => {
                if (whitelist.includes(node.type))
                    return { valid: true };
                return {
                    valid: false,
                    reason: {
                        errorType: 'Unexpected type',
                        nodeType: node.type
                    }
                };
            };
            const unexpected = __1.testWithReason(invalid, predicate, true);
            assert.strictEqual(unexpected.length, 1);
            const [first] = unexpected;
            const { reason } = first;
            assert.deepEqual(reason, {
                errorType: 'Unexpected type',
                nodeType: 'VariableDeclaration'
            });
        });
    });
});
//# sourceMappingURL=index.js.map