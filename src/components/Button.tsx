import { count } from "console";
import { useState } from "react";

interface ButtonProps {
    color: string,
    children: string,
    value: string,
}

export function Button(props: ButtonProps) {
    const [counter, setCounter] = useState(parseInt(props.value) || 0);

    function increment() {
        setCounter(counter + 1);
    }

    return (
        <button type="button" style={{ backgroundColor: props.color }} onClick={increment}>
            {props.children} <b>{counter}</b>
        </button>
    );
}