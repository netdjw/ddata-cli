import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from 'ddata-core';
import { <%= classify(name) %>Interface } from 'src/app/models/<%= slasherize(name) %>/<%= dasherize(name) %>.interface';
import { <%= classify(name) %> } from 'src/app/models/<%= slasherize(name) %>/<%= dasherize(name) %>.model';

@Component({
  selector: 'app-<%= dasherize(name) %>-list',
  templateUrl: './<%= dasherize(name) %>-list.component.html',
  styleUrls: ['./<%= dasherize(name) %>-list.component.css']
})
export class <%= classify(name) %>ListComponent extends BaseListComponent<<%= classify(name) %>Interface> implements OnInit {

  constructor() {
   super(<%= classify(name) %>);
  }
}
