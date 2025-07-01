import React, { useEffect, useState } from 'react';
import Skeleton from '../ui/Skeleton';
import ChatSuggestionButton from '../ui/ChatSuggestionButton';

const ChatWelcome = ({ onSuggestionClick, isLoadingAiResponse }) => {
	const [prompts, setPrompts] = useState([]);
	const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

	const loadInitialPrompts = async () => {
		setIsLoadingPrompts(true);
		try {
			const result = await fetch(
				`${import.meta.env.VITE_SERVER_URL}/geek_query/get_service_categories`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				}
			)
				.then((res) => {
					if (!res.ok) {
						throw new Error(res.statusText);
					} else {
						return res.json();
					}
				})
				.then((data) => {
					// console.log(data);
					const categories = data.categories
						// .slice(0, 5)
						.map((category) => category.title);
					setPrompts(categories);
					return data.categories;
				});
			// console.log(result);
		} catch (err) {
			console.error('Failed to load initial prompts form the database: ', err);
			setPrompts(['Laptop Issues', 'Desktop Issues', 'Printer Issues']);
		} finally {
			setIsLoadingPrompts(false);
		}
	};

	useEffect(() => {
		setIsLoadingPrompts(true);
		loadInitialPrompts();
	}, []);

	return (
		<div className='flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-100 to-violet-100 shadow-xl border border-blue-300 rounded-md p-6'>
			{/* <div className='flex flex-col items-center justify-center bg-gray-200/40 shadow-xl border border-gray-300 rounded-md p-6'> */}
			<h1 className='text-3xl font-bold text-gray-600 '>Welcome to GoDChat</h1>
			<p className='text-gray-500 text-center text-sm m-4'>
				I'm an AI aassistant to collect information about your device.
				<br />
				What service are you looking for?
			</p>
			<div className='flex items-center justify-center flex-wrap'>
				{isLoadingPrompts ? (
					<>
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</>
				) : (
					prompts.map((prompt, index) => (
						<ChatSuggestionButton
							key={index}
							prompt={prompt}
							onClick={() => onSuggestionClick(prompt)}
							isLoading={isLoadingAiResponse}
						/>
					))
				)}
			</div>
		</div>
	);
};
export default ChatWelcome;
