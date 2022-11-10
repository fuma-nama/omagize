import { Snowflake } from '@omagize/api';
import { useNavigate, useParams } from 'react-router-dom';

export function useSelected() {
  const { group } = useParams();
  const navigate = useNavigate();

  return {
    selectedGroup: group,
    setSelectedGroup(group: Snowflake) {
      navigate(`/user/${group}`);
    },
  };
}
