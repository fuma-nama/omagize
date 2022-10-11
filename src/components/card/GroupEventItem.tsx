import {useGroupQuery} from "api/GroupAPI";
import Card from "./Card";
import {
    Avatar,
    Flex,
    HStack,
    Image,
    Skeleton,
    SkeletonCircle,
    SkeletonText,
    StackProps,
    Text
} from "@chakra-ui/react";
import {useColors} from "variables/colors";
import {GroupEvent} from "../../api/types/GroupEvents";

function Info({name, value, ...rest}: {name: string, value: any} & StackProps) {
    const {textColorPrimary, textColorSecondary} = useColors()

    return <HStack {...rest}>
        <Text color={textColorSecondary} fontWeight='bold'>{name}</Text>
        <Text color={textColorPrimary}>{value}</Text>
    </HStack>
}

export function GlobalGroupEventItem({event}: {event: GroupEvent}) {
    const {data: group} = useGroupQuery(event.group)
    const iconSize = '30px'

    return <Card overflow='hidden' gap={3}>
        <HStack mb={2} align='start'>
            {!!group?
                <>
                    <Avatar src={group.iconUrl} name={group.name} w={iconSize} h={iconSize}/>
                    <Text fontWeight='bold'>{group.name}</Text>
                </>:
                <>
                    <SkeletonCircle w={iconSize} h={iconSize}/>
                    <SkeletonText noOfLines={2} w='100px' h='23px'/>
                </>
            }
        </HStack>
        <GroupEventContent event={event} />
    </Card>
}

export default function GroupEventItem({event}: { event: GroupEvent }) {

    return <Card overflow='hidden' gap={3}>
        <GroupEventContent event={event} />
    </Card>
}

function GroupEventContent({event}: {event: GroupEvent}) {
    const {textColorPrimary, textColorSecondary} = useColors()
    const author = event.author

    const happening = event.startAt <= new Date(Date.now())

    return <>
        {happening &&
            <HStack>
                <Text p={2} bg='green.500' rounded='full' fontWeight='bold' fontSize='md'>Event Started</Text>
                {!!event.endAt && <Info name='End At' value={event.endAt.toLocaleString()}/>}
            </HStack>
        }
        <Image w='full' objectFit='cover' src={event.imageUrl} maxH='200px' rounded='lg' />

        <HStack justify='space-between'>
            <Flex direction='column'>
                <Text
                    color={textColorPrimary}
                    fontWeight='bold'
                    fontSize='md'
                >
                    {event.name}
                </Text>
                <Text color={textColorSecondary}>{event.description}</Text>
                <Text color={textColorSecondary}>By {author.username}</Text>
            </Flex>
            <Avatar src={author.avatarUrl} name={author.username} />
        </HStack>

        <Flex direction='row' flexWrap='wrap' gap={4} mt='auto' pt={2}>
            {!!event.place && <Info name='Take Place At' value={event.place}/>}

            {!happening && <Info name='Starting At' value={event.startAt.toLocaleString()} />}
        </Flex>
    </>
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