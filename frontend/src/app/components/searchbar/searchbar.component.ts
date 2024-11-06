import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HelperService } from '../../services/helper.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

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
  public files: NgxFileDropEntry[] = [];

  constructor(private router: Router, private fb: FormBuilder,
    private helperService : HelperService){
  }

  ngOnInit(): void {
    this.searchform = this.fb.group({
      searchterm: this.fb.control<string>('', [ Validators.required ])
    });
    this.uploadform = this.fb.group({
      audiofile: this.fb.control('', [ Validators.required ])
    });

  }
  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {

      // validate file and upload to backend
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.debug(droppedFile.relativePath, file);
          this.helperService.uploadTranscribe(file);
        });
        this.router.navigate(['/transcribe']);
      }
      // else {
      //   // It was a directory (empty directories are added, otherwise only files)
      //   const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
      //   console.log(droppedFile.relativePath, fileEntry);
      // }
    }
  }

  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event : any){
    console.log(event);
  }

  //TODO upload and transcribe
  transcribeAudioFile(){
    const audiofile = this.uploadform.value.audiofile;
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
