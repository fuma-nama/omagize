import {Avatar, Flex, HStack, Text, useColorModeValue, VStack} from "@chakra-ui/react";
import Card from "../card/Card";
import {fetchMessages, Message} from "../../api/MessageAPI";
import {AvatarBg} from "../../variables/colors";

export default function ChatView() {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorBrand = useColorModeValue('brand.500', 'white');
    const messages = fetchMessages(0)

    return <Flex direction="column" h='full' minH='400px' gap={2}>
        {messages.map(message => <MessageItem key={message.id} {...message} />)}
    </Flex>
}

function MessageItem(props: Message) {
    const {author} = props
    const secondaryText = useColorModeValue('gray.400', 'white');

    return <Flex direction="row" _hover={{bg: "navy.800"}} p={7} transition="all 0.2s" rounded='xl'>
        <Avatar name={author.username} src={author.avatar} bg={AvatarBg} />
        <Flex direction='column' align='start' ml={2}>
            <HStack>
                <Text fontWeight='bold' fontSize='lg'>{author.username}</Text>
                <Text textColor={secondaryText}>- {props.timestamp.toLocaleTimeString()}</Text>
            </HStack>

            <Text>{props.content}</Text>
        </Flex>
    </Flex>
}