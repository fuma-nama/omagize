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
    const {globalBg} = useColors()

    const happening = event.startAt <= new Date(Date.now())
    const iconSize = '35px'

    return <Card overflow='hidden' gap={3}>
        <HStack spacing={0} flexWrap='wrap' gap={2}>
            {happening && <EventStarted/>}
            <HStack bg={globalBg} rounded='full' p={2}>
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
        </HStack>
        <GroupEventContent event={event} />
        <Flex direction='row' flexWrap='wrap' gap={4} mt='auto' pt={2}>
            {!!event.place && <Info name='Take Place At' value={event.place}/>}

            {happening?
                !!event.endAt && <Info name='End At' value={event.endAt.toLocaleString()} />
                :
                <Info name='Starting At' value={event.startAt.toLocaleString()} />
            }
        </Flex>
    </Card>
}

export default function GroupEventItem({event}: { event: GroupEvent }) {
    const happening = event.startAt <= new Date(Date.now())

    return <Card overflow='hidden' gap={3}>
        {happening && <HStack>
            <EventStarted />
            {!!event.endAt && <Info name='End At' value={event.endAt.toLocaleString()}/>}
        </HStack>}
        <GroupEventContent event={event} />
        <Flex direction='row' flexWrap='wrap' gap={4} mt='auto' pt={2}>
            {!!event.place && <Info name='Take Place At' value={event.place}/>}

            {!happening && <Info name='Starting At' value={event.startAt.toLocaleString()} />}
        </Flex>
    </Card>
}

function EventStarted() {
    return <Text p={2} bg='green.500' rounded='full' color='white' fontWeight='bold' fontSize='md'>Event Started</Text>
}

function GroupEventContent({event}: {event: GroupEvent}) {
    const {textColorPrimary, textColorSecondary} = useColors()
    const author = event.author

    return <>
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