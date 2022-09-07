import React, {useContext, useEffect, useMemo} from "react";
// Chakra imports
import {Box, Button, Flex, Grid, Heading, HStack, useDisclosure} from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';
import ActiveMembers from './components/ActiveMembers';
import Card from 'components/card/Card';
import {PageContext} from "contexts/PageContext";
import {GroupDetail, useGroupDetailQuery} from "api/GroupAPI";
import { Notifications } from "./components/Notifications";
import ChatView from "components/views/ChatView";
import {BiArrowBack} from "react-icons/bi";
import {useNavigate} from "react-router-dom";
import {fetchMessagesLatest} from "../../../api/MessageAPI";
import { useQuery } from "@tanstack/react-query";
import MessageItem, {MessageItemSkeleton} from "../../../components/card/chat/MessageItem";

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
    const navigate = useNavigate()

    return (
        <Grid
            h='full'
            mb='20px'
            gridTemplateColumns={{ xl: 'repeat(2, 1fr)', '2xl': '1fr 0.46fr' }}
            gap={{ base: '20px', xl: '20px' }}
            display={{ base: 'block', xl: 'grid' }}>
            <Flex flexDirection='column' gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}>
                <Banner />
                <Box
                    flexGrow={1}
                    mt='45px'
                    mb='20px'
                >
                    <Card flexDirection='row' mb='20px' alignItems='center'>
                        <Heading fontSize='24px'>Messages</Heading>
                        <Button ml='auto' variant="brand" onClick={() => navigate(`/user/chat/${group.id}`)}>Open</Button>
                    </Card>
                    <MessagesPreview />
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

function MessagesPreview() {
    const {selectedGroup} = useContext(PageContext)
    const query = useQuery(
        ["messages_overview", selectedGroup],
        () => fetchMessagesLatest(selectedGroup, 5)
    )
    if (query.isLoading) {
        return <>
            <MessageItemSkeleton noOfLines={4} />
            <MessageItemSkeleton noOfLines={2} />
            <MessageItemSkeleton noOfLines={6} />
            <MessageItemSkeleton noOfLines={1} />
        </>
    }

    return <>
        {query.data.map(message => <MessageItem key={message.id} {...message} />)}
    </>
}