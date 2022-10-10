import {Button, useDisclosure} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import CreateGroupModal from "../../modals/CreateGroup";
import {DynamicModal} from "../../modals/Modal";

export default function ActionBar() {
    const {isOpen, onClose, onOpen} = useDisclosure()

    return <>
        <Button w='full' leftIcon={<AddIcon />} onClick={onOpen} mb={3}>New Group</Button>
        <DynamicModal isOpen={isOpen}>
            <CreateGroupModal isOpen={isOpen} onClose={onClose} />
        </DynamicModal>
    </>
}