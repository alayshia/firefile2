import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService {

  private baseUrl: string = 'http://localhost:3000'; // Adjust to your backend's URL

  public downloadProgressSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) { }

  // Download a file and save either locally or in MongoDB
  downloadFile(url: string, storeInMongo: boolean, filename: string, destination: string): Observable<any> {
    const body = {
      url,
      storeInMongo,
      filename,
      destination
    };

    return this.http.post(`${this.baseUrl}/download`, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      reportProgress: true,
      observe: 'events',
      responseType: 'blob' as 'json'
    }).pipe(
      map(event => {
        let progressValue = 0;
        switch (event.type) {
          case HttpEventType.DownloadProgress:
            if (event.total) {
              progressValue = Math.round(100 * event.loaded / event.total); //Returns the % of download complete
            } else {
              progressValue = event.loaded;
            }
            break;
          case HttpEventType.Response:
            progressValue = 100;
            break;
          default:
            progressValue = 0;
            break;
        }
        this.downloadProgressSubject.next(progressValue);
        console.log('Emitting progress from Service:', progressValue);
        return progressValue;
      }),
      catchError(error => {
        console.error("Error downloading the file.", error);
        return [];
      })
    );
  }

  // Fetch all downloads
  getAllDownloads(): Observable<any> {
    return this.http.get(`${this.baseUrl}/downloads`);
  }

  // Fetch a specific download by ID from MongoDB
  getSingleDownload(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/download/${id}`);
  }

  // Delete a specific download by ID from MongoDB
  deleteDownload(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/download/${id}`);
  }
}