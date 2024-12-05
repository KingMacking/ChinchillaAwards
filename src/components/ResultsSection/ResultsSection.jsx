import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const ResultsSection = ({ selectedTab, categories }) => {
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [results, setResults] = useState([]);

	// Simulamos la obtención de votos desde los archivos JSON locales
	const fetchVotes = async () => {
		try {
			const tableName =
				selectedTab === "categories"
					? "chinchilla-awards-votes-categories"
					: "chinchilla-awards-votes-clips";

			const { data, error } = await supabase.from(tableName).select("user_votes");
			console.log(data);

			if (error) {
				toast.error("Error al obtener los votos.");
				console.error(error);
				return [];
			}

			return data.map((entry) => entry.user_votes).flat(); // Flatten los votos
		} catch (error) {
			toast.error("Error al obtener los votos.");
			console.error(error);
		}
	};

	// Calcular los resultados de los votos para la categoría seleccionada
	const calculateResults = (votesData, categories) => {
		const voteCounts = {};

		// Contamos los votos para cada participante por categoría
		votesData.forEach((vote) => {
			const { category, selectedParticipant } = vote;

			if (!voteCounts[category]) {
				voteCounts[category] = {};
			}

			voteCounts[category][selectedParticipant] =
				(voteCounts[category][selectedParticipant] || 0) + 1;
		});

		// Creamos los resultados finales con el participante más votado en cada categoría
		const results = Object.keys(voteCounts).map((categoryId) => {
			const categoryVotes = voteCounts[categoryId];

			const sortedParticipants = Object.entries(categoryVotes)
				.sort((a, b) => b[1] - a[1]) // Orden descendente por votos
				.map(([participantId, points]) => ({
					participantId,
					points,
				}));

			const winner = sortedParticipants[0]; // El ganador es el primero en la lista
			const categoryName = categories.find((c) => c.id === parseInt(categoryId)).name;

			return {
				categoryId,
				categoryName,
				winner: winner.participantId,
				points: winner.points,
			};
		});

		return results;
	};

	// Obtén los votos y calcula los resultados cuando la categoría o el clip cambian
	useEffect(() => {
		const fetchAndSetResults = async () => {
			const votesData = await fetchVotes();
			const resultsData = calculateResults(votesData, categories);

			setResults(resultsData);
			console.log(resultsData);
		};

		fetchAndSetResults();
	}, [selectedTab]);

	return (
		<div className='w-full max-w-4xl p-6 mx-auto text-white bg-[#000816] bg-opacity-50 rounded-lg shadow-md backdrop-blur-md'>
			{/* Lista de categorías */}
			<div className='grid grid-cols-1 gap-4 mb-8'>
				{categories.map((item) => (
					<div
						key={item.id}
						className='p-4 transition-all duration-200 rounded-lg cursor-pointer category-item hover:bg-secondary'
						onClick={() => setSelectedCategory(item.id)}
					>
						<h3 className='text-xl text-center text-primary'>{item.name}</h3>
					</div>
				))}
			</div>

			{/* Resultados */}
			<div className='mt-8'>
				{selectedCategory && (
					<div className='result-details'>
						{results
							.filter((result) => result.categoryId === selectedCategory)
							.map((result) => (
								<div
									key={result.categoryId}
									className='bg-[#000816] bg-opacity-60 p-4 rounded-lg shadow-md mb-6'
								>
									<h3 className='text-2xl text-primary'>{result.categoryName}</h3>
									<p className='text-white'>Ganador: {result.winner}</p>
									<p className='text-white'>Puntos: {result.points}</p>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ResultsSection;
