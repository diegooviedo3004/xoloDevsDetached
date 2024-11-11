import React from 'react';
import { Text } from 'react-native';

const FormattedDate = ({ style, date }) => {
    const dateObj = new Date(date);
    const now = new Date();

    const day = dateObj.getDate();
    const month = dateObj.getMonth();
    const year = dateObj.getFullYear();

    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    if (day === currentDay && month === currentMonth && year === currentYear) {
        return <Text style={style}>{dateObj.toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>;
    }
    else if (
        day === currentDay - 1 && month === currentMonth && year === currentYear ||
        currentDay === 1 && now.getMonth() - 1 === month && now.getFullYear() === year &&
        new Date(currentYear, currentMonth, 0).getDate() === day
    ) {
        return <Text style={style}>Ayer</Text>;
    }
    else {
        return <Text style={style}>{dateObj.toLocaleDateString()}</Text>;
    }
};

export default FormattedDate;
