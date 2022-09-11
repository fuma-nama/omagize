// Chakra imports
import { Flex, Text } from '@chakra-ui/react';
import Card from 'components/card/Card';
// Custom components
import Menu from 'components/menu/MainMenu';
import {useUserNotificationsQuery} from "api/UserAPI";
import {useColors} from "variables/colors";
import UserNotificationItem from "components/card/notification/UserNotification";
import {NotificationSkeleton} from "components/card/notification/Notification";

export default function Notifications(props: { [x: string]: any }) {
	const { ...rest } = props;
	// Chakra Color Mode
	const {textColorPrimary} = useColors()

	const query = useUserNotificationsQuery()

	const notifications = query.data
	return (
		<Card p={1} mb='20px' {...rest}>
			<Flex p={5} align='center' w='100%' justify='space-between' >
				<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
					Notifications
				</Text>
				<Menu />
			</Flex>
			{notifications?
				notifications.map((n, i) =>
				<UserNotificationItem key={i} {...n} />
				) :
				<>
					<NotificationSkeleton />
					<NotificationSkeleton />
					<NotificationSkeleton />
				</>
			}
		</Card>
	);
}
