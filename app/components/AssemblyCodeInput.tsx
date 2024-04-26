import { ChangeEvent } from "react";
import { LinksFunction } from "@remix-run/node";
import styles from "./AssemblyCodeInput.css?url";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

interface AssemblyCodeInputProps {
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
}

export default function AssemblyCodeInput({
    onChange,
    placeholder,
}: AssemblyCodeInputProps) {
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className="component-AssemblyCodeInput">
            <textarea
                className="asm-form"
                onChange={handleChange}
                placeholder={placeholder}
                spellCheck="false"
            ></textarea>
        </div>
    );
}
