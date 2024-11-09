import React, { useState } from "react";
import { toast } from "sonner";

function VotingSection({ categories, onVotesSubmit, participants }) {
	const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
	const [votes, setVotes] = useState(
		categories.map((category) => ({
			category: category.id,
			firstPlace: "",
			secondPlace: "",
		}))
	);
	console.log(votes);

	const currentCategory = categories[currentCategoryIndex];

	const handleVoteChange = (place, value) => {
		setVotes(
			votes.map((vote, index) =>
				index === currentCategoryIndex ? { ...vote, [place]: value } : vote
			)
		);
	};

	const handleSelect = (participant) => {
		const currentVote = votes[currentCategoryIndex];
		if (currentVote.firstPlace === "") {
			handleVoteChange("firstPlace", participant);
		} else if (currentVote.secondPlace === "" && currentVote.firstPlace !== participant) {
			handleVoteChange("secondPlace", participant);
		} else {
			toast.info(
				"Ya seleccionaste ambas posiciones. Reinicia la selección para cambiar los votos."
			);
		}
	};

	const handleNextCategory = () => {
		const currentVote = votes[currentCategoryIndex];
		if (currentVote.firstPlace === "" || currentVote.secondPlace === "") {
			toast.info("Debes seleccionar ambos puestos antes de continuar.");
		} else {
			if (currentCategoryIndex < categories.length - 1) {
				setCurrentCategoryIndex(currentCategoryIndex + 1);
			} else {
				onVotesSubmit(votes); // Cuando termine, enviar los votos
			}
		}
	};

	const handlePrevCategory = () => {
		setCurrentCategoryIndex(currentCategoryIndex - 1);
	};

	const handleResetSelection = () => {
		setVotes(
			votes.map((vote, index) =>
				index === currentCategoryIndex ? { ...vote, firstPlace: "", secondPlace: "" } : vote
			)
		);
	};

	const getParticipantName = (id) => {
		const participant = participants.find((p) => p.id === id);
		if (participant) {
			return `${participant.name.split(" ")[0]} "${participant.nickname}" ${participant.name.split(" ").slice(1).join(" ")}`;
		}
		return "";
	};

	return (
		<div className='w-full max-w-lg p-6 mx-auto text-white bg-black bg-opacity-50 rounded-lg shadow-md backdrop-blur-md'>
			<h2 className='mb-2 text-4xl font-bold text-center text-transparent bg-clip-text bg-gold-gradient'>
				{currentCategory.name}
			</h2>
			<p className='mb-2 text-center text-white text-balance'>{currentCategory.description}</p>
			<p className='mb-8 text-xl font-bold text-center text-white'>{currentCategoryIndex + 1}/{categories.length}</p>

			<div className='grid grid-cols-4 gap-4 mb-2'>
				{participants.map((participant) => (
					<button
						key={participant.id}
						onClick={() => handleSelect(participant.id)}
						className={`relative p-2 rounded-lg overflow-hidden bg-center bg-cover min-h-28
							${votes[currentCategoryIndex].firstPlace === participant.id ? "ring-4 ring-primary" : ""}
							${votes[currentCategoryIndex].secondPlace === participant.id ? "ring-4 ring-secondary" : ""}
							ring-2 ring-gray-600`}
						style={{ backgroundImage: `url(/assets/participants-pictures/${participant.image})` }}
					>
						{/* Indicador de primer o segundo puesto */}
						{votes[currentCategoryIndex].firstPlace === participant.id && (
							<span className='absolute flex items-center justify-center px-2 py-1 font-bold bg-black rounded-full text-md w-7 h-7 top-2 right-2 text-primary'>
								1
							</span>
						)}
						{votes[currentCategoryIndex].secondPlace === participant.id && (
							<span className='absolute flex items-center justify-center px-2 py-1 font-bold bg-black rounded-full text-md w-7 h-7 top-2 right-2 text-secondary'>
								2
							</span>
						)}

						<div className='absolute inset-x-0 bottom-0 p-2 font-semibold text-center text-white bg-gradient-to-t from-black to-transparent'>
							{participant.nickname || participant.name}
						</div>
					</button>
				))}
			</div>

			<div className='flex flex-col items-start justify-between my-10 mt-4'>
				{(votes[currentCategoryIndex].firstPlace ||
					votes[currentCategoryIndex].secondPlace) && (
					<button
						onClick={handleResetSelection}
						className='px-4 py-2 mb-8 text-white border rounded-lg border-secondary'
					>
						Reiniciar selección
					</button>
				)}
				<div>
					<p className='mb-2 text-lg'>
						Primer puesto:{" "}
						<span className='font-bold'>
							{getParticipantName(votes[currentCategoryIndex].firstPlace) ||
								"No seleccionado"}
						</span>
					</p>
					<p className='text-lg'>
						Segundo puesto:{" "}
						<span className='font-bold'>
							{getParticipantName(votes[currentCategoryIndex].secondPlace) ||
								"No seleccionado"}
						</span>
					</p>
				</div>
			</div>

			<div className='flex justify-between mt-4 space-x-4'>
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
			</div>
		</div>
	);
}

export default VotingSection;
