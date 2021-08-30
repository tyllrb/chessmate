import React from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import {DialogCommonProps} from "../../../contexts/DialogsContext";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  container: {
    padding: theme.spacing(2),
  },
  codeBlock: {
    fontFamily: 'monospace',
    marginTop: 7,
    marginBottom: 7,
    fontSize: 17,
  }
}));

const NotationExplainer: React.FC<DialogCommonProps> = ({ isOpen, onClose }) => {
  const classes = useStyles();

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        <Typography variant="body1" className={classes.title}>Info</Typography>
      </Toolbar>

      <Divider />

      <div className={classes.container}>
        <Typography style={{fontWeight: 700}} variant="h6">What is valid chess notation?</Typography>
        <Typography variant="body1">
          ChessMate supports standard algebraic notation as well PGN. However headers, comments, and other metadata
          are ignored. Here is an example of what
        </Typography>

        <div className={classes.codeBlock}>
          1. e4 e5 2. Nd7 Ng7
        </div>
      </div>
    </Dialog>
  );
};

export default NotationExplainer;
