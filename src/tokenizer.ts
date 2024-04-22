export enum TokenKind {
    Empty,
    Reserved,
    Num,
    Text,
    Directive,
    Label,
    Eof,
}

const directiveList: string[] = [".intel_syntax", ".globl"];

function isDirective(str: string): boolean {
    for (let i = 0; i < directiveList.length; i++) {
        const directive = directiveList[i];
        if (str == directive) {
            return true;
        }
    }
    return false;
}

function isSpace(c: string): boolean {
    return /\s/.test(c);
}

function startsWith(line: string, offset: number, str: string): boolean {
    return line.substring(offset, offset + str.length) == str;
}

function isIdent1(c: string): boolean {
    if (c == undefined || c.length != 1) return false;
    return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || c == '_';
}

function isIdent2(c: string): boolean {
    if (c == undefined || c.length != 1) return false;
    return isIdent1(c) || ('0' <= c && c <= '9');
}

/**
 * TODO: alだけになってる...
 */
function isAlNum(c: string): boolean {
    if (c == undefined || c.length != 1) return false;
    return ('a' <= c && c <= 'z') || ('A' <= c && c <= 'Z') || c == '_';
}

function isNum(c: string): boolean {
    if (c == undefined || c.length != 1) return false;
    return ('0' <= c && c <= '9');
}

/**
 * @returns {number} 0 → false, 1以上 → 長さ(true)
 */
function isRegister(line: string, i: number): number {
    if (
        (startsWith(line, i, "rbp") && !isAlNum(line[i + 3])) ||
        (startsWith(line, i, "rsp") && !isAlNum(line[i + 3])) ||
        (startsWith(line, i, "rax") && !isAlNum(line[i + 3]))
    ) {
        return 3;
    }
    return 0;
}

function joinNewToken(kind: TokenKind, crnt: Token, str: string): Token {
    let tok = Token.create(kind, str);
    crnt.next = tok;

    return tok;
}

export class Token {
    kind: TokenKind;
    next: Token | null;
    val: number | null; // this.kind == TokenKind.Num のときのみ使用
    str: string;

    constructor() {
        this.kind = TokenKind.Empty;
        this.next = null;
        this.val = null;
        this.str = "";
    }

    static create(kind: TokenKind, str: string): Token {
        let token = new Token();
        token.kind = kind;
        token.str = str;
        if (kind == TokenKind.Num) {
            token.val = parseInt(str);
        }
        return token;
    }

    static tokenize(data: string): Token | null {
        let head: Token = new Token();
        let cur: Token = head;

        const lines: string[] = data.split('\n');
        lines.forEach((line, line_index) => {
            //console.log(`Line ${line_index + 1}: ${line}`);
            for (let i = 0; i < line.length;) {
                let c = line[i];

                if (isSpace(c)) {
                    i++;
                    continue;
                }

                if (c == ';') {
                    break;
                }

                if (c == ',' ||
                    c == '[' ||
                    c == ']'
                ) {
                    cur = joinNewToken(TokenKind.Reserved, cur, line.substring(i, i + 1));
                    i++;
                    continue;
                }

                if (isNum(c)) {
                    let j = i;
                    let crntc = line[i];
                    do {
                        j++;
                        crntc = line[j];
                    }
                    while (isNum(crntc));

                    const len = j - i;
                    const str = line.substring(i, i + len);
                    cur = joinNewToken(TokenKind.Num, cur, str);
                    cur.val = parseInt(str);
                    i += len;
                    continue;
                }

                if (isIdent1(c) || c == '.') {
                    let j = i;
                    let crntc = line[i];
                    let isCoron = false;
                    do {
                        j++;
                        crntc = line[j];

                        if (isCoron) break;
                    }
                    while (isIdent2(crntc) || (isCoron = crntc == ':'));
                    const len = j - i;
                    const str = line.substring(i, i + len);
                    let kind = TokenKind.Text;
                    if (isDirective(str)) {
                        if (isCoron) throw new Error("Is directive and label...?");
                        kind = TokenKind.Directive;
                    }
                    if (isCoron) kind = TokenKind.Label;

                    cur = joinNewToken(kind, cur, str);
                    i += len;
                    continue;
                }

                //console.log(`     ${c}`);
                i++;
            }
        });

        joinNewToken(TokenKind.Eof, cur, "");
        return head.next;
    }
}