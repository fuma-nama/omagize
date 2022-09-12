import {
    Button,
    Flex,
    Text,
    useColorModeValue, VStack,
} from "@chakra-ui/react";
import React from "react";
import {GroupDetail} from "api/GroupAPI";
import UserItem from "../../../../components/card/UserItem";

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
            group.activeMembers.map(member => <UserItem key={member.id} user={member} />)
          }
        </VStack>
      </Flex>
  );
}