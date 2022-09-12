import {Box, Button, Flex, HStack, IconButton, Text, useColorModeValue, useToken} from "@chakra-ui/react";
import {useColors} from "../../variables/colors";
import Card from "./Card";
import FadeImage from "./FadeImage";
import Avatar from "../icons/Avatar";
import React from "react";
import {FriendRequest, UserType} from "api/UserAPI";
import {CustomCardProps} from "theme/theme";
import {AiOutlineClose} from "react-icons/ai";

export default function UserItem({user}: {user: UserType}) {
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

export function FriendRequestItem(
    {request, ...card}: {request: FriendRequest} & CustomCardProps
) {
    const {cardBg, brand} = useColors()
    const {textColorPrimary, textColorSecondary} = useColors()

    const {user} = request
    const image = user.bannerUrl ?? user.avatarUrl

    return <Flex
        rounded='2xl'
        overflow='hidden'
        {...card}
    >
        <Box bg={cardBg} p='21px' flex={1}>
            <HStack gap='10px' pos='relative' align='start'>
                <Avatar name={user.username} src={user.avatarUrl} variant='normal' />
                <Flex direction='column'>
                    <Text color={textColorPrimary} fontSize='xl' fontWeight='bold'>{user.username}</Text>
                    <Text color={textColorSecondary}>{user.description}</Text>
                </Flex>
            </HStack>
        </Box>
        <HStack
            align='end'
            justify='end'
            p={2}
            flexShrink={0}
            minW='fit-content'
            w='40%'
            h='full'
            bg={brand}
            bgImg={image}
            bgSize='cover'
        >
            <Button variant='action'>Accept</Button>
            <IconButton aria-label='deny' icon={<AiOutlineClose />} variant='danger' />
        </HStack>
    </Flex>
}

export function UserItemSkeleton() {
    return <></>
}