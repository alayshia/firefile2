import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloaderComponent } from './file-downloader.component';
import { FileDownloaderService } from './file-downloader.service';
import { of, throwError } from 'rxjs';

describe('FileDownloaderComponent', () => {
  let component: FileDownloaderComponent;
  let fixture: ComponentFixture<FileDownloaderComponent>;
  let mockFileDownloaderService: { getFileSize: any; downloadFile: any; deleteFile: any; };

  beforeEach(async () => {
    mockFileDownloaderService = {
      getFileSize: jasmine.createSpy('getFileSize').and.returnValue(of(500)), // assuming 500 bytes as default mock value
      downloadFile: jasmine.createSpy('downloadFile').and.returnValue(of({ type: 'progress', value: 50 })), // 50% progress as a mock value
      deleteFile: jasmine.createSpy('deleteFile').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      declarations: [FileDownloaderComponent],
      providers: [
        { provide: FileDownloaderService, useValue: mockFileDownloaderService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check file size', () => {
    component.downloadUrl = 'https://example.com/file.zip';
    component.checkFileSize();
    expect(mockFileDownloaderService.getFileSize).toHaveBeenCalledWith('https://example.com/file.zip');
    expect(component.isLargeFile).toBeFalse();  // As our mock returns 500 bytes which is less than 1 GB
  });

  it('should confirm download and reset isLargeFile flag', () => {
    component.isLargeFile = true;
    component.confirmDownload();
    expect(component.isLargeFile).toBeFalse();
  });

  it('should handle download', () => {
    component.downloadUrl = 'https://example.com/file.zip';
    component.download();
    expect(mockFileDownloaderService.downloadFile).toHaveBeenCalled();
    expect(component.downloadProgress).toBe(50); // Our mock progress value is 50
  });

  it('should handle delete', () => {
    component.downloadUrl = 'https://example.com/file.zip';
    component.delete();
    expect(mockFileDownloaderService.deleteFile).toHaveBeenCalled();
    expect(component.previewData).toBeNull(); // After deletion
  });

  it('should handle error in getFileSize', () => {
    mockFileDownloaderService.getFileSize.and.returnValue(throwError('Error occurred'));
    component.downloadUrl = 'https://example.com/error.zip';
    component.checkFileSize();
  });
});