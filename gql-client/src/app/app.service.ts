import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

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

  private PostDeleteSubscribe = gql`
    subscription PostDeleteSubscribe($post_id: Int!) {
      postDeleted(id: $post_id) {
        id
        title
        url
        votes
      }
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

  deletePost(id: number, callback: Function = null, err: Function = null) {
    this.apollo.mutate({ mutation: this.PostDelete, variables: { post_id: id } })
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
    return this.apollo.subscribe({
        query: this.PostLikeSubscribe,
        variables: { post_id: id }
      }).subscribe((data) => { callback(data) }, (error) => { err(error) });
  }

  registerDeletePost(id: number, callback: Function, err: Function) {
    return this.apollo.subscribe({
        query: this.PostDeleteSubscribe,
        variables: { post_id: id }
      }).subscribe((data) => { callback(data) }, (error) => { err(error) });
  }
}
