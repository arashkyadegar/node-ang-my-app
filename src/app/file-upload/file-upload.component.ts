import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  myUploadForm: FormGroup<any>;
  fileName:string="";
  file:any;

    constructor(private http: HttpClient) {
      this.myUploadForm = new FormGroup({
        upload:new FormControl('',[Validators.required]),
        file: new FormControl('', [Validators.required]),
        fileSource: new FormControl('', [Validators.required])
    });
    }
    onFileChange(event:any) {
  
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.myUploadForm.patchValue({
          fileSource: file
        });
      }
    } 
  onFileSelected(event:any){
    this.file= event.target.files[0];

     if (this.file) {
        this.fileName = this.file.name;
     }
  }
  onReset() {
    throw new Error('Method not implemented.');
    }
    submit() {
      //if(this.file){
      
        var formData: any = new FormData();
        
        //formData.append('avatar', this.file);
        formData.append('file', this.file);
console.log(formData);
        const upload$ = this.http.post("http://localhost:8000/uploads", formData , {responseType: 'text'});
        upload$.subscribe(value => console.log(value)); 
    }
    uploadFile() {
      throw new Error('Method not implemented.');
      }
      click(){
        console.log('clicked');
      }
      get f(){
        return this.myUploadForm.controls;
      } 
      get upload(){
        return this.myUploadForm.get('upload');
      }
      

    }
