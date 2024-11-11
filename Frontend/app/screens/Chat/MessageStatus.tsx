import React from 'react';
import { View, Text } from 'react-native';

const MessageStatus = ({ messageList, index, data, user_id, style }) => {
    const isLastMessage = messageList.length - 1 === index;
    const isRead = data.is_read && data.sender === user_id;
    const isSent = data.sender === user_id;

    return (
        <>
            {isLastMessage && isRead ? (
                <Text style={style}>Visto</Text>
            ) : isLastMessage && isSent ? (
                <Text style={style}>Enviado</Text>
            ) : null}
        </>
    );
};

export default MessageStatus;