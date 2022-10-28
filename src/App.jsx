import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";

import { AppContextProvider } from './contexts';

import './styles/index.css';
import './styles/main.css';

const App = () => {
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");

  return (
    <AppContextProvider>
      <BrowserRouter>
        <Routes pages={pages} />
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App
