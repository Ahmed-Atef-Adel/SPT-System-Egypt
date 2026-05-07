import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { AuthService } from '../shared/guard/auth.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

interface Vehicle {
  id: number;
  name: string;
  number: string;
  chassisNo: string;
  licenseNumber: string;
  licenseExpiry: Date;
  modelNumber: string;
  typeName: string;
  manufacturingYear: number;
  seatCount: number;
  condition: string;
  inMaintenance: boolean;
  motorNumber: string;
}

interface VehicleForm {
  name: string;
  number: string;
  chassisNo: string;
  licenseNumber: string;
  licenseExpiryStr: string;   // date input works with string
  modelNumber: string;
  typeName: string;
  manufacturingYear: number;
  seatCount: number;
  condition: string;
  inMaintenance: boolean;
  motorNumber: string;
}

@Component({
  selector: 'app-vehicles-data',
  templateUrl: './vehicles-data.component.html',
  styleUrls: ['./vehicles-data.component.scss'],
  providers: [MessageService]
})
export class VehiclesDataComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  vehicles: Vehicle[] = [];
  globalFilter: string = '';

  // ── Dialog state ──────────────────────────────────────────────
  showDialog = false;
  isEditMode = false;
  editingVehicleId: number | null = null;

  vehicleForm: VehicleForm = this.emptyForm();

  constructor(
    private router: Router,
    public auth: AuthService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  // ── Data ──────────────────────────────────────────────────────

  loadVehicles() {
    this.vehicles = [
      {
        id: 1,
        name: 'Bus A',
        number: '1234',
        chassisNo: 'CH12345',
        licenseNumber: 'LIC123',
        licenseExpiry: new Date('2027-06-01'),
        modelNumber: 'M2023',
        typeName: 'Bus',
        manufacturingYear: 2023,
        seatCount: 50,
        condition: 'Good',
        inMaintenance: false,
        motorNumber: 'MN123'
      },
      {
        id: 2,
        name: 'Van B',
        number: '5678',
        chassisNo: 'CH67890',
        licenseNumber: 'LIC456',
        licenseExpiry: new Date('2025-01-15'),
        modelNumber: 'M2021',
        typeName: 'Van',
        manufacturingYear: 2021,
        seatCount: 14,
        condition: 'Average',
        inMaintenance: true,
        motorNumber: 'MN456'
      }
    ];
  }

  // ── Helpers ───────────────────────────────────────────────────

  private emptyForm(): VehicleForm {
    return {
      name: '',
      number: '',
      chassisNo: '',
      licenseNumber: '',
      licenseExpiryStr: '',
      modelNumber: '',
      typeName: '',
      manufacturingYear: new Date().getFullYear(),
      seatCount: 0,
      condition: 'Good',
      inMaintenance: false,
      motorNumber: ''
    };
  }

  private generateId(): number {
    return this.vehicles.length > 0
      ? Math.max(...this.vehicles.map(v => v.id)) + 1
      : 1;
  }

  isLicenseExpired(expiry: Date): boolean {
    return new Date(expiry) < new Date();
  }

  // ── Dialog open / close ───────────────────────────────────────

  onAddNew() {
    this.isEditMode = false;
    this.editingVehicleId = null;
    this.vehicleForm = this.emptyForm();
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('custom-modal-overlay')) {
      this.closeDialog();
    }
  }

  // ── Save (Add or Edit) ────────────────────────────────────────

  saveVehicle() {
    if (!this.vehicleForm.name?.trim()) {
      Swal.fire({ icon: 'warning', title: 'Validation', text: 'Vehicle name is required.' });
      return;
    }

    const licenseExpiry = this.vehicleForm.licenseExpiryStr
      ? new Date(this.vehicleForm.licenseExpiryStr)
      : new Date();

    if (this.isEditMode && this.editingVehicleId !== null) {
      const index = this.vehicles.findIndex(v => v.id === this.editingVehicleId);
      if (index !== -1) {
        this.vehicles[index] = {
          id: this.editingVehicleId,
          ...this.vehicleForm,
          licenseExpiry
        };
        this.vehicles = [...this.vehicles];
      }
      Swal.fire({
        icon: 'success',
        title: this.translate.instant('Updated'),
        text: `Vehicle "${this.vehicleForm.name}" updated successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      const newVehicle: Vehicle = {
        id: this.generateId(),
        ...this.vehicleForm,
        licenseExpiry
      };
      this.vehicles = [...this.vehicles, newVehicle];
      Swal.fire({
        icon: 'success',
        title: this.translate.instant('Added'),
        text: `Vehicle "${newVehicle.name}" added successfully.`,
        timer: 2000,
        showConfirmButton: false
      });
    }

    this.closeDialog();
  }

  // ── Edit ──────────────────────────────────────────────────────

  confirmEdit(vehicle: Vehicle) {
    Swal.fire({
      title: this.translate.instant('Confirm Edit'),
      text: this.translate.instant('Are you sure you want to edit this vehicle?'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Yes, edit it'),
      cancelButtonText: this.translate.instant('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.openEditDialog(vehicle);
      }
    });
  }

  private openEditDialog(vehicle: Vehicle) {
    this.isEditMode = true;
    this.editingVehicleId = vehicle.id;
    this.vehicleForm = {
      name: vehicle.name,
      number: vehicle.number,
      chassisNo: vehicle.chassisNo,
      licenseNumber: vehicle.licenseNumber,
      licenseExpiryStr: vehicle.licenseExpiry
        ? new Date(vehicle.licenseExpiry).toISOString().split('T')[0]
        : '',
      modelNumber: vehicle.modelNumber,
      typeName: vehicle.typeName,
      manufacturingYear: vehicle.manufacturingYear,
      seatCount: vehicle.seatCount,
      condition: vehicle.condition,
      inMaintenance: vehicle.inMaintenance,
      motorNumber: vehicle.motorNumber
    };
    this.showDialog = true;
  }

  // ── Delete ────────────────────────────────────────────────────

  confirmDelete(vehicle: Vehicle) {
    Swal.fire({
      title: this.translate.instant('Confirm Delete'),
      text: this.translate.instant('Are you sure you want to delete this vehicle?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Yes, delete it'),
      cancelButtonText: this.translate.instant('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.vehicles = this.vehicles.filter(v => v.id !== vehicle.id);
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('Deleted'),
          text: `Vehicle "${vehicle.name}" deleted successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // ── Maintenance toggle ────────────────────────────────────────

  confirmMaintenance(vehicle: Vehicle) {
    const goingToMaintenance = !vehicle.inMaintenance;
    Swal.fire({
      title: this.translate.instant(goingToMaintenance ? 'Confirm Maintenance' : 'Confirm Available'),
      text: this.translate.instant(
        goingToMaintenance
          ? 'Are you sure you want to send this vehicle to maintenance?'
          : 'Are you sure you want to mark this vehicle as available?'
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: goingToMaintenance ? '#d33' : '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant(goingToMaintenance ? 'Yes, send to maintenance' : 'Yes, mark available'),
      cancelButtonText: this.translate.instant('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        vehicle.inMaintenance = !vehicle.inMaintenance;
        this.vehicles = [...this.vehicles];
        Swal.fire({
          icon: 'info',
          title: this.translate.instant('Status Updated'),
          text: `Vehicle "${vehicle.name}" is now ${vehicle.inMaintenance ? 'in maintenance' : 'available'}.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // ── Badge severity ────────────────────────────────────────────

  getConditionSeverity(condition: string): string {
    switch (condition) {
      case 'Good':    return 'success';
      case 'Average': return 'warning';
      case 'Bad':     return 'danger';
      default:        return 'info';
    }
  }

  // ── Navigation ────────────────────────────────────────────────

  signOut() {
    this.router.navigate(['/module-selection']);
  }
}
