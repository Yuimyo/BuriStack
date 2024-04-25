import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { interpret } from "~/utils/interpreter";

export const meta: MetaFunction = () => {
  return [
    { title: "BuriStack" },
    { name: "description", content: "Assembly言語におけるスタックの挙動を可視化します。自分用。" },
  ];
};

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
    <div style={{ whiteSpace: "nowrap" }}>
      {tree_jsons.map((line, index) => (
        <div key={index}>
          <div>{line}</div>
        </div>
      ))}
    </div>
  );
}
