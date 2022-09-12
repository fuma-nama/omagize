import React, {useContext, useEffect} from "react";
// Chakra imports
import {Box, Button, Flex, Grid, Heading, SimpleGrid} from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';
import ActiveMembers from './components/ActiveMembers';
import Card from 'components/card/Card';
import {PageContext, useGroupChat} from "contexts/PageContext";
import {GroupDetail, useGroupDetailQuery} from "api/GroupAPI";
import { Notifications } from "./components/Notifications";
import {useInfiniteMessageQuery} from "api/MessageAPI";
import MessageItem, {MessageItemSkeleton} from "components/card/chat/MessageItem";
import {QueryErrorPanel} from "components/card/ErrorPanel";
import GroupEventItem from "components/card/GroupEventItem";

export default function GroupOverview() {
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
    const {open} = useGroupChat(group.id)

    return (
        <Grid
            h='full'
            mb='20px'
            gridTemplateColumns={{ xl: 'repeat(2, 1fr)', '2xl': '1fr 0.46fr' }}
            gap={{ base: '20px', xl: '20px' }}
            display={{ base: 'block', xl: 'grid' }}>
            <Flex flexDirection='column' gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}>
                <Banner />
                <Flex
                    direction='column'
                    flexGrow={1}
                    mt='25px'
                    mb='20px'
                    gap={2}
                >
                    <GroupEvents detail={group} />
                    <Card flexDirection='row' alignItems='center' mt={3}>
                        <Heading fontSize='24px'>Messages</Heading>
                        <Button ml='auto' variant="brand" onClick={open}>Open</Button>
                    </Card>
                    <MessagesPreview />
                </Flex>
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

function GroupEvents({detail}: {detail: GroupDetail}) {
    return <SimpleGrid columns={{base: 1, "3sm": 2, "xl": 3}}>
        {detail.events.map(e =>
            <GroupEventItem key={e.id} {...e} />
        )}
    </SimpleGrid>
}

function MessagesPreview() {
    const {selectedGroup} = useContext(PageContext)
    const query = useInfiniteMessageQuery(selectedGroup)

    if (query.error) {
        return <Box flexGrow={1}>
            <QueryErrorPanel query={query} />
        </Box>
    }
    if (query.isLoading) {
        return <>
            <MessageItemSkeleton noOfLines={4} />
            <MessageItemSkeleton noOfLines={2} />
            <MessageItemSkeleton noOfLines={6} />
            <MessageItemSkeleton noOfLines={1} />
        </>
    }

    const pages = query.data.pages
    const lastPage = pages[pages.length - 1]
    return <Flex direction='column-reverse' maxH="1000px" overflow='auto'>
        {lastPage.slice(lastPage.length - 8, lastPage.length - 1).map(message => <MessageItem key={message.id} {...message} />)}
    </Flex>
}