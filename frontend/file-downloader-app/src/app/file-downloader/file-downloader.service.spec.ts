import { TestBed } from '@angular/core/testing';
import { FileDownloaderService } from './file-downloader.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('FileDownloaderService', () => {
  let service: FileDownloaderService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileDownloaderService]
    });

    service = TestBed.inject(FileDownloaderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should download a file', () => {
    const mockResponse = new Blob();
    service.downloadFile('testUrl', true, 'testName', 'testDestination').subscribe(response => {
      expect(response).toEqual(100);
    });

    const req = httpTestingController.expectOne('http://localhost:3000/download');
    expect(req.request.method).toEqual('POST');
    req.flush(mockResponse);
  });
});