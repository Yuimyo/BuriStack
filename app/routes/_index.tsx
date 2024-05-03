import type { LinksFunction, MetaFunction } from "@remix-run/node";
import { to_jsons } from "~/utils/interpreter";
import styles from "./index.css?url";
import Button, { links as buttonLinks } from "~/components/Button";
import AssemblyCodeInput, {
    links as assemblyCodeInputLinks,
} from "~/components/AssemblyCodeInput";
import AssemblyCodeVisualizer, {
    links as assemblyCodeVisualizerLinks,
} from "~/components/AssemblyCodeVisualizer";
import AssemblyCodeSelector, {
    links as assemblyCodeSelectorLinks,
} from "~/components/AssemblyCodeSelector";
import BracketEnd, { links as bracketEndLinks } from "~/components/BracketEnd";
import StackItem, { links as stackItemLinks } from "~/components/StackItem";
import StackStatusViewer, {
    links as stackStatusViewerLinks,
} from "~/components/StackStatusViewer";
import Test1, { links as test1Links } from "~/components/Test1";
import Test2, { links as test2Links } from "~/components/Test2";
import logo from "~/logo.png";
import { useState } from "react";

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
    ...assemblyCodeInputLinks(),
    ...assemblyCodeVisualizerLinks(),
    ...assemblyCodeSelectorLinks(),
    ...bracketEndLinks(),
    ...stackItemLinks(),
    ...stackStatusViewerLinks(),
    ...test1Links(),
    ...test2Links(),
];

export default function Index() {
    const asm_tmp = `
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

    const [asm, setAsm] = useState("");
    const [asmLine, setAsmLine] = useState<string[]>([]);
    const [asmParsedLine, setAsmParsedLine] = useState<string[]>([]);

    const handleTextInput = (text: string) => {
        setAsm(text);
        const lines: string[] = [];
        text.split(/\n/).forEach((line, index) => {
            if (line.trim() != "") lines.push(line);
        });
        setAsmLine(lines);
    };

    const handleExecute = () => {
        const tree_jsons = to_jsons(asm_tmp);
        const lines: string[] = [];
        asm.split(/\n/).forEach((line, index) => {
            if (line.trim() != "") lines.push(line);
        });
        setAsmParsedLine(lines);
    };

    return (
        <div className="route-index">
            <div className="header">
                <div className="logo-container">
                    <img
                        className="logo-data"
                        src={logo}
                        alt="ここにはロゴが表示される筈...!"
                    />
                </div>
                <Button onClick={() => handleExecute()}>実行</Button>
            </div>
            <div className="midder">
                <div className="main-content">
                    <div className="code-input">
                        <AssemblyCodeInput
                            onChange={(e) => {
                                handleTextInput(e.target.value);
                            }}
                        />
                    </div>
                    <div className="code-visualize">
                        <AssemblyCodeVisualizer
                            defaultValue={0}
                            data={asmParsedLine}
                        />
                    </div>
                    <div className="code-select">
                        <AssemblyCodeSelector
                            defaultValue={0}
                            data={asmParsedLine}
                        ></AssemblyCodeSelector>
                    </div>
                    <div className="stack-field">
                        <StackStatusViewer />
                    </div>
                </div>
            </div>
            <div className="footer"></div>

            {/* <Test1 />
            <Test2 />
            <div style={{ whiteSpace: "nowrap" }}>
                {tree_jsons.map((line, index) => (
                    <div key={index}>
                        <div className="hoge">{line}</div>
                    </div>
                ))}
            </div> */}
        </div>
    );
}
