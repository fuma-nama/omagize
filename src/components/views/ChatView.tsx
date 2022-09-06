import {Flex, Text, useColorModeValue} from "@chakra-ui/react";
import Card from "../card/Card";
import {fetchMessages, Message} from "../../api/MessageAPI";

export default function ChatView() {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorBrand = useColorModeValue('brand.500', 'white');
    const messages = fetchMessages(0)

    return <Flex direction="column" h='full' minH='400px'>
        {messages.map(message => <MessageItem key={message.id} {...message} />)}
    </Flex>
}

function MessageItem(props: Message) {
    return <Card>
        <Text>{props.content}</Text>
    </Card>
}