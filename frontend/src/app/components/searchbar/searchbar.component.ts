import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit{

  searchform!: FormGroup;
  uploadform!: FormGroup;
  audiofile!: Blob;
  isAudioFileValid: boolean = true;

  constructor(private router: Router, private fb: FormBuilder,
    private helperService : HelperService){

  }

  ngOnInit(): void {
    this.searchform = this.fb.group({
      searchterm: this.fb.control<string>('', [ Validators.required ])
    });
    this.uploadform = this.fb.group({
      file: this.fb.control('', [ Validators.required ])
    });

  }

  //TODO upload and transcribe
  transcribeAudioFile(){
    const audiofile = this.uploadform.value.file;
    console.debug("file to upload:", audiofile)
    if (!!audiofile)
      this.isAudioFileValid = false
    else
    {
      this.isAudioFileValid = true
      this.helperService.uploadTranscribe(audiofile);
      this.router.navigate(['/transcribe']);
    }
  }

  // puts search query
	getSearchResults() {
		const searchterm = this.searchform.value.searchterm;
		console.debug('>>> searchbar searchterm: ', searchterm);
    this.router.navigate(['/search'], { queryParams: {query: searchterm}})
	}

  // get all transcriptions
	getTranscriptions() {
    this.router.navigate(['/transcriptions'])
	}

}
