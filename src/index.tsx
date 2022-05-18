import React from "react";
import ReactDOM from "react-dom";
import { Dapp } from "./components/DeprecatedDapp";
import UQBet from "./components/pages/UQBet";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";
import { GlobalStateProvider } from "./globalState";
import AddFixturePage from "./components/pages/admin/AddFixturePage";
import { Grommet } from "grommet";
import { theme } from "./theme";
import AdminPage from "./components/pages/admin/AdminPage";

// This is the entry point of your application, but it just renders the Dapp
// react component. All of the logic is contained in it.

declare global {
  interface Window {
    ethereum: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Grommet theme={theme}>
      <GlobalStateProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<UQBet />} />
            <Route path='/admin' element={<AdminPage />} />
            <Route path='/admin/AddFixture' element={<AddFixturePage />} />
            <Route path='/DeprecatedDapp' element={<Dapp />} />
          </Routes>
        </BrowserRouter>
      </GlobalStateProvider>
    </Grommet>
  </React.StrictMode>,
  document.getElementById("root")
);
