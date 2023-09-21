import { Component, OnInit } from '@angular/core';
import { FileDownloaderService } from './file-downloader.service';
@Component({
  selector: 'app-file-downloader',
  templateUrl: './file-downloader.component.html',
  styleUrls: ['./file-downloader.component.css']
})
export class FileDownloaderComponent
  implements OnInit {

  public downloads: any[] = [];
  public url: string = '';
  public filename: string = '';
  public storeInMongo: boolean = true;
  public destination: string = '';
  insecureUrlWarning = false;
  public showSpinner: boolean = false;
  public downloadProgress: number = -1;

  constructor(private fileDownloaderService: FileDownloaderService) { }

  ngOnInit(): void {
    this.fetchAllDownloads();
  }

  downloadFile(): void {
    this.downloadProgress = 0;
    this.fileDownloaderService.downloadFile(this.url, this.storeInMongo, this.filename, this.destination)
      .subscribe(progress => {
        this.downloadProgress = progress;
        console.log("FileDownloaderComponentProgress:", this.downloadProgress);
        if (progress === 100) {
          setTimeout(() => {
            this.downloadProgress = 0;
          }, 2000);
          this.fetchAllDownloads();
        }
      }, error => {
        console.error("Error downloading file:", error);
        this.downloadProgress = 0;
      });
  }

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


  fetchAllDownloads(): void {
    this.fileDownloaderService.getAllDownloads()
      .subscribe(response => {
        this.downloads = response.files;
        console.log(this.downloads);
      }, error => {
        console.error("Error fetching downloads:", error);
      });
  }

  fetchDownload(id: string): void {
    this.fileDownloaderService.getSingleDownload(id)
      .subscribe(response => {
        console.log(response);
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