import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup , Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from 'src/app/post.model';
import { PostsService } from 'src/app/posts.service';
import {mineType} from './mine-type-validsator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  enteredContent: any='';
  enteredTitle:any='';
  private mode='create';
  private postId!: string;
  post: Post | undefined;
  isLoading = false;
  imagePreview! : string ;
  form!: FormGroup;
  private authStatusSub !: Subscription;
  constructor(public postsService : PostsService,
    public route: ActivatedRoute,
    private authService: AuthService){

  }

  ngOnInit(){
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl('', {validators: [Validators.required]}),
      image: new FormControl('',{validators: [Validators.required], asyncValidators: [mineType]})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')){
        this.mode='edit';
        this.postId = paramMap.get('postId')!;
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData =>{
          this.isLoading= false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath:postData.imagePath,
            creator: postData.creator};

        this.form.setValue({
          title: this.post?.title,
           content:this.post?.content,
          image: this.post?.imagePath});
      });
      }else{
        this.mode='create';
        this.postId = null!;
      }
    });
  }
 /* onImagePicked(event: any){

    const file: any = event.target.files[0];
    //console.log(file);
    this.form.patchValue({ image: file });
    this.form.get("image")?.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      console.log(reader.result);
      this.imagePreview != reader.result;
      console.log(this.imagePreview);
    };

  }*/

onImage(e: any){
  if(e.target.files){
    this.form.patchValue({ image: e.target.files[0] });
    this.form.get("image")?.updateValueAndValidity();
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload=(event: any)=>{
      this.imagePreview = event.target.result;
    }
  }
}

  savePost(): void{
    if(this.form.invalid)
    {
      return;
    }
    this.isLoading = true;
    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    }else{
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image);
    }

      this.form.reset();
    }

ngOnDestroy(){
  this.authStatusSub.unsubscribe();
}

}
