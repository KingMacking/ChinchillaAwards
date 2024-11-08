import { useState } from "react";
import { supabase } from "../../supabaseClient";
import LoginScreen from "../LoginScreen/LoginScreen";
import { toast } from "sonner";
import VotingSection from "../VotingSection/VotingSection";

function VotingApp() {
	const [token, setToken] = useState(null);
	const [votationCompleted, setVotationCompleted] = useState(false);
	const [votes, setVotes] = useState([
		{ categoria: "mejor_pelicula", voto: "" },
		{ categoria: "mejor_actor", voto: "" },
		{ categoria: "mejor_director", voto: "" },
	]);

	// Función para cambiar los votos
	const handleVoteChange = (category, vote) => {
		setVotes(votes.map((v) => (v.categoria === category ? { ...v, vote } : v)));
	};

	// Función para registrar los votos
	const handleVote = async () => {
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
		<div>
			<VotingSection />
		</div>
	);
}

export default VotingApp;
