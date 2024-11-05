import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Health, Transcription } from '../model/entity';
import { firstValueFrom, map, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HelperService {
  audioData = ""

  constructor(private httpClient: HttpClient) { }
  // POST "/transcribe"
  uploadTranscribe(audio: Blob){
    const formData = new FormData();
    formData.set("audioFile", audio);
    return firstValueFrom(this.httpClient.post<Transcription>("/transcribe",formData));
  }

  // GET "/search"
  searchTranscriptions(searchterm: string): Promise<Transcription[]> {
    console.info('>> search: ', searchterm)
    const params = new HttpParams()
        .set('query', searchterm)
        // .set('pageSize', 10)

    return firstValueFrom(
      this.httpClient.get<Transcription[]>("/search", { params })
        .pipe(
          map((data: any) => data.transcriptions as any[]),
          map((data: any[]) => {
            return data.map(data => {
              return {
                id: data.id,
                created_on: data.created_on,
                audio_file_string: data.audio_file_string,
                transcription: data.transcription
              } as Transcription
            })
          })
        )
    ).then(result => {
      console.info('>>> result: ', result)
      return result
    })
  }

  // GET "/health"
  checkHealth(){
    return firstValueFrom(this.httpClient.get<Health>("/health"));
  }
}
