import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloaderComponent } from './file-downloader.component';
import { FileDownloaderService } from './file-downloader.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('FileDownloaderComponent', () => {
  let component: FileDownloaderComponent;
  let fixture: ComponentFixture<FileDownloaderComponent>;
  let fileDownloaderService: FileDownloaderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileDownloaderComponent],
      imports: [HttpClientTestingModule],
      providers: [FileDownloaderService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDownloaderComponent);
    component = fixture.componentInstance;
    fileDownloaderService = TestBed.inject(FileDownloaderService);

    spyOn(fileDownloaderService, 'downloadFile').and.returnValue(of(100));
    spyOn(fileDownloaderService, 'getAllDownloads').and.returnValue(of({ files: [] }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should download a file when `downloadFile` is called', () => {
    component.downloadFile();
    expect(fileDownloaderService.downloadFile).toHaveBeenCalledWith('', true, '', '');
  });
});