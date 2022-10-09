import {Button, Flex, HStack, SimpleGrid, Text, useDisclosure} from "@chakra-ui/react";
import {RawFriendsData, useFriendsQuery} from "api/UserAPI";
import {FriendItem, FriendRequestItem, UserItemSkeleton} from "components/card/UserItem";
import {Holder, Placeholder} from "utils/Container";
import AddFriendModal from "components/modals/AddFriendModal";
import {FriendsData} from "../../../../api/types/Friend";

export default function Friends() {
    const query = useFriendsQuery()
    const {isOpen, onOpen, onClose} = useDisclosure()

    return <Flex direction='column' gap={3}>
        <HStack>
            <Text fontSize='2xl' fontWeight='700'>Your Friends</Text>
            <Button onClick={onOpen} variant='brand'>Add</Button>
            <AddFriendModal isOpen={isOpen} onClose={onClose} />
        </HStack>
        <Content data={query.data} />
    </Flex>
}

function Content({data}: { data: FriendsData }) {
    if (data != null && data.friends.length == 0 && data.requests.length === 0) {
        return <Placeholder>You don't have a Friend yet</Placeholder>
    }

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
            {data?.requests?.map(request =>
                <FriendRequestItem key={request.user.id} request={request} />
            )}
            {data?.friends?.map(friend =>
                <FriendItem key={friend.id} friend={friend} />
            )}
        </Holder>
    </SimpleGrid>
}
