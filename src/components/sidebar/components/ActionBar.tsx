import {Button, HStack, SimpleGrid} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";

export default function ActionBar() {
    return <Button w='full' leftIcon={<AddIcon />}>New Group</Button>
}