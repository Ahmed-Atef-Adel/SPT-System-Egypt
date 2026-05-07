import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 

interface Driver {
  id: string;
  driverName: string;
  licenseId: string;
  idNumber: string;
  licenseExpiredDate: string;
  address: string;
  hiringDate: string;
  hasChronicDisease: boolean;
  isBlocked: boolean;
}

interface Vehicle {
  id: string;
  vehicleName: string;
  plateNumber: string;
  model: string;
  year: string;
  capacity: number;
  status: string;
}

interface Passenger {
  id: string;
  name: string;
  phone: string;
  seat: string;
}

interface Trip {
  id: string;
  tripName: string;
  tripDuration: string;
  startDate: string;
  passengerCount: number;
  tripStatus: 'Finished' | 'Cancelled' | 'Started';
  driver: Driver;
  vehicle: Vehicle;
  passengers: Passenger[];
}

@Component({
  selector: 'app-trip-assignment',
  templateUrl: './trip-assignment.component.html',
  styleUrls: ['./trip-assignment.component.scss']
})
export class TripAssignmentComponent {
  @ViewChild('dt') dt!: Table;

  globalFilter: string = '';

  selectedTrip: Trip | null = null;
  selectedDriver: Driver | null = null;
  selectedVehicle: Vehicle | null = null;
  selectedPassengers: Passenger[] = [];

  availableDrivers: Driver[] = [
    {
      id: '1', driverName: 'Ahmed Mohamed', licenseId: 'LIC-001234',
      idNumber: '29901011234567', licenseExpiredDate: '2027-06-01',
      address: '12 Nile St, Cairo', hiringDate: '2022-03-15',
      hasChronicDisease: false, isBlocked: false
    },
    {
      id: '2', driverName: 'Mohamed Ali', licenseId: 'LIC-005678',
      idNumber: '29505154567890', licenseExpiredDate: '2026-12-31',
      address: '45 Tahrir Square, Giza', hiringDate: '2021-07-20',
      hasChronicDisease: false, isBlocked: false
    },
    {
      id: '3', driverName: 'Khaled Hassan', licenseId: 'LIC-009999',
      idNumber: '29801011112233', licenseExpiredDate: '2028-03-15',
      address: '7 Ramses Ave, Cairo', hiringDate: '2023-01-10',
      hasChronicDisease: false, isBlocked: false
    }
  ];

  availableVehicles: Vehicle[] = [
    { id: 'v1', vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234', model: 'Coaster', year: '2021', capacity: 30, status: 'Active' },
    { id: 'v2', vehicleName: 'Mercedes Sprinter', plateNumber: 'XYZ-5678', model: 'Sprinter', year: '2022', capacity: 20, status: 'Active' },
    { id: 'v3', vehicleName: 'Hyundai H350', plateNumber: 'DEF-9999', model: 'H350', year: '2020', capacity: 15, status: 'Active' }
  ];

  assignments: Trip[] = [
    {
      id: '1',
      tripName: 'Cairo to Alexandria',
      tripDuration: '3h 30m',
      startDate: '2026-05-10',
      passengerCount: 25,
      tripStatus: 'Started',
      
      driver: {
        id: '1', driverName: 'Ahmed Mohamed', licenseId: 'LIC-001234',
        idNumber: '29901011234567', licenseExpiredDate: '2027-06-01',
        address: '12 Nile St, Cairo', hiringDate: '2022-03-15',
        hasChronicDisease: false, isBlocked: false
      },
      vehicle: { id: 'v1', vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234', model: 'Coaster', year: '2021', capacity: 30, status: 'Active' },
      passengers: [
        { id: 'p1', name: 'Sara Ahmed', phone: '01012345678', seat: 'A1' },
        { id: 'p2', name: 'Omar Tarek', phone: '01098765432', seat: 'A2' },
        { id: 'p3', name: 'Nour Hassan', phone: '01123456789', seat: 'B1' },
      ]
    },
    {
      id: '2',
      tripName: 'Giza to Luxor',
      tripDuration: '8h 00m',
      startDate: '2026-05-08',
      passengerCount: 18,
      tripStatus: 'Finished',
      driver: {
        id: '2', driverName: 'Mohamed Ali', licenseId: 'LIC-005678',
        idNumber: '29505154567890', licenseExpiredDate: '2026-12-31',
        address: '45 Tahrir Square, Giza', hiringDate: '2021-07-20',
        hasChronicDisease: true, isBlocked: false
      },
      vehicle: { id: 'v2', vehicleName: 'Mercedes Sprinter', plateNumber: 'XYZ-5678', model: 'Sprinter', year: '2022', capacity: 20, status: 'Active' },
      passengers: [
        { id: 'p4', name: 'Layla Mostafa', phone: '01211112222', seat: 'A1' },
        { id: 'p5', name: 'Youssef Samir', phone: '01533334444', seat: 'A2' },
      ]
    },
    {
      id: '3',
      tripName: 'Heliopolis to Maadi',
      tripDuration: '1h 15m',
      startDate: '2026-05-06',
      passengerCount: 10,
      tripStatus: 'Cancelled',
      driver: {
        id: '3', driverName: 'Khaled Hassan', licenseId: 'LIC-009999',
        idNumber: '29801011112233', licenseExpiredDate: '2028-03-15',
        address: '7 Ramses Ave, Cairo', hiringDate: '2023-01-10',
        hasChronicDisease: false, isBlocked: false
      },
      vehicle: { id: 'v3', vehicleName: 'Hyundai H350', plateNumber: 'DEF-9999', model: 'H350', year: '2020', capacity: 15, status: 'Active' },
      passengers: [
        { id: 'p6', name: 'Hana Kamal', phone: '01099988877', seat: 'A1' },
      ]
    }
  ];

  constructor(
    private router: Router,
    public auth: AuthService,
    private translate: TranslateService,
    private modalService: NgbModal
  ) {}

  // ── Bootstrap modal trigger ────────────────────────────────

  private openModal(id: string) {
  this.modalService.open(id, {
      windowClass: 'modalCusSty',
  });
    } 
  


  // ── Modal openers ──────────────────────────────────────────

  openTripModal(trip: Trip) {
    this.selectedTrip = trip;
    setTimeout(() => this.openModal('tripModal'));
  }

  openDriverModal(driver: Driver) {
    this.selectedDriver = driver;
    setTimeout(() => this.openModal('driverModal'));
  }

  openVehicleModal(vehicle: Vehicle) {
    this.selectedVehicle = vehicle;
    setTimeout(() => this.openModal('vehicleModal'));
  }

  openPassengerModal(passengers: Passenger[]) {
    this.selectedPassengers = passengers;
    setTimeout(() => this.openModal('passengerModal'));
  }

  // ── Actions ───────────────────────────────────────────────

  onAddNew() {
    this.router.navigate(['/trip-assignments/create']);
  }

  confirmChangeDriver(assignment: Trip) {
    const driverOptions = this.availableDrivers
      .filter(d => d.id !== assignment.driver.id && !d.isBlocked)
      .reduce((acc, d) => ({ ...acc, [d.id]: d.driverName }), {} as Record<string, string>);

    Swal.fire({
      title: this.translate.instant('Change Driver'),
      text: `Select a new driver for trip "${assignment.tripName}"`,
      icon: 'question',
      input: 'select',
      inputOptions: driverOptions,
      inputPlaceholder: 'Select a driver',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Change'),
      cancelButtonText: this.translate.instant('Cancel'),
      inputValidator: (value) => {
        if (!value) return 'Please select a driver';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newDriver = this.availableDrivers.find(d => d.id === result.value);
        if (newDriver) {
          assignment.driver = newDriver;
          Swal.fire({
            icon: 'success',
            title: 'Driver Changed',
            text: `Driver changed to "${newDriver.driverName}" successfully.`,
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    });
  }

  confirmChangeVehicle(assignment: Trip) {
    const vehicleOptions = this.availableVehicles
      .filter(v => v.id !== assignment.vehicle.id)
      .reduce((acc, v) => ({ ...acc, [v.id]: `${v.vehicleName} (${v.plateNumber})` }), {} as Record<string, string>);

    Swal.fire({
      title: this.translate.instant('Change Vehicle'),
      text: `Select a new vehicle for trip "${assignment.tripName}"`,
      icon: 'question',
      input: 'select',
      inputOptions: vehicleOptions,
      inputPlaceholder: 'Select a vehicle',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Change'),
      cancelButtonText: this.translate.instant('Cancel'),
      inputValidator: (value) => {
        if (!value) return 'Please select a vehicle';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newVehicle = this.availableVehicles.find(v => v.id === result.value);
        if (newVehicle) {
          assignment.vehicle = newVehicle;
          Swal.fire({
            icon: 'success',
            title: 'Vehicle Changed',
            text: `Vehicle changed to "${newVehicle.vehicleName}" successfully.`,
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    });
  }

  confirmChangeStatus(assignment: Trip) {
    Swal.fire({
      title: this.translate.instant('Change Status'),
      text: `Select new status for trip "${assignment.tripName}"`,
      icon: 'question',
      input: 'select',
      inputOptions: {
        'Started': 'Started',
        'Finished': 'Finished',
        'Cancelled': 'Cancelled'
      },
      inputValue: assignment.tripStatus,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Update'),
      cancelButtonText: this.translate.instant('Cancel'),
      inputValidator: (value) => {
        if (!value) return 'Please select a status';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        assignment.tripStatus = result.value as Trip['tripStatus'];
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Trip status changed to "${assignment.tripStatus}".`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Started':   return 'info';
      case 'Finished':  return 'success';
      case 'Cancelled': return 'danger';
      default:          return 'secondary';
    }
  }

  isLicenseExpiredLocal(expiredDate: string): boolean {
    return new Date(expiredDate) < new Date();
  }

  signOut() {
    this.router.navigate(['/module-selection']);
  }
}