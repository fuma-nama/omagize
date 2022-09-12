import {Box, Button, Flex, HStack, SimpleGrid, Text, useDisclosure} from "@chakra-ui/react";
import {Friend, useFriendsQuery} from "api/UserAPI";
import UserItem, {UserItemSkeleton} from "components/card/UserItem";
import {Holder, Placeholder} from "utils/Container";
import AddFriendModal from "components/modals/AddFriendModal";

export default function Friends() {
    const query = useFriendsQuery()
    const {isOpen, onOpen, onClose} = useDisclosure()

    return <Flex direction='column' gap={3}>
        <HStack>
            <Text fontSize='2xl' fontWeight='700'>Your Friends</Text>
            <Button onClick={onOpen} variant='brand'>Add</Button>
            <AddFriendModal isOpen={isOpen} onClose={onClose} />
        </HStack>
        <Content friends={query.data} />
    </Flex>
}

function Content({friends}: {friends: Friend[]}) {
    if (friends != null && friends.length == 0) {
        return <Placeholder>You don't have a Friend yet</Placeholder>
    }

    return <SimpleGrid columns={{base: 1, "3sm": 2, lg: 3, "2xl": 4}} gap={5}>
        <Holder
            array={friends}
            skeleton={
                <>
                    <UserItemSkeleton />
                    <UserItemSkeleton />
                    <UserItemSkeleton />
                </>}
        >
            {() =>
                friends.map(friend =>
                    <UserItem key={friend.id} user={friend} />
                )}
        </Holder>
    </SimpleGrid>
}
