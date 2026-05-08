import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';

interface Trip {
  tripName: string;
  price: number;
}

interface Passenger {
  id: string;
  name: string;
  email: string;
  telephone: string;
  lastLoginDate: string;
  lastTripDate: string;
  lastTripName: string;
  isBlocked: boolean;
  blockReason?: string;
  trips: Trip[];
}

interface PassengerForm {
  name: string;
  email: string;
  telephone: string;
}

@Component({
  selector: 'app-passanger-data',
  templateUrl: './passanger-data.component.html',
  styleUrls: ['./passanger-data.component.scss']
})
export class PassangerDataComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  passengers: Passenger[] = [];
  globalFilter = '';

  // ── Add / Edit dialog ─────────────────────────────────────────
  showDialog   = false;
  isEditMode   = false;
  editingId: string | null = null;
  passengerForm: PassengerForm = this.emptyForm();

  // ── Block / Unblock modal ─────────────────────────────────────
  showBlockModal = false;
  blockTarget: Passenger | null = null;
  blockReason = '';

  // ── Trips modal ───────────────────────────────────────────────
  showTripsModal  = false;
  tripsTarget: Passenger | null = null;
  allTrips: Trip[] = [];

  // Pagination
  tripsPage     = 1;
  tripsPageSize = 5;

  // Sorting
  tripSortField: keyof Trip | null = null;
  tripSortDir: 'asc' | 'desc' = 'asc';

  constructor(
    private router: Router,
    public  auth: AuthService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadPassengers();
  }

  // ── Seed data ─────────────────────────────────────────────────

  loadPassengers() {
    this.passengers = [
      {
        id: '1',
        name: 'Sara Ahmed',
        email: 'sara.ahmed@email.com',
        telephone: '+201001234567',
        lastLoginDate: '2026-05-01',
        lastTripDate: '2026-04-28',
        lastTripName: 'Cairo → Alex',
        isBlocked: false,
        trips: [
          { tripName: 'Cairo → Alex',     price: 120 },
          { tripName: 'Alex → Cairo',     price: 120 },
          { tripName: 'Cairo → Luxor',    price: 350 },
          { tripName: 'Luxor → Aswan',    price: 200 },
          { tripName: 'Cairo → Hurghada', price: 280 },
          { tripName: 'Hurghada → Cairo', price: 280 },
        ]
      },
      {
        id: '2',
        name: 'Omar Hassan',
        email: 'omar.hassan@email.com',
        telephone: '+201119876543',
        lastLoginDate: '2026-04-20',
        lastTripDate: '2026-04-15',
        lastTripName: 'Cairo → Luxor',
        isBlocked: true,
        blockReason: 'Repeated no-show',
        trips: [
          { tripName: 'Cairo → Luxor',  price: 350 },
          { tripName: 'Luxor → Cairo',  price: 350 },
        ]
      },
      {
        id: '3',
        name: 'Nour ElSayed',
        email: 'nour.elsayed@email.com',
        telephone: '+201234567890',
        lastLoginDate: '2026-05-06',
        lastTripDate: '2026-05-05',
        lastTripName: 'Cairo → Hurghada',
        isBlocked: false,
        trips: [
          { tripName: 'Cairo → Hurghada', price: 280 },
          { tripName: 'Cairo → Alex',     price: 120 },
        ]
      }
    ];
  }

  // ── Helpers ───────────────────────────────────────────────────

  private emptyForm(): PassengerForm {
    return { name: '', email: '', telephone: '' };
  }

  private generateId(): string {
    return Date.now().toString();
  }

  // ── Add / Edit dialog ─────────────────────────────────────────

  onAddNew() {
    this.isEditMode = false;
    this.editingId  = null;
    this.passengerForm = this.emptyForm();
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
  }

  savePassenger() {
    if (!this.passengerForm.name?.trim()) {
      Swal.fire({ icon: 'warning', title: 'Validation', text: 'Passenger name is required.' });
      return;
    }

    if (this.isEditMode && this.editingId) {
      const idx = this.passengers.findIndex(p => p.id === this.editingId);
      if (idx !== -1) {
        this.passengers[idx] = { ...this.passengers[idx], ...this.passengerForm };
        this.passengers = [...this.passengers];
      }
      Swal.fire({ icon: 'success', title: 'Updated',
        text: `Passenger "${this.passengerForm.name}" updated successfully.`,
        timer: 2000, showConfirmButton: false });
    } else {
      const newP: Passenger = {
        id: this.generateId(),
        ...this.passengerForm,
        lastLoginDate: '—',
        lastTripDate:  '—',
        lastTripName:  '—',
        isBlocked: false,
        trips: []
      };
      this.passengers = [...this.passengers, newP];
      Swal.fire({ icon: 'success', title: 'Added',
        text: `Passenger "${newP.name}" added successfully.`,
        timer: 2000, showConfirmButton: false });
    }
    this.closeDialog();
  }

  // ── Block / Unblock modal ─────────────────────────────────────

  openBlockModal(passenger: Passenger) {
    this.blockTarget = passenger;
    this.blockReason = '';
    this.showBlockModal = true;
  }

  closeBlockModal() {
    this.showBlockModal = false;
    this.blockTarget = null;
    this.blockReason = '';
  }

  confirmBlockToggle() {
    if (!this.blockReason?.trim()) {
      Swal.fire({ icon: 'warning', title: 'Reason required',
        text: `Please enter a reason for ${this.blockTarget?.isBlocked ? 'unblocking' : 'blocking'} this passenger.` });
      return;
    }

    if (!this.blockTarget) return;

    const action = this.blockTarget.isBlocked ? 'unblocked' : 'blocked';
    this.blockTarget.isBlocked    = !this.blockTarget.isBlocked;
    this.blockTarget.blockReason  = this.blockReason;
    this.passengers = [...this.passengers];

    Swal.fire({ icon: 'info', title: 'Status Updated',
      text: `Passenger "${this.blockTarget.name}" has been ${action}. Reason: ${this.blockReason}`,
      timer: 3000, showConfirmButton: false });

    this.closeBlockModal();
  }

  // ── Trips modal ───────────────────────────────────────────────

  openTripsModal(passenger: Passenger) {
    this.tripsTarget   = passenger;
    this.allTrips      = [...passenger.trips];
    this.tripsPage     = 1;
    this.tripSortField = null;
    this.tripSortDir   = 'asc';
    this.showTripsModal = true;
  }

  closeTripsModal() {
    this.showTripsModal = false;
    this.tripsTarget    = null;
    this.allTrips       = [];
  }

  // Trips pagination

  get tripsTotalPages(): number {
    return Math.ceil(this.allTrips.length / this.tripsPageSize);
  }

  get tripsPageNumbers(): number[] {
    return Array.from({ length: this.tripsTotalPages }, (_, i) => i + 1);
  }

  get pagedTrips(): Trip[] {
    const start = (this.tripsPage - 1) * this.tripsPageSize;
    return this.allTrips.slice(start, start + this.tripsPageSize);
  }

  setTripsPage(page: number) {
    if (page < 1 || page > this.tripsTotalPages) return;
    this.tripsPage = page;
  }

  // Trips sorting

  sortTrips(field: keyof Trip) {
    if (this.tripSortField === field) {
      this.tripSortDir = this.tripSortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.tripSortField = field;
      this.tripSortDir   = 'asc';
    }
    this.allTrips = [...this.allTrips].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      const cmp  = typeof valA === 'string'
        ? valA.localeCompare(valB as string)
        : (valA as number) - (valB as number);
      return this.tripSortDir === 'asc' ? cmp : -cmp;
    });
    this.tripsPage = 1;
  }

  getTripSortIcon(field: keyof Trip): string {
    if (this.tripSortField !== field) return 'pi-sort-alt';
    return this.tripSortDir === 'asc' ? 'pi-sort-amount-up' : 'pi-sort-amount-down';
  }

  // ── Overlay click (close on backdrop) ────────────────────────

  onOverlayClick(event: MouseEvent, modal: 'dialog' | 'block' | 'trips') {
    if (!(event.target as HTMLElement).classList.contains('custom-modal-overlay')) return;
    if (modal === 'dialog') this.closeDialog();
    if (modal === 'block')  this.closeBlockModal();
    if (modal === 'trips')  this.closeTripsModal();
  }

  // ── Navigation ────────────────────────────────────────────────

  signOut() {
    this.router.navigate(['/module-selection']);
  }
}
