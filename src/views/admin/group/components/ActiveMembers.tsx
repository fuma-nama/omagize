import {
  Box,
  Button,
  Flex, HStack, Image,
  Text,
  useColorModeValue, useToken, VStack,
} from "@chakra-ui/react";
import React from "react";
import {GroupDetail, Member} from "api/GroupAPI";
import Card from "components/card/Card";
import Avatar from "components/icons/Avatar"

export default function ActiveMembers(props: { group: GroupDetail}) {
  const { group } = props;

  const textColor = useColorModeValue("navy.700", "white");

  return (
      <Flex
        direction='column'
        w='100%'>
        <Flex
          align={{ sm: "flex-start", lg: "center" }}
          justify='space-between'
          w='100%'
          px='22px'
          pb='20px'
          mb='10px'
          boxShadow='0px 40px 58px -20px rgba(112, 144, 176, 0.26)'>
          <Text color={textColor} fontSize='xl' fontWeight='600'>
            Active Members
          </Text>
          <Button variant='action'>All Members</Button>
        </Flex>
        <VStack>
          {
            group.activeMembers.map(member => <MemberCard key={member.id} member={member} />)
          }
        </VStack>
      </Flex>
  );
}

function MemberCard(props: {member: Member}) {
  const {member} = props
  const [brand] = useToken("color", ["brand.400"])

  return <Card
      _hover={{opacity: 0.5, cursor: 'pointer'}}
      transition='0.2s linear'
      overflow='hidden'
      pos='relative'>
    <Box
        pos='absolute'
        top={0} left={0}
        w='full' h='full'
        bgGradient={member.avatar? null : `linear-gradient(to right, transparent 30%, ${brand})`}
        css={{maskImage: "linear-gradient(to right, transparent 30%, black)"}}>
      {member.avatar && <Image
          w='full' h='full'
          src={member.avatar}
          objectFit="cover"
          filter='auto'
          brightness={0.5}/>
      }
    </Box>

    <HStack gap='10px' pos='relative'>
      <Avatar name={member.username} src={member.avatar} variant='normal' />
      <Text fontSize='xl' fontWeight='bold'>{member.username}</Text>
    </HStack>
  </Card>
}