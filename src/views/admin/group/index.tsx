import React, {useContext, useEffect} from "react";
// Chakra imports
import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    Heading,
    HStack,
    Icon, Image,
    SimpleGrid,
    Text,
    useDisclosure
} from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';
import AdminsCard from './components/AdminsCard';
import Card, {CardButton} from 'components/card/Card';
import {PageContext, useGroupChat} from "contexts/PageContext";
import {GroupDetail, useGroupDetailQuery} from "api/GroupAPI";
import { Notifications } from "./components/Notifications";
import {useInfiniteMessageQuery} from "api/MessageAPI";
import MessageItem, {MessageItemSkeleton} from "components/card/chat/MessageItem";
import {QueryErrorPanel} from "components/card/ErrorPanel";
import GroupEventItem from "components/card/GroupEventItem";
import {Holder} from "../../../utils/Container";
import {AddIcon, ChatIcon} from "@chakra-ui/icons";
import {useColors} from "../../../variables/colors";
import CreateEventModal from "../../../components/modals/CreateEventModal";
import {BsPeopleFill} from "react-icons/bs";
import {AiFillSetting} from "react-icons/ai";
import {CustomCardProps} from "../../../theme/theme";

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
                    gap='20px'
                >
                    <ActionBar group={group} />
                    <GroupEvents detail={group} />
                    <Text fontSize='2xl' fontWeight='600'>Recent Messages</Text>
                    <MessagesPreview />
                </Flex>
            </Flex>
            <Flex direction='column' gap="20px" gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}>
                <About group={group} />
                <Card px='0px'>
                    <AdminsCard group={group} />
                </Card>
                <Notifications />
            </Flex>
        </Grid>
    );
}

function About({group}: {group: GroupDetail}) {
    return <Card p={0} overflow='hidden'>
        {!!group.banner && <Image src={group.banner} height='100px' objectFit='cover' />}
        <Flex direction='column' p='20px'>
            <HStack mb='10px'>
                <Text fontSize='2xl' fontWeight='bold'>About</Text>
            </HStack>
            <Text whiteSpace='pre-line'>{group.introduction}</Text>
        </Flex>
    </Card>
}

function ActionBar(props: {group: GroupDetail}) {
    const {group} = props
    const {open} = useGroupChat(group.id)

    function Item({text, icon, ...props}: {text: string, icon: any} & CustomCardProps) {
        return <CardButton alignItems='center' gap={2} {...props}>
            {icon}
            <Text fontSize={{base: 'md', md: 'lg'}}>{text}</Text>
        </CardButton>
    }

    return <>
        <SimpleGrid columns={3} gap={5}>
            <Item text='Chat' icon={<ChatIcon width='30px' height='30px' />} onClick={open} />
            <Item text='Members' icon={<Icon as={BsPeopleFill} width='30px' height='30px' />} />
            <Item text='Settings' icon={<Icon as={AiFillSetting} width='30px' height='30px' />} />
        </SimpleGrid>
    </>
}

function GroupEvents({detail}: {detail: GroupDetail}) {
    const {textColorSecondary} = useColors()
    const {onOpen, isOpen, onClose} = useDisclosure()
    const atBottom = detail.events.length == 0 || detail.events.length % 2 == 0

    return <>
        <SimpleGrid columns={{
            base: 1,
            md: 2,
        }} gap={3}>
            {detail.events.map(e =>
                <Box>
                    <GroupEventItem key={e.id} {...e} />
                </Box>
            )}
            {!atBottom && <CardButton onClick={() => onOpen()}>
                <Center p='50px' color={textColorSecondary} h='full' flexDirection='column' gap={3}>
                    <AddIcon w='50px' h='50px'/>
                    <Text>Create Event</Text>
                </Center>
            </CardButton>}
            <CreateEventModal isOpen={isOpen} onClose={onClose} group={detail.id}/>
        </SimpleGrid>
        {atBottom && <CardButton p={0} onClick={() => onOpen()}>
            <HStack p='20px' color={textColorSecondary} justify='center'>
                <AddIcon w='20px' h='20px' />
                <Text>Create Event</Text>
            </HStack>
        </CardButton>}
    </>
}

function MessagesPreview() {
    const {selectedGroup} = useContext(PageContext)
    const query = useInfiniteMessageQuery(selectedGroup)

    if (query.error) {
        return <Box flexGrow={1}>
            <QueryErrorPanel query={query} />
        </Box>
    }

    return <Flex direction='column-reverse' maxH="1000px" overflow='auto'>
        <Holder
            isLoading={query.isLoading}
            skeleton={
                <>
                    <MessageItemSkeleton noOfLines={4} />
                    <MessageItemSkeleton noOfLines={2} />
                    <MessageItemSkeleton noOfLines={6} />
                    <MessageItemSkeleton noOfLines={1} />
                </>
            }
        >
            {() => {
                const pages = query.data.pages
                const lastPage = pages[pages.length - 1]

                return lastPage.slice(lastPage.length - 8, lastPage.length - 1).map(message => <MessageItem key={message.id} {...message} />)
            }}
        </Holder>
    </Flex>
}