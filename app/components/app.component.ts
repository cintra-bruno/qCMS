import { Component } from '@angular/core';
import { AppService } from '../services/app.service';
import { Template, Element } from '../models/template';
import { User } from '../models/user';
import { Doc } from '../models/document';
import { Session } from '../models/session';
import { LoginFields } from '../models/helpers';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'main-app',
  providers: [AppService],
  templateUrl: 'app/templates/app.component.html',
  styleUrls: ['app/styles/app.component.css'],
})

export class AppComponent { 
  scenario:string;
  template:Template;
  templateAdded:boolean;
  templateDeleted:boolean;
  templateEdited:boolean;
  documentAdded:boolean;
  documentDeleted:boolean;
  documentEdited:boolean;
  document:Doc;
  errorMessage:any;

  sessionId:string;
  remember:boolean = false;
  session:Session;

  loginForm:LoginFields = {
    login: '',
    pw: ''
  }

  loginErr:boolean = false;

  constructor (private appService:AppService) {
    this.template = new Template();
    this.sessionId = Cookie.get('sessionId');
    this.getSession();
  }

  getSession():void {
    if (!this.sessionId) {
      return
    }
    this.appService.getSession(this.sessionId).subscribe(
      session  => this.session = new Session(session.user, session.sessionId, new Date(session.createdAt)),
      error => {
        this.errorMessage = error,
        Cookie.delete('sessionId')
      }
    )
  }

  signIn():void {
    if (this.loginErr) this.loginErr = false;
    this.appService.loginUser(this.loginForm).subscribe(
      user => {
        this.session = new Session(user),
        this.setSession(this.session)
      },
      error => {
        this.errorMessage = error,
        this.loginErr = true;
      }
    )
  }

  setSession(session:Session):void {
    this.appService.setSession(session).subscribe(
      sessionId => {
        this.sessionId = sessionId.sessionId,
        this.getSession(),
        this.remember ? Cookie.set('sessionId', this.sessionId, 99) : Cookie.set('sessionId', this.sessionId)
      },
      error => this.errorMessage = error
    )
  }

  deleteSession(sessionId:string):void {
    this.appService.deleteSession(sessionId).subscribe(
      response => {
        Cookie.delete('sessionId'),
        location.reload()
      },
      error => this.errorMessage = error
    )
  }

  onSignOut(signOut:boolean):void {
    if (signOut = true) {
      this.deleteSession(Cookie.get('sessionId'))
    }
  }

  onSelectScenario(scenario:string):void {
    this.scenario = scenario;
  }

  onChangeScenario(scenario:string):void {
    this.scenario = scenario;
  }

  onSelectTemplate(template:Template):void {
    this.template =  template;
  }

  onSelectDocument(document:Doc):void {
    this.document = document;
    this.template = document.template;
  }

  onRefresh(template:Template):void {
    this.template = template;
  }

  onAddTemplate(templateAdded:boolean):void {
    this.templateAdded = templateAdded;
    setTimeout(
      () => this.templateAdded = undefined, 500
    )
  }

  onDeleteTemplate(templateDeleted:boolean):void {
    this.templateDeleted = templateDeleted;
    setTimeout(
      () => this.templateDeleted = undefined, 500
    )
  }

  onEditTemplate(templateEdited:boolean):void {
    this.templateEdited = templateEdited;
    setTimeout(
      () => this.templateEdited = undefined, 500
    )
  }

  onAddDocument(documentAdded:boolean):void {
    this.documentAdded = documentAdded;
    setTimeout(
      () => this.documentAdded = undefined, 500
    )
  }

  onDeleteDocument(documentDeleted:boolean):void {
    this.documentDeleted = documentDeleted;
    setTimeout(
      () => this.documentDeleted = undefined, 500
    )
  }

  onEditDocument(documentEdited:boolean):void {
    this.documentEdited = documentEdited;
    setTimeout(
      () => this.documentEdited = undefined, 500
    )
  }

  onRefreshSession(refresh:boolean):void {
    this.getSession();
  }
}