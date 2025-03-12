import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient.service';
import { Patient } from '../patient';
// Import jsPDF and html2canvas
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-patient',
  templateUrl: './view-patient.component.html',
  styleUrls: ['./view-patient.component.css']
})
export class ViewPatientComponent implements OnInit {
  id: number;
  patient: Patient;

  constructor(private route: ActivatedRoute, private patientService: PatientService) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.patient = new Patient();
    this.patientService.getPatientById(this.id).subscribe(data => {
      this.patient = data;
    });
  }

  getTotalBill(): number {
    // Convert string values to numbers and sum them
    const fees = parseFloat(this.patient.fees) || 0;
    const mfees = parseFloat(this.patient.mfees) || 0;
    return fees + mfees;
  }

  printPDF(): void {
    const DATA = document.getElementById('pdfContent');
    if (DATA) {
      html2canvas(DATA).then(canvas => {
        // Set PDF properties (A4 paper size in mm)
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' for portrait
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('patient-details.pdf'); // Download PDF file
      });
    }
  }
}
