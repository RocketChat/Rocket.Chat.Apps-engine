import { acorn, acornWalk, astring } from "../../deps.ts";

const buildFunctionPredicate = (functionIdentifiers: Set<string>) => (node: any, state: Set<string>, ancestors: any[]) => {
  if (node.type !== 'CallExpression') return;

  let isValid = false;

  // This is a simple call to a function, like `fn()`
  isValid = (node.callee.type === "Identifier" && functionIdentifiers.has(node.callee.name));

  // This is a call to an object property or instance method, like `obj.fn()`, but not computed like `obj[fn]()`
  isValid ||= (node.callee.type === "MemberExpression" && !node.callee.computed && node.callee.property?.type === "Identifier" && functionIdentifiers.has(node.callee.property?.name));

  // This is a weird dereferencing technique used by bundlers, and since we'll be dealing with bundled sources we have to check for it
  if (!isValid && node.callee.type === "SequenceExpression") {
    const [,secondExpression] = node.callee.expressions;
    isValid = secondExpression?.type === "Identifier" && functionIdentifiers.has(secondExpression.name);
    isValid ||= secondExpression?.type === "MemberExpression" && !secondExpression.computed && functionIdentifiers.has(secondExpression.property.name);
  }

  if (!isValid) return;

  // Should we further narrow the member expression to determine whether it is the correct chain?

  // ancestors[ancestors.length-1] === node, so here we're checking for parent node
  if (!ancestors[ancestors.length-2] || ancestors[ancestors.length-2].type === 'AwaitExpression') return;

  wrapWithAwait(node);
  asyncifyScope(ancestors, state);
}

const getFunctionIdentifier = (ancestors, nodeIndex: number) => {
  const currentNode = ancestors[nodeIndex];
  // Function declarations or expressions can be directly named
  if (currentNode.id?.type === "Identifier") {
    return currentNode.id.name;
  }

  const parent = ancestors[nodeIndex-1];

  // If we don't have a parente node to provide an identifier
  // or that parent is either a Property or MethodDefinition which
  // identifier is dynamically assigned at run time, we cannot determine
  // the proper identification for the node
  if (!parent || parent.computed) return;

  // Several node types can have an id prop of type Identifier
  if (parent.id?.type === "Identifier") {
    return parent.id.name;
  }

  // Usually assignments to object properties (MethodDefinition, Property)
  if (parent.key?.type === "Identifier") {
    return parent.key.name;
  }

  // Variable assignments have left hand and right hand properties
  if (parent.left?.type === "Identifier") {
    return parent.left.name;
  }
}

const asyncifyScope = (ancestors: any[], state: Set<string>) => {
  const functionScopeIndex = ancestors.findLastIndex((n) => "async" in n);
  if (functionScopeIndex === -1) return;

  const functionScopeNode = ancestors[functionScopeIndex];

  if (functionScopeNode.async) {
    return;
  }

  functionScopeNode.async = true;

  // If the parent of a function node is a call expression, we're talking about an IIFE
  // Should we care about this case as well?
  // const parentNode = ancestors[functionScopeIndex-1];
  // if (parentNode?.type === 'CallExpression' && ancestors[functionScopeIndex-2] && ancestors[functionScopeIndex-2].type !== 'AwaitExpression') {
  //   pendingOperations.push(buildFunctionPredicate(getFunctionIdentifier(ancestors, functionScopeIndex-2)));
  // }

  const identifier = getFunctionIdentifier(ancestors, functionScopeIndex);

  // We can't fix calls of functions we can't name at compile time
  if (!identifier) return;

  // pendingOperations.push(buildFunctionPredicate(identifier));
  state.add(identifier);
};

const wrapWithAwait = (node) => {
  const innerNode = { ...node };

  if (!node.type.includes("Expression")) {
    throw new Error(`Can't wrap "${node.type}" with await`);
  }

  node.type = "AwaitExpression";
  node.argument = innerNode;

  Object.keys(node).forEach(
    (key) => !["type", "argument"].includes(key) && delete node[key],
  );
};

const fixLivechatIsOnlineCalls = (node, state: Set<string>, ancestors: any[]) => {
  if (node.type !== "MemberExpression") return;

  if (node.property.name !== "isOnline") return;

  if (node.object.type !== "CallExpression") return;

  if (node.object.callee.type !== "MemberExpression") return;

  if (node.object.callee.property.name !== "getLivechatReader") return;

  let parentIndex = ancestors.length - 2;
  let targetNode = ancestors[parentIndex];

  if (targetNode.type !== "CallExpression") {
    targetNode = node;
  } else {
    parentIndex--;
  }

  // If we're already wrapped with an await, nothing to do
  if (ancestors[parentIndex].type === "AwaitExpression") return;

  // console.log(
  //   "TARGET NODE =",
  //   nodeToWrap.type,
  //   "PARENT =",
  //   ancestor[parentPos].type,
  //   "PARENT =",
  //   ancestor[parentPos - 1].type,
  // );

  // If we're in the middle of a chained member access, we can't wrap with await
  if (ancestors[parentIndex].type === "MemberExpression") return;

  wrapWithAwait(targetNode);
  asyncifyScope(ancestors, state);
  // return () => {};
};

const checkReassignmentOfModifiedIdentifiers = (node, state: Set<string>, ancestors: any[]) => {
  if (node.type === "AssignmentExpression") {
    if (node.operator !== "=") return;

    let identifier;

    if (node.left.type === "Identifier") identifier = node.left.name;

    if (node.left.type === "MemberExpression" && !node.left.computed) identifier = node.left.property.name;

    if (!identifier || node.right.type !== "Identifier" || !state.has(node.right.name)) return;

    state.add(identifier);

    return;
  }

  if (node.type === "VariableDeclarator") {
    // console.log(node, state)
    if (node.id.type !== "Identifier" || state.has(node.id.name))  return;

    if (node.init?.type !== "Identifier" || !state.has(node?.init.name)) return;

    state.add(node.id.name);

    return;
  }

  if (node.type === "Property") {
    // console.log(node, state)
    if (node.key.type !== "Identifier" || state.has(node.key.name)) return;

    if (node.value?.type !== "Identifier" || !state.has(node.value?.name)) return;

    state.add(node.key.name);

    return;
  }
}

function fixAst(ast: Node): boolean {
    const pendingOperations = [fixLivechatIsOnlineCalls, checkReassignmentOfModifiedIdentifiers];

    // Have we touched the tree?
    let isModified = false;

    while (pendingOperations.length) {
        const ops = pendingOperations.splice(0);
        const functionIdentifiers = new Set<string>();

        acornWalk.fullAncestor<Set<string>>(ast, (node, state, ancestors) => {
            ops.forEach(operation => operation(node, state, ancestors));

            isModified = true;
        }, undefined, functionIdentifiers);

        if (functionIdentifiers.size) {
            pendingOperations.push(buildFunctionPredicate(functionIdentifiers), checkReassignmentOfModifiedIdentifiers);
        }
    }

    return isModified;
}

export function fixBrokenSynchronousAPICalls(appSource: string): string {
    const astRootNode = acorn.parse(appSource, {
        ecmaVersion: 2017,
        // Allow everything, we don't want to complain if code is badly written
        // Also, since the code itself has been transpiled, the chance of getting
        // shenanigans is lower
        allowReserved: true,
        allowReturnOutsideFunction: true,
        allowImportExportEverywhere: true,
        allowAwaitOutsideFunction: true,
        allowSuperOutsideMethod: true,
    });

    if (fixAst(astRootNode)) {
        return astring.generate(astRootNode);
    }

    return appSource;
}
