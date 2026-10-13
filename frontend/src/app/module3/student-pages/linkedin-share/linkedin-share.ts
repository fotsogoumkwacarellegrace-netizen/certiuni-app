
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Certificate } from '../../student-service/student.service';

export interface LinkedinShareData {
  certificate: Certificate;
  studentFullName: string;
}

@Component({
  selector: 'app-linkedin-share',
  imports: [CommonModule, FormsModule , MatIconModule],
  templateUrl: './linkedin-share.html',
  styleUrl:'./linkedin-share.css'
})
export class LinkedinShare {
  private dialogRef = inject(MatDialogRef<LinkedinShare>);
  data = inject<LinkedinShareData>(MAT_DIALOG_DATA);

  // Légende pré-remplie, modifiable par l'étudiant
  caption = signal(
    `Je suis ravi(e) de partager ma nouvelle certification : ${this.data?.certificate?.course_title} 🎓`
  );

  close() {
    this.dialogRef.close();
  }

  publishToLinkedIn() {
    // Conforme au cahier des charges : vrai lien LinkedIn, pas d'API payante
    const shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' +
      encodeURIComponent('https://certiuni.cm/verify/' + this.data.certificate.id);

    window.open(shareUrl, '_blank');
    this.dialogRef.close();
  }
}