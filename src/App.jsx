import { Toaster } from "sonner";
import "./App.css";
import VotingApp from "./components/VotingApp/VotingApp";

function App() {
	return (
		<main className="bg-main min-h-svh min-w-svw">
			<Toaster position='top-center' richColors />
			<VotingApp />
		</main>
	);
}

export default App;
