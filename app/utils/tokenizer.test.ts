import { expect, test } from 'vitest'
import { Token, TokenKind } from "./tokenizer";

function isAlmostSameToken(actual: Token | null, expectWithoutNext: Token | null): Token | null {
    if (expectWithoutNext == null) {
        expect(actual).toBeNull();
        return null;
    }
    else {
        expect(actual).toBeDefined();
        expect(actual).not.toBeNull();
        expect(actual?.kind).toBe(expectWithoutNext?.kind);
        expect(actual?.str).toBe(expectWithoutNext?.str);
        expect(actual?.val).toBe(expectWithoutNext?.val);

        if (actual == undefined) return null;
        return actual?.next;
    }
}

test('tokenize1', () => {
    let tok = Token.tokenize(`mov 0, rsp`);
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "mov"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Num, "0"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Reserved, ","));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "rsp"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Eof, ""));
    expect(tok).toBeNull();
});

test('tokenize no comment', () => {
    let tok = Token.tokenize(`  
    ; なるほどね
    mov rsp, rbp ;hmm..  mov rsp, rbp
    `);
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "mov"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "rsp"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Reserved, ","));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "rbp"));

    tok = isAlmostSameToken(tok, Token.create(TokenKind.Eof, ""));
    expect(tok).toBeNull();
});

test('tokenize directive', () => {
    let tok = Token.tokenize(`  
    .intel_syntax noprefix
    .globl main
    main:
      push rbp
    `);
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Directive, ".intel_syntax"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "noprefix"));

    tok = isAlmostSameToken(tok, Token.create(TokenKind.Directive, ".globl"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "main"));

    tok = isAlmostSameToken(tok, Token.create(TokenKind.Label, "main:"));

    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "push"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "rbp"));

    tok = isAlmostSameToken(tok, Token.create(TokenKind.Eof, ""));
    expect(tok).toBeNull();
});

test('tokenize bracket', () => {
    let tok = Token.tokenize(`  
      mov [rax], rbp
    `);

    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "mov"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Reserved, "["));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "rax"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Reserved, "]"));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Reserved, ","));
    tok = isAlmostSameToken(tok, Token.create(TokenKind.Text, "rbp"));

    tok = isAlmostSameToken(tok, Token.create(TokenKind.Eof, ""));
    expect(tok).toBeNull();
});