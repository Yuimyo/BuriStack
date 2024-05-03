import { LinksFunction } from "@remix-run/node";
import styles from "./StackStatusViewer.css?url";
import StackItem, { links as stackItemLinks } from "~/components/StackItem";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
    ...stackItemLinks(),
];

interface StackStatusViewerProps {}

// eslint-disable-next-line no-empty-pattern
export default function StackStatusViewer({}: StackStatusViewerProps) {
    const data: string[] = [
        "ok",
        "afaf",
        "aafaf",
        "9-0ai09x",
        "0x013213",
        "afaf",
        "aafaf",
        "9-0ai09x",
        "0x013213",
        "afaf",
        "aafaf",
        "9-0ai09x",
        "0x013213",
        "afaf",
        "aafaf",
        "9-0ai09x",
        "0x013213",
        "9-0ai09x",
        "0x013213",
        "afaf",
        "aafaf",
        "9-0ai09x",
        "0x013213",
    ];

    return (
        <div className="component-StackStatusViewer">
            <div className="container-stk">
                <div className="container-stk-head">
                    <div className="pos-left">
                        <div className="stk-linerow">421</div>
                    </div>
                    <div className="pos-mid">
                        <div className="container-stk-title">mov 2, rax</div>
                    </div>
                    <div className="pos-right"></div>
                </div>
                <div className="container-stk-main">
                    <div className="container-stk-draw">
                        {data.map((line, index) => (
                            <StackItem
                                key={index}
                                width={100}
                                height={70}
                                description={line}
                                lore={"5"}
                            />
                        ))}
                    </div>
                </div>
                <div className="container-stk-below">
                    <div className="container-stk-fading"></div>
                    <div className="container-stk-scalebar"></div>
                </div>
            </div>
        </div>
    );
}
