const ChatMessage = ({ message }) => {
	const isUser = message.role === 'user';

	const bgColor = isUser ? 'bg-blue-500' : 'bg-gray-300';
	const textColor = isUser ? 'text-white' : 'text-gray';
	const alignment = isUser ? 'justify-end' : 'justify-start';

	return (
		<div className={` flex ${alignment}`}>
			<div
				className={`${bgColor} ${textColor}
				sm:text-sm md:text-sm lg:text-sm rounded-2xl px-6 py-2 m-2 flex max-w-xs sm:max-w-fit md:max-w-1/2 shadow-md`}>
				{message.content}
			</div>
		</div>
	);
};

export default ChatMessage;
