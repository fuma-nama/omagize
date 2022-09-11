// Chakra imports
import {Button, Flex, Text} from '@chakra-ui/react';
import Card from 'components/card/Card';
// Custom components
import {clearUserNotifications, useUserNotificationsQuery} from "api/UserAPI";
import {useColors} from "variables/colors";
import UserNotificationItem from "components/card/notification/UserNotification";
import {NotificationSkeleton} from "components/card/notification/Notification";
import {Holder} from "utils/Container";
import {useMutation} from "@tanstack/react-query";

export default function Notifications(props: { [x: string]: any }) {
	const { ...rest } = props;
	// Chakra Color Mode
	const {textColorPrimary} = useColors()

	const query = useUserNotificationsQuery()
	const mutation = useMutation(
		['clear_user_notifications'],
		() => clearUserNotifications()
	)

	return (
		<Card p={1} mb='20px' {...rest}>
			<Flex p={5} align='center' w='100%' justify='space-between' >
				<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
					Notifications
				</Text>
				<Button variant='action' onClick={() => mutation.mutate()} isLoading={mutation.isLoading}>Read All</Button>
			</Flex>
			<Holder array={query.data} placeholder="No Notifications" skeleton={
				<>
					<NotificationSkeleton />
					<NotificationSkeleton />
					<NotificationSkeleton />
				</>
			}>
				{() =>
					query.data.map((n, i) =>
						<UserNotificationItem key={i} {...n} />
					)
				}
			</Holder>
		</Card>
	);
}
