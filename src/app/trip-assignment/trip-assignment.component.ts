import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';

// ── Interfaces ────────────────────────────────────────────────

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

interface Assignment {
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

/** A trip template the user can pick when creating a new assignment */
interface TripTemplate {
  id: string;
  tripName: string;
  startTime: string;   // e.g. "06:00"
  endTime: string;     // e.g. "18:00"
  segmentDurationHours: number; // e.g. 2
}

/** One generated slot shown in the preview table */
interface Segment {
  name: string;
  startTime: string;
  endTime: string;
  duration: string;
}

@Component({
  selector: 'app-trip-assignment',
  templateUrl: './trip-assignment.component.html',
  styleUrls: ['./trip-assignment.component.scss']
})
export class TripAssignmentComponent {
  @ViewChild('dt') dt!: Table;

  globalFilter = '';

  // ── Detail modal state ────────────────────────────────────────
  showTripModal      = false;
  showDriverModal    = false;
  showVehicleModal   = false;
  showPassengerModal = false;

  selectedTrip: Assignment | null = null;
  selectedDriver: Driver | null = null;
  selectedVehicle: Vehicle | null = null;
  selectedPassengers: Passenger[] = [];

  // ── New Assignment modal state ────────────────────────────────
  showNewModal = false;

  newForm = {
    tripId:    '',
    driverId:  '',
    vehicleId: ''
  };

  generatedSegments: Segment[] = [];

  // ── Master data ───────────────────────────────────────────────

  availableTrips: TripTemplate[] = [
    { id: 't1', tripName: 'Cairo → Alexandria',  startTime: '06:00', endTime: '18:00', segmentDurationHours: 2 },
    { id: 't2', tripName: 'Giza → Luxor',         startTime: '07:00', endTime: '19:00', segmentDurationHours: 3 },
    { id: 't3', tripName: 'Heliopolis → Maadi',   startTime: '08:00', endTime: '16:00', segmentDurationHours: 2 },
    { id: 't4', tripName: 'Cairo → Hurghada',     startTime: '05:00', endTime: '17:00', segmentDurationHours: 4 },
  ];

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
    { id: 'v1', vehicleName: 'Toyota Coaster',    plateNumber: 'ABC-1234', model: 'Coaster',  year: '2021', capacity: 30, status: 'Active' },
    { id: 'v2', vehicleName: 'Mercedes Sprinter', plateNumber: 'XYZ-5678', model: 'Sprinter', year: '2022', capacity: 20, status: 'Active' },
    { id: 'v3', vehicleName: 'Hyundai H350',       plateNumber: 'DEF-9999', model: 'H350',     year: '2020', capacity: 15, status: 'Active' }
  ];

  assignments: Assignment[] = [
    {
      id: '1', tripName: 'Cairo to Alexandria', tripDuration: '2h 00m',
      startDate: '2026-05-10', passengerCount: 25, tripStatus: 'Started',
      driver: {
        id: '1', driverName: 'Ahmed Mohamed', licenseId: 'LIC-001234',
        idNumber: '29901011234567', licenseExpiredDate: '2027-06-01',
        address: '12 Nile St, Cairo', hiringDate: '2022-03-15',
        hasChronicDisease: false, isBlocked: false
      },
      vehicle: { id: 'v1', vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234', model: 'Coaster', year: '2021', capacity: 30, status: 'Active' },
      passengers: [
        { id: 'p1', name: 'Sara Ahmed',  phone: '01012345678', seat: 'A1' },
        { id: 'p2', name: 'Omar Tarek',  phone: '01098765432', seat: 'A2' },
        { id: 'p3', name: 'Nour Hassan', phone: '01123456789', seat: 'B1' },
      ]
    },
    {
      id: '2', tripName: 'Giza to Luxor', tripDuration: '3h 00m',
      startDate: '2026-05-08', passengerCount: 18, tripStatus: 'Finished',
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
      id: '3', tripName: 'Heliopolis to Maadi', tripDuration: '2h 00m',
      startDate: '2026-05-06', passengerCount: 10, tripStatus: 'Cancelled',
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
    public  auth: AuthService,
    private translate: TranslateService,
  ) {}

  // ── New Assignment modal ──────────────────────────────────────

  onAddNew() {
    this.newForm = { tripId: '', driverId: '', vehicleId: '' };
    this.generatedSegments = [];
    this.showNewModal = true;
  }

  closeNewModal() {
    this.showNewModal = false;
  }

  /**
   * When the user selects a trip, calculate how many non-overlapping
   * segments of `segmentDurationHours` fit between startTime and endTime,
   * then populate the preview table.
   *
   * Example: startTime=06:00, endTime=18:00, segmentDurationHours=2
   *   → 6 slots: 06–08, 08–10, 10–12, 12–14, 14–16, 16–18
   */
  onTripChange() {
    this.generatedSegments = [];
    if (!this.newForm.tripId) return;

    const template = this.availableTrips.find(t => t.id === this.newForm.tripId);
    if (!template) return;

    const [startH, startM] = template.startTime.split(':').map(Number);
    const [endH,   endM  ] = template.endTime.split(':').map(Number);

    const totalMinutes   = (endH * 60 + endM) - (startH * 60 + startM);
    const segmentMinutes = template.segmentDurationHours * 60;

    if (totalMinutes <= 0 || segmentMinutes <= 0) return;

    const slotCount = Math.floor(totalMinutes / segmentMinutes);

    for (let i = 0; i < slotCount; i++) {
      const slotStartMin = startH * 60 + startM + i * segmentMinutes;
      const slotEndMin   = slotStartMin + segmentMinutes;

      const slotStart = this.minutesToTime(slotStartMin);
      const slotEnd   = this.minutesToTime(slotEndMin);

      this.generatedSegments.push({
        name:      `${template.tripName} — Slot ${i + 1}`,
        startTime: slotStart,
        endTime:   slotEnd,
        duration:  `${template.segmentDurationHours}h 00m`
      });
    }
  }

  private minutesToTime(totalMinutes: number): string {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = (totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  saveNewAssignment() {
    if (!this.newForm.tripId || !this.newForm.driverId || !this.newForm.vehicleId) return;

    const driver  = this.availableDrivers.find(d => d.id === this.newForm.driverId)!;
    const vehicle = this.availableVehicles.find(v => v.id === this.newForm.vehicleId)!;
    const template = this.availableTrips.find(t => t.id === this.newForm.tripId)!;

    const today = new Date().toISOString().split('T')[0];

    const newRows: Assignment[] = this.generatedSegments.map((seg, i) => ({
      id:             `${Date.now()}-${i}`,
      tripName:       seg.name,
      tripDuration:   seg.duration,
      startDate:      today,
      passengerCount: 0,
      tripStatus:     'Started' as const,
      driver:         { ...driver },
      vehicle:        { ...vehicle },
      passengers:     []
    }));

    this.assignments = [...this.assignments, ...newRows];

    Swal.fire({
      icon: 'success',
      title: 'Assignments Created',
      text: `${newRows.length} assignment${newRows.length !== 1 ? 's' : ''} created for "${template.tripName}".`,
      timer: 2500,
      showConfirmButton: false
    });

    this.closeNewModal();
  }

  // ── Detail modal openers ──────────────────────────────────────

  openTripModal(trip: Assignment) {
    this.selectedTrip  = trip;
    this.showTripModal = true;
  }

  openDriverModal(driver: Driver) {
    this.selectedDriver  = driver;
    this.showDriverModal = true;
  }

  openVehicleModal(vehicle: Vehicle) {
    this.selectedVehicle  = vehicle;
    this.showVehicleModal = true;
  }

  openPassengerModal(passengers: Passenger[]) {
    this.selectedPassengers  = passengers;
    this.showPassengerModal = true;
  }

  // ── Actions ───────────────────────────────────────────────────

  confirmChangeDriver(assignment: Assignment) {
    const driverOptions = this.availableDrivers
      .filter(d => d.id !== assignment.driver.id && !d.isBlocked)
      .reduce((acc, d) => ({ ...acc, [d.id]: d.driverName }), {} as Record<string, string>);

    Swal.fire({
      title: 'Change Driver',
      text: `Select a new driver for "${assignment.tripName}"`,
      icon: 'question',
      input: 'select',
      inputOptions: driverOptions,
      inputPlaceholder: 'Select a driver',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Change',
      cancelButtonText: 'Cancel',
      inputValidator: v => !v ? 'Please select a driver' : null
    }).then(result => {
      if (result.isConfirmed) {
        const d = this.availableDrivers.find(x => x.id === result.value);
        if (d) {
          assignment.driver = d;
          this.assignments = [...this.assignments];
          Swal.fire({ icon: 'success', title: 'Driver Changed', text: `Changed to "${d.driverName}".`, timer: 2000, showConfirmButton: false });
        }
      }
    });
  }

  confirmChangeVehicle(assignment: Assignment) {
    const vehicleOptions = this.availableVehicles
      .filter(v => v.id !== assignment.vehicle.id)
      .reduce((acc, v) => ({ ...acc, [v.id]: `${v.vehicleName} (${v.plateNumber})` }), {} as Record<string, string>);

    Swal.fire({
      title: 'Change Vehicle',
      text: `Select a new vehicle for "${assignment.tripName}"`,
      icon: 'question',
      input: 'select',
      inputOptions: vehicleOptions,
      inputPlaceholder: 'Select a vehicle',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Change',
      cancelButtonText: 'Cancel',
      inputValidator: v => !v ? 'Please select a vehicle' : null
    }).then(result => {
      if (result.isConfirmed) {
        const v = this.availableVehicles.find(x => x.id === result.value);
        if (v) {
          assignment.vehicle = v;
          this.assignments = [...this.assignments];
          Swal.fire({ icon: 'success', title: 'Vehicle Changed', text: `Changed to "${v.vehicleName}".`, timer: 2000, showConfirmButton: false });
        }
      }
    });
  }

  confirmChangeStatus(assignment: Assignment) {
    Swal.fire({
      title: 'Change Status',
      text: `Select new status for "${assignment.tripName}"`,
      icon: 'question',
      input: 'select',
      inputOptions: { Started: 'Started', Finished: 'Finished', Cancelled: 'Cancelled' },
      inputValue: assignment.tripStatus,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
      inputValidator: v => !v ? 'Please select a status' : null
    }).then(result => {
      if (result.isConfirmed) {
        assignment.tripStatus = result.value as Assignment['tripStatus'];
        this.assignments = [...this.assignments];
        Swal.fire({ icon: 'success', title: 'Status Updated', text: `Status changed to "${assignment.tripStatus}".`, timer: 2000, showConfirmButton: false });
      }
    });
  }

  // ── Overlay backdrop click ────────────────────────────────────

  onOverlayClick(event: MouseEvent, modal: string) {
    if (!(event.target as HTMLElement).classList.contains('custom-modal-overlay')) return;
    switch (modal) {
      case 'new':       this.closeNewModal(); break;
      case 'trip':      this.showTripModal      = false; break;
      case 'driver':    this.showDriverModal    = false; break;
      case 'vehicle':   this.showVehicleModal   = false; break;
      case 'passenger': this.showPassengerModal = false; break;
    }
  }

  // ── Helpers ───────────────────────────────────────────────────

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
