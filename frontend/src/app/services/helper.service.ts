import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http'
import { Health, Transcription } from '../model/entity';
import { catchError, firstValueFrom, map, retry, Subject, tap, throwError } from 'rxjs';
import { API_ENDPOINT } from '../config/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  //pushes successful transcription to UploadComponent from /transcribe
  onNewTranscriptions = new Subject<Transcription>()

  constructor(private router: Router, private httpClient: HttpClient) {}

  // POST "/transcribe"
  uploadTranscribe(audiofile: File): Promise<void | Transcription[]> {
    const formData = new FormData()
    formData.append('audiofile', audiofile)
    // maybe TODO auth, but not asked
    // const headers = new HttpHeaders({
      // 'security-token': 'mytoken'
    // })
    return firstValueFrom(this.httpClient.post<Transcription>(`${API_ENDPOINT}/transcribe`, formData, { responseType: 'json' })
    .pipe(
      map((data: any) => {
      this.onNewTranscriptions.next({
        audio_file_name: data.audio_file_name,
        transcription: data.transcription
        } as Transcription)
        return [{
          audio_file_name: data.audio_file_name,
          transcription: data.transcription,
          } as Transcription]
        }),
        catchError(this.handleError)
      )
    )
  }

  // GET http://127.0.0.1:5000/search?query=sample
  searchTranscriptions(searchterm: string): Promise<void | Transcription[]> {
    console.info('>> searchterm: ', searchterm)
    const params = new HttpParams()
        .set('query', searchterm)
        // .set('pageSize', 10)
    return firstValueFrom(
      this.httpClient.get<Transcription[]>(`${API_ENDPOINT}/search`, { params })
        .pipe(
          // tap(data => console.log(`response: ${data}`)),
          map((data: any) => data as Transcription[]),
          // tap(data => console.log(`first object: ${data[0]}`)),
          map((data: Transcription[]) => {
            return data.map(data => {
              return {
                id: data.id,
                created_on: data.created_on,
                audio_file_name: data.audio_file_name,
                transcription: data.transcription
              } as Transcription
            })
          }),
          catchError(this.handleError)
        )
    )
  }

  // GET http://127.0.0.1:5000/transcriptions
  getTranscriptions(): Promise<void | Transcription[]> {
    return firstValueFrom(
      this.httpClient.get<Transcription[]>(`${API_ENDPOINT}/transcriptions`)
        .pipe(
          tap(data => console.log(`response: ${data}`)),
          map((data: any) => data as Transcription[]),
          tap(data => console.log(`first object: ${data[0]}`)),
          map((data: Transcription[]) => {
            return data.map(data => {
              return {
                id: data.id,
                created_on: data.created_on,
                audio_file_name: data.audio_file_name,
                transcription: data.transcription
              } as Transcription
            })
          }),
          catchError(this.handleError)
        )
    )
  }

  // GET "/health"
  checkHealth(){
    return firstValueFrom(this.httpClient.get<Health>(`${API_ENDPOINT}/health`));
  }

  //error handler for http requests
  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Failed to get transcription. Please try again later.'));
  }
}
