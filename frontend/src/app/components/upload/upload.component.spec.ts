import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadComponent } from './upload.component';
import { HelperService } from '../../services/helper.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Transcription } from '../../model/entity';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadComponent],
      providers: [
        HelperService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // test display 
  it("should create a new row", () => {
    component.transcriptionlist$ = [
      { id: 1,
        created_on: "2024-11-07 12:37:36.933514+00:00",
        audio_file_name: "Test.mp3",
        transcription: "Placeholder test asdkjfasdf $^$#%^^&*(("
      } as Transcription
    ];
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.innerHTML).toContain("Placeholder test asdkjfasdf");
  });

});
