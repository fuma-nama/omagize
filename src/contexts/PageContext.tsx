import {createContext, ReactNode, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

type PageContextType = {
    selectedGroup?: string
    setSelectedGroup?: (group: string) => void
}

export const PageContext = createContext<PageContextType>({})

export function PageContextProvider(props: {children: ReactNode}) {
    const {group} = useParams()
    const navigate = useNavigate()

    return <PageContext.Provider value={{
        selectedGroup: group,
        setSelectedGroup(group) {
            navigate(`/admin/${group}`)
        }
    }}>
        {props.children}
    </PageContext.Provider>
}