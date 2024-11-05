import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { Transcription } from '../../model/entity';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.css'
})
export class SearchbarComponent implements OnInit{

  transcriptionlist: Transcription[] = []

  searchform!: FormGroup;
  uploadform!: FormGroup;
  audiofile!: Blob;

  constructor(private router: Router, private fb: FormBuilder,
    private helperService : HelperService){

  }

  ngOnInit(): void {
    this.searchform = this.fb.group({
      searchterm: this.fb.control<string>('', [ Validators.required ])
    });
    this.uploadform = this.fb.group({
      file: this.fb.control('')
    });

  }

  //TODO upload and transcribe
  // transcribeAudioFile(){
  //   const file = this.uploadform.value;
  //   console.info(file)
  //   this.helperService.uploadTranscribe(file);
  //   this.router.navigate(['/transcribe']);
  // }

  // puts search query
	getSearchResults() {
		const searchterm = this.searchform.value;
		console.info('>>> searchterm: ', searchterm);
    const formVal = this.uploadform.value;
    this.helperService.searchTranscriptions(searchterm)
      .then((result : any)=>{
        console.log(result);
        this.router.navigate(['/search'],
          { queryParams: {query: searchterm}});
      }).catch((error :any)=> {
        console.error(error);
      })
	}
}
