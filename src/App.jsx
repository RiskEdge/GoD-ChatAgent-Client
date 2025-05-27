import { useState, useEffect, useRef } from 'react';
import ChatMessage from './components/chat/ChatMessage';
import ChatInput from './components/chat/ChatInput';

function App() {
	const [messages, setMessages] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [currentBotMessage, setCurrentBotMessage] = useState(null);
	const currentBotMessageRef = useRef(null);
	// const [streamingMessageIndex, setStreamingMessageIndex] = useState(null);
	const bottomRef = useRef(null);
	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, currentBotMessage]);

	const ws = useRef(null);

	useEffect(() => {
		currentBotMessageRef.current = currentBotMessage;
	}, [currentBotMessage]);

	useEffect(() => {
		ws.current = new WebSocket('ws://localhost:8001/chat');

		ws.current.onopen = () => {
			console.log('WebSocket connection opened');
		};

		ws.current.onmessage = (event) => {
			const data = event.data;
			if (data === '[FINISH]') {
				ws.current.close();
			}

			if (data === '[END]') {
				if (currentBotMessageRef.current) {
					setMessages((prev) => [...prev, currentBotMessageRef.current]);
					setCurrentBotMessage(null);
					currentBotMessageRef.current = null;
				}
				setIsLoading(false);
			} else {
				setCurrentBotMessage((prev) => {
					if (prev) {
						return {
							...prev,
							content: prev.content + data,
						};
					} else {
						const botMessage = {
							id: Date.now().toString(),
							content: data,
							role: 'bot',
							timestamp: Date.now(),
						};
						return botMessage;
					}
				});
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
		<div className='w-1/2 h-screen max-h-screen flex flex-col items-center justify-center max-w-3xl m-auto'>
			<main className='flex flex-col flex-grow w-full overflow-y-scroll'>
				{/* {messages.length === 0 && !isLoading ? (
					<div>
						<ChatMessage
							message={{
								content: 'Hey there! How can I help you today?',
								role: 'bot',
							}}
						/>
					</div>
				) : ( */}
				<div>
					{messages.map((message, index) => (
						<ChatMessage key={index} message={message} />
					))}
					{currentBotMessage && <ChatMessage message={currentBotMessage} />}
				</div>
				{/* )} */}
				<div ref={bottomRef} />
			</main>

			<div className='sticky bottom-0 w-full'>
				<ChatInput onSendMessage={handleMessageSend} isLoading={isLoading} />
			</div>
		</div>
	);
}

export default App;
