import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

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
		};

		fetchAndSetResults();
	}, [selectedTab]);

	return (
		<div className='results-section'>
			<div className='categories-list'>
				{categories.map((item) => (
					<div
						key={item.id}
						className='category-item'
						onClick={() => setSelectedCategory(item.id)}
					>
						{item.name}
					</div>
				))}
			</div>

			<div className='results'>
				{selectedCategory && (
					<div className='result-details'>
						{results
							.filter((result) => result.categoryId === selectedCategory)
							.map((result) => (
								<div key={result.categoryId}>
									<h3>{result.categoryName}</h3>
									<p>Ganador: {result.winner}</p>
									<p>Puntos: {result.points}</p>
								</div>
							))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ResultsSection;
