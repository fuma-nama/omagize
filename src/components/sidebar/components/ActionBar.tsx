import {Button, useDisclosure} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import CreateGroupModal from "../../modals/CreateGroup";

export default function ActionBar() {
    const {isOpen, onClose, onOpen} = useDisclosure()

    return <>
        <Button w='full' leftIcon={<AddIcon />} onClick={onOpen}>New Group</Button>
        <CreateGroupModal isOpen={isOpen} onClose={onClose} />
    </>
}