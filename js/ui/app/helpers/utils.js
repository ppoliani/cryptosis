import {Map} from 'immutable';

// remove the exclude prorties from the given object
export const filterObject = (obj, exclude) => Map(obj)
  .filter((_, k) => !exclude.includes(k));
