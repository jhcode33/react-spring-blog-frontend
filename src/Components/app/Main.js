import Router from "../router/Router"
import Footer from "./Footer";
import "../../css/main.css";

function Main() {

	return (
		<main>
      <div className="py-4">
        <div className="container">
          <Router></Router>
        </div>
      </div>
      
    </main>
	);
}

export default Main;