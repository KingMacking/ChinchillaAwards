import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";
import LoginScreen from "../LoginScreen/LoginScreen";
import VotingSection from "../VotingSection/VotingSection";
import CATEGORIES from '../../data/categories.json'
import PARTICIPANTS from '../../data/participants.json'


function VotingApp() {
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);

	// Verificar si el usuario ya está autenticado
	useEffect(() => {
		const session = supabase.auth.getSession()
		setUser(session?.user ?? null);

		const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
			setUser(session?.user ?? null);
		});

		return () => listener.unsubscribe();
	}, []);

	// Función para registrar los votos
	const handleVote = async (votes) => {
		const { error: voteError } = await supabase.from("gf-awards-votes").insert([{ token, votes }]);

		if (voteError) {
			toast.error("Error al registrar los votos");
			return;
		}

		const { error: tokenError } = await supabase
			.from("gf-awards-tokens")
			.update({ is_used: true })
			.eq("token", token);

		if (tokenError) {
			toast.error("Error al actualizar el token.");
		} else {
			toast.success("Votos registrados con éxito.");
			setToken(null); // Reseteamos el estado del token para simular logout
		}
	};

	if (!user) {
		return <LoginScreen />;
	}

	return (
		<main className="flex items-center h-full">
			<VotingSection categories={CATEGORIES} participants={PARTICIPANTS} onVotesSubmit={handleVote}/>
		</main>
	);
}

export default VotingApp;
