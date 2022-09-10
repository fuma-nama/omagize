// Chakra imports
import {
	Avatar,
	Box,
	Flex,
	Grid,
	SimpleGrid,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Text,
	useColorModeValue
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import {useUserQuery} from "../../../../api/UserAPI";
import {useGroupsQuery} from "../../../../api/GroupAPI";

function useColors() {

	return {
		textColorPrimary: useColorModeValue('secondaryGray.900', 'white'),
		textColorSecondary: 'gray.400',
		borderColor: useColorModeValue('white !important', '#111C44 !important')
	}
}
export default function Banner(props: any) {
	const query = useUserQuery()
	const groupsQuery = useGroupsQuery()

	// Chakra Color Mode
	const {textColorPrimary, textColorSecondary, borderColor} = useColors()
	const avatarSize = '120px'

	if (query.isLoading) return <BannerSkeleton />
	const user = query.data
	const groups = groupsQuery.data

	return (
		<Card mb={{ base: '0px', lg: '20px' }} alignItems='center' {...props}>
			<Box bgImg={user.bannerUrl} bgSize='cover' borderRadius='16px' h='200px' w='100%' />
			<Avatar mx='auto' src={user.avatarUrl} h={avatarSize} w={avatarSize} mt='-43px' border='4px solid' borderColor={borderColor} />
			<Text color={textColorPrimary} fontWeight='bold' fontSize='xl' mt='10px'>
				{user.username}
			</Text>
			<Text color={textColorSecondary} fontSize='sm'>
				{user.description}
			</Text>
			<SimpleGrid columns={2} mx='auto' mt='26px' gap={5}>
				<Flex alignItems='center' flexDirection='column'>
					{groups?
						<Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
							{groups.length}
						</Text> :
						<Skeleton w='60px' h='30px'/>
					}

					<Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
						Joined Groups
					</Text>
				</Flex>
				<Flex alignItems='center' flexDirection='column'>
					<Text color={textColorPrimary} fontSize='2xl' fontWeight='700'>
						{33}
					</Text>
					<Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
						Friends
					</Text>
				</Flex>
			</SimpleGrid>
		</Card>
	);
}

function BannerSkeleton(props: any) {
	const {textColorSecondary, borderColor} = useColors()
	const avatarSize = '120px'

	return <Card mb={{ base: '0px', lg: '20px' }} alignItems='center' {...props}>
		<Skeleton bgSize='cover' borderRadius='16px' h='200px' w='100%' />
		<SkeletonCircle mx='auto' h={avatarSize} w={avatarSize} mt='-43px' border='4px solid' borderColor={borderColor} />
		<Skeleton w='200px' h='30px' my='10px' />
		<SkeletonText w='300px' />
		<SimpleGrid columns={2} mx='auto' mt='26px' gap={5}>
			<Flex alignItems='center' flexDirection='column'>
				<Skeleton w='60px' h='30px' />
				<Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
					Joined Groups
				</Text>
			</Flex>
			<Flex alignItems='center' flexDirection='column'>
				<Skeleton w='60px' h='30px'/>
				<Text color={textColorSecondary} fontSize='sm' fontWeight='400'>
					Friends
				</Text>
			</Flex>
		</SimpleGrid>
	</Card>
}
