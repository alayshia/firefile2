import { Component, Input, OnChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProgressBarComponent implements OnChanges {

  @Input() downloadProgress: number = -1;
  public progress: number = 0;

  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnChanges(): void {
    console.log('Updating ProgressBar width to:', this.downloadProgress + '%');
    if (this.downloadProgress !== -1) {
      this.progress = this.downloadProgress;
      console.log('ProgressBarComponent receiving progress:', this.downloadProgress);
      this.cdRef.detectChanges(); //Forces a change detection

    }
  }
}