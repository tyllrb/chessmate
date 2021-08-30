import React, {useCallback, useEffect, useRef, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import {getCropperConfig} from "../../../services/ConfigService";
import {DialogCommonProps} from "../../../contexts/DialogsContext";
import {AlertType, useToaster} from "../../../contexts/ToasterContext";

const { Cropper } = window as any;

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  buttons: {
    marginLeft: 'auto',
    '& > :not(:first-child)': {
      marginLeft: theme.spacing(1),
    },
  },
  container: {
    position: 'relative',
  },
  mainPhoto: {
    maxWidth: '100%',
    display: 'block',
  },
}));

export interface PhotoCropDialogProps {
  onComplete: (photoData: string[]) => void;
  photo?: string;
}

const PhotoCropDialog: React.FC<DialogCommonProps & PhotoCropDialogProps> = ({ photo, isOpen, onClose, onComplete }) => {
  const classes = useStyles();
  const toaster = useToaster();

  const [currentCropper, setCurrentCropper] = useState<any>();
  const [queue, setQueue] = useState<string[]>([]);
  const [canAdd, setCanAdd] = useState<boolean>(false);
  const [canImport, setCanImport] = useState<boolean>(false);

  const onCropStart = useCallback(() => {
    if (!canAdd)
      setCanAdd(true);
  }, [canAdd]);

  const onPhotoLoaded = useCallback(node => {
    if (node !== null) {
      console.log('creating cropper');
      node.addEventListener('cropstart', onCropStart);
      setCanAdd(false);
      setCurrentCropper(new Cropper(node, getCropperConfig()));
    } else {
      setCurrentCropper(undefined);
    }
  }, []);

  const importSnippets = useCallback(() => {
    onComplete(queue);
  }, [queue]);

  const addSnippet = useCallback(() => {
    const snippet = currentCropper?.getCroppedCanvas().toDataURL();
    if (snippet) {
      toaster.show(
        !queue.length ? 'Added snippet! When you\'re done adding all your snippets, hit "import"' : 'Added snippet!',
        AlertType.SUCCESS
      );
      currentCropper?.clear();
      setCanAdd(false);
      setCanImport(true);
      const base64Data = snippet.split(',')[1];
      setQueue([...queue, base64Data]);
    }
  }, [currentCropper, queue]);

  const close = useCallback(() => {
    setQueue([]);
    onClose();
  }, []);

  return (
    <Dialog fullScreen open={isOpen} onClose={close}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>

        <Typography variant="body1" className={classes.title}>Select notation</Typography>

        <div className={classes.buttons}>
          <Button disabled={!canAdd} onClick={addSnippet} color="secondary" variant="contained" size="small">
            Add
          </Button>

          <Badge badgeContent={queue.length} color="primary">
            <Button disabled={!canImport} onClick={importSnippets} color="secondary" variant="contained" size="small">
              Import
            </Button>
          </Badge>
        </div>
      </Toolbar>

      <Divider />
      { !!photo ? (
        <div className={classes.container}>
          <img src={photo} className={classes.mainPhoto} ref={onPhotoLoaded} />
        </div>
      ) : null }
    </Dialog>
  );
};

export default PhotoCropDialog;
