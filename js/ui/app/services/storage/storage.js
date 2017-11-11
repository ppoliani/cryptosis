import {task} from 'folktale/concurrency/task'

export const setItem = (key, value) => task(async resolver => {
  window.localStorage.setItem(key, value);
  resolver.resolve();
});

export const getItem = key =>  task(async resolver => {
  resolver.resolve(window.localStorage.getItem(key));
});


export const removeItem = key => task(async resolver => {
  window.localStorage.removeItem(key);
  resolver.resolve();
})
