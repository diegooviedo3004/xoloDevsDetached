import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
    id: number;
    images: { image: string }[];
    created_at: string;
    updated_at: string;
    title: string;
    description: string;
    sex: "Hembra" | "Macho";
    breed: string;
    location: string;
    lat: string;
    long: string;
    starting_price: string;
    weight: string;
    traceability: boolean;
    lot: boolean;
    post_type: "Post" | "Auction";
    video_url: string;
    is_approved: boolean;
    is_active: boolean;
}

interface PostState {
    posts: Post[];
    activePost: Post | null;
}

const initialState: PostState = {
    posts: [],
    activePost: null,
    activeTraceability: null
};

export const postSlice = createSlice({
    name: 'postSlice',
    initialState,
    reducers: {
        setActivePost: (state, action: PayloadAction<Post | null>) => {
            state.activePost = action.payload;
        },
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        },
        setActiveTraceability: (state, action: PayloadAction<Post[]>) => {
            state.activeTraceability = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setActivePost, setPosts, setActiveTraceability } = postSlice.actions;

export default postSlice.reducer;
