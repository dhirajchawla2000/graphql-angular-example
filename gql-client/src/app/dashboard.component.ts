import { Component, OnInit } from '@angular/core';
import { GraphqlService } from './app.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  postData: any = [];
  userData: any = [];

  constructor(private service: GraphqlService) {}

  ngOnInit() {
    this.service.getPosts((data) => this.postData = data.posts);
    this.service.getUsers((data) => this.userData = data.authors);
  }

  deletePost(event) {
    this.postData = this.postData.filter(post => post.id !== event.id);
  }

  updatePostLike(event) {
    this.postData.filter(post => post.id === event.id).votes = event.votes;
  }
}
