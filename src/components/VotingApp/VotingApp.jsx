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
		const { error: voteError } = await supabase
			.from("chinchilla-awards-votes")
			.insert([{ user_email: user.email, user_votes: votes }]);

		if (voteError) {
			toast.error("Error al registrar los votos");
			return;
		} else {
			toast.success("Votos registrados con éxito.");
			setUser(null); // Reseteamos el estado del user para simular logout
			setTimeout(() => {
				toast.info("¡Gracias por votar en los Chinchilla Awards!");
			}, 1500);
		}
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			toast.error("Error al cerrar sesión: " + error.message);
		} else {
			toast.success("Sesión cerrada correctamente.");
			if (onLogout) {
				onLogout(); // Notifica al componente padre que el usuario cerró sesión
			}
		}
	};

	if (!user) {
		return <LoginScreen />;
	}
	console.log(user);

	return (
		<main className='flex items-center h-full overflow-scroll'>
			<VotingSection
				categories={CATEGORIES}
				onVotesSubmit={handleVote}
				handleLogout={handleLogout}
			/>
		</main>
	);
}

export default VotingApp;
