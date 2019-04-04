import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'decodeHtmlString'})
export class DecodeHtmlString implements PipeTransform {
    transform(value: string) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = value;
        return tempElement.innerText;
    }
}
