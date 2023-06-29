import {
  Component,
  ViewChild,
  ElementRef,
  OnInit, AfterViewInit
} from '@angular/core';

@Component({
  selector: 'app-create-places',
  templateUrl: './create-places.component.html',
  styleUrls: ['./create-places.component.css']
})
export class CreatePlacesComponent implements AfterViewInit {

  @ViewChild('input_tag_div')
  inputTagDiv!: ElementRef;
  @ViewChild('tag_input')
  tagInputElement!: ElementRef;
  tags: string[] = []
  disableTagInput: boolean = false

  constructor() {
  }

  ngAfterViewInit() {
    this.tagInputElement.nativeElement.addEventListener('keydown', (event: any) => {
      console.log(event.code)
      if (event.key === 'Enter' || event.code === 'Comma') {
        if (this.tags.length >= 3) {
          this.disableTagInput = true
        }
        let inputValue = event.target.value.replace(/\s+/g,' ')
        this.tags.push(inputValue)
        event.target.value = ''
      }
    })
  }

  removeTag(tag: string) {
    let indexOfTag = this.tags.indexOf(tag)
    this.tags.splice(indexOfTag, 1)
    if (this.tags.length <= 3) {
      this.disableTagInput = false
    }
  }

}
