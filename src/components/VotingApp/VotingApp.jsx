import { useState } from "react";
import { supabase } from "../../supabaseClient";
import LoginScreen from "../LoginScreen/LoginScreen";
import { toast } from "sonner";

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
			<h1>GF AWARDS 2024</h1>
			<div>
				<h2>Votar</h2>
				{votes.map((v) => (
					<div key={v.categoria}>
						<label>{v.categoria}</label>
						<input
							type='text'
							defaultValue={v.voto}
							onChange={(e) => handleVoteChange(v.categoria, e.target.value)}
						/>
					</div>
				))}
				<button onClick={handleVote}>Enviar Votos</button>
			</div>
		</div>
	);
}

export default VotingApp;
