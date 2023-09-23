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
  public filenameIsUnique: boolean = false;
  public filenameErrorMessage: string = '';
  public currentDownloadURL: string | null = null;
  public revealQRCode: boolean = false;

  constructor(private fileDownloaderService: FileDownloaderService) { }

  ngOnInit(): void {
    this.fetchAllDownloads();
  }


  showQRCode(url: string): void {
    this.currentDownloadURL = url;
    this.revealQRCode = !this.revealQRCode;
  }

  checkFilenameUniqueness(): void {
    this.fileDownloaderService.isFilenameUnique(this.filename)
      .subscribe(response => {
        if (response.isUnique) {
          this.filenameIsUnique = true;
          this.filenameErrorMessage = '';
        } else {
          this.filenameIsUnique = false;
          this.filenameErrorMessage = 'Filename is not unique!';
        }
      }, error => {
        console.error("Error checking filename uniqueness:", error);
      });
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

  fetchDownload(filename: string): void {
    this.fileDownloaderService.getSingleDownload(filename)
      .subscribe(response => {
        console.log(response);
      }, error => {
        console.error("Error fetching single download:", error);
      });
  }

  deleteDownload(filename: string): void {
    this.fileDownloaderService.deleteDownload(filename)
      .subscribe(response => {
        console.log(response.message);
        this.fetchAllDownloads(); // Refresh the list after deletion
      }, error => {
        console.error("Error deleting download:", error);
      });
  }
}