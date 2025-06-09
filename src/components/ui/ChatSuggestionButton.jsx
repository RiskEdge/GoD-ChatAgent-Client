const ChatSuggestionButton = ({ prompt, onClick, isLoading }) => {
	return (
		<button
			disabled={isLoading}
			onClick={() => onClick(prompt)}
			className='bg-card h-10 w-fit p-3 mx-2 my-1 text-sm text-blue-400 bg-white border justify-center items-center text-center border-blue-300 font-bold rounded-md text-wrap shadow-sm transition-all duration-150 ease-in-out transform hover:scale-105'>
			{prompt}
		</button>
	);
};
export default ChatSuggestionButton;
