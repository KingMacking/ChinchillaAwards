import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

function LoginScreen({ onLoginSuccess }) {
	const [token, setToken] = useState("");
	const [loading, setLoading] = useState(false);

	// Función para manejar el login
	const handleLogin = async () => {
		if (loading) return; // Previene múltiples envíos

		setLoading(true);

		const { data, error } = await supabase
			.from("gf-awards-tokens")
			.select("*")
			.eq("token", token)
			.eq("is_used", false)
			.single();

		setLoading(false);
		if (error || !data) {
			toast.error("Token inválido o ya ha utilizado");
		} else {
			onLoginSuccess(token); // Pasamos el token de vuelta al componente padre
			toast.success("Login exitoso. Puede votar.");
		}
	};

	return (
		<div className='flex flex-col items-center justify-center p-8 max-w-sm mx-auto text-center h-full'>
			<img src="/assets/logo-big.svg" alt=""  className="mb-10"/>
			<h2 className='text-3xl font-semibold mb-4 text-white'>Iniciar sesión</h2>
			<p className='text-white mb-6'>Ingresa tu token para acceder a la votación.</p>

			<input
				type='text'
				placeholder='1a2b3c4d5e...'
				value={token}
				onChange={(e) => setToken(e.target.value)}
				className='w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary'
			/>
			<button
				onClick={handleLogin}
				disabled={loading}
				className={`w-full p-3 text-black font-medium rounded-md transition-all ${
					loading ? "bg-gray-500 cursor-not-allowed" : "bg-primary hover:bg-secondary"
				} focus:outline-none focus:ring-2 focus:ring-secondary`}
			>
				{loading ? "Cargando..." : "Ingresar a votar"}
			</button>
		</div>
	);
}

export default LoginScreen;
