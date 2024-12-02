import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";
import LoginScreen from "../LoginScreen/LoginScreen";
import VotingSection from "../VotingSection/VotingSection";
import CATEGORIES from "../../data/categories.json";

function VotingApp() {
	const [user, setUser] = useState(null); // Estado del usuario
	const [hasVoted, setHasVoted] = useState(false); // Estado para verificar si ya votó
	console.log(user);
	console.log(hasVoted);
	
	

	// Verificar si el usuario ya está autenticado y validar votos
	useEffect(() => {
		// Obtener sesión actual
		const fetchSession = async () => {
			const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

			if (sessionError) {
				toast.error("Error al obtener la sesión del usuario.");
				return;
			}

			const user = sessionData?.session?.user ?? null;
			setUser(user);

			// Si el usuario existe, verificar si ya tiene votos
			if (user) {
				const { data: votes, error: votesError } = await supabase
					.from("chinchilla-awards-votes-test")
					.select("id")
					.eq("user_email", user.email);
				console.log(votes);
				

				if (votesError) {
					toast.error("Error al verificar los votos del usuario.");
					return;
				}

				if (votes.length > 0) {
					// Si ya votó, se bloquea el acceso
					toast.error("Este email ya ha registrado votos. No puedes votar nuevamente.");
					setHasVoted(true);
				}
			}
		};

		// Escuchar cambios de autenticación
		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			const user = session?.user ?? null;
			setUser(user);
		});

		fetchSession();

		return () => listener.unsubscribe(); // Limpieza al desmontar
	}, []);

	// Función para registrar los votos
	const handleVote = async (votes) => {
		console.log({ user_email: user.email, user_votes: votes });

		const { error: voteError } = await supabase
			.from("chinchilla-awards-votes-test")
			.insert([{ user_email: user.email, user_votes: votes }]);

		if (voteError) {
			toast.error("Error al registrar los votos");
			return;
		} else {
			toast.success("Votos registrados con éxito.");
			setTimeout(() => {
				toast.info("¡Gracias por votar en los Chinchilla Awards!");
			}, 1500);
			setUser(null); // Reseteamos el estado del usuario para simular logout
		}
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error("Error al cerrar sesión: " + error.message);
		} else {
			toast.success("Sesión cerrada correctamente.");
			setUser(null); // Se asegura de limpiar el estado del usuario
		}
	};

	// Renderizado condicional según el estado del usuario
	if (!user) {
		return <LoginScreen />;
	}

	if (hasVoted) {
		// Mostrar mensaje si ya votó
		return (
			<div className='flex flex-col items-center justify-center h-screen'>
				<p className='mb-6 text-white'>
					Ya has votado con este email. No puedes votar nuevamente.
				</p>
				<button
					onClick={handleLogout}
					className='p-3 font-medium text-white bg-red-600 rounded hover:bg-red-700'
				>
					Cerrar sesión
				</button>
			</div>
		);
	}

	return (
		<main className='flex items-start h-full py-12 overflow-y-scroll'>
			<VotingSection
				categories={CATEGORIES}
				onVotesSubmit={handleVote}
				handleLogout={handleLogout}
			/>
		</main>
	);
}

export default VotingApp;
