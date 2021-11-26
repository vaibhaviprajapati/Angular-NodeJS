
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from 'src/app/post.model';
import { PostsService } from 'src/app/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

 /*posts = [
   {title: 'First Post', content: 'This is the first content post'},
   {title: 'Second Post', content: 'This is the Second content post'},
   {title: 'Third Post', content: 'This is the Third content post'},
 ];
 */
posts=[{title:'', content:'', id:'', imagePath:'', creator:''}];
private postSub: Subscription | undefined;
isLoading = false;
totalPosts = 10;
postPerPage = 2;
currentPage = 1;
pageSizeOptions =[1,2,5,10];
userIsAuthenticated = false;
userId!: string;
private authStatusSub !: Subscription;
constructor(public postsService : PostsService, private authService: AuthService){

}
ngOnInit(){
  this.isLoading =true;
   this.postsService.getPosts( this.postPerPage, this.currentPage);
  this.userId = this.authService.getUserId();
   this.postSub = this.postsService.getPostUpdateListener()
  .subscribe((postData: {posts: Post[], postCount: number}) =>{
    this.isLoading = false;
    this.totalPosts = postData.postCount;
    this.posts = postData.posts;
  });
  this.userIsAuthenticated = this.authService.getIsAuth();
  this.authStatusSub = this.authService.getAuthStatusListener()
  .subscribe(isAuthenticated => {
    this.userIsAuthenticated = isAuthenticated;
    this.userId = this.authService.getUserId();
  });
}
onChangedPage(pageData: PageEvent){
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.postPerPage = pageData.pageSize;
  this.postsService.getPosts( this.postPerPage, this.currentPage);
}

onDelete(postId: string){
  this.isLoading = true;
  this.postsService.deletePost(postId).subscribe(() => {
    this.postsService.getPosts(this.postPerPage, this.currentPage)
  });
}
ngOnDestroy(){
  this.postSub?.unsubscribe();
  this.authStatusSub.unsubscribe();
}
}

