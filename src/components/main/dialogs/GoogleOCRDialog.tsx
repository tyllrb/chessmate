import React, {useCallback, useEffect} from 'react';

import {makeStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Placeholder from "../../ui/Placeholder";
import HelpIcon from '@material-ui/icons/Help';
import CenterBox from "../../ui/CenterBox";
import {requestOCRReader} from "../../../utils/requests";
import {DialogCommonProps} from "../../../contexts/DialogsContext";
import {AlertType, useToaster} from "../../../contexts/ToasterContext";

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
    position: 'relative',
  },
  loader: {
    textAlign: 'center',
    '& > :first-child': {
      marginBottom: theme.spacing(2),
    },
  },
}));

export interface GoogleOCRDialogProps {
  queue?: string[];
  onComplete: (text: string) => void;
}

const GoogleOCRDialog: React.FC<DialogCommonProps & GoogleOCRDialogProps> = ({ queue, isOpen, onClose, onComplete }) => {
  const classes = useStyles();
  const toaster = useToaster();

  const requestOCR = useCallback(async (images: string[]) => {
    try {
      const result = await requestOCRReader(images);
      console.log(result);
      onComplete(result.join(''));
    } catch (e) {
      console.error(e);
      toaster.show('Hmm, could not scan this image, is your WiFi connected?', AlertType.ERROR);
    }
  }, [requestOCRReader]);

  useEffect(() => {
    if (isOpen && !!queue?.length) {
      requestOCR(queue);
    }
  }, [isOpen]);

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Toolbar>
        <Typography variant="body1" className={classes.title}>Processing...</Typography>
      </Toolbar>

      <Divider />

      <CenterBox>
        {!!queue?.length ? (
          <div className={classes.container}>
            <div className={classes.loader}>
              <CircularProgress
                variant="indeterminate"
                size={60}
                thickness={5}
                color={"secondary"} />
              <Typography variant="body1">Processing snippets ({queue?.length})</Typography>
              <Typography style={{fontStyle: 'italic'}} color="textSecondary" variant="body2">
                Making OCR request...
              </Typography>
            </div>
          </div>
        ) : null}

        {!queue?.length ? (
          <Placeholder
            message={'Hmm theres nothing in the queue to process'}
            icon={<HelpIcon />}
          />
        ) : null}
      </CenterBox>
    </Dialog>
  );
};

export default GoogleOCRDialog;
