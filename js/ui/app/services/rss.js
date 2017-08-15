require('../../node_modules/rss-parser/dist/rss-parser.js')
import {task} from 'folktale/concurrency/task'

export const loadFeeds = url => task(resolver => {
  parser.parseURL(url, (error, parsed) => {
    if(error) return resolver.reject(error)
    resolver.resolve(parsed.feed);
  });
});
