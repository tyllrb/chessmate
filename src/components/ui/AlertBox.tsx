import React, {useState} from "react";
import clsx from "clsx";

import { makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import {green, red, yellow} from "@material-ui/core/colors";
import {AlertType} from "../../contexts/ToasterContext";

const useStyles = props => makeStyles(theme => ({
  container: {
    color: '#fff',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 14,
  },
  icon: {
    textAlign: 'center',
    marginRight: 5,
    '& svg': {
      fontSize: 20,
    },
  },
  [AlertType.SUCCESS]: {
    background: green[500],
  },
  [AlertType.ERROR]: {
    background: red[500],
  },
  [AlertType.WARNING]: {
    background: yellow[800],
  },
}));

const AlertBox: React.FC<{
  icon?: React.ReactElement,
  type?: AlertType,
  message: string,
}> = ({ icon, type = AlertType.ERROR, message }) => {
  const classes = useStyles({})();
  return (
    <div className={clsx(classes.container, classes[type])}>
      <div className={classes.icon} color="inherit">
        {!!icon ? icon : <WarningIcon color="inherit" />}
      </div>
      <p>{message}</p>
    </div>
  );
};

export default AlertBox;
