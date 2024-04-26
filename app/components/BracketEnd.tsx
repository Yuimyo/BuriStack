import { LinksFunction } from "@remix-run/node";
import styles from "./BracketEnd.css?url";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

interface BracketEndProps {
    width: number;
    height: number;
    thickness: number;
}

export default function BracketEnd({
    width,
    height,
    thickness,
}: BracketEndProps) {
    return (
        <div className="component-BracketEnd">
            <div className="bracket">
                <div className="bracket-above"></div>
                <div className="bracket-below"></div>
            </div>
        </div>
    );
}
