import Card from "./Card";
import {Group} from "../../api/GroupAPI";
import {Avatar, Box, Image, SkeletonCircle, SkeletonText, Text} from "@chakra-ui/react";
import {PageContext} from "../../contexts/PageContext";
import {useContext} from "react";
import FadeImage from "./utils/FadeImage";

export function ChatGroup(props: {group: Group, active: boolean}) {
    const {group, active} = props
    const activeColor = "brand.400"
    const {setSelectedGroup} = useContext(PageContext)

    return <Box
        transition='0.2s linear'
        mr={active? '5px' : '10px'}
        filter='auto' brightness={active? 1 : 0.7}
        onClick={() => setSelectedGroup(group.id)}
        _hover={{ cursor: 'pointer' }}>
        <Card pos='relative' overflow='hidden'>
            <FadeImage
                src={group.bannerHash}
                direction='to left'
                placeholder={activeColor}
                bg={active? activeColor : 'black'}
                image={{
                    filter: 'auto', brightness: active? 0.9 : 0.7
                }}
            />

            <Box pos='relative' maxW='70%' color='white'>
                <Avatar name={group.name} src={group.iconHash} />
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