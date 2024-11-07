import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from '../../services/helper.service';

import { BrowserModule } from '@angular/platform-browser';
import { Transcription } from '../../model/entity';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent{

  transcriptionlist: Transcription[] = []

  constructor(private helperService: HelperService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      let searchterm = params['query'];
      console.log(searchterm);
      this.helperService.searchTranscriptions(searchterm)
      .then((result : any) => {
        console.log("result:", result);
        this.transcriptionlist.push(result)
        console.info("transcriptions=", this.transcriptionlist)
        }
      );
    });
  }

}

