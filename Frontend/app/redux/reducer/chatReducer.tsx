import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    other_user: string;
    last_message: Message;
}

interface ChatState {
    chats: Chat[];
    activeChat: Chat | null;
}

const initialState: ChatState = {
    chats: [],
    activeChat: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setActiveChat: (state, action: PayloadAction<Chat | null>) => {
            state.activeChat = action.payload;
        },
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setActiveChat, setChats } = chatSlice.actions;

export default chatSlice.reducer;
