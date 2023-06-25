    this.myBlogForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required]),
      //date: new FormControl('', [Validators.required]),
      author:new FormControl('',[Validators.required])

  });