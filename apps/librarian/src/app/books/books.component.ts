import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { BooksDataSource, BooksItem } from './books-datasource';
import { BooksService } from './books.service';
import { UsersService } from '../core/users.service';

declare var Notification: any;

@Component({
  selector: 'librarian-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: BooksDataSource;
  newBook: BooksItem = {} as BooksItem;
  users: any[];

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['title', 'author', 'excerpt', 'uploader', 'actions'];

  constructor(private booksService: BooksService, private usersService: UsersService) {}

  ngOnInit() {
    this.getDataSource();
    this.getUsers();
  }

  getUsers() {
    this.usersService.getUsers()
      .subscribe(response => this.users = (<any>response.data).users);
  }

  updateBook(book, updates) {
    this.booksService.updateBook({...book, ...updates})
      .subscribe((b) => {
        this.getDataSource();
        this.sendNotification(`${b.data.updateBook.title} updated successfully!`);
      });
  }

  uploadBook(book) {
    this.booksService.uploadBook(book)
      .subscribe((b) => {
        this.getDataSource();
        this.sendNotification(`${b.data.uploadBook.title} created successfully!`);
      });
  }

  deleteBook(id) {
    this.booksService.deleteBook(id)
      .subscribe((b) => {
        this.getDataSource();
        this.sendNotification(`${b.data.deleteBook.title} deleted successfully!`);
      })
  }

  getDataSource() {
    this.dataSource = new BooksDataSource(this.paginator, this.sort, this.booksService);
  }

  sendNotification(message) {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
    } else if (Notification.permission === 'granted') {
      let notification = new Notification(message);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          let notification = new Notification(message);
        }
      });
    }
  }
}
