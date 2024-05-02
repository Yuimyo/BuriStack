import { useEffect, useState } from "react";
import { LinksFunction } from "@remix-run/node";
import styles from "./AssemblyCodeVisualizer.css?url";
import AssemblyCodeSelector from "./AssemblyCodeSelector";

// prettier-ignore
export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

interface AssemblyCodeVisualizerProps {
    onChange?: (lineNumber: number) => void;
    defaultValue: number;
    data: string[];
}

export default function AssemblyCodeVisualizer({
    defaultValue,
    data,
}: AssemblyCodeVisualizerProps) {
    return (
        <div className="component-AssemblyCodeVisualizer">
            <AssemblyCodeSelector defaultValue={defaultValue} data={data} />
        </div>
    );
}
