import React, {useCallback, useEffect, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import AlertBox from "../../ui/AlertBox";
import EditorBox from "../../ui/EditorBox";
import {DialogCommonProps} from "../../../contexts/DialogsContext";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  container: {
    position: 'relative',
    padding: theme.spacing(2),
  },
  tryAgainButton: {
    marginLeft: 'auto',
  },
  notationText: {

  },
  textArea: {
    background: 'inherit',
    width: '95%',
    height: '100%',
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
    border: 0,
    outline: 0,
    color: '#fff',
    fontSize: 16,
  },
}));

export interface FixNotationDialogProps {
  onComplete: (text: string) => void;
  notation?: string;
  notationErrors?: string[];
}

const FixNotationDialog: React.FC<DialogCommonProps & FixNotationDialogProps> = ({
  isOpen,
  notation,
  notationErrors,
  onClose,
  onComplete
}) => {
  const classes = useStyles();
  const [currentNotationText, setCurrentNotationText] = useState<string>('');

  const onTryAgain = useCallback(() => {
    onComplete(currentNotationText);
  }, [currentNotationText]);

  useEffect(() => {
    if (isOpen && !!notation) {
      setCurrentNotationText(notation);
    }
  }, [notation]);

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>

        <Typography variant="body1">Fix Notation</Typography>

        <Button onClick={onTryAgain} variant="contained" className={classes.tryAgainButton} color="secondary">
          Try Again
        </Button>
      </Toolbar>

      <Divider />

      <div className={classes.container}>
        <AlertBox message={`Something is wrong with this notation. Please fix any mistakes and try again!`} />
        {!!notationErrors?.length && (
          <AlertBox message={
            `The following moves are invalid:

            ${notationErrors.join(', ')}`
          }/>
        )}
        <textarea onChange={e => setCurrentNotationText(e.target.value)} className={classes.textArea}>
          {notation}
        </textarea>
      </div>
    </Dialog>
  );
};

export default FixNotationDialog;
