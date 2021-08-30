import React, {useCallback, useEffect, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { COLOR, PIECE } from 'cm-chessboard/src/cm-chessboard/Chessboard';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Divider from "@material-ui/core/Divider";

export interface ChessSettings {
  orientation?: string;
  boardSprite?: string;
  responsive?: boolean;
  animationDuration?: number;
}

const defaultChessSettings = {
  orientation: COLOR.white,
  responsive: true,
  animationDuration: 300,
  boardSprite: "chessboard-sprite-staunty.svg",
};

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  container: {
    position: 'relative',
  },
  doneButton: {
    marginLeft: 'auto',
  },
}));

const ChessSettingsDialog: React.FC<{
  isOpen: boolean;
  settings: ChessSettings;
  onClose: () => void;
  onSave: (text: string) => void;
}> = ({ isOpen, onClose, settings, onSave }) => {
  const classes = useStyles();

  const [currentSettings, setCurrentSettings] = useState<ChessSettings>(settings);

  const onDone = () => {

  };

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>

        <Typography variant="body1">Settings</Typography>

        <Button onClick={onDone} color="secondary" variant="contained" className={classes.doneButton}>
          Done
        </Button>
      </Toolbar>

      <Divider />
    </Dialog>
  );
};

export default ChessSettingsDialog;
