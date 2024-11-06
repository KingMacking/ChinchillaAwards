import { Toaster } from "sonner";
import "./App.css";
import VotingApp from "./components/VotingApp/VotingApp";

function App() {

	return (
			<div>
                <Toaster position="top-center" richColors>
					<VotingApp />
				</Toaster>
            </div>
	);
}

export default App;
