import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AugmentedRealityService } from '../services/augmented-reality.service';

@Component({
  selector: 'app-ar-viewer',
  templateUrl: './ar-viewer.component.html',
  styleUrls: ['./ar-viewer.component.css']
})
export class ARViewerComponent implements OnInit {
  @ViewChild('arView', { static: true }) arView: ElementRef;
  productId: string;
  arModel: any;

  constructor(
    private route: ActivatedRoute,
    private arService: AugmentedRealityService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadARModel();
  }

  loadARModel() {
    this.arService.getARModel(this.productId).subscribe(
      model => {
        this.arModel = model;
        this.initARView();
      },
      error => console.error('Error loading AR model:', error)
    );
  }

  initARView() {
    // Aquí iría la lógica para inicializar la vista de AR
    // Esto dependerá de la biblioteca de AR que estés utilizando
    console.log('Initializing AR view with model:', this.arModel);
  }

  saveARSession() {
    const sessionData = {
      productId: this.productId,
      duration: 0, // Calcular la duración real
      interactions: [], // Registrar las interacciones del usuario
      deviceInfo: {
        type: 'mobile', // Detectar el tipo de dispositivo
        model: 'unknown', // Obtener el modelo del dispositivo si es posible
        os: 'unknown' // Obtener el sistema operativo si es posible
      }
    };
    this.arService.saveARSession(sessionData).subscribe(
      response => console.log('AR session saved:', response),
      error => console.error('Error saving AR session:', error)
    );
  }
}