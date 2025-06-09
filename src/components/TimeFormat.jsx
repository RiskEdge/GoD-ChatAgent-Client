import React from 'react';

function TimeDisplay({ timestamp }) {
	const date = new Date(timestamp);
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const formattedTime = `${hours}:${minutes}`;

	return <span>{formattedTime}</span>;
}

export default TimeDisplay;
