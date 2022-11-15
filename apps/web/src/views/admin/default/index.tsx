// Chakra imports
import {
  Avatar,
  Flex,
  FormLabel,
  HStack,
  Icon,
  Select,
  SimpleGrid,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
// Assets
import Usa from 'assets/img/dashboards/usa.png';
// Custom components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdAddTask, MdAttachMoney, MdBarChart, MdFileCopy } from 'react-icons/md';
import Banner from './components/Banner';
import { useGroupEventsQuery, useSelfUser } from '@omagize/api';
import { GlobalGroupEventItem, GroupEventSkeleton } from 'components/card/GroupEventItem';
import Friends from './components/Friends';
import { Carousel, LeftButton, Provider, RightButton } from 'chakra-ui-carousel';

export default function UserReports() {
  // Chakra Color Mode
  const user = useSelfUser();
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  return (
    <Flex direction="column" gap={5} mb={10}>
      <Banner user={user} />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }} gap="20px" mt="20px">
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />}
            />
          }
          name="Earnings"
          value="$350.4"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />}
            />
          }
          name="Spend this month"
          value="$642.39"
        />
        <MiniStatistics growth="+23%" name="Sales" value="$574.34" />
        <MiniStatistics
          endContent={
            <Flex me="-16px" mt="10px">
              <FormLabel htmlFor="balance">
                <Avatar src={Usa} />
              </FormLabel>
              <Select id="balance" variant="mini" mt="5px" me="0px" defaultValue="usd">
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gba">GBA</option>
              </Select>
            </Flex>
          }
          name="Your balance"
          value="$1,000"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
              icon={<Icon w="28px" h="28px" as={MdAddTask} color="white" />}
            />
          }
          name="New Tasks"
          value="154"
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdFileCopy} color={brandColor} />}
            />
          }
          name="Total Projects"
          value="2935"
        />
      </SimpleGrid>
      <Events />
      <Friends />
    </Flex>
  );
}

function Events() {
  const query = useGroupEventsQuery();

  const empty = query.data != null && query.data.length === 0;
  if (empty) return <></>;
  return (
    <Flex direction="column" gap={3}>
      <Provider>
        <HStack>
          <Text fontSize="2xl" fontWeight="700">
            Group Events
          </Text>
          <LeftButton variant="action" />
          <RightButton variant="action" />
        </HStack>
        <Carousel
          gap={20}
          children={
            query.data != null
              ? query.data.map((event) => (
                  <GlobalGroupEventItem key={event.id} event={event} minW="fit-content" />
                ))
              : [<GroupEventSkeleton />, <GroupEventSkeleton />, <GroupEventSkeleton />]
          }
        />
      </Provider>
    </Flex>
  );
}
