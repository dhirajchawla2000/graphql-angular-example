import { Component, @Input } from '@angular/core';

@Component({
  selector: 'post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent {
  @Input() postObj:Object;
  constructor() {}
  onDelete(): void {

  }
}
