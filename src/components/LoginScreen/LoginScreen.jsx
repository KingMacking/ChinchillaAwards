import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

function LoginScreen() {
	// Función para manejar el login con Google
	const handleGoogleLogin = async () => {
		try {
			const { error } = await supabase.auth
				.signInWithOAuth({
					provider: "google",
					options: {
						redirectTo: "http://thechinchillaawards.netlify.app",
					},
				})
				.then(toast.success("Sesión iniciada correctamente, ya puedes votar"));
			if (error) {
				toast.error("Error al iniciar sesión con Google.");
			}
		} catch (error) {
			toast.error("Algo salió mal. Por favor, intente nuevamente.");
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
					className='w-full p-3 font-medium text-black transition-all rounded-md bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary'
				>
					Iniciar sesión con Google
				</button>
			</div>
		</div>
	);
}

export default LoginScreen;
