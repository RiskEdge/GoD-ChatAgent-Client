import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/chat/ChatMessage';
import ChatInput from './components/chat/ChatInput';

import loader from './assets/loader.gif';
import ChatWelcome from './components/chat/ChatWelcome';
import ChatSuggestionButton from './components/ui/ChatSuggestionButton';
import GeekCard from './components/ui/GeekCard';

function App() {
	const [messages, setMessages] = useState([]);
	const [fetchedChatHistory, setFetchedChatHistory] = useState(false);
	const [options, setOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isGeekOption, setIsGeekOption] = useState(false);
	const [geeks, setGeeks] = useState([]);

	const [textValue, setTextValue] = useState('');
	const [userId, setUserId] = useState('');
	const [conversationId, setConversationId] = useState('');
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

	const getChatHistory = async () => {
		const chatHistory = await fetch(
			`${import.meta.env.VITE_SERVER_URL}/chat/chat_history/${conversationId}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		).then(async (res) => {
			if (res.ok) {
				const data = await res.json();
				if (!data[0]) return;
				if (data[0].chat_messages.length === 0) return;
				// console.log(data);
				const formattedMessages = data[0].chat_messages.map((message) => {
					return {
						id: Date.now().toString(),
						content: message.message,
						role: message.sender,
						timestamp: message.sentAt,
					};
				});
				setMessages(formattedMessages);
				setFetchedChatHistory(true);
			}
		});
	};

	useEffect(() => {
		if (userId) {
			if (messages.length <= 0) {
				getChatHistory();
			}
		}
	}, [userId]);

	useEffect(() => {
		currentBotMessageRef.current = currentBotMessage;
	}, [messages, currentBotMessage]);

	useEffect(() => {
		// setConversationId(userId + '-conversation-id');
		ws.current = new WebSocket(
			`${import.meta.env.VITE_WEBSOCKET_URL}/chat/${userId}?conversation_id=${conversationId}`
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
				console.log(response);

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
				if (response === 'Please select a Geek to proceed') {
					const geekOptions = JSON.parse(options[0]);
					const suitableGeeks = geekOptions.geeks;
					console.log(suitableGeeks);
					setGeeks(suitableGeeks);
					setIsGeekOption(true);
					setOptions([]);
				} else {
					setGeeks([]);
					setIsGeekOption(false);
					setOptions(options || []);
				}
				setIsLoading(false);
			} catch (error) {
				console.log(error);
				setIsLoading(false);
				setOptions([]);
				setGeeks([]);
				setIsGeekOption(false);
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
				<p>The connection has been closed.</p>;
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
			// console.log('', updated);
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
			setConversationId(textValue + '-conversation-id');
		}
	};

	const handleUserIdBlur = (event) => {
		if (!userId || userId.trim() === '') {
			setErrorMessage('Please enter a user id to proceed!');
		} else {
			setErrorMessage('');
		}
	};

	const handleGeekCardClick = (geek) => {
		console.log(geek);
	};

	const handleClearConversation = async () => {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/chat/delete/${conversationId}`,
				{
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			if (response.ok) {
				setMessages([]);
				setFetchedChatHistory(false);
				console.log('Chat history deleted successfully');
			} else {
				console.error('Failed to delete chat history');
			}
		} catch (error) {
			console.error('Error deleting chat history:', error);
		}
	};

	const handleContinueChat = async () => {
		setFetchedChatHistory(true);
		if (ws.current && ws.current.readyState === WebSocket.CLOSED) {
			ws.current = new WebSocket(
				`${
					import.meta.env.VITE_WEBSOCKET_URL
				}/chat/${userId}?conversation_id=${conversationId}`
			);
		}

		if (ws.current && ws.current.readyState === WebSocket.OPEN) {
			console.log('WebSocket connection opened to continue chat with agent.');
			setIsLoading(true);
			ws.current.send(
				JSON.stringify({
					action: 'continue_conversation',
					chat_history: messages.map((message) => ({
						role: message.role,
						message: message.content,
					})),
				})
			);
		}
		setFetchedChatHistory(false);
	};

	return (
		<div className='relative w-full md:w-3/4 lg:w-1/2 h-screen max-h-screen flex flex-col items-center justify-center max-w-3xl mt-0 mb-1 mx-0 md:mx-auto lg:mx-auto border border-gray-300 p-3'>
			<div className='absolute justify-between top-0 left-0 min-h-15 mb-2 w-full bg-gradient-to-r from-blue-600 to-violet-600 text-lg font-bold text-white flex flex-row px-4 pt-3'>
				<div className='flex flex-col justify-between'>
					<p>{userId}</p>

					<p className='mt-1 mb-0 text-gray-200 text-sm text-start font-light'>
						Chatting with AI Bot
					</p>
				</div>
				<button
					onClick={handleClearConversation}
					className='flex items-center w-fit font-medium right-0 border border-white px-3 mx-1 my-2 bg-transparent rounded-full text-wrap shadow-sm transition-all duration-150 ease-in-out transform hover:scale-105'>
					Clear
				</button>
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

						{fetchedChatHistory && (
							<div className='flex flex-col items-center mx-auto my-3 justify-center border border-gray-300 p-3 w-1/2'>
								<p className='font-bold mb-3'>Continue chat?</p>
								<div className='flex flex-row gap-x-6'>
									<button
										onClick={handleContinueChat}
										className='bg-blue-400 px-4 py-1 rounded-lg text-white border border-blue-400 hover:scale-105'>
										Yes
									</button>
									<button
										onClick={handleClearConversation}
										className=' px-4 py-1 rounded-lg border border-blue-400 hover:bg-blue-400 hover:text-white hover:scale-105'>
										No
									</button>
								</div>
							</div>
						)}

						{/* Bot Streaming Message */}
						{/* {currentBotMessage && <ChatMessage message={currentBotMessage} />} */}

						{/* Options shown after full bot response */}

						{!isLoading && isGeekOption && geeks.length > 0 ? (
							<div className='flex flex-wrap w-full'>
								{geeks.map((geek, index) => (
									<GeekCard
										// className='m-2'
										key={index}
										geekData={geek}
										handleGeekCardClick={handleGeekCardClick}
									/>
								))}
							</div>
						) : (
							<div>
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
