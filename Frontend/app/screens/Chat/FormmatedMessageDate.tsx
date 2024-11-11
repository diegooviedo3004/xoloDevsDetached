import React from 'react';
import { Text } from 'react-native';

const FormattedMessageDate = ({ style, date }) => {
    const dateObj = new Date(date);
    const now = new Date();

    const isToday = (someDate) => {
        return someDate.getDate() === now.getDate() &&
            someDate.getMonth() === now.getMonth() &&
            someDate.getFullYear() === now.getFullYear();
    };

    const isYesterday = (someDate) => {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        return someDate.getDate() === yesterday.getDate() &&
            someDate.getMonth() === yesterday.getMonth() &&
            someDate.getFullYear() === yesterday.getFullYear();
    };

    const formatTime = (someDate) => {
        let hours = someDate.getHours();
        const minutes = someDate.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const formatDateTime = (someDate) => {
        const day = someDate.getDate();
        const month = someDate.getMonth() + 1;
        const year = someDate.getFullYear();
        return `${day}/${month}/${year} ${formatTime(someDate)}`;
    };

    const getFormattedDate = () => {
        if (isToday(dateObj)) {
            return `hoy a las ${formatTime(dateObj)}`;
        } else if (isYesterday(dateObj)) {
            return `ayer a las ${formatTime(dateObj)}`;
        } else {
            return formatDateTime(dateObj);
        }
    };

    return (
        <Text style={style}>{getFormattedDate()}</Text>
    );
};

export default FormattedMessageDate;
