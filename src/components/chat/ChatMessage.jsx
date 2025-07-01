import TimeDisplay from '../TimeFormat';
// import bot from 'assets/robot-aassistant.png';
import bot from './../../assets/robot-assistant.png';

const ChatMessage = ({ message }) => {
	const isUser = message.role === 'user';

	const bgColor = isUser
		? 'bg-gradient-to-br from-cyan-500 via-sky-500 to-blue-600'
		: 'bg-gradient-to-r from-gray-50 via-gray-100 to-gray-200';
	const textColor = isUser ? 'text-white' : 'text-gray';
	const alignment = isUser ? 'justify-end' : 'justify-start';
	const timeColor = isUser ? 'text-white/80' : 'text-gray-600/70';
	const corner = isUser ? 'rounded-tr-none' : 'rounded-tl-none';

	return (
		<div className={` flex ${alignment} items-start`}>
			{!isUser && (
				<div
					className={`w-10 h-10 my-2 rounded-full ${bgColor} flex items-center justify-center font-bold ${textColor} object-fill`}>
					<img src={bot} alt='bot' />
				</div>
			)}
			<div
				className={`${bgColor} ${textColor} ${corner}
				sm:text-sm md:text-sm lg:text-sm rounded-2xl  px-6 py-2 m-2 flex max-w-xs sm:max-w-fit md:max-w-1/2 shadow-md flex-col`}>
				<div style={{ whiteSpace: 'pre-wrap' }}>{message.content}</div>
				<div className={`${timeColor} text-xs  my-1 flex justify-end`}>
					<TimeDisplay timestamp={message.timestamp} />
				</div>
			</div>
			{isUser && (
				<div
					className={`w-10 h-10 my-2 rounded-full ${bgColor} flex items-center justify-center font-bold ${textColor}`}>
					U
				</div>
			)}
		</div>
	);
};

export default ChatMessage;
