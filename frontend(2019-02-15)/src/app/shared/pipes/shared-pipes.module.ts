import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExcerptPipe } from './excerpt.pipe';
import { GetValueByKeyPipe } from './get-value-by-key.pipe';
import { RelativeTimePipe } from './relative-time.pipe';
import { DecodeHtmlString } from './decodeHtml.pipe';

const pipes = [
  ExcerptPipe,
  GetValueByKeyPipe,
  RelativeTimePipe,
  DecodeHtmlString
];

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: pipes,
  exports: pipes
})
export class SharedPipesModule { }
