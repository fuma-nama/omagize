import {
    Flex,
    useColorModeValue,
} from "@chakra-ui/react";
import { fetchMessagesBefore, fetchMessagesLatest, Message} from "../../api/MessageAPI";
import {useInfiniteQuery} from "@tanstack/react-query";
import {createContext, MutableRefObject, useContext, useEffect, useMemo, useRef} from "react";
import {PageContext} from "../../contexts/PageContext";
import {useInView} from "react-intersection-observer";
import MessageItem, { MessageItemSkeleton } from "components/card/chat/MessageItem";

export default function ChatView() {
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorBrand = useColorModeValue('brand.500', 'white');
    const {selectedGroup} = useContext(PageContext)

    const [ready, ref] = useBottomScroll()
    const {
        data,
        error,
        fetchPreviousPage,
        hasPreviousPage,
        isFetching,
    } = useInfiniteQuery(["messages", selectedGroup],
        ({ pageParam }) => pageParam == null?
            fetchMessagesLatest(selectedGroup) :
            fetchMessagesBefore(selectedGroup, pageParam), {
            refetchOnMount: false,
            getPreviousPageParam: (first) => first[0],
    })

    function mapPage(messages: Message[]) {
        return messages.map(message => <MessageItem key={message.id} {...message} />)
    }

    return <Flex
        ref={ref}
        overflow='auto'
        direction="column-reverse" h='full' minH='400px' gap={2}
    >
        {data == null? null : [].concat(...data.pages.map(mapPage)).reverse()}
        {hasPreviousPage && <LoadingBlock isFetching={isFetching || !ready} onFetch={() => fetchPreviousPage()}/>}
    </Flex>
}

function useBottomScroll(): [boolean, MutableRefObject<HTMLDivElement>, () => void] {
    const ref = useRef<HTMLDivElement>()
    const scroll = () => {
        const element = ref.current
        if (element) {
            console.log("scrolled", element.scrollTop, element.scrollHeight)
            element.scrollTo(element.scrollLeft, element.scrollHeight)
        }
    }
    const ready = useMemo<boolean>(
        () => {
            scroll()
            return !!ref.current
        },
        [ref.current]
    )

    return [ready, ref, scroll]
}

function LoadingBlock(props: {isFetching: boolean, onFetch: () => void}) {
    const [ref] = useInView({
        onChange(inView) {
            if (inView && !props.isFetching) {
                props.onFetch()
            }
        }
    })
    return <Flex gap={2} direction="column" ref={ref}>
        <MessageItemSkeleton noOfLines={2} />
        <MessageItemSkeleton noOfLines={1} />
        <MessageItemSkeleton noOfLines={6} />
        <MessageItemSkeleton noOfLines={3} />
    </Flex>
}