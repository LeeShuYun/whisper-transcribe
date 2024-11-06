import { Component } from '@angular/core';
import { Transcription } from '../../model/entity';
import { HelperService } from '../../services/helper.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transcriptions',
  templateUrl: './transcriptions.component.html',
  styleUrl: './transcriptions.component.css'
})
export class TranscriptionsComponent {
  transcriptionlist: Transcription[] = []

  constructor(private helperService: HelperService) {
    this.helperService.getTranscriptions()
    .then((result : any) => {
      this.transcriptionlist = result
      console.info("transcriptions=", this.transcriptionlist)
      }
    );
  }

}
