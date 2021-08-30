import './App.css';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';

import ChessMate from "./containers/routes/ChessMate";
import {DialogsProvider} from "./contexts/DialogsContext";
import {ChessboardProvider} from "./contexts/ChessboardContext";
import {ToasterProvider} from "./contexts/ToasterContext";

/*
  Color Palette:
  - #251101
  - #470024
  - #5B1865
  - #2C5784
  - #5688C7
 */

const mainTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#2C5784',
    },
    secondary: {
      main: '#470024',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <ToasterProvider>
        <DialogsProvider>
          <Router>
            <Switch>
              <Route exact path="/">
                <ChessboardProvider>
                  <ChessMate />
                </ChessboardProvider>
              </Route>
            </Switch>
          </Router>
        </DialogsProvider>
      </ToasterProvider>
    </ThemeProvider>
  );
}

export default App;
