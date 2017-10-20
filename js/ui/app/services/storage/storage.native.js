import {AsyncStorage} from 'react-native'
import {task} from 'folktale/concurrency/task'

export const setItem = (key, value) =>
  task(async resolver => {
    try {
      await AsyncStorage.setItem(key, value);
      resolver.resolve();
    }
    catch(error) {
      resolver.reject(error);
    }
  })

export const getItem = key =>
  task(async resolver => {
    try {
      const item = await AsyncStorage.getItem(key);
      resolver.resolve(item);
    }
    catch(error) {
      resolver.reject(error);
    }
  })
