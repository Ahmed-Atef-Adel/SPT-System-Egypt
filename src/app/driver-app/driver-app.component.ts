import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

interface Trip {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  stopsCount: number;
  PassagnerCount: number;
  AcutalPassagnerCount: number;
  status:
    | 'Pending'
    | 'Started'
    | 'Ended'
    | 'Cancelled';

  cancelReason?: string;
}

@Component({
  selector: 'app-driver-app',
  templateUrl: './driver-app.component.html',
  styleUrls: ['./driver-app.component.scss']
})
export class DriverAppComponent {

  @ViewChild('dt') dt!: Table;

  // =========================
  // Trips Data
  // =========================

  trips: Trip[] = [
    {
      id: 1,
      name: 'Business Trip to Berlin',
      startTime: '08:00',
      endTime: '18:00',
      stopsCount: 4,
      status: 'Pending',
      AcutalPassagnerCount : 0,
      PassagnerCount : 3
    },
    {
      id: 2,
      name: 'Family Vacation',
      startTime: '10:00',
      endTime: '20:00',
      stopsCount: 7,
      status: 'Started',
        AcutalPassagnerCount : 0,
      PassagnerCount : 3
    }
  ];

  globalFilter: string = '';

  // =========================
  // Cancel Dialog
  // =========================

  cancelDialog: boolean = false;

  cancelReason: string = '';

  selectedTrip!: Trip;

  // =========================
  // Ticket Reader
  // =========================

  ticketDialog: boolean = false;

  ticketBarcode: string = '';

  ticketData: any = null;

  constructor(
    private router: Router,
    public auth: AuthService,
    private translate: TranslateService
  ) {}

  // =========================
  // Duration
  // =========================

  getDuration(trip: Trip): string {

   const today = new Date();

const datePart = today.toISOString().split('T')[0]; // YYYY-MM-DD

const start = new Date(`${datePart}T${trip.startTime}`);
const end = new Date(`${datePart}T${trip.endTime}`);

const diffMs = end.getTime() - start.getTime();

const hours = Math.floor(diffMs / (1000 * 60 * 60));

    return `${hours}h`;
  }

  // =========================
  // Generate Next ID
  // =========================

  private getNextId(): number {

    return this.trips.length > 0
      ? Math.max(...this.trips.map(t => t.id)) + 1
      : 1;
  }

  // =========================
  // Add New Trip
  // =========================

  onAddNew() {

     this.ticketDialog = true;
  }
 

 

  // =========================
  // Delete Trip
  // =========================

  confirmDelete(trip: Trip) {

    Swal.fire({
      title: 'Delete Trip?',
      text: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete'
    }).then((result) => {

      if (result.isConfirmed) {

        this.trips =
          this.trips.filter(t => t.id !== trip.id);

        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Trip deleted successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // =========================
  // Start Trip
  // =========================

  startTrip(trip: Trip) {

    Swal.fire({
      title: 'Start Trip?',
      text: `Start "${trip.name}" ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Start'
    }).then((result) => {

      if (result.isConfirmed) {

        trip.status = 'Started';

        this.trips = [...this.trips];

        Swal.fire({
          icon: 'success',
          title: 'Trip Started',
          text: `${trip.name} started successfully`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // =========================
  // End Trip
  // =========================

  endTrip(trip: Trip) {

    Swal.fire({
      title: 'End Trip?',
      text: `End "${trip.name}" ?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'End Trip'
    }).then((result) => {

      if (result.isConfirmed) {

        trip.status = 'Ended';

        this.trips = [...this.trips];

        Swal.fire({
          icon: 'success',
          title: 'Trip Ended',
          text: `${trip.name} ended successfully`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  // =========================
  // Open Cancel Dialog
  // =========================

  openCancelDialog(trip: Trip) {

    this.selectedTrip = trip;

    this.cancelReason = '';

    this.cancelDialog = true;
  }

  // =========================
  // Confirm Cancel Trip
  // =========================

  confirmCancelTrip() {

    if (!this.selectedTrip) {
      return;
    }

    this.selectedTrip.status = 'Cancelled';

    this.selectedTrip.cancelReason =
      this.cancelReason;

    this.trips = [...this.trips];

    this.cancelDialog = false;

    Swal.fire({
      icon: 'warning',
      title: 'Trip Cancelled',
      text: `${this.selectedTrip.name} cancelled successfully`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // =========================
  // Ticket Dialog
  // =========================

  openTicketDialog(trip: Trip) {

    this.selectedTrip = trip;

    this.ticketDialog = true;

    this.ticketBarcode = '';

    this.ticketData = null;
  }

  // =========================
  // Read Ticket
  // =========================

  readTicket() {

    this.ticketData = {
      ticketNumber: this.ticketBarcode,
      passengerName: 'Ahmed Ali',
      seatNumber: 'A12',
      status: 'Valid'
    };

    Swal.fire({
      icon: 'success',
      title: 'Ticket Read',
      text: `Ticket ${this.ticketBarcode} loaded successfully`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // =========================
  // Badge Severity
  // =========================

  getStatusSeverity(status: string): string {

    switch (status) {

      case 'Pending':
        return 'warning';

      case 'Started':
        return 'info';

      case 'Ended':
        return 'success';

      case 'Cancelled':
        return 'danger';

      default:
        return 'secondary';
    }
  }

  // =========================
  // Sign Out
  // =========================

  signOut() {

    this.router.navigate(['/module-selection']);
  }
}