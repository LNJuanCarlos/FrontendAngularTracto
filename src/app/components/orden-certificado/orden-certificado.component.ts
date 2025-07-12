import { Component, OnInit } from '@angular/core';
import { OrdenCertificado } from './orden-certificado.model';
import { OrdenCertificadoService } from './orden-certificado.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrdenCertificadoDetalle } from './orden-certificado-detalle.model';

@Component({
  selector: 'app-orden-certificado',
  templateUrl: './orden-certificado.component.html'
})
export class OrdenCertificadoComponent implements OnInit {

  compania: string = '';
  numeroDoc: number = 1;
  certificados: OrdenCertificado[] = [];
  error: string = '';
  actividades: OrdenCertificadoDetalle[] = [];
  

  constructor(private certificadoService: OrdenCertificadoService) {}

  ngOnInit(): void {}

  buscar() {
    this.certificadoService.obtenerCertificado(this.compania, this.numeroDoc).subscribe({
      next: data => {
        this.certificados = data;
        this.error = '';
        // Llamar al detalle
        this.certificadoService.obtenerDetalle(this.compania, this.numeroDoc).subscribe({
          next: detalle => this.actividades = detalle,
          error: _ => this.actividades = []
        });
      },
      error: err => {
        this.certificados = [];
        this.actividades = [];
        this.error = 'No se encontró el certificado.';
      }
    });
  }
  

////////////////////////////

exportarPDF() {
  if (!this.certificados.length) return;

  const certificado = this.certificados[0];
  const doc = new jsPDF();

  //const fechaActual = new Date().toLocaleDateString();


  function obtenerFechaPersonalizada(): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = meses[hoy.getMonth()];
    const anio = hoy.getFullYear();
    return `Lima, ${dia} de ${mes} del ${anio}`;
  }



  const img = new Image();
  img.src = 'assets/images/logo-tracusa.png';
  img.onload = () => {
    doc.addImage(img, 'PNG', 15, 10, 66, 15);

    doc.setFontSize(10);
    //doc.text(`Lima, ${fechaActual}`, 150, 20);
    doc.text(obtenerFechaPersonalizada(), 140, 20);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('CERTIFICADO DE MANTENIMIENTO', 70, 40);

    doc.setFontSize(10);
    doc.text('Para:', 25, 50);
    doc.text(certificado.nombreCompleto, 25, 55);
    doc.text('Presente. –', 25, 62);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(
      'Por medio del presente certificamos que la unidad cuyos datos le indicamos\nle hemos realizado el servicio de trabajos preventivos en nuestro taller en Lima.',
      25,
      70
    );

    // Datos del vehículo
    const datos = [
      ['MARCA', certificado.descripcionMarca],
      ['MODELO', certificado.modelo],
      ['COLOR', certificado.descripcionColor],
      ['SERIE DE CHASIS', certificado.maquinaCodigo],
      ['PLACA', certificado.numeroPlaca],
      ['MOTOR', certificado.numeroMotor],
      ['KILOMETRAJE', certificado.maquinaKilometraje.toString()],
      ['HORAS', certificado.maquinaHoraKilometraje]
    ];

    let y = 90;
    datos.forEach(([etiqueta, valor]) => {
      doc.text(`${etiqueta} :`, 25, y);
      doc.text(valor, 70, y);
      y += 7;
    });

    // Descripción de actividades
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('DESCRIPCION DE ACTIVIDADES:', 25, y + 10);
    doc.setFont('helvetica', 'normal');
    doc.text('En la unidad de mención se realizó lo siguiente:', 25, y + 16);

    doc.setFont('helvetica', 'bold');
    let ay = y + 24;
    this.actividades.forEach((act, index) => {
      doc.text(`- ${act.descripcionActividad}`, 25, ay);
      ay += 7;
    });

    // Pie de página
    doc.setFont('helvetica', 'normal');
    doc.text('Se expide el presente documento para los fines que el interesado crea conveniente.', 25, ay + 10);
    doc.text('Certificado válido por 03 meses.', 25, ay + 20);
    doc.text('Atentamente', 25, ay + 30);
    doc.setFont('helvetica', 'bold');
    doc.text('TRACTO CAMIONES USA S.A.', 25, ay + 36);

    doc.save('certificado-mantenimiento.pdf');
  };
}

}
