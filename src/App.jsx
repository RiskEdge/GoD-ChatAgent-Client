import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/chat/ChatMessage';
import ChatInput from './components/chat/ChatInput';

import loader from './assets/loader.gif';
import ChatWelcome from './components/chat/ChatWelcome';
import ChatSuggestionButton from './components/ui/ChatSuggestionButton';

function App() {
	const [messages, setMessages] = useState([]);
	const [options, setOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [textValue, setTextValue] = useState('');
	const [userId, setUserId] = useState('');
	const [errorMessage, setErrorMessage] = useState('');

	const [currentBotMessage, setCurrentBotMessage] = useState(null);
	const currentBotMessageRef = useRef(null);
	const bottomRef = useRef(null);
	const textBufferRef = useRef('');

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, currentBotMessage]);

	const ws = useRef(null);
	// const userId = 'user1234';

	useEffect(() => {
		currentBotMessageRef.current = currentBotMessage;
	}, [messages, currentBotMessage]);

	useEffect(() => {
		const conversationId = userId + '-conversation-id';
		ws.current = new WebSocket(
			`wss://${
				import.meta.env.VITE_WEBSOCKET_URL
			}/chat/${userId}?conversation_id=${conversationId}`
		);

		ws.current.onopen = () => {
			console.log('WebSocket connection opened');
		};

		ws.current.onmessage = (event) => {
			const data = event.data;

			if (!data || data === '[END]') {
				console.log('Received an empty or END message, ignoring.');
				setIsLoading(false); // Make sure to turn off loading
				return;
			}

			// NON-STREAMING RESPONSE
			try {
				const fullResponse = JSON.parse(data);
				const { response, options } = fullResponse;

				const botMessage = {
					id: Date.now().toString(),
					content: response,
					role: 'bot',
					timestamp: Date.now(),
				};
				setMessages((prev) => [...prev, botMessage]);
				// setCurrentBotMessage(null);
				// currentBotMessageRef.current = null;
				// textBufferRef.current = '';
				setOptions(options || []);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
				setIsLoading(false);
				setOptions([]);
			}

			// STREAMING RESPONSE
			// if (data === '[END]') {
			// 	try {
			// 		const fullResponse = JSON.parse(textBufferRef.current);
			// 		const { response, options } = fullResponse;

			// 		const botMessage = {
			// 			id: Date.now().toString(),
			// 			content: response,
			// 			role: 'bot',
			// 			timestamp: Date.now(),
			// 		};
			// 		setMessages((prev) => [...prev, botMessage]);
			// 		setCurrentBotMessage(null);
			// 		currentBotMessageRef.current = null;
			// 		textBufferRef.current = '';
			// 		setOptions(options || []);
			// 		setIsLoading(false);
			// 	} catch (err) {
			// 		console.log(err);
			// 		setIsLoading(false);
			// 		setOptions([]);
			// 	}
			// } else {
			// 	textBufferRef.current += data;
			// 	// setIsLoading(false);
			// }
		};

		ws.current.onclose = () => {
			console.log('WebSocket connection closed');
			setIsLoading(false);
		};

		ws.current.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		return () => {
			if (ws.current && ws.current.readyState === WebSocket.OPEN) {
				ws.current.close();
			}
		};
	}, [userId]);

	const handleMessageSend = async (content) => {
		if (!userId || userId === '') {
			setErrorMessage('Please enter a user id to proceed!');
		}
		const userMessage = {
			id: Date.now().toString(),
			content: content,
			role: 'user',
			timestamp: Date.now(),
		};
		setMessages((prev) => {
			const updated = [...prev, userMessage];
			console.log('', updated);
			return updated;
		});
		setIsLoading(true);
		setCurrentBotMessage(null);
		textBufferRef.current = '';
		setOptions([]);

		try {
			if (ws.current && ws.current.readyState === WebSocket.OPEN) {
				ws.current.send(content);
			} else {
				console.log('WebSocket is not open');
			}
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const handleUserIdChange = (event) => {
		setTextValue(event.target.value);
		// console.log(userId);
	};

	const handleUserIdKeyDown = (event) => {
		if (event.key === 'Enter') {
			setUserId(textValue);
		}
	};

	const handleUserIdBlur = (event) => {
		if (!userId || userId.trim() === '') {
			setErrorMessage('Please enter a user id to proceed!');
		} else {
			setErrorMessage('');
		}
	};

	return (
		<div className='relative w-full md:w-3/4 lg:w-1/2 h-screen max-h-screen flex flex-col items-center justify-center max-w-3xl mt-0 mb-1 mx-0 md:mx-auto lg:mx-auto border border-gray-300 p-3'>
			<div className='absolute top-0 left-0 min-h-15 mb-2 w-full bg-gradient-to-r from-blue-600 to-violet-600 text-lg font-bold text-white flex flex-col  px-4 pt-3'>
				<p>{userId}</p>

				<p className='mt-1 mb-0 text-gray-200 text-sm text-start font-light'>
					Chatting with AI Bot
				</p>
			</div>
			<main className='flex flex-col flex-grow w-full overflow-y-auto'>
				{(!userId || userId === '') && (
					<div className='flex flex-col flex-grow mx-2 items-center justify-center'>
						<textarea
							value={textValue}
							rows='1'
							placeholder='Enter user id'
							onBlur={handleUserIdBlur}
							onKeyDown={handleUserIdKeyDown}
							onChange={handleUserIdChange}
							className='font-bold text-black flex items-center justify-center w-full resize-none
								 border-1 py-1 px-3'></textarea>
						{errorMessage && (
							<p className='text-red-500 text-sm font-light mt-2'>{errorMessage}</p>
						)}
					</div>
				)}
				{userId && userId !== '' && messages.length === 0 && !isLoading ? (
					<div className='flex flex-grow mx-2 items-center justify-center'>
						<ChatWelcome
							onSuggestionClick={handleMessageSend}
							isLoadingAiResponse={isLoading}
						/>
					</div>
				) : (
					<div className='my-14'>
						{messages.map((message, index) => (
							<ChatMessage key={index} message={message} />
						))}

						{/* Loader */}
						{isLoading &&
							messages.length > 0 &&
							messages[messages.length - 1].role === 'user' && (
								<img src={loader} alt='loading' width={50} height={50} />
							)}

						{/* Bot Streaming Message */}
						{/* {currentBotMessage && <ChatMessage message={currentBotMessage} />} */}

						{/* Options shown after full bot response */}
						{!isLoading && options.length > 0 && (
							<div className='flex flex-wrap w-3/4'>
								{options.map((option, index) => (
									<ChatSuggestionButton
										key={index}
										prompt={option}
										onClick={handleMessageSend}
										isLoading={isLoading}
									/>
								))}
							</div>
						)}
					</div>
				)}
				<div ref={bottomRef} />
			</main>

			{userId && userId !== '' && (
				<div className='sticky bottom-0 w-full'>
					<ChatInput onSendMessage={handleMessageSend} isLoading={isLoading} />
				</div>
			)}
		</div>
	);
}

export default App;
