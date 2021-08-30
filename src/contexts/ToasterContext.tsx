import React, {createContext, useState, useCallback, useContext, useMemo, createRef, Ref} from 'react';
import clsx from "clsx";
import {makeStyles} from "@material-ui/core";
import {green, red, yellow} from "@material-ui/core/colors";
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import Slide from '@material-ui/core/Slide';
import {createKey} from "../utils/misc";

export enum AlertType {
  WARNING = 'warning',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface Toaster {
  message: string,
  type: AlertType,
  onUndo?: () => void,
  id: string,
}

export interface ToasterContextInterface {
  show: (message: string, type: AlertType, onUndo?: () => void) => void;
}

export const ToasterContext = createContext<ToasterContextInterface | undefined>(undefined);

const useStyles = props => makeStyles(theme => ({
  container: {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1500,
  },
  box: {
    color: '#fff',
    padding: theme.spacing(1),
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 12,
    boxShadow: '0px 0px 28px -4px #000000',
    maxWidth: '80%',
    minWidth: 210,
    paddingLeft: 15,
    paddingRight: 15,
  },
  icon: {
    fontSize: 20,
    marginRight: 7,
  },
  message: {
  },
  hidden: {
    display: 'none',
  },
  [AlertType.SUCCESS]: {
    background: green[500],
  },
  [AlertType.ERROR]: {
    background: red[500],
  },
  [AlertType.WARNING]: {
    background: yellow[900],
  },
}));

export const ToasterProvider: React.FC = ({ children }) => {
  const classes = useStyles({})();
  const [messages, setMessages] = useState<Toaster>();

  const getIcon = (type: AlertType) => {
    switch (type) {
      case AlertType.WARNING:
        return <WarningIcon className={classes.icon} color="inherit" />;
      case AlertType.ERROR:
        return <ErrorIcon className={classes.icon} color="inherit" />;
      case AlertType.SUCCESS:
        return <SuccessIcon className={classes.icon} color="inherit" />;
    }
  };

  const show = (message: string, type: AlertType, onUndo?: () => void) => {
    const id = createKey();
    setMessages({ message, type, onUndo, id });
    setTimeout(() => {
      setMessages(undefined);
    }, 5000);
  };

  return (
    <ToasterContext.Provider
      value={{
        show,
      }}>
      <div className={classes.container}>
        <Slide direction={'up'} in={!!messages}>
          <div className={clsx(classes.box, classes[!!messages ? messages.type : 'hidden'])}>
            {!!messages && (
              <React.Fragment>
                {getIcon(messages.type)}
                <div className={classes.message}>{messages.message}</div>
              </React.Fragment>
            )}
          </div>
        </Slide>
      </div>
      {children}
    </ToasterContext.Provider>
  );
};

export function useToaster() {
  const context = useContext(ToasterContext);
  if (context === undefined) {
    throw new Error('useToaster must be used within a Provider');
  }
  return context;
}
