import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import clsx from "clsx";

const useStyles = props => makeStyles(theme => ({
  container: {
    background: theme.palette.background.default,
    height: '93vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const CenterBox: React.FC<{ className?: string }> = ({ className, children }) => {
  const classes = useStyles({})();

  return (
    <div className={clsx(classes.container, className)}>
      { children }
    </div>
  );
};

export default CenterBox;
