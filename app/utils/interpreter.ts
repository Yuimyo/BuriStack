import { TreeBuilder, TreeNode } from './parser';
import { Token } from './tokenizer';

export function interpret(assemblyText: string): string[] {
    let tok = Token.tokenize(assemblyText);
    if (tok == null) throw new Error("Head token is null.");

    let jsons: string[] = [];

    let builder = new TreeBuilder(tok);
    let node: TreeNode | null = builder.build_tree();
    for (; node != null; node = node.next) {
        let nextNode: TreeNode | null = node.next;
        node.next = null;

        const json = JSON.stringify(node);
        jsons.push(json);
        node.next = nextNode;
    }

    return jsons;
}