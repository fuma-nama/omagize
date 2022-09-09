// chakra imports
import {Box, Flex, Stack} from '@chakra-ui/react';
//   Custom components
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import SidebarCard from 'components/sidebar/components/SidebarCard';
import {useGroupsQuery} from "../../../api/GroupAPI";
import {ChatGroup, ChatGroupSkeleton} from "../../card/ChatGroup";
import {useContext} from "react";
import {PageContext} from "../../../contexts/PageContext";
import ActionBar from "./ActionBar";

// FUNCTIONS

function SidebarContent(props: { routes: RoutesType[] }) {
	const { routes } = props;
	const query = useGroupsQuery()
	const {selectedGroup} = useContext(PageContext)

	// SIDEBAR
	return (
		<Flex direction='column' height='100%' pt='25px' borderRadius='30px' overflow='auto'>
			<Brand />
			<Stack direction='column' mt='18px' mb='auto'>
				<Box ps='10px'>
					<Links routes={routes} />
				</Box>
				<Box px='10px'>
					<ActionBar />
				</Box>

				<Flex direction='column' ps='10px' gap={3}>
					{
						query.isLoading?
							<>
								<ChatGroupSkeleton />
								<ChatGroupSkeleton />
							</>:
							query.data.map(group => <ChatGroup key={group.id} group={group} active={selectedGroup === group.id} />)
					}
				</Flex>
			</Stack>

			<Box ps='20px' pe={{ lg: '16px', '2xl': '20px' }} mt='60px' mb='40px' borderRadius='30px'>
				<SidebarCard />
			</Box>
		</Flex>
	);
}

export default SidebarContent;
