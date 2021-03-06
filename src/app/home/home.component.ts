import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('dataImportInput') dataImportInput: ElementRef;

  items: MenuItem[];
  topBarItems: MenuItem[];
  currentValue = null;

  saveFile: any;

  basicOptions: any;
  basicData: any;

  cheeseBalance = 0;
  cashBalance = 0;

  cheeseFromFile = 0;

  maxPrice = 1000;
  refreshSeconds = 10;
  refreshValueInterval = null;

  importDataModalShow = false;

  labelChart = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  pricesData = [];
  chartFill = true;

  constructor(private router: Router, private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
    this.balanceThread();
    this.pricesThread();

    this.basicOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };

    this.basicData = {
        labels: this.labelChart,
        datasets: [
            {
                label: 'Prices Updates',
                data: this.pricesData,
                fill: this.chartFill,
                borderColor: '#42A5F5',
                tension: .4
            },
        ]
    };

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

  balanceThread() {
    let cheeseBalanceTmp = localStorage.getItem('cheeseBalance');
    if(!cheeseBalanceTmp) {
      localStorage.setItem('cheeseBalance', "0");
    } else {
      this.cheeseBalance = Number(localStorage.getItem('cheeseBalance'));
    }

    let cashBalanceTmp = localStorage.getItem('cashBalance');
    if(!cashBalanceTmp) {
      localStorage.setItem('cashBalance', "0");
    } else {
      this.cashBalance = Number(localStorage.getItem('cashBalance'));
    }
  }

  pricesThread() {
    let pricesDataTmp = JSON.parse(localStorage.getItem('pricesData'));
    let dataMask = [];

    if(!pricesDataTmp) {
      localStorage.setItem('pricesData', JSON.stringify(dataMask));
    } else {
      this.pricesData = pricesDataTmp;
      dataMask = pricesDataTmp;
    }

    this.currentValue = localStorage.getItem('currentPrice');
    if(!this.currentValue) {
      this.currentValue = (this.getRandomInt(this.maxPrice) / 100);
      localStorage.setItem('currentPrice', this.currentValue);
      dataMask.push(this.currentValue);
      localStorage.setItem('pricesData', JSON.stringify(dataMask));
      this.updateChart(dataMask);
    }
    this.refreshValueInterval = setInterval(() => {
      this.currentValue = (this.getRandomInt(this.maxPrice) / 100);
      localStorage.setItem('currentPrice', this.currentValue);
      dataMask.push(this.currentValue);
      if(dataMask.length > 20) {
        dataMask.shift();
      }
      localStorage.setItem('pricesData', JSON.stringify(dataMask));
      this.updateChart(dataMask);
      this.messageService.add({severity:'success', summary:'Service Message', detail:'Price updates!'});
    }, 1000 * this.refreshSeconds);
  }

  updateChart(data: Array<any>) {
      this.basicData = {
        labels: this.labelChart,
        datasets: [
            {
                label: 'Prices Updates',
                data: data,
                fill: this.chartFill,
                borderColor: '#42A5F5',
                tension: .4
            },
        ]
    };
  }

  showImportDataModal() {
    this.dataImportInput.nativeElement.value = '';
    this.cheeseFromFile = 0;
    this.importDataModalShow = true;
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  fileChange(event) {
    let file = event.target.files[0];
    let binaryData = null;

    const promise = new Promise((resolve) => {
      var reader = new FileReader();
      reader.onload = function(e) {
        binaryData = e.target.result;
        let cheeseFromFileTmp = new Uint32Array(binaryData.slice(169, 173))[0];

        new Uint8Array(binaryData)[169] = 0
        new Uint8Array(binaryData)[170] = 0
        new Uint8Array(binaryData)[171] = 0
        new Uint8Array(binaryData)[172] = 0

        resolve({data: cheeseFromFileTmp, file: binaryData});
      };
      reader.onerror = function(e) {
        console.log('Error : ' + e.type);
      };
      reader.readAsArrayBuffer(file);
    });

    promise.then(result => {
      this.cheeseFromFile = Number(result['data']);
      this.saveFile = new Blob([binaryData], {
        type: 'application/octet-stream'
      });
    });
  }

  importData() {
    this.cheeseBalance = this.cheeseBalance + this.cheeseFromFile;
    this.cheeseFromFile = 0;
    this.importDataModalShow = false;

    var file = new File([this.saveFile], "name");
    var a = document.createElement("a");
    var url = URL.createObjectURL(file);
    a.href = url;
    a.download = "DATA.BIN";
    document.body.appendChild(a);
    a.click();

    this.messageService.add({severity:'success', summary:'Service Message', detail:'Cheese imported!'});
    localStorage.setItem('cheeseBalance', ""+this.cheeseBalance);
  }

}
