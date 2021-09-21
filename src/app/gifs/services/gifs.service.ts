import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../inteface/gifs.interface';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private serviceUrl = 'https://api.giphy.com/v1/gifs';
  private apiKey = '9E3ZHjZTGJisNCWJ6K86pI8E8I63PtEe';
  // tslint:disable-next-line: variable-name
  private _historial: string[] = [];

  public resultados: Gif[] = [];

  get historial(): string[] {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')) || [];
    this.resultados = JSON.parse(localStorage.getItem('ultima')) || [];
  }

  buscarGifs(query: string = ''): void {
    query = query.trim().toLowerCase();
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', query);

    this.http
      .get<SearchGifsResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe(
        (resp) => {
          this.resultados = resp.data;
          localStorage.setItem('ultima', JSON.stringify(this.resultados));
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
