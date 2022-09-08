import {Avatar as Base} from "@chakra-ui/react";
import {AvatarProps} from "@chakra-ui/avatar/dist/declarations/src/avatar";

export default function Avatar(props: AvatarProps) {
    return <Base {...props} bg='brand.300' color='white' />
}