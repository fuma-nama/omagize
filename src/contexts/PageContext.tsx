import {createContext, ReactNode, useState} from "react";

type PageContextType = {
    selectedGroup?: string
    setSelectedGroup?: (group: string) => void
}

export const PageContext = createContext<PageContextType>({})

export function PageContextProvider(props: {children: ReactNode}) {
    const [selectedGroup, setSelectedGroup] = useState<string>(null)

    return <PageContext.Provider value={{
        selectedGroup,
        setSelectedGroup
    }}>
        {props.children}
    </PageContext.Provider>
}