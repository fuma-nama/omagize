import { mode } from '@chakra-ui/theme-tools';
import {Dict} from "@chakra-ui/utils";

export const modalStyles: Dict = {
    components: {
        Modal: {
            parts: ['content'],
            baseStyle: {
                dialog: {
                    bg: "navy.900"
                },
            },
        }
    }
}