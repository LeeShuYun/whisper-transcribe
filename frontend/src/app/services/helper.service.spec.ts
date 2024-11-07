import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpEvent, HttpEventType, provideHttpClient } from '@angular/common/http';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Health, Transcription } from '../model/entity';

import { HelperService } from './helper.service';
// import { SearchbarComponent } from '../components/searchbar/searchbar.component';
import { SearchComponent } from '../components/search/search.component';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { UploadComponent } from '../components/upload/upload.component';
import { Subject } from 'rxjs';
import { API_ENDPOINT } from '../config/constants';
import { TranscriptionsComponent } from '../components/transcriptions/transcriptions.component';

describe('HelperService', () => {
  let service: HelperService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        HttpClientModule,
        AppRoutingModule
      ],
      providers: [
        HelperService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(HelperService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.debugElement.componentInstance;
  });

  afterEach(() => {
    httpTestingController.verify(); // Verify no outstanding HTTP requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const mockAudioFile = new File(
    ['audio data'], 'mock-audio.mp3', { type: 'audio/mpeg' });
  const mockTranscription = {
    id: 1,
    created_on: "2024-11-07 12:37:36.933514+00:00",
    audio_file_name: 'mock-audio.mp3',
    transcription: 'This is a test transcription.',
  };

  //POST "/transcribe" uploadTranscribe() success check
  it('should upload file and return transcription', (done) => {
    // Set up spy to check on Subject
    const transcriptionSpy = spyOn(service.onNewTranscriptions, 'next');

    //set up assert
    service.uploadTranscribe(mockAudioFile).then((transcriptions) => {
      // assert result received from uploadTranscribe() is correct
      expect(transcriptions).toEqual([
        {
          audio_file_name: mockTranscription.audio_file_name,
          transcription: mockTranscription.transcription,
        } as Transcription
      ]);
      // assert onNewTranscriptions emits correct data
      expect(transcriptionSpy).toHaveBeenCalledWith({
        audio_file_name: mockTranscription.audio_file_name,
        transcription: mockTranscription.transcription,
      }as Transcription);
      done();
    });

    // assert request type and file is attached
    const req = httpTestingController.expectOne(`${API_ENDPOINT}/transcribe`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.get('audiofile')).toEqual(mockAudioFile);

    // trigger service method
    req.flush(mockTranscription);
  });

  //POST "/transcribe" uploadTranscribe() failure check
  it('should handle errors', (done) => {
    // setup console.error spy
    const consoleErrorSpy = spyOn(console, 'error');

    service.uploadTranscribe(mockAudioFile).catch((error) => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(error).toBeTruthy();
      done();
    });

    // simulate network failure
    const req = httpTestingController.expectOne(`${API_ENDPOINT}/transcribe`);
    req.error(new ErrorEvent('NetworkError'));
  });

});

