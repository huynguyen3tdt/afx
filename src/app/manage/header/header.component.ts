import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TOKEN_AFX } from 'src/app/core/constant/authen-constant';
import { AuthenService } from 'src/app/core/services/authen.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private authenService: AuthenService) { }

  ngOnInit() {
  }

  logout() {
    this.authenService.logout().subscribe(response => {
      if (response.meta.code === 200) {
        localStorage.removeItem(TOKEN_AFX);
        this.router.navigate(['/login']);
      }
    });
  }
}
