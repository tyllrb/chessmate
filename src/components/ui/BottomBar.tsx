import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const useStyles = props => makeStyles(theme => ({
  bottomBar: {
    color: theme.palette.grey[200],
    borderTop: `1px solid ${theme.palette.grey[700]}`,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    height: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barItem: {
    fontSize: 11,
    fontWeight: 700,
  },
}));

export interface BottomBarItem {
  text: string;
  icon: any;
  onAction: () => void;
}

const BottomBar: React.FC<{
  items: BottomBarItem[],
}> = ({ items }) => {
  const classes = useStyles({})();

  return (
    <div className={classes.bottomBar}>
      {items.map(item => (
          <Button
            className={classes.barItem}
            key={item.text.replace(' ', '-')}
            size="small"
            color="inherit"
            variant="text"
            onClick={item.onAction}
            startIcon={item.icon}>
            { item.text }
          </Button>
        ))
      }
    </div>
  );
};

export default BottomBar;
