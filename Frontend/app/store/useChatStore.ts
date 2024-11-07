import { useDispatch, useSelector } from 'react-redux';
import api from "../axios/api";
import {setActiveChat, setChats} from "../redux/reducer/chatReducer";

interface Message {
    id: Number;
    sender: Number,
    content: string,
    timestamp: string,
    is_read: boolean,
    is_deleted: boolean,
}

interface Chat {
    id: Number;
    other_user_id: Number;
    other_user: string;
    last_message: Message;
}

interface UseChatStore {
    chats: Chat[];
    activeChat: Chat | null;
    startLoadingChats: () => Promise<void>;
    startSetActiveChat: (id: Number) => Promise<void>;
}

export const useChatStore = (): UseChatStore => {
    const { chats, activeChat } = useSelector((state: any) => state.chat);
    const dispatch = useDispatch();

    const startLoadingChats = async (): Promise<void> => {
        try {
            const { data } = await api.get('/chat/conversations/');
            dispatch(setChats(data));
        } catch (error) {
            console.error(error);
        }
    };

    const startSetActiveChat = async (id: Number): Promise<void> => {
        try {
            const { data } = await api.get(`/chat/conversations/${id}/`);
            dispatch(setActiveChat(data));
        } catch (error) {
            console.error(error);
        }
    };

    return {
        chats,
        activeChat,
        startLoadingChats,
        startSetActiveChat,
    };
};
