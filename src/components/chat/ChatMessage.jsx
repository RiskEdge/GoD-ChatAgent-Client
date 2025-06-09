import TimeDisplay from '../TimeFormat';

const ChatMessage = ({ message }) => {
	const isUser = message.role === 'user';

	const bgColor = isUser ? 'bg-blue-500' : 'bg-gray-300';
	const textColor = isUser ? 'text-white' : 'text-gray';
	const alignment = isUser ? 'justify-end' : 'justify-start';
	const timeColor = isUser ? 'text-white/80' : 'text-gray-600/70';

	return (
		<div className={` flex ${alignment}`}>
			<div
				className={`${bgColor} ${textColor}
				sm:text-sm md:text-sm lg:text-sm rounded-2xl px-6 py-2 m-2 flex max-w-xs sm:max-w-fit md:max-w-1/2 shadow-md flex-col`}>
				<div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
				<div className={`${timeColor} text-xs  my-1 flex justify-end`}>
					<TimeDisplay timestamp={message.timestamp} />
				</div>
			</div>
		</div>
	);
};

export default ChatMessage;
