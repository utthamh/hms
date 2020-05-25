
import { Component, Input, Output, OnInit, EventEmitter, HostBinding, OnChanges, SimpleChanges, AfterViewInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-zs-textbox',
  templateUrl: './zs-textbox.component.html',
  styleUrls: ['./zs-textbox.component.less']
})
export class ZsTextboxComponent implements OnInit, OnChanges {

  @Input() hint: string;
  @Input() placeholder: string = 'Search rep';
  @Input() hideLabel: string;
  @Input() regex: string;
  @Input() minCharLength: Number;
  @Input() maxCharLength: Number;
  @Input() required: boolean;
  @Input() showOptionalText: boolean;
  @Input() inerrorstate: boolean;
  @Input() modelvalue: string;
  @Input() validatefunction: Function;
  @Input() validatefunctionArgs = [];
  @Input() blurfunction: Function;
  @Input() blurfunctionArgs: any;
  @Input() inputtype: string = "text";
  @Input() customstyle: object;
  @Input() fieldsetStyle: object;
  @Input() errorSpanStyle: object;
  @Input() enablesearch: String = 'true';
  @Input() disabled: Boolean;
  @Input() regexErrorMessage = '';
  @Input() touched?: boolean = false;
  @Input() showLoader = false;

  @Output() modelvalueChange = new EventEmitter(true);
  @Output() modelvalueDiff = new EventEmitter(true);
  @Output() inerrorstateChange = new EventEmitter(true);
  @Output() validated = new EventEmitter(true);

  mentionClosedFunction: Function;
  @Input() mentions: any = [];
  @Input() mentionConfiguration: any = {};
  @Input() mentionListTemplate: TemplateRef<any>;

  errorClass = 'zs-error';
  customClass = '';
  searchspan = '';
  previousValue;
  currentValue;
  errorMessage = '';
  showMinCharError = false;

  @HostBinding('class.zs-error') public inputClass = '';

  constructor() { }

  ngOnInit() {
    this.validate();
    this.blurEvent();

    if (this.enablesearch === 'true') {
      this.searchspan = 'zs-input-icon zs-icon-search';
    }

    if (this.showOptionalText === undefined) {
      this.showOptionalText = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modelvalue']) {
      this.previousValue = changes['modelvalue'].previousValue;
      this.currentValue = changes['modelvalue'].currentValue;
      this.modelvalueDiff.emit({
        'previousValue': changes['modelvalue'].previousValue,
        'currentValue': changes['modelvalue'].currentValue
      });
    }
    if (changes['modelvalue'] && changes['modelvalue'].currentValue !== undefined) {
      this.touched = true;
    } else if (changes['required']) {
      this.validate();
    }

    if (changes['mentions'] && changes['mentions'].currentValue) {
     this.mentionConfiguration = changes['mentionConfiguration'].currentValue;
     this.mentionClosedFunction = this.mentionDropDownClosed.bind(this);
     this.mentionConfiguration['mentionSelect'] = this.mentionClosedFunction;
    }
  }

  setDefaultValues() {
    if (this.modelvalue === undefined) {
      this.modelvalue = '';
    }
    this.inerrorstate = false;
  }

  clearModelValue() {
    this.modelvalue = '';
    this.validate();
  }

  validate() {
    if (this.checkForCharLimit()) {
      this.inputClass = this.errorClass;
      this.errorMessage = 'Character limit exceeded. Enter value less than or equal to ' + this.maxCharLength + ' characters.';
      this.inerrorstate = true;
    }
    else if (this.checkForMinChar()) {
      this.inputClass = this.errorClass;
      this.errorMessage = 'Enter value more than ' + this.minCharLength + ' characters.';
      this.inerrorstate = true;
    }
    else if (this.checkForRequiredField()) {
      this.inputClass = this.errorClass;
      this.errorMessage = 'Enter valid value';
      this.inerrorstate = true;
    } else if (this.checkForRegexValidation()) {
      this.inputClass = this.errorClass;
      if (this.regexErrorMessage === '') {
        this.errorMessage = 'Value contains special characters';
      } else {
        this.errorMessage = this.regexErrorMessage;
      }
      this.inerrorstate = true;
    } else if (this.validatefunction) {
      let message: any;
      if (this.validatefunctionArgs && this.validatefunctionArgs.length > 0) {
        message = this.validatefunction(this.modelvalue, this.validatefunctionArgs);
      } else {
        message = this.validatefunction(this.modelvalue);
      }
      this.checkForError(message);
    } else {
      this.resetTextBox();
    }
    this.inerrorstateChange.emit(this.inerrorstate);
    this.modelvalueChange.emit(this.modelvalue);
    this.validated.emit(true);
  }

  checkForRequiredField() {
    if (this.required !== undefined && this.required) {
      if (this.modelvalue === undefined || (this.modelvalue !== undefined && this.modelvalue !== null && this.modelvalue.trim().length === 0)) {
        return true;
      }
      return false;
    }
  }

  checkForMinChar() {
    if (this.minCharLength !== undefined && this.minCharLength !== null && this.modelvalue !== undefined && this.modelvalue !== null) {
      if (this.modelvalue.trim().length < this.minCharLength) {
        if (this.showMinCharError) {
          return true;
        }
      }
      else if (this.modelvalue.trim().length >= this.minCharLength) {
        this.showMinCharError = true
      }
      return false;
    }
  }

  checkForCharLimit() {
    if (this.modelvalue !== undefined && this.modelvalue !== null && this.modelvalue.length > this.maxCharLength) {
      return true;
    }
    return false;
  }

  checkForRegexValidation() {
    if (this.regex !== undefined && !new RegExp(this.regex).test(this.modelvalue)) {
      return true;
    }
    return false;
  }

  resetTextBox() {
    this.inputClass = '';
    this.errorMessage = '';
    this.inerrorstate = false;
  }

  blurEvent() {
    if (this.blurfunction) {
      if (this.errorMessage === '') {
        if (this.blurfunctionArgs !== undefined) {
          this.errorMessage = this.blurfunction(this.modelvalue, ...this.blurfunctionArgs);
        } else {
          this.errorMessage = this.blurfunction(this.modelvalue);
        }
      }
      this.checkForError(this.errorMessage);
    }
    if (this.modelvalue !== null && this.modelvalue !== undefined && this.minCharLength) {
      this.showMinCharError = true;
      this.validate();
    }
  }

  checkForError(errorMessage) {
    if (errorMessage && errorMessage.length > 0) {
      this.inputClass = this.errorClass;
      this.errorMessage = errorMessage;
      this.inerrorstate = true;
      this.inerrorstateChange.emit(this.inerrorstate);
    } else {
      this.resetTextBox();
    }
  }

  mentionDropDownClosed(event: any) {
    if (event && 'label' in event) {
      return event['label'];
    }
  }
}
