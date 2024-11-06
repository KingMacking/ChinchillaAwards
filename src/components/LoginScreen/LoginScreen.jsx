import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

function LoginScreen({ onLoginSuccess }) {
	const [token, setToken] = useState("");

	// Función para manejar el login
	const handleLogin = async () => {
		const { data, error } = await supabase
			.from("tokens")
			.select("*")
			.eq("token", token)
			.eq("is_used", false)
			.single();

		if (error || !data) {
			toast.error("Token inválido o ya ha sido usado.");
		} else {
			onLoginSuccess(token); // Pasamos el token de vuelta al componente padre
			toast.success("Login exitoso. Puede votar.");
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<input
				type='text'
				placeholder='Ingresa tu token'
				value={token}
				onChange={(e) => setToken(e.target.value)}
			/>
			<button onClick={handleLogin}>Login</button>
		</div>
	);
}

export default LoginScreen;
