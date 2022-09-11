import {GroupEvent} from "api/GroupAPI";
import Card from "./Card";
import {Avatar, Flex, HStack, Image, Skeleton, SkeletonCircle, SkeletonText, StackProps, Text} from "@chakra-ui/react";
import {useColors} from "variables/colors";

function Info({name, value, ...rest}: {name: string, value: any} & StackProps) {
    const {textColorPrimary, textColorSecondary} = useColors()

    return <HStack {...rest}>
        <Text color={textColorSecondary} fontWeight='bold'>{name}</Text>
        <Text color={textColorPrimary}>{value}</Text>
    </HStack>
}

export default function GroupEventItem(props: GroupEvent) {
    const {textColorPrimary, textColorSecondary} = useColors()

    return <Card overflow='hidden' gap={3}>
        <Image w='full' objectFit='cover' src={props.image} maxH='200px' rounded='lg' />

        <HStack justify='space-between'>
            <Flex direction='column'>
                <Text
                    color={textColorPrimary}
                    fontWeight='bold'
                    fontSize='md'
                >
                    {props.name}
                </Text>
                <Text color={textColorSecondary}>{props.description}</Text>
                <Text color={textColorSecondary}>By {props.author.username}</Text>
            </Flex>
            <Avatar src={props.author.avatarUrl} name={props.author.username} />
        </HStack>

        <Flex direction='row' flexWrap='wrap' gap={4} mt={2}>
            <Info name='Take Place At' value={props.place} />

            <Info name='Starting At' value={props.startAt.toLocaleTimeString()} />
        </Flex>
    </Card>
}

export function GroupEventSkeleton() {
    return <Card overflow='hidden' gap={3}>
        <Skeleton w='full' h='200px' rounded='lg' />

        <HStack justify='space-between'>
            <Flex direction='column' gap={3}>
                <Skeleton w='200px' h='20px' />
                <SkeletonText w='full' noOfLines={2} />
            </Flex>
            <SkeletonCircle w='40px' h='40px' />
        </HStack>

        <Flex direction='row' flexWrap='wrap' gap={4} mt={2}>
            <Skeleton w='120px' h='25px' />
            <Skeleton w='100px' h='25px' />
        </Flex>
    </Card>
}