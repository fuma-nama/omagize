import { GenericItem, GroupNotificationItem } from './Notification';
import { AiFillWarning } from 'react-icons/ai';
import {
  LoginNotification,
  UserNotification,
} from '../../../api/types/Notifications';

export default function UserNotificationItem(props: UserNotification) {
  switch (props.type) {
    case 'login':
      return <LoginNotificationItem {...props} />;
    case 'mention':
      return <GroupNotificationItem {...props} />;
  }
}

function LoginNotificationItem({ from, time }: LoginNotification) {
  return (
    <GenericItem
      icon={AiFillWarning}
      title={`New Login From ${from}`}
      description={`Something Logged in to your Account From ${from}`}
      time={time.toLocaleTimeString()}
    />
  );
}