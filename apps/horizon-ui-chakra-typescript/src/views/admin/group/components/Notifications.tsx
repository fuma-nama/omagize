import {
    clearGroupNotifications,
    useGroupNotificationsQuery
} from "api/NotificationsAPI";
import React, {useContext} from "react";
import {PageContext} from "contexts/PageContext";
import {Button, Flex, Text, useColorModeValue} from "@chakra-ui/react";

import Card from "components/card/Card";
import {GroupNotificationItem, NotificationSkeleton} from "components/card/notification/Notification";
import {ArrayHolder, Holder} from "utils/Container";
import {useMutation} from "@tanstack/react-query";

export function Notifications() {
    const {selectedGroup} = useContext(PageContext)
    const query = useGroupNotificationsQuery(selectedGroup)
    const mutation = useMutation(
        ['clear_group_notifications'],
        () => clearGroupNotifications()
    )

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
            <Button variant='action' isLoading={mutation.isLoading} onClick={() => mutation.mutate()}>Clear all</Button>
        </Flex>
        <ArrayHolder
            placeholder="No Notifications" array={query.data}
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
                    <GroupNotificationItem key={n.id} {...n} />
                )
            }
        </ArrayHolder>
    </Card>
}
