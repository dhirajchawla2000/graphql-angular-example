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

  private PostDelete = gql`
    mutation PostDelete($post_id: Int!) {
      deletePost(postId: $post_id)
    }
  `;

  private PostLike = gql`
    mutation PostLike($post_id: Int!) {
      upvotePost(postId: $post_id) {
        id
      }
    }
  `;

  private PostLikeSubscribe = gql`
    subscription PostLikeSubscribe($post_id: Int!) {
      postUpvoted(id: $post_id) {
        id
        title
        url
        votes
      }
    }
  `;

  constructor(private apollo: Apollo) {}

  getUsers(callback: Function): void {
    this.apollo.watchQuery({ query: this.UsersQuery }).subscribe(({data}) => {
      callback(data);
    });
  }

  getPosts(callback: Function) {
    this.apollo.watchQuery({ query: this.PostsQuery }).subscribe(({data}) => {
      callback(data);
    });
  }

  deletePost(id: number, callback: Function, err: Function) {
    this.apollo.mutate({ mutation: this.PostDelete, variables: { post_id: id } })
      .subscribe(({data}) => {
        callback(data);
      },
      (error) => {
        err(error);
      });
  }

  likePost(id: number, callback: Function = null, err: Function = null) {
    this.apollo.mutate({ mutation: this.PostLike, variables: { post_id: id } })
      .subscribe(({data}) => {
        if (callback !== null) {
          callback(data);
        }
      },
      (error) => {
        if (err !== null) {
          err(error);
        }
      });
  }

  registerLikePost(id: number, callback: Function, err: Function) {
    this.apollo.subscribe({
        query: this.PostLikeSubscribe,
        variables: { post_id: id }
      }).subscribe((data) => { callback(data) }, (error) => { err(error) });
  }
}
