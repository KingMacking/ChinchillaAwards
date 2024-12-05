import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";

const ResultsSection = ({ selectedTab, categories, goBack }) => {
	const [selectedCategory, setSelectedCategory] = useState(1);
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

	const currentResult = results.find((result) => {
		return result.categoryId === selectedCategory;
	});
	return (
		<div className='w-full max-w-4xl p-4 mx-auto text-white bg-[#000816] bg-opacity-50 rounded-lg shadow-md backdrop-blur-md gap-4 flex items-start'>
			{/* Lista de categorías */}
			<div className='flex flex-col gap-1'>
				{categories.map((item) => {
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
				<button type="button" onClick={goBack} className='px-4 py-2 text-lg font-bold text-white uppercase transition-all duration-200 border border-transparent rounded-lg cursor-pointer category-item bg-primary'>
					Volver atrás
				</button>
			</div>

			{/* Resultados */}
			<div className='flex-[1]'>
				{selectedCategory && (
					<div className='result-details'>
						{/* Top 1 */}
						<div className='flex mb-4'>
							<div
								key={
									currentResult?.results[0].participantId ||
									currentResult?.results[0].id
								}
								className='w-full mb-4'
							>
								<div
									className={`bg-[#000816] bg-opacity-60 p-6 flex-1 flex flex-col gap-4 rounded-lg border-2 border-primary`}
								>
									<div className='flex items-center gap-6'>
										{/* Imagen solo para participantes */}
										{currentResult?.results[0].img && (
											<img
												src={currentResult?.results[0].img}
												alt={currentResult?.results[0].name}
												className='object-cover w-64 h-auto rounded-md'
											/>
										)}
										<div>
											<h3 className='text-3xl text-primary'>
												{currentResult?.results[0].clipName ||
													currentResult?.results[0].name}
											</h3>
											{/* Mostrar autor solo para clips */}
											{currentResult?.results[0].authorName && (
												<p className='text-white'>
													Autor: {currentResult?.results[0].authorName}
												</p>
											)}
											<p className='text-white'>
												Puntos: {currentResult?.results[0].points}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Resto de los participantes o clips */}
						<div>
							{currentResult?.results.map((result, index) => (
								<div key={result.participantId || result.id}>
									{index > 0 && (
										<div className='bg-[#000816] bg-opacity-60 px-4 py-2 rounded-lg mb-2'>
											<h3 className='text-xl text-primary'>
												{result.clipName || result.name}
											</h3>
											{/* Mostrar autor solo para clips */}
											{result.authorName && (
												<p className='m-0 text-white'>
													Autor: {result.authorName}
												</p>
											)}
											<p className='m-0 text-white'>
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
	);
};

export default ResultsSection;
