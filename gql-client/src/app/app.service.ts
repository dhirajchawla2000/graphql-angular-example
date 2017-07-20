import { Injectable } from '@angular/core';
import { Apollo, ApolloQueryObservable } from 'apollo-angular';
import { ApolloQueryResult } from 'apollo-client';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

interface Post {
  id: number,
  title: string,
  url: string,
  votes: number
}

@Injectable()
export class GraphqlService {
  private PostsQuery = gql`
    query Posts {
      posts {
        id
        title
        url
        votes
      }
    }
  `;

  private UsersQuery = gql`
    query Authors {
      authors {
        id
        firstName
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  getUsers(callback: Function): void {
    this.apollo.watchQuery({ query: this.UsersQuery }).subscribe(({data}) => {
      callback(data);
    });
  }

  getPosts(callback: Function): void {
    this.apollo.watchQuery({ query: this.PostsQuery }).subscribe(({data}) => {
      callback(data);
    });
  }
}
