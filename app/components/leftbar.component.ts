import { Component, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { AppService } from '../services/app.service';
import { Template } from '../models/template';
import { Doc } from '../models/document';
import { SettingMenuInterface } from '../models/helpers';

@Component({
  selector: 'left-bar',
  providers: [AppService],
  templateUrl: 'app/templates/leftbar.component.html',
  styleUrls: ['app/styles/leftbar.component.css']
})

export class LeftBarComponent implements OnInit, OnChanges { 
  brand:string = '@qCMS';
  extend:string = null;
  scenario:string = null;
  active:string = null;
  templates:Array<Template>;
  documents:Array<Doc>;
  errMessage:any;
  @Input() templateAdded:boolean;
  @Input() templateDeleted:boolean;
  @Input() templateEdited:boolean;
  @Input() documentAdded:boolean;
  @Input() documentDeleted:boolean;
  @Input() documentEdited:boolean;
  @Input() document:Doc;

  settingMenu:Array<SettingMenuInterface> = [
    {title: 'New template', icon: 'fa-file-o', is_selected: false, scenario: 'newTemplate'},
    {title: 'Edit template', icon: 'fa-edit', is_selected: false, scenario: 'editTemplate'},
    {title: 'Add user', icon: 'fa-user-plus', is_selected: false, scenario: 'addUser'},
    {title: 'Preferences', icon: 'fa-cutlery', is_selected: false, scenario: 'preferences'},
    {title: 'Account', icon: 'fa-briefcase', is_selected: false, scenario: 'account'}
  ]


  constructor (private appService:AppService) {}

  ngOnInit() {
    this.getDocuments();
    this.getTemplates();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.templateAdded === true) {
      this.getTemplates('added');
    }
    if (this.templateDeleted === true) {
      this.getTemplates('deleted');
    }
    if (this.templateEdited === true) {
      this.getTemplates('edited');
    }
    if (this.documentAdded === true) {
      this.getDocuments('added');
    }
    if (this.documentDeleted === true) {
      this.getDocuments('deleted');
    }
    if (this.documentEdited === true) {
      this.getDocuments('edit');
    }
  }

  @Output() onSelectScenario = new EventEmitter<string>();
  selectRightBarScenario(scenario:string):void {
    if (scenario === 'newTemplate') {
      this.newTemplate();
    }
    this.onSelectScenario.emit(scenario);
  }

  setScenario(scenario:string):void {
    this.scenario = scenario;
    this.active = scenario;
    this.openSelected(scenario);
  }

  selectSettingElement(element:SettingMenuInterface) {
    if (element.is_selected === false) {
      for (let e of this.settingMenu) {
        if (e.is_selected === true) {
          e.is_selected = false;
        }
      }
      element.is_selected = true;
    }
  }

  extendBar(scenario:string):void {
    if (this.extend === 'show' && this.scenario === scenario) {
      this.extend = 'hide';
      this.active = null;
    } else {
      this.extend = 'show';
      this.setScenario(scenario);
    }
  }

  handleScenariosTemp(templates:Array<Template>, scenario?:string) {
    if (scenario) {
      if (scenario === 'edit') {
        return
      }
      else if (scenario === 'deleted') {
        this.selectDefaultTemplate(templates);
      }
      else if (scenario === 'added') {
        return
      }
    }
    else {
      this.selectDefaultTemplate(templates);
    }
  }

  getTemplates(scenario?:string):void {
    this.appService.getTemplates().subscribe(
      templates => {
        this.templates = templates,
        this.handleScenariosTemp(templates, scenario)
      },
      error => this.errMessage = error
    );
  }

  @Output() onSelectTemplate = new EventEmitter<Template>();
  selectTemplate(template:Template):void {
    template.is_selected = true;
    for (let temp of this.templates) {
      if (temp._id !== template._id && temp.is_selected === true) {
        temp.is_selected = false;
      }
    }
    let selectedTemplate = new Template(template.name, template.elements, template.is_default, template.collection);
    this.onSelectTemplate.emit(selectedTemplate);
  }

  findDefault(templates:Array<Template>):Template {
    for (let template of templates) {
      if (template.is_default === true) {
        return template;
      }
    }
    return new Template();
  }

  selectDefaultTemplate(elements:Array<Template>):void {
    for (let element of elements) {
      if (element.is_selected === true) {
        this.extendBar('new');
        return
      }
    }
    this.selectTemplate(this.findDefault(elements));
    this.extendBar('new');
  }

  selectDefaultDocument(elements:Array<Doc>):void {
    for (let element of elements) {
      if (element.is_selected === true) {
        this.extendBar('all');
        return
      }
    }
    this.selectDocument(elements[0]);
    this.extendBar('all');
  }

  selectCurrentDocument(documents:Array<Doc>):void {
    for (let doc of documents) {
      if (doc._id === this.document._id) {
        doc.is_selected = true;
        return
      }
    }
  }

  handleScenariosDoc(documents:Array<Doc>, scenario?:string) {
    if (scenario) {
      if (scenario === 'edit') {
        this.selectCurrentDocument(documents);
      }
      else if (scenario === 'deleted') {
        this.selectDocument(documents[0]);
      }
      else if (scenario === 'added') {
        this.selectDocument(documents[0]);
        this.openSelected('editDocument');
        this.extendBar('all');
      }
    }
    else {
      return
    }
  }

  newTemplate():void {
    let newTemplate = new Template();
    this.onSelectTemplate.emit(newTemplate);
  }

  getDocuments(scenario?:string):void {
    this.appService.getDocuments().subscribe(
      documents => {
        this.documents = documents,
        this.handleScenariosDoc(documents, scenario) 
      },
      error => this.errMessage = error
    );
  }

  @Output() onSelectDocument = new EventEmitter<Doc>();
  selectDocument(document:Doc) {
    document.is_selected = true;
    for (let doc of this.documents) {
      if (doc._id !== document._id && doc.is_selected === true) {
        doc.is_selected = false;
      }
    }
    let selectedDocument = new Doc(document.title, document.template, document._id);
    this.onSelectDocument.emit(selectedDocument);
  }

   openSelected(scenario:string):void {
    if (scenario === 'all') {
      for (let document of this.documents) {
        if (document.is_selected === true) {
          let selectedDocument = new Doc(document.title, document.template, document._id);
          this.onSelectDocument.emit(selectedDocument);
          this.selectRightBarScenario('editDocument');
          break;
        }   
      }
    } else if (scenario === 'new') {
      for (let template of this.templates) {
        if (template.is_selected === true) {
          let selectedTemplate = new Template(template.name, template.elements, template.is_default);
          this.onSelectTemplate.emit(selectedTemplate);
          this.selectRightBarScenario('useTemplate');
          break
        }
      }
    } else if (scenario === 'admin') {
      for (let element of this.settingMenu) {
        if (element.is_selected === true) {
          this.selectRightBarScenario(element.scenario);
          break;
        }
      }
    }
  }
}