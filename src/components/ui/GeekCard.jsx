import {
	Card,
	CardHeader,
	CardBody,
	CardFooter,
	Typography,
	Button,
	Tooltip,
	IconButton,
} from '@material-tailwind/react';

const GeekCard = ({ geekData, handleGeekCardClick }) => {
	return (
		<Card className='w-1/3 shadow-lg p-2 m-2 text-wrap rounded-2xl'>
			<CardHeader floated={false} color='blue-gray'>
				<img
					src='https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
					alt='ui/ux review check'
				/>
				{/* <div className='to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 ' /> */}
			</CardHeader>
			<CardBody>
				<div className='mb-3 flex items-center justify-between'>
					<Typography variant='h5' color='blue-gray' className='font-medium text-xl'>
						{geekData.fullName.first} {geekData.fullName.last}
					</Typography>
					{/* <Typography color='blue-gray' className='flex items-center gap-1.5 font-normal'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 24 24'
							fill='currentColor'
							className='-mt-0.5 h-5 w-5 text-yellow-700'>
							<path
								fillRule='evenodd'
								d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
								clipRule='evenodd'
							/>
						</svg>
						5.0
					</Typography> */}
				</div>
				<Typography color='gray' className='text-sm text-gray-600'>
					<span className='font-bold '>Primary Skill:</span> {geekData.primarySkillName}
				</Typography>
				{geekData.secondarySkillsNames.length > 0 && (
					<Typography color='gray' className='text-sm text-gray-600'>
						<span className='font-bold'>Secondary Skills:</span>{' '}
						{geekData?.secondarySkillsNames?.map((skill) => (
							<Typography>{skill}</Typography>
						))}
					</Typography>
				)}
				<Typography color='gray' className='text-sm text-gray-600'>
					<span className='font-bold'>Years of Experience:</span> {geekData.yoe}
				</Typography>
			</CardBody>
			<CardFooter className='pt-3 bottom-0'>
				<Button
					onClick={handleGeekCardClick}
					size='lg'
					fullWidth={true}
					variant='gradient'
					className='bg-gradient-to-r from-blue-500 to-violet-500 p-1 rounded-xl'>
					Choose
				</Button>
			</CardFooter>
		</Card>
	);
};
export default GeekCard;
