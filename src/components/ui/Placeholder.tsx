import React from "react";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles(theme => ({
  placeholder: {
  },
  icon: {
    textAlign: 'center',
    marginBottom: 5,
    '& svg': {
      fontSize: 100,
      color: theme.palette.grey[600],
    },
  },
  message: {
    color: theme.palette.grey[600],
    textAlign: 'center',
    fontWeight: 700,
  },
}));

const Placeholder: React.FC<{
  icon?: React.ReactElement,
  message: string,
}> = ({ icon, message }) => {
  const classes = useStyles({})();

  return (
    <div className={classes.placeholder}>
      {!!icon && <div className={classes.icon}>{icon}</div>}
      <div className={classes.message}>{message}</div>
    </div>
  );
};

export default Placeholder;
