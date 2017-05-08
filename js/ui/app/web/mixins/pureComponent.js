import shallowCompare from "react/lib/shallowCompare";
import mixin from './index';

export default mixin({
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
});
