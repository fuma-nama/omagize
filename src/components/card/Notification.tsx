import {GroupNotification, MentionNotification} from "api/GroupAPI";
import {Flex, Icon, Text, useColorModeValue} from "@chakra-ui/react";
import {useItemHoverBg} from "../../variables/colors";
import Card from "./Card";
import {GoMention} from "react-icons/go";
import React from "react";

export function GroupNotificationItem(props: GroupNotification & any) {
    switch (props.type) {
        case "mention": return <MentionNotificationItem {...props} />
        default: return <></>
    }
}

function MentionNotificationItem(props: MentionNotification) {
    const { author, date } = props;

    // Chakra Color Mode
    const textColor = useColorModeValue('brands.900', 'white');
    const bgItem = useItemHoverBg()
    const textColorDate = useColorModeValue('secondaryGray.600', 'white');

    return (
        <Card _hover={bgItem} bg='transparent' boxShadow='unset' px='24px' py='21px' transition='0.2s linear'>
            <Flex direction='row' align='center' justify='center' gap='12px'>
                <Flex bg='brand.400' p='10px' rounded='xl'>
                    <Icon as={GoMention} color={textColor} width='30px' height='30px' />
                </Flex>
                <Flex
                    direction='column'
                    me={{ base: '4px', md: '32px', xl: '10px', '3xl': '32px' }}>
                    <Text
                        color={textColor}
                        fontSize='md'
                        mb='5px'
                        fontWeight='bold'>
                        {author.username} Mentioned You
                    </Text>
                </Flex>
                <Text ms='auto' fontWeight='700' fontSize='sm' color={textColorDate}>
                    {date.toLocaleTimeString()}
                </Text>
            </Flex>
        </Card>
    );
}