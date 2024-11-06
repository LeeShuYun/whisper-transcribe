import { Component, Input } from '@angular/core';
import { Transcription } from '../../model/entity';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  @Input()
  transcription: Transcription[] = [];

}
