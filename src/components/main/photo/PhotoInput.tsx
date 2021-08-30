import {createRef, forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useState} from "react";

import { makeStyles } from '@material-ui/core/styles';
import {Button} from "@material-ui/core";

const useStyles = props => makeStyles(theme => ({
  photoInput: {
    display: 'none',
  },
}));

interface PhotoInputProps {
  onChange: (data) => void;
  icon?: any;
  text?: string;
}

export interface PhotoInputRef {
  open: () => void;
}

const PhotoInput = forwardRef<PhotoInputRef, PhotoInputProps>(({ onChange, icon: Icon, text }, ref) => {
  const classes = useStyles({})();

  const onPhotoSelected = useCallback((event) => {
    const input = event.target;
    const fileReader = new FileReader();

    fileReader.onload = () => {
      onChange(fileReader.result);
    };

    fileReader.readAsDataURL(input.files[0]);
  }, [onChange]);

  useImperativeHandle(ref, () => ({
    open: () => document.getElementById('photo')?.click(),
  }));

  return (
    <>
      <input onChange={onPhotoSelected} id="photo" type="file" name="image" accept="image/*" capture="environment" className={classes.photoInput} />
      { !!Icon && (<Icon onClick={() => document.getElementById('photo')?.click()} />) }
      { !!text && (<Button color="secondary" variant="contained" size="large" onClick={() => document.getElementById('photo')?.click()}>{text}</Button>)}
    </>
  );
});

export default PhotoInput;
