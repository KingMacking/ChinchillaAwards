import React, { useState } from "react";
import { toast } from "sonner";

function VotingClipsSection({ categories, onVotesSubmit, handleLogout, goBack }) {
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
			toast.info("Debes seleccionar una opción antes de continuar.");
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
				src={`https://www.youtube.com/embed/${currentCategory.videoUrl}`}
				className='w-full rounded-lg aspect-video'
				allowFullScreen
			></iframe>

			{/* Lista de participantes */}
			<div className='mt-8 space-y-4'>
				{participants.map((participant) => {
					const isSelected =
						votes[currentCategoryIndex].selectedParticipant === participant.id;

					return (
						<div
							key={participant.id}
							onClick={() => handleVoteChange(participant.id)}
							className={`cursor-pointer p-4 text-lg font-semibold border rounded-lg transition-all duration-300 ${
								isSelected ? "bg-primary text-black border-primary" : "bg-transparent text-white"
							}`}
						>
							{participant.clipName} - {participant.authorName}
						</div>
					);
				})}
			</div>

			{/* Navegación */}
			<div className='flex items-center gap-2 mt-8'>
				<button
					onClick={goBack}
					className='px-6 py-3 font-semibold text-white rounded-lg bg-secondary'
				>
					Atras
				</button>
				{currentCategoryIndex !== 0 && (
					<button
						onClick={handlePrevCategory}
						className='px-6 py-3 font-semibold text-white rounded-lg bg-secondary'
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
			</div>
		</div>
	);
}

export default VotingClipsSection;
