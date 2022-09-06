import React, {useContext, useEffect} from "react";
// Chakra imports
import {Box, Flex, Grid} from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';
import ActiveMembers from './components/ActiveMembers';
import Card from 'components/card/Card';
import {PageContext} from "contexts/PageContext";
import {GroupDetail, useGroupDetailQuery} from "api/GroupAPI";
import { Notifications } from "./components/Notifications";
import ChatView from "components/views/ChatView";

export default function GroupChat() {
    const {selectedGroup, setInfo} = useContext(PageContext)
    const query = useGroupDetailQuery(selectedGroup)
    useEffect(() => setInfo({title: query.isLoading? null : query.data.name}), [query.data])

    if (query.isLoading) {
        return <></>
    }

    return <Content group={query.data} />
}

function Content(props: {group: GroupDetail}) {
    const {group} = props

    return (
        <Grid
            h='full'
            mb='20px'
            gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
            gap={{ base: '20px', xl: '20px' }}
            display={{ base: 'block', xl: 'grid' }}>
            <Flex flexDirection='column' gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}>
                <Banner />
                <Box
                    flexGrow={1}
                    mt='45px'
                    mb='20px'
                >
                    <ChatView />
                </Box>
            </Flex>
            <Flex direction='column' gap="20px" gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}>
                <Card px='0px'>
                    <ActiveMembers group={group} />
                </Card>
                <Notifications />
            </Flex>
        </Grid>
    );
}