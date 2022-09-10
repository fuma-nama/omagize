import React, {useState} from "react";

export function useModalState<T>(close: () => void, initial?: T): [
    () => void, T, React.Dispatch<React.SetStateAction<T>>
] {
    const [value, setValue] = useState<T>(initial)

    return [() => {
        setValue(initial)
        close()
    }, value, setValue]
}