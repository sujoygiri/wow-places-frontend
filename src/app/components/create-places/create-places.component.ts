import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  OnInit, AfterViewInit
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-create-places',
  templateUrl: './create-places.component.html',
  styleUrls: ['./create-places.component.css']
})
export class CreatePlacesComponent implements OnInit, AfterViewInit {

  @ViewChild('input_tag_div')
  inputTagDiv!: ElementRef;
  @ViewChild('tag_input')
  tagInputElement!: ElementRef;
  tags: string[] = []
  placeAddingForm: FormGroup = new FormGroup({})
  imagePreviewLink:string = ''

  constructor(private renderer: Renderer2, private formBuilder: FormBuilder, private http: HttpClient) {
  }

  ngOnInit() {
    this.placeAddingForm = this.formBuilder.group({
      placeImage: [null, [Validators.required]],
      placeName: ['', [Validators.required]],
      placeDescription: ['', [Validators.required]]
    })
  }

  onFileChange(event: any) {
    // const reader:FileReader = new FileReader();
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.placeAddingForm.patchValue({
        placeImage: file
      });
      this.placeAddingForm.get('placeImage')?.updateValueAndValidity()
      // File Preview
      // reader.readAsDataURL(file)
    }
    // reader.onload = () => {
    //   this.imagePreviewLink = reader.result as string;
    // }
  }

  ngAfterViewInit() {
    this.renderer.listen(this.tagInputElement.nativeElement, 'keydown', (event: any) => {
      let inputTagValue: string = event.target.value.replace(/\s+/g, ' ');
      if (event.key === 'Enter') {
        if (inputTagValue.length <= 1 || this.tags.includes(inputTagValue) || this.tags.length >= 4) {
          event.target.value = ''
        } else {
          this.tags.push(inputTagValue)
          event.target.value = ''
        }
      }
    })
  }

  removeTag(tag: string) {
    let indexOfTag = this.tags.indexOf(tag)
    this.tags.splice(indexOfTag, 1)
  }

  sendData() {
    let userInputValue = this.placeAddingForm.value
    console.log(userInputValue)
    // console.log(this.imagePreviewLink)
    let formData = new FormData()
    formData.append('placeName',userInputValue.placeName)
    formData.append('placeDescription',userInputValue.placeDescription)
    formData.append('placeImage',userInputValue.placeImage)
    this.http.post('http://localhost:3000/file', formData,{reportProgress:true,observe:"events"}).subscribe({
      next:(response) => {
        console.log(response)
      },
      error:(error) => {
        console.log(error)
      }
    })
  }

}
