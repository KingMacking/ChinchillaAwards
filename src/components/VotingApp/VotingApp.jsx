import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";
import LoginScreen from "../LoginScreen/LoginScreen";
import VotingCategoriesSection from "../VotingCategoriesSection/VotingCategoriesSection";
import VotingClipsSection from "../VotingClipsSection/VotingClipsSection";
import CATEGORIES from "../../data/categories.json";

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
			if (!user || !currentVoteType) return;

			setLoading(true);
			try {
				const tableName =
					currentVoteType === "categories"
						? "chinchilla-awards-votes-test"
						: "chinchilla-awards-votes-clips";

				const { data, error } = await supabase
					.from(tableName)
					.select("user_email")
					.eq("user_email", user.email)
					.single();

				if (error && error.code !== "PGRST116") {
					throw error;
				}

				setHasVoted(!!data);
			} catch (error) {
				toast.error("Error verificando los votos. Por favor, intenta nuevamente.");
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
					? "chinchilla-awards-votes-test"
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
			setHasVoted(true);

			const { error: logoutError } = await supabase.auth.signOut();
			if (logoutError) {
				toast.error(
					"Error al cerrar sesión después de votar. Por favor, intenta nuevamente."
				);
			}
			setUser(null);
		} catch (error) {
			toast.error("Ocurrió un error inesperado. Por favor, intenta nuevamente.");
		}
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error("Error al cerrar sesión: " + error.message);
		} else {
			toast.success("Sesión cerrada correctamente.");
			setUser(null);
		}
	};

	if (!user) {
		return <LoginScreen />;
	}

	if (!currentVoteType) {
		return (
			<main className='flex flex-col items-center justify-center h-screen gap-8 p-4 text-center'>
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
						Votar por Categorías
					</button>
					<button
						onClick={() => setCurrentVoteType("clips")}
						className='px-6 py-3 text-lg font-semibold text-black rounded-lg bg-secondary hover:bg-opacity-80'
					>
						Votar por Clips
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
			<main className='flex flex-col items-center justify-center h-screen p-4 text-center'>
				<h1 className='text-4xl font-bold text-primary'>¡Ya votaste en esta sección!</h1>
				<p className='text-lg text-white'>Gracias por participar en los Chinchilla Awards.</p>
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
		<main className='flex flex-col items-center h-full gap-6 py-12'>
			<button
				onClick={() => setCurrentVoteType(null)}
				className='self-start px-4 py-2 text-white bg-gray-700 rounded-md hover:bg-gray-600'
			>
				← Volver
			</button>
			{currentVoteType === "categories" && (
				<VotingCategoriesSection
					categories={CATEGORIES}
					onVotesSubmit={handleVote}
					handleLogout={handleLogout}
				/>
			)}
			{currentVoteType === "clips" && (
				<VotingClipsSection
					categories={CATEGORIES} // Reemplaza con los datos de los clips
					onVotesSubmit={handleVote}
					handleLogout={handleLogout}
				/>
			)}
		</main>
	);
}

export default VotingApp;
