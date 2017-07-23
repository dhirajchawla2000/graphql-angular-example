import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { GraphqlService } from './app.service';

import {Post} from './post';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postObj: Post;
  @Output() deleteComp: EventEmitter<number> = new EventEmitter();
  @Output() updateLike: EventEmitter<Post> = new EventEmitter();

  constructor(private service: GraphqlService) {}

  ngOnInit() {
    this.service.registerLikePost(this.postObj.id,
      (data) => {
        this.updateLike.emit(data.postUpvoted);
      },
      (error) => {
        console.log('Error: ', error);
      });
  }

  onDelete(): void {
    this.service.deletePost(this.postObj.id,
      (data) => {
        if (data.deletePost) {
          this.deleteComp.emit(this.postObj.id);
        }
      },
      (error) => {
        console.log('Error: ', error);
    });
  }

  onLike(): void {
    this.service.likePost(this.postObj.id);
  }
}
