import { Token, TokenKind } from "./tokenizer";

const regList: string[] = ["rax", "rsp", "rbp", "rdi"];

export enum TreeNodeKind {
    Empty,     // TreeNodeインスタンス化時の初期値
    Directive, // .intel_syntax, .globl, etc...
    LabelTo,   // main:, etc...
    LabelFrom, // 
    Regist,    // rax, rbp, etc...
    RegistRef, // [rax], [rbp], etc...
    Num,       // 0, 23, etc...
    Mov,       // mov
    Ret,       // ret
    Push,      // push
    Pop,       // pop
    Cmp,       // cmp
    Je,        // je
    Jmp,       // jmp
    Add,       // add
    Sub,       // sub
}

export class TreeNode {
    kind: TreeNodeKind;
    next: TreeNode | null;
    lhs: TreeNode | null;
    rhs: TreeNode | null;
    val: number; // this.kind == TreeNodeKind.Num のときのみ使用
    name: string; // this.kind == TreeNodeKind.Label, TreeNodeKind.Directive のときのみ使用
    option: string; // this.kind == TreeNodeKind.Directive のときのみ使用

    constructor() {
        this.kind = TreeNodeKind.Empty;
        this.next = null;
        this.lhs = null;
        this.rhs = null;
        this.val = 0;
        this.name = "";
        this.option = "";
    }
}

export class TreeBuilder {
    token: Token | null;

    constructor(head: Token) {
        this.token = head;

    }

    roll(): void {
        if (this.token == null) {
            return;
        }
        this.token = this.token.next;
    }

    consumeReserved(op: string): boolean {
        if (this.token == null ||
            this.token?.kind != TokenKind.Reserved ||
            this.token?.str != op) {
            return false;
        }
        this.roll();
        return true;
    }

    consumeText(str: string): boolean {
        if (this.token == null ||
            this.token?.kind != TokenKind.Text ||
            this.token?.str != str) {
            return false;
        }
        this.roll();
        return true;
    }

    expectReserved(op: string): void {
        if (this.token == null ||
            this.token?.kind != TokenKind.Reserved ||
            this.token?.str != op) {
            throw new Error(`${op}ではありません`);
        }
        this.roll();
    }

    expectText(): Token {
        if (this.token == null ||
            this.token?.kind != TokenKind.Text) {
            throw new Error(`$Textではありません`);
        }
        let crnt = this.token;
        this.roll();
        return crnt;
    }

    atEof(): boolean {
        if (this.token == null ||
            this.token?.kind != TokenKind.Eof) {
            return false;
        }
        return true;
    }

    public build_tree(): TreeNode | null {

        let head = new TreeNode();
        head.next = null;
        let cur: TreeNode | null = head;
        while (!this.atEof()) {
            if (cur == null) throw new Error("Invalid node.");
            cur.next = this.stmt();
            cur = cur.next;
        }

        return head.next;
    }

    // stmt   := dirc | lorder
    // dirc   := Directive text
    // lorder := label? order
    // label  := Label
    // order  := "mov"  value "," value |
    //           "ret" |
    //           ...
    // value  := num | reg | "[" reg "]"
    // reg    := "rax" | "rsp" | "rbp" | ...
    stmt(): TreeNode | null {
        if (this.token != null && this.token?.kind == TokenKind.Directive) {
            let node = new TreeNode();
            node.kind = TreeNodeKind.Directive;
            node.name = this.token?.str;
            this.roll();
            let optionToken = this.expectText();
            node.option = optionToken.str;
            return node;
        }

        return this.lorder();
    }

    lorder(): TreeNode | null {
        if (this.token != null && this.token?.kind == TokenKind.Label) {
            let label = this.token?.str;
            let node = new TreeNode();
            node.kind = TreeNodeKind.LabelTo;
            node.name = label;
            this.roll();
            node.lhs = this.order();
            return node;
        }
        return this.order();
    }

    order(): TreeNode | null {
        let node = new TreeNode();
        if (this.consumeText("mov")) {
            node.kind = TreeNodeKind.Mov;
            node.lhs = this.value();
            this.expectReserved(',');
            node.rhs = this.value();
        }
        else if (this.consumeText("ret")) {
            node.kind = TreeNodeKind.Ret;
        }
        else if (this.consumeText("push")) {
            node.kind = TreeNodeKind.Push;
            node.lhs = this.value();
        }
        else if (this.consumeText("pop")) {
            node.kind = TreeNodeKind.Pop;
            node.lhs = this.value(); // TODO: numは多分禁止されてる
        }
        else if (this.consumeText("cmp")) {
            node.kind = TreeNodeKind.Cmp;
            node.lhs = this.value();
            this.expectReserved(',');
            node.rhs = this.value();
        }
        else if (this.consumeText("je")) {
            node.kind = TreeNodeKind.Je;
            let assumeLabelToken = this.expectText();
            let assumeLabel = new TreeNode();
            assumeLabel.kind = TreeNodeKind.LabelFrom;
            assumeLabel.name = assumeLabelToken.str;
            node.lhs = assumeLabel;
        }
        else if (this.consumeText("jmp")) {
            node.kind = TreeNodeKind.Jmp;
            let assumeLabelToken = this.expectText();
            let assumeLabel = new TreeNode();
            assumeLabel.kind = TreeNodeKind.LabelFrom;
            assumeLabel.name = assumeLabelToken.str;
            node.lhs = assumeLabel;
        }
        else if (this.consumeText("add")) {
            node.kind = TreeNodeKind.Add;
            node.lhs = this.value();
            this.expectReserved(',');
            node.rhs = this.value();
        }
        else if (this.consumeText("sub")) {
            node.kind = TreeNodeKind.Sub;
            node.lhs = this.value();
            this.expectReserved(',');
            node.rhs = this.value();
        }
        else {
            throw new Error("Not implemented.");
        }
        return node;
    }

    value(): TreeNode | null {
        if (this.token != null && this.token?.kind == TokenKind.Num) {
            let node = new TreeNode();
            node.kind = TreeNodeKind.Num;
            node.val = this.token?.val ?? -1;
            return node;
        }
        else if (this.consumeReserved('[')) {
            let node = new TreeNode();
            node.kind = TreeNodeKind.RegistRef;
            node.lhs = this.reg();
            this.expectReserved(']');
            return node;
        }
        else {
            return this.reg();
        }
    }

    reg(): TreeNode | null {
        let node = new TreeNode();
        node.kind = TreeNodeKind.Regist;

        for (let i = 0; i < regList.length; i++) {
            const reg = regList[i];
            if (this.token?.str == reg
            ) {
                node.name = reg;
                this.roll();
                return node;
            }
        };

        throw new Error("Invalid regist.");
    }
}