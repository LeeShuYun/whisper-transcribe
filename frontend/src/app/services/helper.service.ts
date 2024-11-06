import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Health, Transcription } from '../model/entity';
import { firstValueFrom, map, Subject, tap } from 'rxjs';
import { API_ENDPOINT } from '../model/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  //pushes successful transcription to UploadComponent from /transcribe
  onNewTranscriptions = new Subject<Transcription>()

  constructor(private router: Router, private httpClient: HttpClient) {}

  // POST "/transcribe"
  uploadTranscribe(audiofile: Blob){
    const formData = new FormData()
    formData.append('audiofile', audiofile)
    // maybe TODO auth, but not asked
    // const headers = new HttpHeaders({
      // 'security-token': 'mytoken'
    // })
    this.httpClient.post(`${API_ENDPOINT}/transcribe`, formData, { responseType: 'json' })
    .subscribe((data : any) => {
      console.info("received data", data.transcription)
      this.onNewTranscriptions.next({
        audio_file_name: data.filename,
        transcription: data.transcription,
      } as Transcription)
    })
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
          })
        )
    ) // TODO cleanup this looks insane
    .then(result => {
      console.debug('>>> helpersvc result[0]: ',
        result[0].id,
        result[0].created_on,
        result[0].audio_file_name,
        result[0].transcription)
      return result
    }).catch((error :any)=> {
      console.error(`helpersvc error: ${JSON.stringify(error)}`);
      if (error.status == 404)
        console.debug(`No transcriptions found.`)
    })
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
          })
        )
    ) // TODO cleanup this looks insane
    .then(result => {
      console.debug('>>> helpersvc result[0]: ',
        result[0].id,
        result[0].created_on,
        result[0].audio_file_name,
        result[0].transcription)
      return result
    }).catch((error :any)=> {
      console.error(`helpersvc error: ${error}`);
      alert(`Error: ${JSON.stringify(error)}`)
    })
  }

  // GET "/health"
  checkHealth(){
    return firstValueFrom(this.httpClient.get<Health>(`${API_ENDPOINT}/health`));
  }
}
