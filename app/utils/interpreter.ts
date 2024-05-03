import { TreeBuilder, TreeNode } from "./parser";
import { Token } from "./tokenizer";

export function interpret(assemblyText: string): string[] {
    const tok = Token.tokenize(assemblyText);
    if (tok == null) throw new FailedToTokenizeError("Head token is null.");

    const jsons: string[] = [];

    const builder = new TreeBuilder(tok);
    let node: TreeNode | null = builder.build_tree();
    for (; node != null; node = node.next) {
        const nextNode: TreeNode | null = node.next;
        node.next = null;

        const json = JSON.stringify(node);
        jsons.push(json);
        node.next = nextNode;
    }

    return jsons;
}

class FailedToTokenizeError extends Error {}
