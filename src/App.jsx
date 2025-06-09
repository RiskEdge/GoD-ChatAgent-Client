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

	const [currentBotMessage, setCurrentBotMessage] = useState(null);
	const currentBotMessageRef = useRef(null);
	const bottomRef = useRef(null);
	const textBufferRef = useRef('');

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, currentBotMessage]);

	const ws = useRef(null);

	useEffect(() => {
		currentBotMessageRef.current = currentBotMessage;
	}, [messages, currentBotMessage]);

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8001/chat');

		ws.current.onopen = () => {
			console.log('WebSocket connection opened');
		};

		ws.current.onmessage = (event) => {
			const data = event.data;

			if (data === '[END]') {
				// if (currentBotMessageRef.current) {
				// 	setMessages((prev) => [...prev, currentBotMessageRef.current]);
				// 	setCurrentBotMessage(null);
				// 	currentBotMessageRef.current = null;
				// }

				try {
					const fullResponse = JSON.parse(textBufferRef.current);
					const { response, options } = fullResponse;

					const botMessage = {
						id: Date.now().toString(),
						content: response,
						role: 'bot',
						timestamp: Date.now(),
					};
					setMessages((prev) => [...prev, botMessage]);
					setCurrentBotMessage(null);
					currentBotMessageRef.current = null;
					textBufferRef.current = '';
					setOptions(options || []);
					setIsLoading(false);
				} catch (err) {
					console.log(err);
					setIsLoading(false);
					setOptions([]);
				}
			} else {
				textBufferRef.current += data;
				// setCurrentBotMessage((prev) => {
				// 	if (prev) {
				// 		const updated = {
				// 			...prev,
				// 			content: prev.content + data,
				// 		};
				// 		currentBotMessageRef.current = updated;
				// 		return updated;
				// 	} else {
				// 		const botMessage = {
				// 			id: Date.now().toString(),
				// 			content: data,
				// 			role: 'bot',
				// 			timestamp: Date.now(),
				// 		};
				// 		currentBotMessageRef.current = botMessage;
				// 		return botMessage;
				// 	}
				// });

				// try {
				// 	textBufferRef.current += data;
				// 	setCurrentBotMessage({
				// 		id: Date.now().toString(),
				// 		content: textBufferRef.current,
				// 		role: 'bot',
				// 		timestamp: Date.now(),
				// 	});
				// } catch (err) {
				// 	console.error('Failed to parse JSON: ', err);
				// }
			}
		};

		ws.current.onclose = () => {
			console.log('WebSocket connection closed');
		};

		ws.current.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		return () => {
			if (ws.current && ws.current.readyState === WebSocket.OPEN) {
				ws.current.close();
			}
		};
	}, []);

	const handleMessageSend = async (content) => {
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

	return (
		<div className=' w-full md:w-3/4 lg:w-1/2 h-screen max-h-screen flex flex-col items-center justify-center max-w-3xl my-1 mx-0 md:mx-auto lg:mx-auto border border-gray-300 p-3'>
			<main className='flex flex-col flex-grow w-full overflow-y-scroll'>
				{messages.length === 0 && !isLoading ? (
					<div className='flex flex-grow items-center justify-center'>
						<ChatWelcome
							onSuggestionClick={handleMessageSend}
							isLoadingAiResponse={isLoading}
						/>
					</div>
				) : (
					<div>
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

			<div className='sticky bottom-0 w-full'>
				<ChatInput onSendMessage={handleMessageSend} isLoading={isLoading} />
			</div>
		</div>
	);
}

export default App;
