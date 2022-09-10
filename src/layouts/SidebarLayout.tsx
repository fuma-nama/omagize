import {PageContextProvider} from "../contexts/PageContext";
import {SidebarContext} from "../contexts/SidebarContext";
import {Flex} from "@chakra-ui/react";
import {ReactNode, useState} from "react";
import Sidebar from "../components/sidebar/Sidebar";
import routes from "../routes";
import {Outlet} from "react-router-dom";

export default function SidebarLayout(props: {sidebar?: ReactNode}) {
    const [ toggleSidebar, setToggleSidebar ] = useState(false);

    return <Flex direction='row' h='full'>
        <PageContextProvider>
            <SidebarContext.Provider
                value={{
                    toggleSidebar,
                    setToggleSidebar
                }}>
                {props.sidebar || <Sidebar routes={routes} display='none'/>}
                <Outlet />
            </SidebarContext.Provider>
        </PageContextProvider>
    </Flex>
}