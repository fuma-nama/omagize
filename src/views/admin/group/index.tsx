import React, {useContext, useEffect} from "react";
// Chakra imports
import { Flex, Grid, Link, Text, useColorModeValue } from '@chakra-ui/react';

// Custom components
import Banner from './components/Banner';
import ActiveMembers from './components/ActiveMembers';
import Card from 'components/card/Card';
import {Link as RouterLink} from "react-router-dom"
import {PageContext} from "contexts/PageContext";
import {GroupDetail, useGroupDetailQuery} from "api/GroupAPI";
import { Notifications } from "./components/Notifications";

export default function GroupChat() {
    const {selectedGroup, setInfo} = useContext(PageContext)
    const query = useGroupDetailQuery(selectedGroup)
    useEffect(() => setInfo({title: query.isLoading? null : query.data.name}), [query.data])

    if (query.isLoading) {
        return <></>
    }

    return <Content group={query.data} />
}

function Content(props: {group: GroupDetail}) {
    const {group} = props
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorBrand = useColorModeValue('brand.500', 'white');

    return (
        <Grid
            mb='20px'
            gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
            gap={{ base: '20px', xl: '20px' }}
            display={{ base: 'block', xl: 'grid' }}>
            <Flex flexDirection='column' gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}>
                <Banner />
                <Flex direction='column'>
                    <Flex
                        mt='45px'
                        mb='20px'
                        justifyContent='space-between'
                        direction={{ base: 'column', md: 'row' }}
                        align={{ base: 'start', md: 'center' }}>
                        <Text color={textColor} fontSize='2xl' ms='24px' fontWeight='700'>
                            Trending NFTs
                        </Text>
                        <Flex
                            align='center'
                            me='20px'
                            ms={{ base: '24px', md: '0px' }}
                            mt={{ base: '20px', md: '0px' }}>
                            <Link
                                as={RouterLink}
                                color={textColorBrand}
                                fontWeight='500'
                                me={{ base: '34px', md: '44px' }}
                                to='#art'>
                                Art
                            </Link>
                            <Link
                                as={RouterLink}
                                color={textColorBrand}
                                fontWeight='500'
                                me={{ base: '34px', md: '44px' }}
                                to='#music'>
                                Music
                            </Link>
                            <Link
                                as={RouterLink}
                                color={textColorBrand}
                                fontWeight='500'
                                me={{ base: '34px', md: '44px' }}
                                to='#collectibles'>
                                Collectibles
                            </Link>
                            <Link as={RouterLink} color={textColorBrand} fontWeight='500' to='#sports'>
                                Sports
                            </Link>
                        </Flex>
                    </Flex>
                    <Flex direction='column' gap='20px' mb={{ base: '20px', xl: '0px' }}>

                    </Flex>
                </Flex>
            </Flex>
            <Flex direction='column' gap="20px" gridArea={{ xl: '1 / 3 / 2 / 4', '2xl': '1 / 2 / 2 / 3' }}>
                <Card px='0px'>
                    <ActiveMembers group={group} />
                </Card>
                <Notifications />
            </Flex>
        </Grid>
    );
}