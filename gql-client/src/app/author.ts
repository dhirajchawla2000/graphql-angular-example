import {Post} from './post';

export class Author {
  id: number;
  firstName: String;
  lastName: String;
  posts: [Post];
}
