import React, {useEffect, useRef, useState} from "react";
import clsx from "clsx";

import { makeStyles } from '@material-ui/core/styles';

const useStyles = props => makeStyles(theme => ({
  container: {

  },
  backdrop: {
    overflow: 'auto',
  },
  highlights: {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    color: 'transparent',
  },
  textarea: {
    margin: 0,
    borderRadius: 0,
    outline: 0,
    backgroundColor: 'transparent',
  },
}));

const EditorBox: React.FC<{
  text?: string,
  onChange: (text: string) => void,
  errors?: string[],
}> = ({ text, onChange, errors }) => {
  const classes = useStyles({})();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const applyErrorHighlighting = text => text.replace(/\n$/g, '\n\n').replace(/[A-Z].*?\b/g, '<mark></mark>');

  const handleInput = () => {
    console.log('called');
    const highlights = applyErrorHighlighting(textareaRef.current?.value);

    if (highlights && !!highlightRef.current) {
      highlightRef.current.innerHTML = highlights;
    }
  };

  useEffect(() => {
    if (![textareaRef, highlightRef, backdropRef].every(Boolean)) {
      console.warn('undefined refs');
      return;
    }

    textareaRef.current?.addEventListener('input', e => handleInput())
  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.backdrop} ref={backdropRef}>
        <div className={classes.highlights} ref={highlightRef}>
        </div>
      </div>
      <textarea className={classes.textarea} ref={textareaRef}>
        {text}
      </textarea>
    </div>
  );
};

export default EditorBox;
