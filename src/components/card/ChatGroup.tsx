import Card from "./Card";
import {Group} from "../../api/GroupAPI";
import {Avatar, Box, Image, SkeletonCircle, SkeletonText, Text} from "@chakra-ui/react";
import {PageContext} from "../../contexts/PageContext";
import {useContext} from "react";

export function ChatGroup(props: {group: Group, active: boolean}) {
    const {group, active} = props
    const activeColor = "brand.400"
    const {setSelectedGroup} = useContext(PageContext)

    return <Box
        mr={active? '5px' : '10px'}
        filter='auto' brightness={active? 1 : 0.7}
        onClick={() => setSelectedGroup(group.id)}
        _hover={{ cursor: 'pointer' }}>
        <Card pos='relative' overflow='hidden'>
            <Box top={0} left={0} w='full' h='full' pos='absolute' bg={active? activeColor : 'black'}>
                <Image alt="banner"
                       css={{maskImage: `linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0))`}}
                       src={group.banner} objectFit='cover' filter='auto' brightness={0.7} />
            </Box>

            <Box pos='relative' maxW='70%'>
                <Avatar name={group.name} src={group.icon} />
                <Text mt={3} fontSize='lg' fontWeight='bold' lineHeight={1}>{group.name}</Text>
            </Box>
        </Card>
    </Box>
}

export function ChatGroupSkeleton() {
    return <Box mr='10px'>
        <Card bg='black' overflow='hidden'>
            <SkeletonCircle size='10'/>
            <SkeletonText mt='3' noOfLines={2} spacing='4' />
        </Card>
    </Box>
}