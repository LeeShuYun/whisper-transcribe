import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Health, SearchCommand, Transcription } from '../model/entity';
import { firstValueFrom, map, Subject, tap } from 'rxjs';
import { API_ENDPOINT } from '../model/constants';
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  audioData = ""

  constructor(private httpClient: HttpClient) {}

  // POST "/transcribe"
  uploadTranscribe(audio: Blob){
    const formData = new FormData();
    formData.set("audioFile", audio);
    return firstValueFrom(this.httpClient.post<Transcription>(`${API_ENDPOINT}/transcribe`,formData));
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
    ).then(result => {
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
    ).then(result => {
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
