import {useRef} from "react";

export const useBeforeMount = (cb) => {
  const willMount = useRef(true);

  if (willMount.current) cb();

  willMount.current = false;
};
