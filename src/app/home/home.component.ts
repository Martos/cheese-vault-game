import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';

import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  items: MenuItem[];
  topBarItems: MenuItem[];
  currentValue = null;

  refreshSeconds = 60;
  refreshValueInterval = null;

  constructor(private router: Router, private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
    this.pricesThread();
    this.items = [
      {
          label: 'File',
          icon: 'pi pi-pw pi-file',
          items: [{
                  label: 'New', 
                  icon: 'pi pi-fw pi-plus',
                  items: [
                      {label: 'User', icon: 'pi pi-fw pi-user-plus'},
                      {label: 'Filter', icon: 'pi pi-fw pi-filter'}
                  ]
              },
              {label: 'Open', icon: 'pi pi-fw pi-external-link'},
              {separator: true},
              {label: 'Quit', icon: 'pi pi-fw pi-times'}
          ]
      }
    ];
    this.topBarItems = [
      { label: 'Cheese Vault v0.85' }
    ];
  }

  pricesThread() {
    this.currentValue = localStorage.getItem('currentPrice');
    if(!this.currentValue) {
      this.http.get<any>('https://www.randomnumberapi.com/api/v1.0/random?min=0&max=1000&count=1').subscribe(data => {
        this.currentValue = (data[0] / 100);
        localStorage.setItem('currentPrice', this.currentValue);
      });
    }
    this.refreshValueInterval = setInterval(() => {
      this.http.get<any>('https://www.randomnumberapi.com/api/v1.0/random?min=0&max=1000&count=1').subscribe(data => {
        this.currentValue = (data[0] / 100);
        localStorage.setItem('currentPrice', this.currentValue);
        this.messageService.add({severity:'success', summary:'Service Message', detail:'Price updates!'});
      });
    }, 1000 * this.refreshSeconds);
  }

}
