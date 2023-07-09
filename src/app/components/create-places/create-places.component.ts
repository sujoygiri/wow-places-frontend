import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

import { GlobalService } from 'src/app/global.service';
import { PlaceService } from 'src/app/service/place.service';
// import { map } from 'rxjs';

@Component({
  selector: 'app-create-places',
  templateUrl: './create-places.component.html',
  styleUrls: ['./create-places.component.css'],
})
export class CreatePlacesComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('input_tag_div')
  inputTagDiv!: ElementRef;
  @ViewChild('tag_input')
  tagInputElement!: ElementRef;
  @ViewChild('preview_image')
  previewImageElement!: ElementRef;

  tagsArray: string[] = [];
  placeAddingForm: FormGroup = new FormGroup({});
  imagePreviewLink: string = '';
  openModal: boolean = false;
  placeName: string = '';
  placeDescription: string = '';
  tagError: boolean = false;
  tagErrorMessage: string = '';
  waitForResponse: boolean = false;
  serverError: boolean = false;
  serverErrorMessage: string = '';
  timeOutFunction: any;

  constructor(
    private renderer: Renderer2,
    private formBuilder: FormBuilder,
    private route: Router,
    private globalService: GlobalService,
    private placeService:PlaceService
  ) {}

  ngOnInit() {
    this.placeAddingForm = this.formBuilder.group({
      placeImage: [null, [Validators.required]],
      placeName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      placeDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // Create an image preview blob link
      this.imagePreviewLink = URL.createObjectURL(file);
      // update the form field with the image
      this.placeAddingForm.patchValue({
        placeImage: file,
      });
      this.placeAddingForm.get('placeImage')?.updateValueAndValidity();
    }
  }

  ngAfterViewInit() {
    this.renderer.listen(
      this.tagInputElement.nativeElement,
      'keydown',
      (event: any) => {
        let inputTagValue: string = event.target.value
          .replace(/\s+/g, ' ')
          .trim();
        if (event.key === 'Enter') {
          if (
            inputTagValue.length <= 2 ||
            inputTagValue.length > 40 ||
            this.tagsArray.includes(inputTagValue) ||
            this.tagsArray.length >= 4
          ) {
            event.target.value = '';
          } else {
            this.tagsArray.push(inputTagValue);
            event.target.value = '';
          }
        }
      }
    );
  }

  removeTag(tag: string) {
    let indexOfTag = this.tagsArray.indexOf(tag);
    this.tagsArray.splice(indexOfTag, 1);
  }

  previewBeforeSubmit() {
    if (this.tagsArray.length < 1) {
      this.tagError = true;
      this.tagErrorMessage = 'Minimum one tag is required';
      this.timeOutFunction = setTimeout(() => {
        this.tagError = false;
        this.tagErrorMessage = '';
      }, 2000);
    } else {
      this.tagError = false;
      this.placeName = this.placeAddingForm.value.placeName;
      this.placeDescription = this.placeAddingForm.value.placeDescription;
      this.openModal = true;
    }
  }

  closeModal() {
    this.openModal = false;
    this.serverError = false;
    this.serverErrorMessage = '';
  }

  sendData() {
    let userInputValue = this.placeAddingForm.value;
    let convertTagsToString = this.tagsArray.join(',');
    let formData = new FormData();
    formData.append(
      'placeImage',
      this.placeAddingForm.get('placeImage')?.value
    );
    formData.append('placeName', userInputValue.placeName.trim());
    formData.append('placeDescription', userInputValue.placeDescription.trim());
    formData.append('placeTags', convertTagsToString);
    this.waitForResponse = true;
    this.placeService.addPlace(formData).subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            this.placeAddingForm.reset();
            this.tagsArray = [];
            this.imagePreviewLink = '';
          }
        },
        error: (error: any) => {
          this.waitForResponse = false;
          this.serverError = true;
          this.serverErrorMessage = 'Something went wrong, please try again';
        },
        complete: () => {
          this.waitForResponse = false;
          this.openModal = false;
          this.globalService.showToaster = true;
          this.route.navigate(['/home']);
        },
      });
  }

  dismissAlert() {
    this.serverError = false;
    this.serverErrorMessage = '';
  }

  ngOnDestroy() {
    clearTimeout(this.timeOutFunction);
  }
}
