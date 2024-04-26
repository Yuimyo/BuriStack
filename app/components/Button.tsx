import type { LinksFunction } from "@remix-run/node";
import styles from "./Button.css?url";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ children, onClick }: ButtonProps) {
    const handleChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <div className="component-Button">
            <button className="btn" onClick={handleChange}>
                {children}
            </button>
        </div>
    );
}
