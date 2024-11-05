export interface Transcription {
  id: number,
  created_on: string,
  audio_file_string: string,
  transcription: string
}

export interface Links {
  "href": string,
  "rel": string,
  "method": string
}

export interface Health {
  "status": string,
  "details": string,
  "links": Links[]
}

export interface GetQuery{
  query: string
}
