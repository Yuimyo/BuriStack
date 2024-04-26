import { LinksFunction } from "@remix-run/node";
import styles from "./StackItem.css?url";
import BracketEnd from "~/components/BracketEnd";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

interface StackItemProps {
    description: string;
    lore: string;
    width: number;
    height: number;
}

export default function StackItem({
    description,
    lore,
    width,
    height,
}: StackItemProps) {
    return (
        <div className="component-StackItem">
            <div className="stk">
                <div className="stk-inside">
                    <div className="stk-description">{description}</div>
                </div>
                <div className="stk-outside">
                    <BracketEnd
                        width={width}
                        height={height}
                        thickness={2}
                    ></BracketEnd>
                    <div className="stk-lore">{lore}</div>
                </div>
            </div>
        </div>
    );
}
