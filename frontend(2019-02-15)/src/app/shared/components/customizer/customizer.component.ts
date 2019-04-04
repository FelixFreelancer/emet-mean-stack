import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-customizer',
    templateUrl: './customizer.component.html',
    styleUrls: ['./customizer.component.scss']
})
export class CustomizerComponent implements OnInit {
    isOpen: boolean;
    constructor() { }

    ngOnInit() {
    }

}
