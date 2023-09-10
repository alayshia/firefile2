import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';;

@Injectable({
  providedIn: 'root'
})
export class FileDownloaderService {

  private baseUrl: string = 'http://localhost:3000'; // Adjust to your backend's URL

  constructor(private http: HttpClient) { }

  // Download a file and save either locally or in MongoDB
  downloadFile(url: string, storeInMongo: boolean, filename: string, destination?: string): Observable<any> {
    const body = {
      url,
      storeInMongo,
      filename,
      destination
    };
    return this.http.post(`${this.baseUrl}/download`, body);
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