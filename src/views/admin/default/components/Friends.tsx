import {Box, Flex, HStack, SimpleGrid, Text} from "@chakra-ui/react";
import {Friend, useFriendsQuery} from "api/UserAPI";
import UserItem, {UserItemSkeleton} from "components/card/UserItem";
import {Holder, Placeholder} from "utils/Container";

export default function Friends() {
    const query = useFriendsQuery()

    return <Flex direction='column' gap={3}>
        <Text fontSize='2xl' fontWeight='700'>Your Friends</Text>
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
