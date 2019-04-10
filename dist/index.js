"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const estraverse_1 = require("estraverse");
exports.check = (node, whitelist, stopOnFirst = false) => exports.test(node, node => whitelist.includes(node.type), stopOnFirst);
exports.test = (node, predicate, stopOnFirst = false) => {
    const unexpected = [];
    estraverse_1.traverse(node, {
        enter: (current, parent) => {
            if (!predicate(current, parent, node)) {
                unexpected.push(current);
                if (stopOnFirst)
                    return estraverse_1.VisitorOption.Break;
            }
        }
    });
    return unexpected;
};
//# sourceMappingURL=index.js.map