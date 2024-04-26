import { LinksFunction } from "@remix-run/node";
import styles from "./Test2.css?url";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

export default function Test2() {
    return (
        <div className="component-Test2">
            <div className="hoge">Test2hoge</div>
            <div className="hoge1">Test2hoge1</div>
            <div className="hogeA">Test2hogeA</div>
            <div className="hoge2">Test2hoge2</div>
            <div className="hogeB">Test2hogeB</div>
            <div className="hoge-autoprefixer">
                <div>test</div>
            </div>
        </div>
    );
}
