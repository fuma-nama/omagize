import {useContext, useEffect} from "react";
import {PageContext} from "contexts/PageContext";
import {Group, useGroupQuery} from "api/GroupAPI";

export default function GroupChat() {
    const {selectedGroup, setInfo} = useContext(PageContext)
    const query = useGroupQuery(selectedGroup)
    useEffect(() => setInfo({title: query.isLoading? null : query.data.name}), [query.data])

    if (query.isLoading) {
        return <></>
    }

    return <Content group={query.data} />
}

function Content(props: {group: Group}) {

    return <></>
}