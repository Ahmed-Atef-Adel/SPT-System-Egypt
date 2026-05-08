import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';

interface Trip {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  stopsCount: number;
  expectedCount: number;
  actualPassengerCount: number;
  status: 'Pending' | 'Started' | 'Ended' | 'Cancelled';
  cancelReason?: string;
}

interface TicketData {
  ticketNumber: string;
  passengerName: string;
  seatNumber: string;
  status: string;
}

@Component({
  selector: 'app-driver-app',
  templateUrl: './driver-app.component.html',
  styleUrls: ['./driver-app.component.scss']
})
export class DriverAppComponent {

  @ViewChild('dt') dt!: Table;

  // ── Data ──────────────────────────────────────────────────────

  trips: Trip[] = [
    {
      id: 1,
      name: 'Business Trip to Berlin',
      startTime: '08:00',
      endTime: '18:00',
      stopsCount: 4,
      expectedCount: 30,
      actualPassengerCount: 0,
      status: 'Pending'
    },
    {
      id: 2,
      name: 'Family Vacation',
      startTime: '10:00',
      endTime: '20:00',
      stopsCount: 7,
      expectedCount: 45,
      actualPassengerCount: 12,
      status: 'Started'
    },
    {
      id: 3,
      name: 'School Excursion',
      startTime: '07:00',
      endTime: '15:00',
      stopsCount: 3,
      expectedCount: 50,
      actualPassengerCount: 50,
      status: 'Ended'
    },
    {
      id: 4,
      name: 'Airport Transfer',
      startTime: '06:00',
      endTime: '08:00',
      stopsCount: 1,
      expectedCount: 10,
      actualPassengerCount: 0,
      status: 'Cancelled',
      cancelReason: 'Vehicle breakdown — maintenance required.'
    }
  ];

  globalFilter = '';
  selectedTrip: Trip | null = null;

  // ── Ticket modal ──────────────────────────────────────────────

  showTicketModal = false;
  ticketBarcode   = '';
  ticketData: TicketData | null = null;

  // ── Cancel modal ──────────────────────────────────────────────

  showCancelModal = false;
  cancelReason    = '';

  // ── Reason view modal ─────────────────────────────────────────

  showReasonModal = false;

  constructor(
    private router: Router,
    public  auth: AuthService,
    private translate: TranslateService
  ) {}

  // ── Duration helper ───────────────────────────────────────────

  getDuration(trip: Trip): string {
    const today    = new Date().toISOString().split('T')[0];
    const start    = new Date(`${today}T${trip.startTime}`);
    const end      = new Date(`${today}T${trip.endTime}`);
    const diffMs   = end.getTime() - start.getTime();
    const hours    = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes  = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  // ── Ticket modal ──────────────────────────────────────────────

  openTicketModal() {
    this.ticketBarcode = '';
    this.ticketData    = null;
    this.showTicketModal = true;
  }

  closeTicketModal() {
    this.showTicketModal = false;
    this.ticketBarcode   = '';
    this.ticketData      = null;
  }

  readTicket() {
    if (!this.ticketBarcode?.trim()) return;

    // Simulate ticket lookup
    this.ticketData = {
      ticketNumber:  this.ticketBarcode,
      passengerName: 'Ahmed Ali',
      seatNumber:    'A12',
      status:        'Valid'
    };

    Swal.fire({
      icon: 'success',
      title: 'Ticket Read',
      text: `Ticket ${this.ticketBarcode} loaded successfully.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // ── Cancel modal ──────────────────────────────────────────────

  openCancelModal(trip: Trip) {
    this.selectedTrip = trip;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.cancelReason    = '';
    this.selectedTrip    = null;
  }

  confirmCancelTrip() {
    if (!this.cancelReason?.trim() || !this.selectedTrip) return;

    this.selectedTrip.status       = 'Cancelled';
    this.selectedTrip.cancelReason = this.cancelReason;
    this.trips = [...this.trips];

    Swal.fire({
      icon: 'warning',
      title: 'Trip Cancelled',
      text: `"${this.selectedTrip.name}" has been cancelled.`,
      timer: 2000,
      showConfirmButton: false
    });

    this.closeCancelModal();
  }

  // ── Reason view modal ─────────────────────────────────────────

  openReasonModal(trip: Trip) {
    this.selectedTrip   = trip;
    this.showReasonModal = true;
  }

  closeReasonModal() {
    this.showReasonModal = false;
    this.selectedTrip    = null;
  }

  // ── Start Trip ────────────────────────────────────────────────

  startTrip(trip: Trip) {
    Swal.fire({
      title: 'Start Trip?',
      text: `Are you sure you want to start "${trip.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Start',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        trip.status = 'Started';
        this.trips  = [...this.trips];
        Swal.fire({
          icon: 'success',
          title: 'Trip Started',
          text: `"${trip.name}" started successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // ── End Trip ──────────────────────────────────────────────────

  endTrip(trip: Trip) {
    Swal.fire({
      title: 'End Trip?',
      text: `Are you sure you want to end "${trip.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, End Trip',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        trip.status = 'Ended';
        this.trips  = [...this.trips];
        Swal.fire({
          icon: 'success',
          title: 'Trip Ended',
          text: `"${trip.name}" ended successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // ── Badge severity ────────────────────────────────────────────

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Pending':   return 'warning';
      case 'Started':   return 'info';
      case 'Ended':     return 'success';
      case 'Cancelled': return 'danger';
      default:          return 'secondary';
    }
  }

  // ── Overlay click ─────────────────────────────────────────────

  onOverlayClick(event: MouseEvent, modal: 'ticket' | 'cancel' | 'reason') {
    if (!(event.target as HTMLElement).classList.contains('custom-modal-overlay')) return;
    if (modal === 'ticket') this.closeTicketModal();
    if (modal === 'cancel') this.closeCancelModal();
    if (modal === 'reason') this.closeReasonModal();
  }

  // ── Navigation ────────────────────────────────────────────────

  signOut() {
    this.router.navigate(['/module-selection']);
  }
}
