import { Component, OnInit } from '@angular/core';
declare const jqKeyboard: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'afx-front';
  constructor() {
    jqKeyboard.init();
  }

  ngOnInit(): void {
  }
}
