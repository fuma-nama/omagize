import {useContext, useEffect} from "react";
import {PageContext} from "contexts/PageContext";
import {Group, useGroupQuery} from "api/GroupAPI";

export default function GroupChat() {
    const {selectedGroup} = useContext(PageContext)
    const query = useGroupQuery(selectedGroup)

    if (query.isLoading) {
        return <></>
    }

    return <Content group={query.data} />
}

function Content(props: {group: Group}) {
    const {group} = props
    const {setInfo} = useContext(PageContext)
    console.log(group.name)

    useEffect(() => setInfo({title: group.name}), [])

    return <></>
}