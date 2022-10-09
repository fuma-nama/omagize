import {Box, Button, Flex, HStack, IconButton, Text, useToken} from "@chakra-ui/react";
import {useColors} from "../../variables/colors";
import Card from "./Card";
import FadeImage from "./utils/FadeImage";
import Avatar from "../icons/Avatar";
import React from "react";
import {acceptFriendRequest, denyFriendRequest} from "api/UserAPI";
import {CustomCardProps} from "theme/theme";
import {AiOutlineClose} from "react-icons/ai";
import {useMutation} from "@tanstack/react-query";
import {ChatIcon, WarningIcon} from "@chakra-ui/icons";
import {User} from "../../api/types/User";
import {Friend, FriendRequest} from "../../api/types/Friend";

export default function UserItem({user}: {user: User}) {
    const [brand] = useToken("color", ["brand.400"])
    const {textColorPrimary} = useColors()
    const image = user.bannerUrl ?? user.avatarUrl

    return <Card
        overflow='hidden'
        pos='relative'>
        <FadeImage
            direction='to left' src={image}
            placeholder={brand}
            percent={60}
            opacity={50}
        />

        <HStack gap='10px' pos='relative' align='start'>
            <Avatar name={user.username} src={user.avatarUrl} variant='normal' />
            <Flex direction='column'>
                <Text color={textColorPrimary} fontSize='xl' fontWeight='bold'>{user.username}</Text>
                <Text color={textColorPrimary}>{user.description}</Text>
            </Flex>
        </HStack>
    </Card>
}

export function FriendItem({friend}: {friend: Friend}) {
    const [brand] = useToken("color", ["brand.400"])
    const {textColorPrimary} = useColors()
    const image = friend.bannerUrl ?? friend.avatarUrl

    return <Card
        overflow='hidden'
        pos='relative'>
        <FadeImage
            direction='to left' src={image}
            placeholder={brand}
            percent={60}
            opacity={50}
        />

        <HStack gap='10px' pos='relative' align='start'>
            <Avatar name={friend.username} src={friend.avatarUrl} variant='normal' />
            <Flex direction='column'>
                <Text color={textColorPrimary} fontSize='xl' fontWeight='bold'>{friend.username}</Text>
                <Text color={textColorPrimary}>{friend.description}</Text>
            </Flex>
        </HStack>
        <HStack ml='auto' align='end'>
            <Button leftIcon={<ChatIcon />} variant='action'>Chat</Button>
        </HStack>
    </Card>
}

export function FriendRequestItem(
    {request, ...card}: {request: FriendRequest} & CustomCardProps
) {
    const user = request.user
    const image = user.bannerUrl ?? user.avatarUrl

    const accept = useMutation(
        ["accept_friend_request", request.user.id],
        () => acceptFriendRequest(request.user.id)
    )
    const deny = useMutation(
        ["deny_friend_request", request.user.id],
        () => denyFriendRequest(request.user.id)
    )

    const {textColorPrimary, textColorSecondary, cardBg, brand} = useColors()
    const breakpoint = '3sm'

    return <Flex
        rounded='2xl'
        overflow='hidden'
        direction={{base: 'column', [breakpoint]: 'row'}}
        {...card}
    >
        <Box bg={cardBg} flex={1} p='21px'>
            <HStack mb={3}>
                <WarningIcon />
                <Text>Friend Request</Text>
            </HStack>
            <HStack gap='10px' align='start'>
                <Avatar name={user.username} src={user.avatarUrl} variant='normal' />
                <Flex direction='column'>

                    <Text color={textColorPrimary} fontSize='xl' fontWeight='bold'>{user.username}</Text>
                    <Text color={textColorSecondary}>{request.message}</Text>
                </Flex>
            </HStack>
        </Box>
        <HStack
            align='end'
            justify='end'
            p={2}
            flexShrink={0}
            minW='fit-content'
            w={{[breakpoint]: '40%'}}
            h={{[breakpoint]: 'full'}}
            bg={brand}
            bgImg={image}
            bgSize='cover'
        >
            <Button
                isLoading={accept.isLoading} onClick={() => accept.mutate()}
                variant='action'>
                Accept
            </Button>
            <IconButton
                isLoading={deny.isLoading} onClick={() => deny.mutate()}
                aria-label='deny' icon={<AiOutlineClose />} variant='danger'
            />
        </HStack>
    </Flex>
}

export function UserItemSkeleton() {
    return <></>
}