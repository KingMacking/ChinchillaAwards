import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";
import LoginScreen from "../LoginScreen/LoginScreen";
import VotingCategoriesSection from "../VotingCategoriesSection/VotingCategoriesSection";
import VotingClipsSection from "../VotingClipsSection/VotingClipsSection";
import CATEGORIES from "../../data/categories.json";
import CATEGORIES_CLIPS from "../../data/clipsCategories.json";

function VotingApp() {
	const [user, setUser] = useState(null);
	const [currentVoteType, setCurrentVoteType] = useState(null);
	const [hasVoted, setHasVoted] = useState(false);
	const [loading, setLoading] = useState(false);

	// Verificar si el usuario ya está autenticado
	useEffect(() => {
		const session = supabase.auth.getSession();
		setUser(session?.user ?? null);

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => listener.unsubscribe();
	}, []);

	// Verificar si el usuario ya votó
	useEffect(() => {
		const checkIfVoted = async () => {
			if (!currentVoteType) return;

			setLoading(true);

			try {
				const tableName =
					currentVoteType === "categories"
						? "chinchilla-awards-votes-categories"
						: "chinchilla-awards-votes-clips";

				const { data, error } = await supabase.from(tableName).select("*");

				console.log(data, error);

				if (error && error.code !== "PGRST116") {
					throw error;
				}
				console.log(data);

				if (data && data.length > 0) {
					setHasVoted(true); // Usuario ya votó
				} else {
					setHasVoted(false); // Usuario no ha votado
				}
			} catch (error) {
				toast.error("Error verificando los votos. Por favor, intenta nuevamente.");
				setCurrentVoteType(null)
			} finally {
				setLoading(false);
			}
		};

		checkIfVoted();
	}, [currentVoteType]);

	// Función para registrar los votos
	const handleVote = async (votes) => {
		try {
			const tableName =
				currentVoteType === "categories"
				? "chinchilla-awards-votes-categories"
				: "chinchilla-awards-votes-clips";

			const { error: voteError } = await supabase
				.from(tableName)
				.insert([{ user_email: user.email, user_votes: votes }]);

			if (voteError) {
				if (voteError.message.includes("duplicate key value")) {
					toast.error("Ya votaste en esta sección.");
					return;
				}
				toast.error("Error al registrar los votos. Intenta nuevamente.");
				return;
			}

			toast.success("Votos registrados con éxito.");

			setCurrentVoteType(null);
		} catch (error) {
			toast.error("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
		}
	};

	const handleLogout = async () => {
		try {
			// Cerrar sesión en Supabase
			const { error } = await supabase.auth.signOut();

			if (error) {
				throw new Error(error.message); // Si hay error, lanzamos la excepción
			}

			// Mostrar mensaje de éxito
			toast.success("Sesión cerrada correctamente.");
		} catch (error) {
			// Manejo de errores si ocurre un fallo en el proceso
			console.error("Error al cerrar sesión:", error);
			toast.error("Error al cerrar sesión: " + error.message);
		}
	};

	if (!user) {
		return <LoginScreen />;
	}

	if (!currentVoteType) {
		return (
			<main className='flex flex-col items-center justify-center h-screen gap-8 p-4 text-center bg-[#000816] bg-opacity-50 rounded-lg shadow-md backdrop-blur-md'>
				<h1 className='text-4xl font-bold text-primary'>
					¡Bienvenido a los Chinchilla Awards!
				</h1>
				<p className='text-lg text-white'>
					Por favor, selecciona el tipo de votación en el que deseas participar.
				</p>
				<div className='flex flex-col gap-4'>
					<button
						onClick={() => setCurrentVoteType("categories")}
						className='px-6 py-3 text-lg font-semibold text-black rounded-lg bg-primary hover:bg-opacity-80'
					>
						Votar categorías streamers
					</button>
					<button
						onClick={() => setCurrentVoteType("clips")}
						className='px-6 py-3 text-lg font-semibold text-white rounded-lg bg-secondary hover:bg-opacity-80'
					>
						Votar clips of the year
					</button>
					<button
						onClick={handleLogout}
						className='px-6 py-3 text-lg font-semibold text-white border rounded-lg border-secondary hover:bg-opacity-80'
					>
						Cerrar sesión
					</button>
				</div>
			</main>
		);
	}

	if (loading) {
		return <p className='text-white'>Cargando...</p>;
	}

	if (hasVoted) {
		return (
			<main className='flex flex-col items-center justify-center h-screen p-4 text-center bg-[#000816] bg-opacity-50 rounded-lg shadow-md backdrop-blur-md'>
				<h1 className='text-4xl font-bold text-primary'>¡Ya votaste en esta sección!</h1>
				<p className='text-lg text-white'>
					Gracias por participar en los Chinchilla Awards.
				</p>
				<button
					onClick={() => setCurrentVoteType(null)}
					className='px-6 py-3 mt-4 text-lg font-semibold text-black rounded-lg bg-primary hover:bg-opacity-80'
				>
					Volver a la Selección
				</button>
			</main>
		);
	}

	return (
		<main className='flex flex-col items-start h-auto gap-6 py-12 '>
			{currentVoteType === "categories" && (
				<VotingCategoriesSection
					categories={CATEGORIES}
					onVotesSubmit={handleVote}
					handleLogout={handleLogout}
					goBack={() => setCurrentVoteType(null)}
				/>
			)}
			{currentVoteType === "clips" && (
				<VotingClipsSection
					categories={CATEGORIES_CLIPS} // Reemplaza con los datos de los clips
					onVotesSubmit={handleVote}
					handleLogout={handleLogout}
					goBack={() => setCurrentVoteType(null)}
				/>
			)}
		</main>
	);
}

export default VotingApp;
