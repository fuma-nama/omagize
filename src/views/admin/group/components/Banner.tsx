// Chakra imports
import {
	AvatarGroup, Button,
	Flex,
	Heading,
	HStack,
	Image,
	Text,
	useColorModeValue, VStack,
} from '@chakra-ui/react';
import Avatar from "components/icons/Avatar"

// Assets
import {GroupDetail, useGroupDetailQuery} from "api/GroupAPI";
import React, {useContext} from "react";
import {PageContext, useGroupChat} from "contexts/PageContext";
import {toAvatarUrl} from "../../../../api/Media";

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
			<Avatar src={group.icon} name={group.name}
					top={{base: '20px', "3sm": 'unset'}}
					right={{base: '20px', "3sm": 'unset'}}
					pos={{base: 'absolute', "3sm": 'relative'}}
					w={{base: "50px", "3sm": "100px", "2xl": "200px"}}
					h={{base: "50px", "3sm": "100px", "2xl": "200px"}}
			/>

			<Flex color='white' direction='column' pos='relative' align='start' gap='20px'>
				<Heading
					mt='40px'>
					{group.name}
				</Heading>
				<HStack mt='20px'>
					<AvatarGroup max={5}>
						{
							group.membersPreview.map(a => <Avatar key={a.id} src={toAvatarUrl(a.avatarHash)} name={a.username} />)
						}
					</AvatarGroup>
					<Text>{group.memberCount} Members</Text>
				</HStack>
			</Flex>
		</Flex>
	);
}