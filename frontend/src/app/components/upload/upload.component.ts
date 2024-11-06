import { Component, Input } from '@angular/core';
import { Transcription } from '../../model/entity';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

  transcriptionlist$: Transcription[] = [];

  constructor(private helperService: HelperService){
    this.helperService.onNewTranscriptions.subscribe(data => {
      console.debug(data)
      this.transcriptionlist$.push(data)
    })
  }
}
