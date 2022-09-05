// Chakra imports
import {
	Avatar,
	AvatarGroup,
	Button,
	Flex,
	Heading,
	HStack,
	Image,
	Link,
	Text,
	useColorModeValue,
	VStack
} from '@chakra-ui/react';

// Assets
import {GroupDetail, useGroupDetailQuery} from "api/GroupAPI";
import {AvatarBg} from "variables/colors";
import {useContext} from "react";
import {PageContext} from "contexts/PageContext";

export default function Banner() {
	const {selectedGroup} = useContext(PageContext)
	const query = useGroupDetailQuery(selectedGroup)
	if (query.isLoading) return <></>

	return <Content group={query.data} />
}

function Content(props: {group: GroupDetail}) {
	const {group} = props
	const bg = useColorModeValue("brand.300", "brand.400")

	return (
		<Flex
			pos='relative'
			direction='row'
			overflow='hidden'
			borderRadius='30px'
			bg={group.banner? null : bg}
			align='center'
			p='20px' gap='20px'>
			{group.banner && <Image
				pos='absolute'
				src={group.banner} objectFit='cover'
				top='0' left='0'
				w='full' h='full'
				filter='auto'
				blur='sm'
				brightness={0.5}
			/>}
			<Avatar src={group.icon} name={group.name} bg={AvatarBg}
					display={{base: "none", md: "block"}}
					w={{base: "100px", "2xl": "200px"}} h={{base: "100px", "2xl": "200px"}}
			/>
			<Flex direction='column' pos='relative' align='start' gap='20px'>
				<Heading
					mt='40px'
					color='white'
					mb='20px'>
					{group.name}
				</Heading>
				<HStack>
					<AvatarGroup>
						{
							group.activeMembers.map(a => <Avatar key={a.id} src={a.avatar} name={a.username} />)
						}
					</AvatarGroup>
					<Text>{group.memberCount} Members</Text>
				</HStack>
			</Flex>
		</Flex>
	);
}