import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { GraphqlService } from './app.service';

import {Post} from './post';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() postObj: Post;
  @Output() deleteComp: EventEmitter<number> = new EventEmitter();
  @Output() updateLike: EventEmitter<Post> = new EventEmitter();

  private likeObserver;
  private deleteObserver;

  constructor(private service: GraphqlService) {}

  ngOnInit() {
    this.likeObserver = this.service.registerLikePost(this.postObj.id,
      (data) => {
        this.updateLike.emit(data.postUpvoted);
      },
      (error) => {
        console.log('Error: ', error);
      });

    this.deleteObserver = this.service.registerDeletePost(this.postObj.id,
      (data) => {
        this.deleteComp.emit(data.postDeleted);
      },
      (error) => {
        console.log('Error: ', error);
      });
  }

  ngOnDestroy() {}

  onDelete(): void {
    this.service.deletePost(this.postObj.id);
  }

  onLike(): void {
    this.service.likePost(this.postObj.id);
  }
}
