
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import FormPage from './FormPage';
import CardsDataComponent from './CardsDataComponent';

function App() {


  return (
    <BrowserRouter>
    <div className="App">
    <Routes>
    <Route path="/" element={<FormPage/>} exact>
      </Route>

    <Route path="/cards" element={<CardsDataComponent/>}>
    </Route>

      {/* <CardsDataComponent dataNewOne={collectionDataCard} />   */}
      </Routes>
    </div>
   
    </BrowserRouter>
  );
}

export default App;
