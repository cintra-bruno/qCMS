import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Template, Element } from '../models/template';
import { Doc } from '../models/document';
import { Alert } from '../models/helpers';
import { AppService } from '../services/app.service';

@Component({
    selector: 'right-bar',
    providers: [AppService],
    templateUrl: 'app/templates/rightbar.component.html',
    styleUrls: ['app/styles/rightbar.component.css']
})

export class RightBarComponent implements OnChanges {

  show:string = 'default';
  @Input() scenario:string;
  @Input() template:Template;
  @Input() document:Doc;
  errorMessage:any;
  response:any;
  showAlert:boolean;
  hideAlert:boolean;
  alert:Alert;
  elementsTypes:Array<string> = ['header', 'text'];
  elementsList:Array<Element> = [];
  templateAdded:boolean;
  documentTitle:string = '';
  documentAdded:boolean;

  constructor (private appService: AppService) { 
      this.bootstrapElements()
   } 

  bootstrapElements():void {
    for (let type of this.elementsTypes) {
      let element = new Element(type);
      this.elementsList.push(element);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.scenario != null) {
      this.show = 'show';
    }
  }

  showBar():void {
    if (this.show === 'default' || this.show == 'hide') {
      this.show = 'show';
    } else if (this.show === 'show') {
      this.show = 'hide';
    }
  }

  templateName:string;
  templateElements:Array<Element> = [];

  addElement(element:Element):void {
    let indexes:Array<number> = [];
    for (let i of this.templateElements) {
      indexes.push(i.index);
    }
    element.index = indexes.length > 0 ? Math.max.apply(null, indexes) +1 : 0;
    let elementToPush:Element = Object.assign({}, element);
    this.templateElements.push(elementToPush);

    this.refreshTemplate();
  }

  removeElement(index:number):void {
    for (let i of this.templateElements) {
      if (i.index === index) {
        this.templateElements.splice(this.templateElements.indexOf(i), 1);
        this.refreshTemplate();
        return
      }
    }
  }

  @Output() onRefresh = new EventEmitter<Template>();
  refreshTemplate() {
    this.template = new Template(this.templateName, this.templateElements);
    this.onRefresh.emit(this.template);
  }

  chosenElement:Element = new Element();
  choseElement(element:Element):void {
    this.chosenElement = element;
  }

  saveTemplate():void {
    this.appService.postTemplate(this.template).subscribe(
      response => {
        this.response = response,
        this.resetTemplateForm(response),
        this.showAlerts('success', 'Template saved'),
        this.emitAddTemplate()
      },
      error => {
        this.errorMessage = <any>error,
        this.showAlerts('danger', 'Something went wrong')
      }
    );
  }

  resetTemplateForm(response:string):void {
    if (response === 'success') {
      this.template = new Template();
    }
  }

  showAlerts(type:string, message:string):void {
    this.showAlert = true;
    this.alert = new Alert(type, message);
    setTimeout(() => {
      this.hideAlert = true;
    }, 6000);
    setTimeout(() => {
      this.showAlert = false;
      this.hideAlert = false;
    }, 7500);
  }

  @Output() onAddTemplate = new EventEmitter<boolean>();
  emitAddTemplate() {
    this.templateAdded = true;
    this.onAddTemplate.emit(this.templateAdded);
    this.template = new Template();
    this.onRefresh.emit(this.template);
  }

  addDocument(title:string, template:Template):void {
    let doc = new Doc(title, template);
    this.appService.postDocument(doc).subscribe(
      response => {
        this.response = response,
        this.showAlerts('success', 'Document saved'),
        this.emitAddDocument()
      },
      error => {
        this.errorMessage = <any>error,
        this.showAlerts('danger', 'Something went wrong')
      }
    );
  }

  editDocument(document:Doc):void {
    this.appService.putDocument(document).subscribe(
      response => {
        this.response = response,
        this.showAlerts('success', 'Document saved'),
        this.emitAddDocument()
      },
      error => {
        this.errorMessage = <any>error,
        this.showAlerts('danger', 'Something went wrong')
      }
    );
  }

  @Output() onAddDocument = new EventEmitter<boolean>();
  emitAddDocument() {
    this.documentAdded = true;
    this.onAddDocument.emit(this.documentAdded);
  }
}