import * as fs from 'fs';
import { TreeBuilder, TreeNode } from './parser';
import { Token } from './tokenizer';

function interpret(assemblyText: string) {
    let tok = Token.tokenize(assemblyText);
    if (tok == null) throw new Error("Head token is null.");

    let builder = new TreeBuilder(tok);
    let node: TreeNode | null = builder.build_tree();
    const json = JSON.stringify(node);
    console.log(`${json}`);
}

fs.readFile('tmp.s', 'utf8', (err, data) => {
    if (err) {
        console.error('ファイルを読み込めませんでした:', err);
        return;
    }

    interpret(data);
});

