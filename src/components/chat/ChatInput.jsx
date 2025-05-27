import { useRef, useState } from 'react';

const ChatInput = ({ onSendMessage, isLoading }) => {
	const [inputValue, setInputValue] = useState('');
	const textareaRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setInputValue('');
		await onSendMessage(inputValue.trim());
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.focus();
		}
	};

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto';
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<form className='w-full p-4 bg-background/80 backdrop-blur-sm'>
			<div className='flex items-end space-x-2'>
				<input
					ref={textareaRef}
					type='text'
					placeholder='Type your message here'
					className='w-full flex-1 p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					value={inputValue}
					onKeyDown={handleKeyDown}
					onChange={handleInputChange}
				/>
				<button
					type='submit'
					disabled={isLoading || !inputValue.trim()}
					className='bg-blue-200 rounded py-2 px-4 hover:bg-blue-400 hover:text-white font-medium'>
					Send
				</button>
			</div>
		</form>
	);
};

export default ChatInput;
