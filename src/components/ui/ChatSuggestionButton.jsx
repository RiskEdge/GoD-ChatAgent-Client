const ChatSuggestionButton = ({ prompt, onClick, isLoading }) => {
	return (
		<button
			disabled={isLoading}
			onClick={() => onClick(prompt)}
			className='bg-card w-fit py-1 px-2 mx-1 my-1 text-[12px] text-blue-400 bg-white border justify-center items-center text-center border-blue-300 font-bold rounded-full text-wrap shadow-sm transition-all duration-150 ease-in-out transform hover:scale-105'>
			{/* // className='bg-card w-fit py-1 px-2 mx-1 my-1 text-[12px] text-white bg-gradient-to-r from-blue-500 to-violet-500 border justify-center items-center text-center border-blue-300 rounded-full text-wrap shadow-sm transition-all duration-150 ease-in-out transform hover:scale-105'> */}
			{prompt}
		</button>
	);
};
export default ChatSuggestionButton;
