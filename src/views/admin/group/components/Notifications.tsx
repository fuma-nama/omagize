import {GroupNotification, MentionNotification, useGroupNotificationsQuery} from "api/GroupAPI";
import React, {useContext} from "react";
import {PageContext} from "contexts/PageContext";
import {Button, Flex, Icon, Image, Text, useColorModeValue} from "@chakra-ui/react";

import Card from "components/card/Card";
import {GroupNotificationItem, NotificationSkeleton} from "components/card/notification/Notification";
import {Holder} from "../../../../utils/Container";

export function Notifications() {
    const {selectedGroup} = useContext(PageContext)
    const query = useGroupNotificationsQuery(selectedGroup)

    const textColor = useColorModeValue('secondaryGray.900', 'white');

    return <Card p='0px'>
        <Flex
            align={{ sm: 'flex-start', lg: 'center' }}
            justify='space-between'
            w='100%'
            px='22px'
            py='18px'>
            <Text color={textColor} fontSize='xl' fontWeight='600'>
                Notifications
            </Text>
            <Button variant='action'>Clear all</Button>
        </Flex>
        <Holder
            text="No Notifications" array={query.data}
            skeleton={
                <>
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                    <NotificationSkeleton />
                </>
            }
        >
            {() =>
                query.data.map((n, i) =>
                    <GroupNotificationItem key={i} {...n} />
                )
            }
        </Holder>
    </Card>
}
