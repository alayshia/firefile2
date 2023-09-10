import { Component, OnInit } from '@angular/core';
import { FileDownloaderService } from './file-downloader.service'; // adjust the path based on your directory structure

@Component({
  selector: 'app-file-downloader',
  templateUrl: './file-downloader.component.html',
  styleUrls: ['./file-downloader.component.css']
})
export class FileDownloaderComponent implements OnInit {

  public downloads: any[] = [];
  public url: string = '';
  public filename: string = '';
  public storeInMongo: boolean = true;
  public destination: string = '';
  insecureUrlWarning = false;

  constructor(private fileDownloaderService: FileDownloaderService) { }


  checkUrlSecurity() {
    // Check if the URL starts with 'http://'
    if (this.url.startsWith('http://')) {
      this.insecureUrlWarning = true;
    } else {
      this.insecureUrlWarning = false;
    }
  }
  
  confirmProceedWithInsecureUrl() {
    // Proceed with the entered URL despite the warning
    this.insecureUrlWarning = false;
  }

  ngOnInit(): void {
    this.fetchAllDownloads();
  }

  downloadFile(): void {
    this.fileDownloaderService.downloadFile(this.url, this.storeInMongo, this.filename, this.destination)
      .subscribe(response => {
        console.log(response.message);
        this.fetchAllDownloads(); // Refresh the list after download
      }, error => {
        console.error("Error downloading file:", error);
      });
  }

  fetchAllDownloads(): void {
    this.fileDownloaderService.getAllDownloads()
      .subscribe(response => {
        this.downloads = response.files;
      }, error => {
        console.error("Error fetching downloads:", error);
      });
  }

  fetchDownload(id: string): void {
    this.fileDownloaderService.getSingleDownload(id)
      .subscribe(response => {
        console.log(response);
        // Handle the fetched file, maybe display in a modal or another component
      }, error => {
        console.error("Error fetching single download:", error);
      });
  }

  deleteDownload(id: string): void {
    this.fileDownloaderService.deleteDownload(id)
      .subscribe(response => {
        console.log(response.message);
        this.fetchAllDownloads(); // Refresh the list after deletion
      }, error => {
        console.error("Error deleting download:", error);
      });
  }
}