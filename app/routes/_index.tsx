import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { interpret } from "~/utils/interpreter";
import styles from "./index.css?url";
import Button, { links as buttonLinks } from "~/components/Button";
import Test1, { links as test1Links } from "~/components/Test1";
import Test2, { links as test2Links } from "~/components/Test2";

// prettier-ignore
export const meta: MetaFunction = () => {
    return [
        { title: "BuriStack" },
        { name: "description", content: "Assembly言語におけるスタックの挙動を可視化します。自分用。" },
    ];
};

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    ...buttonLinks(),
    ...test1Links(),
    ...test2Links(),
];

export default function Index() {
    const asm = `
  .intel_syntax noprefix
  .globl main
  main:
    push rbp
    mov rbp, rsp
    sub rsp, 16
    mov rax, rbp
    sub rax, 8
    push rax
    push 1
    pop rdi
    pop rax
    mov [rax], rdi
    push rdi
    pop rax
  `;
    const tree_jsons = interpret(asm);

    return (
        <div>
            <Button>永いエラーと奮闘と奮闘の末</Button>
            <Test1 />
            <Test2 />
            <div style={{ whiteSpace: "nowrap" }}>
                {tree_jsons.map((line, index) => (
                    <div key={index}>
                        <div className="hoge">{line}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
