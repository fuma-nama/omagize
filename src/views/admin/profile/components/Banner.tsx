// Chakra imports
import {
	Avatar,
	Box,
	Flex,
	IconButton,
	SimpleGrid,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	Text,
	useDisclosure
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import {useUserQuery} from "api/UserAPI";
import {useGroupsQuery} from "api/GroupAPI";
import {useColors} from "variables/colors";
import {EditIcon} from "@chakra-ui/icons";
import EditAccountModal from "components/modals/EditAccount";

export default function Banner(props: any) {
	const query = useUserQuery()
	const groupsQuery = useGroupsQuery()
	const {isOpen, onOpen, onClose} = useDisclosure()

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
			<Flex direction='row' pos='relative' mt='10px'>
				<Text color={textColorPrimary} fontWeight='bold' fontSize='xl'>
					{user.username}
				</Text>
				<IconButton
					minH='30px' h='full' aria-label='Edit Profile'
					pos='absolute' left='100%' ml={2} icon={<EditIcon />}
					onClick={onOpen}
				/>
			</Flex>
			<EditAccountModal isOpen={isOpen} onClose={onClose} />

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
