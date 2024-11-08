import React, { useState } from "react";
import { toast } from "sonner";

const participants = ["Mati", "Aiden", "Agustin", "Row"];
const FALSE_CATEGORIES = ["Mati", "Aiden", "Agustin", "Row"];

function VotingSection({ categories, onVotesSubmit }) {
	const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0); // Categoría actual
	const [votes, setVotes] = useState(
		FALSE_CATEGORIES.map((category) => ({
			categoria: category.name,
			firstPlace: "",
			secondPlace: "",
		}))
	);

	const currentCategory = categories[currentCategoryIndex];

	// Actualizar los votos para la categoría actual
	const handleVoteChange = (place, value) => {
		setVotes(
			votes.map((vote, index) =>
				index === currentCategoryIndex ? { ...vote, [place]: value } : vote
			)
		);
	};

	// Función para manejar la selección del primer y segundo puesto
	const handleSelect = (participant) => {
		const currentVote = votes[currentCategoryIndex];
		if (currentVote.firstPlace === "") {
			handleVoteChange("firstPlace", participant); // Selecciona el primer puesto
		} else if (currentVote.secondPlace === "" && currentVote.firstPlace !== participant) {
			handleVoteChange("secondPlace", participant); // Selecciona el segundo puesto
		} else {
			toast.info(
				"Ya seleccionaste ambas posiciones. Para cambiar los votos reinicia la seleccion"
			);
		}
	};

	// Avanzar a la siguiente categoría
	const handleNextCategory = () => {
		if (currentCategoryIndex < categories.length - 1) {
			setCurrentCategoryIndex(currentCategoryIndex + 1);
		} else {
			onVotesSubmit(votes); // Cuando termine, enviar los votos
		}
	};

	const handlePrevCategory = () => {
		setCurrentCategoryIndex(currentCategoryIndex - 1);
	};

	const handleResetSelection = () => {
		handleVoteChange("firstPlace", "");
		handleVoteChange("secondPlace", "");
	};

	return (
		<div>
			<h2>{currentCategory.name}</h2>
            <p>{currentCategory.description}</p>

			<div className='grid'>
				{participants.map((participant) => (
					<button
						key={participant}
						className={`grid-item 
                            ${
								votes[currentCategoryIndex].firstPlace === participant
									? "selected-first"
									: ""
							}
                            {votes[currentCategoryIndex].secondPlace === participant ? "selected-second" : ""}=`}
						onClick={() => handleSelect(participant)}
						disabled={
							votes[currentCategoryIndex].firstPlace === participant ||
							votes[currentCategoryIndex].secondPlace === participant
						}
					>
						{participant}
					</button>
				))}
			</div>
			<div>
				<p>Primer puesto: {votes[currentCategoryIndex].firstPlace || "No seleccionado"}</p>
				<p>
					Segundo puesto: {votes[currentCategoryIndex].secondPlace || "No seleccionado"}
				</p>
			</div>
			<button onClick={handleResetSelection}>Reiniciar selección</button>

			<button onClick={handleNextCategory}>
				{currentCategoryIndex < categories.length - 1
					? "Siguiente categoría"
					: "Enviar votos"}
			</button>

			{currentCategoryIndex !== 0 && (
				<button onClick={handlePrevCategory}>Anterior categoría</button>
			)}
		</div>
	);
}

export default VotingSection;
