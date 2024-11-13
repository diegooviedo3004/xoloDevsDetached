import { useDispatch, useSelector } from 'react-redux';
import api from "../axios/api";
import {setActiveChat, setChats} from "../redux/reducer/chatReducer";
import {setActivePost, setActiveTraceability, setPosts} from "../redux/reducer/postReducer";

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

interface usePostStore {
    posts: Post[];
    activePost: Post | null;
    startLoadingPosts: () => Promise<void>;
    startSetActivePost: (id: Number) => Promise<void>;
}

export const usePostStore = (): usePostStore => {
    const { posts,activePost, activeTraceability  } = useSelector((state: any) => state.post);
    const dispatch = useDispatch();

    const startLoadingPosts = async (): Promise<void> => {
        try {
            const { data } = await api.get('/posts/');
            dispatch(setPosts(data.slice(0, 30)));
        } catch (error) {
            console.error(error);
        }
    };

    const startSetActivePost = async (id: Number): Promise<void> => {
        try {
            const { data } = await api.get(`/posts/${id}/`);
            dispatch(setActivePost(data));
        } catch (error) {
            console.error(error);
        }
    };

    const startSetActiveTraceability = async (id: Number): Promise<void> => {
        try {
            const { data } = await api.get(`/posts-detail/${id}/`);
            dispatch(setActiveTraceability(data));
        } catch (error) {
            console.error(error);
        }
    };

    return {
        posts,
        activePost,
        startLoadingPosts,
        startSetActivePost,
        startSetActiveTraceability,
        activeTraceability,
    };
};
