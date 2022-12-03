// Assets
import Nft1 from './assets/Nft1.png';
import Nft2 from './assets/Nft2.png';
import Nft3 from './assets/Nft3.png';
import Nft4 from './assets/Nft4.png';
import Nft5 from './assets/Nft5.png';
import Nft6 from './assets/Nft6.png';
import tableDataTopCreators from './variables/tableDataTopCreators';
import { tableColumnsTopCreators } from './variables/tableColumnsTopCreators';

import TableTopCreators from './components/TableTopCreators';
import HistoryItem from './components/HistoryItem';
import { Button, Flex, Text } from '@chakra-ui/react';
import { useColors } from '@omagize/ui/theme';
import { Card } from '@omagize/ui/components';

export function SidePanel() {
  return (
    <Card px="0px" mb="20px">
      <TableTopCreators tableData={tableDataTopCreators} columnsData={tableColumnsTopCreators} />
      <History />
    </Card>
  );
}

function History() {
  const { textColorPrimary } = useColors();

  return (
    <Card p="0px">
      <Flex
        align={{ sm: 'flex-start', lg: 'center' }}
        justify="space-between"
        w="100%"
        px="22px"
        py="18px"
      >
        <Text color={textColorPrimary} fontSize="xl" fontWeight="600">
          History
        </Text>
        <Button variant="action">See all</Button>
      </Flex>

      <HistoryItem
        name="Colorful Heaven"
        author="By Mark Benjamin"
        date="30s ago"
        image={Nft5}
        price="0.91 ETH"
      />
      <HistoryItem
        name="Abstract Colors"
        author="By Esthera Jackson"
        date="58s ago"
        image={Nft1}
        price="0.91 ETH"
      />
      <HistoryItem
        name="ETH AI Brain"
        author="By Nick Wilson"
        date="1m ago"
        image={Nft2}
        price="0.91 ETH"
      />
      <HistoryItem
        name="Swipe Circles"
        author="By Peter Will"
        date="1m ago"
        image={Nft4}
        price="0.91 ETH"
      />
      <HistoryItem
        name="Mesh Gradients "
        author="By Will Smith"
        date="2m ago"
        image={Nft3}
        price="0.91 ETH"
      />
      <HistoryItem
        name="3D Cubes Art"
        author="By Manny Gates"
        date="3m ago"
        image={Nft6}
        price="0.91 ETH"
      />
    </Card>
  );
}
