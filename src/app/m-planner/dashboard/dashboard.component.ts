import { AppService } from './../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private appService: AppService) { }

  user = this.appService.getUserInfoFromLocalStorage();

  users = [];

  fetchUserList = () => {
    this.appService.getAllNormalUsers().subscribe((apiResponse) => {
      this.users = apiResponse.data;
    });
  }

  ngOnInit() {
    this.fetchUserList();
  }

}
