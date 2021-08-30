import React from "react";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  child: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: -20,
    right: -20,
    overflow: 'scroll',
  },
}));

const ScrollableBox: React.FC<{
  height?: string;
}> = ({ height, children }) => {
  const classes = useStyles({})();
  return (
    <div className={classes.container}>
      <div className={classes.child}>
        {children}
      </div>
    </div>
  );
};

export default ScrollableBox;
