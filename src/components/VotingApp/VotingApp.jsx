import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";
import LoginScreen from "../LoginScreen/LoginScreen";
import VotingSection from "../VotingSection/VotingSection";
import CATEGORIES from "../../data/categories.json";

function VotingApp() {
	const [user, setUser] = useState(null);

	// Verificar si el usuario ya está autenticado
	useEffect(() => {
		const session = supabase.auth.getSession();
		setUser(session?.user ?? null);

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => listener.unsubscribe();
	}, []);

	// Función para registrar los votos
	const handleVote = async (votes) => {
		try {
			// Verificar si el email ya tiene votos registrados
			const { data: existingVotes, error: checkError } = await supabase
				.from("chinchilla-awards-votes-test")
				.select("id")
				.eq("user_email", user.email);

			if (checkError) {
				toast.error("Error al verificar los votos. Intenta nuevamente.");
				return;
			}

			if (existingVotes.length > 0) {
				// Si ya existen votos con este email, mostrar una alerta y no permitir enviar los votos
				toast.error("Este email ya ha registrado votos. No puedes votar nuevamente.");
				return;
			}

			// Registrar los votos en la base de datos
			const { error: voteError } = await supabase
				.from("chinchilla-awards-votes-test")
				.insert([{ user_email: user.email, user_votes: votes }]);

			if (voteError) {
				toast.error("Error al registrar los votos. Intenta nuevamente.");
				return;
			}

			toast.success("Votos registrados con éxito.");
			setTimeout(() => {
				toast.info("¡Gracias por votar en los Chinchilla Awards!");
			}, 1500);

			// Opcional: cerrar sesión después de votar
			setUser(null);
		} catch (error) {
			toast.error("Ocurrió un error inesperado. Por favor, intente nuevamente.");
		}
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error("Error al cerrar sesión: " + error.message);
		} else {
			toast.success("Sesión cerrada correctamente.");
			setUser(null); // Limpiar el estado del usuario
		}
	};

	if (!user) {
		return <LoginScreen />;
	}

	return (
		<main className="flex items-start h-full py-12 overflow-y-scroll">
			<VotingSection
				categories={CATEGORIES}
				onVotesSubmit={handleVote}
				handleLogout={handleLogout}
			/>
		</main>
	);
}

export default VotingApp;
