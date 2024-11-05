import { Component, Input, OnInit } from '@angular/core';
import { HelperService } from '../../services/helper.service';

import { BrowserModule } from '@angular/platform-browser';
import { Transcription } from '../../model/entity';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {

  @Input()
  transcriptionlist: Transcription[] = []

  constructor(private helperService: HelperService) { }

  // ngOnInit(): void {

  // }
}
