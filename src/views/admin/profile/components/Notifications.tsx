// Chakra imports
import {Button, Flex, Text} from '@chakra-ui/react';
import Card from 'components/card/Card';
// Custom components
import Menu from 'components/menu/MainMenu';
import {UserNotification, useUserNotificationsQuery} from "api/UserAPI";
import {useColors} from "variables/colors";
import UserNotificationItem from "components/card/notification/UserNotification";
import {NotificationSkeleton} from "components/card/notification/Notification";
import {Holder} from "../../../../utils/Container";
import {GroupNotification} from "../../../../api/GroupAPI";

export default function Notifications(props: { [x: string]: any }) {
	const { ...rest } = props;
	// Chakra Color Mode
	const {textColorPrimary} = useColors()

	const query = useUserNotificationsQuery()

	return (
		<Card p={1} mb='20px' {...rest}>
			<Flex p={5} align='center' w='100%' justify='space-between' >
				<Text color={textColorPrimary} fontWeight='bold' fontSize='2xl' mb='4px'>
					Notifications
				</Text>
				<Button variant='action'>Read All</Button>
			</Flex>
			<Holder array={query.data} text="No Notifications" skeleton={
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
