import React, { useState } from "react";
import { toast } from "sonner";

function VotingSection({ categories, onVotesSubmit, handleLogout }) {
	const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
	const [votes, setVotes] = useState(
		categories.map((category) => ({
			category: category.id,
			selectedParticipant: "",
		}))
	);

	const currentCategory = categories[currentCategoryIndex];
	const participants = currentCategory.participants;

	const handleVoteChange = (participantId) => {
		setVotes(
			votes.map((vote, index) =>
				index === currentCategoryIndex
					? { ...vote, selectedParticipant: participantId }
					: vote
			)
		);
	};

	const handleNextCategory = () => {
		const currentVote = votes[currentCategoryIndex];
		if (currentVote.selectedParticipant === "") {
			toast.info("Debes seleccionar un participante antes de continuar.");
		} else {
			if (currentCategoryIndex < categories.length - 1) {
				setCurrentCategoryIndex(currentCategoryIndex + 1);
			} else {
				onVotesSubmit(votes); // Enviar votos al finalizar
			}
		}
	};

	const handlePrevCategory = () => {
		setCurrentCategoryIndex(currentCategoryIndex - 1);
	};

	return (
		<div className='w-full max-w-4xl p-6 mx-auto text-white bg-[#000816] bg-opacity-50 rounded-lg shadow-md backdrop-blur-md'>
			{/* Título */}
			<h2 className='mb-8 text-6xl font-bold text-center uppercase text-primary'>
				{currentCategory.name}
			</h2>

			{/* Video */}
			<iframe
				src='https://www.youtube.com/embed/2UsXEsJzOu8/'
				frameBorder='0'
				className='w-full h-[450px] rounded-lg'
				allowFullScreen
			></iframe>

			{/* Participantes */}
			<div className='grid grid-cols-3 gap-4 mt-8'>
				{participants.map((participant) => {
					const isSelected =
						votes[currentCategoryIndex].selectedParticipant === participant.id;

					return (
						<div
							key={participant.id}
							onClick={() => handleVoteChange(participant.id)}
							className={`relative cursor-pointer transition-all duration-300 ${
								isSelected
									? "transform -translate-y-2 opacity-100 grayscale-0"
									: "opacity-50 hover:opacity-100 grayscale hover:grayscale-0"
							}`}
						>
							<img
								src={`/assets/participants-pictures/${participant.image}`}
								alt={participant.name}
								className='object-cover w-full h-full rounded-lg'
							/>
						</div>
					);
				})}
			</div>

			{/* Navegación */}
			<div className='flex justify-between mt-8 space-x-4'>
				{currentCategoryIndex !== 0 && (
					<button
						onClick={handlePrevCategory}
						className='px-4 py-2 font-semibold text-white rounded-lg bg-secondary'
					>
						Anterior categoría
					</button>
				)}
				<button
					onClick={handleNextCategory}
					className='px-6 py-3 ml-auto font-semibold text-black rounded-lg bg-primary'
				>
					{currentCategoryIndex < categories.length - 1
						? "Siguiente categoría"
						: "Enviar votos"}
				</button>
				<button
					className='px-4 py-2 font-semibold text-white rounded-lg bg-secondary'
					onClick={handleLogout}
				>
					Logout
				</button>
			</div>
		</div>
	);
}

export default VotingSection;
