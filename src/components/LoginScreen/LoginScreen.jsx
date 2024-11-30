import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { toast } from "sonner";

function LoginScreen() {
	// Función para manejar el login con Google
	const handleGoogleLogin = async () => {
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					redirectTo: 'http://thechinchillaawards.netlify.app'
				}
			});
			if (error) {
				toast.error("Error al iniciar sesión con Google.");
				console.error(error);
			}
		} catch (error) {
			toast.error("Algo salió mal. Por favor, intente nuevamente.");
			console.error(error);
		}
	};

	return (
		<div className='flex flex-col items-center justify-center h-full max-w-sm p-8 mx-auto text-center'>
			<img src='/assets/logo-big.svg' alt='Logo' className='mb-10' />
			<h2 className='mb-4 text-3xl font-semibold text-white'>Iniciar sesión</h2>
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
	);
}

export default LoginScreen;
