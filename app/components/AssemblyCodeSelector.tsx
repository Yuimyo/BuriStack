import { useEffect, useState } from "react";
import { LinksFunction } from "@remix-run/node";
import styles from "./AssemblyCodeSelector.css?url";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

interface AssemblyCodeSelectorProps {
    onChange?: (lineNumber: number) => void;
    defaultValue: number;
    data: string[];
}

export default function AssemblyCodeSelector({
    onChange,
    defaultValue,
    data,
}: AssemblyCodeSelectorProps) {
    const [selectedLine, setSelectedLine] = useState(defaultValue);

    useEffect(() => {
        console.log("changed selected line:", selectedLine); // TODO
    }, [selectedLine]);

    const handleButtonClick = (lineNumber: number) => {
        setSelectedLine((prev) => lineNumber);
        if (onChange) {
            onChange(lineNumber);
        }
    };

    return (
        <div className="component-AssemblyCodeSelector">
            <div className="viewer">
                {data.map((line, index) => (
                    <button
                        className="asm-line"
                        key={index}
                        onClick={() => handleButtonClick(index + 1)}
                    >
                        {line}
                    </button>
                ))}
            </div>
        </div>
    );
}
