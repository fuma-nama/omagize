import {Button, Flex, HStack, SimpleGrid, Text, useDisclosure} from "@chakra-ui/react";
import {Friend, FriendRequest, FriendsData, useFriendsQuery} from "api/UserAPI";
import UserItem, {FriendRequestItem, UserItemSkeleton} from "components/card/UserItem";
import {ArrayHolder, Holder, Placeholder} from "utils/Container";
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
        <Content {...query.data} />
    </Flex>
}

function Content(data: FriendsData) {
    if (data != null && data.friends.length == 0 && data.requests.length === 0) {
        return <Placeholder>You don't have a Friend yet</Placeholder>
    }
    const {friends, requests} = data

    return <SimpleGrid columns={{base: 1, lg: 2, "2xl": 3}} gap={5}>
        <Holder
            isLoading={data == null}
            skeleton={
                <>
                    <UserItemSkeleton />
                    <UserItemSkeleton />
                    <UserItemSkeleton />
                </>}
        >
            {requests?.map(request =>
                <FriendRequestItem key={request.user.id} request={request} />
            )}
            {friends?.map(friend =>
                <UserItem key={friend.id} user={friend} />
            )}
        </Holder>
    </SimpleGrid>
}
