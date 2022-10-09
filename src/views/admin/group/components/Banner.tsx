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
import {GroupDetail, useGroupDetailQuery, useGroupMembersQuery} from "api/GroupAPI";
import React, {useContext} from "react";
import {PageContext, useGroupChat} from "contexts/PageContext";
import {toAvatarUrl, toIconUrl} from "../../../../api/utils/Media";

export default function Banner() {
	const {selectedGroup} = useContext(PageContext)
	const query = useGroupDetailQuery(selectedGroup)
	if (query.isLoading) return <></>

	return <Content group={query.data} />
}

function Content(props: {group: GroupDetail}) {
	const {group} = props
	const bg = useColorModeValue("brand.300", "brand.400")
	const membersQuery = useGroupMembersQuery(group.id)

	return (
		<Flex
			pos='relative'
			direction='row'
			overflow='hidden'
			borderRadius='30px'
			bg={group.bannerHash? null : bg}
			align='center'
			p='20px' gap='20px'>
			{group.bannerHash && <Image
				pos='absolute'
				src={group.bannerHash} objectFit='cover'
				top='0' left='0'
				w='full' h='full'
				filter='auto'
				blur='sm'
				brightness={0.5}
			/>}
			<Avatar src={group.iconHash} name={group.name}
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
							membersQuery.isSuccess &&
							membersQuery.data.pages[0].map(member =>
								<Avatar key={member.id} src={toAvatarUrl(member.id, member.avatarHash)} name={member.username} />
							)
						}
					</AvatarGroup>
					<Text>{group.memberCount} Members</Text>
				</HStack>
			</Flex>
		</Flex>
	);
}