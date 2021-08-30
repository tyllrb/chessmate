import React from "react";

import { makeStyles } from '@material-ui/core/styles';
import Link from "@material-ui/core/Link";

const useStyles = props => makeStyles(theme => ({
  link: {
    color: '#5688C7',
  },
}));

const Linker: React.FC<{
  onClick: () => void;
  text: string,
}> = ({ text, onClick }) => {
  const classes = useStyles({})();
  return (
    <Link
      href="#"
      className={classes.link}
      onClick={e => {
        e.preventDefault();
        onClick?.();
    }}>{text}</Link>
  );
};

export default Linker;
