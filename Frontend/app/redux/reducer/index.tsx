import { combineReducers } from 'redux';
import drawerReducer from './drawerReducer';
import cartReducer from './cartReducer';
import wishListReducer from './wishListReducer';
import chatReducer from "./chatReducer";
import postReducer from "./postReducer";

const rootReducer = combineReducers({
    drawer: drawerReducer,
    cart: cartReducer,
    wishList : wishListReducer,
    chat: chatReducer,
    post: postReducer,
});

export default rootReducer;