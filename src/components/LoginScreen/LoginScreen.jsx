import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

function LoginScreen() {
	const [loading, setLoading] = useState(false); // Para manejar el estado de carga

	// Función para manejar el login con Google
	const handleGoogleLogin = async () => {
		setLoading(true);
		try {
			// Iniciar sesión con Google
			const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: "http://thechinchillaawards.netlify.app",
				},
			});

			if (signInError) {
				toast.error("Error al iniciar sesión con Google.");
				setLoading(false);
				return;
			}

			// Esperar a que el usuario esté autenticado
			const { data: sessionData } = await supabase.auth.getSession();
			const userEmail = sessionData?.session?.user?.email;

			if (!userEmail) {
				toast.error("No se pudo obtener el email del usuario.");
				setLoading(false);
				return;
			}

			// Verificar si el email ya tiene votos registrados
			const { data: votes, error: votesError } = await supabase
				.from("chinchilla-awards-votes-test")
				.select("id")
				.eq("user_email", userEmail);

			if (votesError) {
				toast.error("Error al verificar los votos.");
				setLoading(false);
				return;
			}

			if (votes.length > 0) {
				toast.error("Este email ya ha registrado votos.");
				setLoading(false);
				return;
			}

			// Si todo está bien
			toast.success("Sesión iniciada correctamente, ya puedes votar.");
		} catch (error) {
			toast.error("Algo salió mal. Por favor, intente nuevamente.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center w-full h-full'>
			<div className='bg-[#000816] bg-opacity-50 rounded-lg h-auto p-8 shadow-md backdrop-blur-md max-w-sm text-center'>
				<img src='/assets/thechinchillaawardslogo.png' alt='Logo' className='mb-10' />
				<p className='mb-6 text-white'>
					Inicia sesión con tu cuenta de Google para participar.
				</p>

				<button
					onClick={handleGoogleLogin}
					className={`w-full p-3 font-medium text-black transition-all rounded-md ${
						loading ? "bg-gray-400" : "bg-primary hover:bg-secondary"
					} focus:outline-none focus:ring-2 focus:ring-secondary`}
					disabled={loading}
				>
					{loading ? "Validando..." : "Iniciar sesión con Google"}
				</button>
			</div>
		</div>
	);
}

export default LoginScreen;
