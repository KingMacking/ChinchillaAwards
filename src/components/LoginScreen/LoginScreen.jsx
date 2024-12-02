import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

function LoginScreen() {
	// Estado para el tiempo restante
	const [timeLeft, setTimeLeft] = useState("");

	// Configurar la fecha del evento (14 de diciembre a las 17hs)
	const eventDate = new Date("2024-12-14T17:00:00-03:00"); // Hora de Argentina (UTC-3)

	// Función para actualizar el contador
	const updateCountdown = () => {
		const now = new Date();
		const diff = eventDate - now;

		if (diff <= 0) {
			setTimeLeft("¡El evento ha comenzado!");
		} else {
			const days = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
			const hours = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
			const minutes = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
			const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0'); 
			setTimeLeft(`${days} : ${hours} : ${minutes} : ${seconds}`);
		}
	};

	// Actualizar el contador cada segundo
	useEffect(() => {
		const interval = setInterval(updateCountdown, 1000);

		// Limpiar el intervalo cuando el componente se desmonte
		return () => clearInterval(interval);
	}, []);

	// Función para manejar el login con Google
	const handleGoogleLogin = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: "http://thechinchillaawards.netlify.app",
				},
			});
			if (error) {
				toast.error("Error al iniciar sesión con Google.");
			}
		} catch (error) {
			toast.error("Algo salió mal. Por favor, intente nuevamente.");
		}
	};

	return (
		<div className='flex flex-col items-center justify-center w-screen h-screen'>
			<div className='bg-[#000816] bg-opacity-50 rounded-lg h-auto p-10 shadow-md backdrop-blur-md max-w-4xl text-center'>
				<img src='/assets/thechinchillaawardslogo.png' alt='Logo' className='max-w-xl mx-auto mb-4' />

				{/* Contador */}
				<p className='p-5 mb-6 font-semibold text-white border border-white rounded-md text-8xl'>
					{timeLeft}
				</p>

				<p className='mb-6 text-white'>
					Inicia sesión con tu cuenta de Google para participar.
				</p>

				<button
					onClick={handleGoogleLogin}
					className='w-full p-3 font-medium text-black transition-all rounded-md bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary'
				>
					Iniciar sesión con Google
				</button>
			</div>
		</div>
	);
}

export default LoginScreen;
