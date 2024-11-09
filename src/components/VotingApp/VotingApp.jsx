import { useState } from "react";
import { supabase } from "../../supabaseClient";
import LoginScreen from "../LoginScreen/LoginScreen";
import { toast } from "sonner";
import VotingSection from "../VotingSection/VotingSection";
import CATEGORIES from '../../data/categories.json'
import PARTICIPANTS from '../../data/participants.json'


function VotingApp() {
	const [token, setToken] = useState(null);

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

	if (!token) {
		return <LoginScreen onLoginSuccess={setToken} />;
	}

	return (
		<main className="flex items-center h-full">
			<VotingSection categories={CATEGORIES} participants={PARTICIPANTS} onVotesSubmit={handleVote}/>
		</main>
	);
}

export default VotingApp;
