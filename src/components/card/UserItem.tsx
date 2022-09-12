import {Flex, HStack, Text, useToken} from "@chakra-ui/react";
import {useColors} from "../../variables/colors";
import Card from "./Card";
import FadeImage from "./FadeImage";
import Avatar from "../icons/Avatar";
import React from "react";
import {UserType} from "api/UserAPI";

export default function UserItem({user}: {user: UserType}) {
    const [brand] = useToken("color", ["brand.400"])
    const {textColorPrimary, textColorSecondary} = useColors()
    const image = user.bannerUrl ?? user.avatarUrl

    return <Card
        _hover={{opacity: 0.5, cursor: 'pointer'}}
        transition='0.2s linear'
        overflow='hidden'
        pos='relative'>
        <FadeImage
            direction='to left' src={image}
            placeholder={brand}
            image={{
                filter:'auto',
                brightness: 0.5
            }}
        />

        <HStack gap='10px' pos='relative' align='start'>
            <Avatar name={user.username} src={user.avatarUrl} variant='normal' />
            <Flex direction='column'>
                <Text color={textColorPrimary} fontSize='xl' fontWeight='bold'>{user.username}</Text>
                <Text color={textColorSecondary}>{user.description}</Text>
            </Flex>
        </HStack>
    </Card>
}

export function UserItemSkeleton() {
    return <></>
}