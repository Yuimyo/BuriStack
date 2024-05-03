import { Token, TokenKind } from "./tokenizer";

const regList: string[] = ["rax", "rsp", "rbp", "rdi"];

export enum TreeNodeKind {
    Empty, /////// TreeNodeインスタンス化時の初期値
    Directive, /// .intel_syntax, .globl, etc...
    LabelTo, ///// main:, etc...
    LabelFrom, ///
    Regist, ////// rax, rbp, etc...
    RegistRef, /// [rax], [rbp], etc...
    Num, ///////// 0, 23, etc...
    Mov, ///////// mov
    Ret, ///////// ret
    Push, //////// push
    Pop, ///////// pop
    Cmp, ///////// cmp
    Je, ////////// je
    Jmp, ///////// jmp
    Add, ///////// add
    Sub, ///////// sub
}

export class TreeNode {
    kind: TreeNodeKind;
    next: TreeNode | null;
    lhs: TreeNode | null;
    rhs: TreeNode | null;
    val: number; ///// this.kind == TreeNodeKind.Num のときのみ使用
    name: string; //// this.kind == TreeNodeKind.Label, TreeNodeKind.Directive のときのみ使用
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
        if (
            this.token == null ||
            this.token?.kind != TokenKind.Reserved ||
            this.token?.str != op
        ) {
            return false;
        }
        this.roll();
        return true;
    }

    consumeText(str: string): boolean {
        if (
            this.token == null ||
            this.token?.kind != TokenKind.Text ||
            this.token?.str != str
        ) {
            return false;
        }
        this.roll();
        return true;
    }

    expectReserved(op: string): void {
        if (
            this.token == null ||
            this.token?.kind != TokenKind.Reserved ||
            this.token?.str != op
        ) {
            throw new NotExpectedTokenReceivedError(`${op}ではありません`);
        }
        this.roll();
    }

    expectText(): Token {
        if (this.token == null || this.token?.kind != TokenKind.Text) {
            throw new NotExpectedTokenReceivedError(`$Textではありません`);
        }
        const crnt = this.token;
        this.roll();
        return crnt;
    }

    atEof(): boolean {
        if (this.token == null || this.token?.kind != TokenKind.Eof) {
            return false;
        }
        return true;
    }

    public build_tree(): TreeNode | null {
        const head = new TreeNode();
        head.next = null;
        let cur: TreeNode | null = head;
        while (!this.atEof()) {
            if (cur == null)
                throw new NotExpectedTokenReceivedError("Invalid node.");
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
            const node = new TreeNode();
            node.kind = TreeNodeKind.Directive;
            node.name = this.token?.str;
            this.roll();
            const optionToken = this.expectText();
            node.option = optionToken.str;
            return node;
        }

        return this.lorder();
    }

    lorder(): TreeNode | null {
        if (this.token != null && this.token?.kind == TokenKind.Label) {
            const label = this.token?.str;
            const node = new TreeNode();
            node.kind = TreeNodeKind.LabelTo;
            node.name = label;
            this.roll();
            node.lhs = this.order();
            return node;
        }
        return this.order();
    }

    order(): TreeNode | null {
        const node = new TreeNode();
        if (this.consumeText("mov")) {
            node.kind = TreeNodeKind.Mov;
            node.lhs = this.value();
            this.expectReserved(",");
            node.rhs = this.value();
        } else if (this.consumeText("ret")) {
            node.kind = TreeNodeKind.Ret;
        } else if (this.consumeText("push")) {
            node.kind = TreeNodeKind.Push;
            node.lhs = this.value();
        } else if (this.consumeText("pop")) {
            node.kind = TreeNodeKind.Pop;
            node.lhs = this.value(); // TODO: numは多分禁止されてる
        } else if (this.consumeText("cmp")) {
            node.kind = TreeNodeKind.Cmp;
            node.lhs = this.value();
            this.expectReserved(",");
            node.rhs = this.value();
        } else if (this.consumeText("je")) {
            node.kind = TreeNodeKind.Je;
            const assumeLabelToken = this.expectText();
            const assumeLabel = new TreeNode();
            assumeLabel.kind = TreeNodeKind.LabelFrom;
            assumeLabel.name = assumeLabelToken.str;
            node.lhs = assumeLabel;
        } else if (this.consumeText("jmp")) {
            node.kind = TreeNodeKind.Jmp;
            const assumeLabelToken = this.expectText();
            const assumeLabel = new TreeNode();
            assumeLabel.kind = TreeNodeKind.LabelFrom;
            assumeLabel.name = assumeLabelToken.str;
            node.lhs = assumeLabel;
        } else if (this.consumeText("add")) {
            node.kind = TreeNodeKind.Add;
            node.lhs = this.value();
            this.expectReserved(",");
            node.rhs = this.value();
        } else if (this.consumeText("sub")) {
            node.kind = TreeNodeKind.Sub;
            node.lhs = this.value();
            this.expectReserved(",");
            node.rhs = this.value();
        } else {
            throw new NotImplementedError("Not implemented.");
        }
        return node;
    }

    value(): TreeNode | null {
        if (this.token != null && this.token?.kind == TokenKind.Num) {
            const node = new TreeNode();
            node.kind = TreeNodeKind.Num;
            node.val = this.token?.val ?? -1;
            this.roll();
            return node;
        } else if (this.consumeReserved("[")) {
            const node = new TreeNode();
            node.kind = TreeNodeKind.RegistRef;
            node.lhs = this.reg();
            this.expectReserved("]");
            return node;
        } else {
            return this.reg();
        }
    }

    reg(): TreeNode | null {
        const node = new TreeNode();
        node.kind = TreeNodeKind.Regist;

        for (let i = 0; i < regList.length; i++) {
            const reg = regList[i];
            if (this.token?.str == reg) {
                node.name = reg;
                this.roll();
                return node;
            }
        }

        throw new NotExpectedTokenReceivedError("Invalid regist.");
    }
}

class NotExpectedTokenReceivedError extends Error {}
class NotImplementedError extends Error {}
