import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const ResultsSection = ({ selectedTab, categories }) => {
	const [selectedCategory, setSelectedCategory] = useState(1);
	const [results, setResults] = useState([]);
	console.log(categories);

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
				.map(([participantId, points]) => {
					// Buscamos al participante por su ID dentro de la categoría
					const participant = categories
						.find((c) => c.id === parseInt(categoryId))
						.participants.find((p) => p.id === parseInt(participantId));

					return {
						participantId,
						points,
						name: participant.name,
						img: `/assets/participants-pictures/${participant.image}`,
					};
				});

			const categoryName = categories.find((c) => c.id === parseInt(categoryId)).name;

			return {
				categoryId: parseInt(categoryId),
				categoryName,
				results: sortedParticipants, // Devolvemos todos los participantes ordenados
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

	console.log(results);

	const currentResults = results.filter((result) => result.categoryId === selectedCategory);
	return (
		<div className='w-full max-w-4xl p-6 mx-auto text-white bg-[#000816] bg-opacity-50 rounded-lg shadow-md backdrop-blur-md'>
			{/* Lista de categorías */}
			<div className='flex items-start'>
				<div className='flex flex-col flex-[1]'>
					{categories.map((item) => {
						console.log(item);
						return (
							<button
								key={item.id}
								className={`px-4 py-2 text-lg transition-all duration-200 rounded-lg cursor-pointer category-item border border-transparent text-white uppercase hover:border-secondary ${
									selectedCategory === item.id
										? "bg-primary text-white font-bold hover:text-white"
										: ""
								} `}
								onClick={() => setSelectedCategory(item.id)}
								type='button'
							>
								{item.name}
							</button>
						);
					})}
				</div>

				{/* Resultados */}
				<div className='flex-[3]'>
					{selectedCategory && (
						<div className='result-details'>
							{/* Top 3 */}
							<div className='mb-8'>
								{results
									.filter((result) => result.categoryId === selectedCategory)
									.map((result, index) => (
										<div key={result.participantId} className='mb-6'>
											{index < 3 && (
												<div
													className={`bg-[#000816] bg-opacity-60 p-6 rounded-lg shadow-md ${
														index === 0 ? "border-4 border-primary" : ""
													}`}
												>
													<div className='flex items-center'>
														<img
															src={result.img}
															alt={result.name}
															className='object-cover w-16 h-16 mr-4 rounded-full'
														/>
														<div>
															<h3 className='text-2xl text-primary'>
																{result.name}
															</h3>
															<p className='text-white'>
																Puntos: {result.points}
															</p>
														</div>
													</div>
												</div>
											)}
										</div>
									))}
							</div>

							{/* Resto de los participantes */}
							<div>
								{results
									.filter((result) => result.categoryId === selectedCategory)
									.map((result, index) => (
										<div key={result.participantId}>
											{index >= 3 && (
												<div className='bg-[#000816] bg-opacity-60 p-4 rounded-lg shadow-md mb-4'>
													<h3 className='text-xl text-primary'>
														{result.name}
													</h3>
													<p className='text-white'>
														Puntos: {result.points}
													</p>
												</div>
											)}
										</div>
									))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ResultsSection;
