import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { tap } from 'rxjs/internal/operators';

const bookFragment = gql`fragment book on Book { id title author excerpt uploader { id name } } `;

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private apollo: Apollo) {}

  getBooks() {
    const query = gql`
      {books {...book}}
      ${bookFragment}
    `;

    return this.apollo.query({query, fetchPolicy: 'no-cache'});
  }

  updateBook(book) {
    const mutation = gql`
      mutation updateBook($id: ID!, $title: String, $author: String, $excerpt: String, $uploaderId: ID) {
        updateBook(id: $id, title: $title, author: $author, excerpt: $excerpt, uploaderId: $uploaderId) {
          ...book
        }
      }
      ${bookFragment}
    `;
    return this.apollo.mutate({mutation, variables: {...book}});
  }

  uploadBook(book) {
    const mutation = gql`
      mutation uploadBook($title: String!, $author: String!, $excerpt: String, $uploaderId: ID) {
        uploadBook(title: $title, author: $author, excerpt: $excerpt, uploaderId: $uploaderId) {
          ...book
        }
      }
      ${bookFragment}
    `;
    return this.apollo.mutate({mutation, variables: {...book}});
  }

  deleteBook(id) {
    const mutation = gql`
      mutation deleteBook($id: ID!) {
        deleteBook(id: $id) {
          ...book
        }
      }
      ${bookFragment}
    `;
    return this.apollo.mutate({mutation, variables: {id}});
  }
}
