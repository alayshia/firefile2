import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-qr-code-generator',
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css']
})
export class QrCodeGeneratorComponent implements OnInit {
  @Input() urlToShare: string | null = null;

  constructor() { }

  ngOnInit(): void { }

}