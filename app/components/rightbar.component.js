"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var RightBarComponent = (function () {
    function RightBarComponent() {
        this.show = 'default';
    }
    RightBarComponent.prototype.ngOnChanges = function (changes) {
        if (this.scenario != null) {
            this.show = 'show';
        }
    };
    RightBarComponent.prototype.showBar = function () {
        if (this.show === 'default' || this.show == 'hide') {
            this.show = 'show';
        }
        else if (this.show === 'show') {
            this.show = 'hide';
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], RightBarComponent.prototype, "scenario", void 0);
    RightBarComponent = __decorate([
        core_1.Component({
            selector: 'right-bar',
            templateUrl: 'app/templates/rightbar.component.html',
            styleUrls: ['app/styles/rightbar.component.css']
        }), 
        __metadata('design:paramtypes', [])
    ], RightBarComponent);
    return RightBarComponent;
}());
exports.RightBarComponent = RightBarComponent;
//# sourceMappingURL=rightbar.component.js.map