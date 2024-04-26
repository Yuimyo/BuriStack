import { LinksFunction } from "@remix-run/node";
import styles from "./Test1.css?url";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

export default function Test1() {
    return (
        <div className="component-Test1">
            <div className="hoge">Test1hoge</div>
            <div className="hoge1">Test1hoge1</div>
            <div className="hoge-a">Test1hogeA</div>
            <div className="hoge2">Test1hoge2</div>
            <div className="hoge-b">Test1hogeB</div>
        </div>
    );
}
