import React, {useCallback, useEffect, useMemo, useState} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import {asyncForEach, isNumber} from "../../../utils/misc";
import Placeholder from "../../ui/Placeholder";
import HelpIcon from '@material-ui/icons/Help';
import CenterBox from "../../ui/CenterBox";
import {DialogCommonProps} from "../../../contexts/DialogsContext";

const { Tesseract } = window as any;

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

export interface OCRDialogProps {
  queue?: string[];
  onComplete?: (text: string) => void;
}

const OCRDialog: React.FC<DialogCommonProps & OCRDialogProps> = ({ queue, isOpen, onClose, onComplete }) => {
  const classes = useStyles();
  const [queuePosition, setQueuePosition] = useState<number>(1);
  const [currentProgress, setCurrentProgress] = useState<{message: string; progress?: number; }>();

  const startWorker = useCallback((worker) => {
    const run = async () => {
      setQueuePosition(1);
      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      const results: string[] = [];
      await asyncForEach(queue, async (photo, index) => {
        if(index) setQueuePosition(index + 1);

        const result = await worker.recognize(photo);
        console.log(result);
        results.push(result?.data?.text);
        return true;
      });

      await worker.terminate();
      console.log(results);
      onComplete?.(results.join('\n'));
    };

    run();
  }, [queue]);

  const onProgress = progress => {
    if (progress.status === 'recognizing text') {
      setCurrentProgress({
        message: `Reading snippet...`,
        progress: progress.status === 'recognizing text' ? progress.progress * 100 : undefined
      });
    } else {
      setCurrentProgress({ message: 'Initializing OCR...'})
    }
  };

  useEffect(() => {
    if (isOpen && !!queue?.length) {
      console.log('run worker');
      const worker = Tesseract.createWorker({ logger: onProgress });
      startWorker(worker);
    }
  }, [isOpen]);

  return (
    <Dialog fullScreen open={isOpen} onClose={onClose}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>

        <Typography variant="body1" className={classes.title}>Processing...</Typography>
      </Toolbar>

      <Divider />

      <CenterBox>
        {!!queue?.length ? (
          <div className={classes.container}>
            { !!currentProgress ? (
              <div className={classes.loader}>
                <CircularProgress
                  variant={!isNumber(currentProgress.progress) ? "indeterminate" : "determinate"}
                  value={currentProgress.progress || 5}
                  size={60}
                  thickness={5}
                  color={"secondary"} />
                <Typography variant="body1">Processing snippet ({ queuePosition })</Typography>
                <Typography style={{fontStyle: 'italic'}} color="textSecondary" variant="body2">
                  {currentProgress.message}
                </Typography>
              </div>
            ) : null}
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

export default OCRDialog;
