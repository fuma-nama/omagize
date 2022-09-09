import {Message} from "api/MessageAPI";
import {Flex, HStack, SkeletonCircle, SkeletonText, Text, useColorModeValue} from "@chakra-ui/react";
import Avatar from "components/icons/Avatar"

export default function MessageItem(props: Message) {
    const {author} = props
    const secondaryText = useColorModeValue('gray.400', 'white');
    const hoverBg = useColorModeValue("white", "navy.800")

    return <Flex direction="row" _hover={{bg: hoverBg}} p={7} transition="all 0.2s" rounded='xl'>
        <Avatar name={author.username} src={author.avatarUrl} />
        <Flex direction='column' align='start' ml={2}>
            <HStack>
                <Text fontWeight='bold' fontSize='lg'>{author.username}</Text>
                <Text textColor={secondaryText}>- {props.timestamp.toLocaleTimeString()}</Text>
            </HStack>

            <Text>{props.content}</Text>
        </Flex>
    </Flex>
}

export function MessageItemSkeleton(props: {noOfLines: number}) {
    return <Flex direction="row" p={7} transition="all 0.2s" rounded='xl'>
        <SkeletonCircle w="50px" h="50px" />
        <Flex direction='column' align='start' ml={2} gap={5} w='full' maxW='500px'>
            <SkeletonText w='46%' noOfLines={1} />
            <SkeletonText w='full' noOfLines={props.noOfLines} />
        </Flex>
    </Flex>
}