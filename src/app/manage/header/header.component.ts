import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_AFX } from 'src/app/core/constant/authen-constant';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem(TOKEN_AFX);
    this.router.navigate(['/login']);
  }
}
