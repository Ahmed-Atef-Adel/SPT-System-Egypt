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
  startDate: string;
  endDate: string;
  stopsCount: number;
  expectedCount: number;
  price: number;
  tripCountPerDay: number;
  status: 'Active' | 'Not Active';
}

@Component({
  selector: 'app-trip-data',
  templateUrl: './trip-data.component.html',
  styleUrls: ['./trip-data.component.scss']
})
export class TripDataComponent {
  @ViewChild('dt') dt!: Table;

  trips: Trip[] = [
    {
      id: 1,
      name: 'Business Trip to Berlin',
      startTime: '08:00',
      endTime: '18:00',
      startDate: '2026-05-01',
      endDate: '',
      stopsCount: 4,
      status: 'Active',
      expectedCount: 3,
      price: 1200,
      tripCountPerDay: 2
    },
    {
      id: 2,
      name: 'Family Vacation',
      startTime: '10:00',
      endTime: '20:00',
      startDate: '2026-06-10',
      endDate: '2026-06-20',
      stopsCount: 7,
      status: 'Not Active',
      expectedCount: 5,
      price: 3500,
      tripCountPerDay: 3
    },
  ];

  globalFilter: string = '';

  constructor(
    private router: Router,
    public auth: AuthService,
    private translate: TranslateService,
  ) {}

  getDuration(trip: Trip): string {
    const start = new Date(`${trip.startDate}T${trip.startTime}`);
    const end = new Date(`${trip.startDate}T${trip.endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${hours}h`;
  }

  private getNextId(): number {
    return this.trips.length > 0 ? Math.max(...this.trips.map(t => t.id)) + 1 : 1;
  }

  onAddNew() {
    Swal.fire({
      title: this.translate.instant('Add New Trip'),
      html: `
        <div style="text-align:left; display:grid; gap:8px;">
          <label>Trip Name *</label>
          <input id="swal-name" class="swal2-input" placeholder="Trip Name" style="margin:0">

          <label>Start Date *</label>
          <input id="swal-startDate" type="date" class="swal2-input" style="margin:0">

          <label>End Date</label>
          <input id="swal-endDate" type="date" class="swal2-input" style="margin:0">

          <label>Start Time *</label>
          <input id="swal-startTime" type="time" class="swal2-input" style="margin:0">

          <label>End Time *</label>
          <input id="swal-endTime" type="time" class="swal2-input" style="margin:0">

          <label>Stops Count *</label>
          <input id="swal-stopsCount" type="number" min="0" class="swal2-input" placeholder="0" style="margin:0">

          <label>Expected Count *</label>
          <input id="swal-expectedCount" type="number" min="0" class="swal2-input" placeholder="0" style="margin:0">

          <label>Price ($) *</label>
          <input id="swal-price" type="number" min="0" class="swal2-input" placeholder="0.00" style="margin:0">

          <label>Trip Count Per Day *</label>
          <input id="swal-tripCountPerDay" type="number" min="1" class="swal2-input" placeholder="1" style="margin:0">

          <label>Status *</label>
          <select id="swal-status" class="swal2-input" style="margin:0; height:42px;">
            <option value="Active">Active</option>
            <option value="Not Active">Not Active</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Add Trip'),
      cancelButtonText: this.translate.instant('Cancel'),
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value.trim();
        const startDate = (document.getElementById('swal-startDate') as HTMLInputElement).value;
        const endDate = (document.getElementById('swal-endDate') as HTMLInputElement).value;
        const startTime = (document.getElementById('swal-startTime') as HTMLInputElement).value;
        const endTime = (document.getElementById('swal-endTime') as HTMLInputElement).value;
        const stopsCount = parseInt((document.getElementById('swal-stopsCount') as HTMLInputElement).value, 10);
        const expectedCount = parseInt((document.getElementById('swal-expectedCount') as HTMLInputElement).value, 10);
        const price = parseFloat((document.getElementById('swal-price') as HTMLInputElement).value);
        const tripCountPerDay = parseInt((document.getElementById('swal-tripCountPerDay') as HTMLInputElement).value, 10);
        const status = (document.getElementById('swal-status') as HTMLSelectElement).value as 'Active' | 'Not Active';

        if (!name || !startDate || !startTime || !endTime) {
          Swal.showValidationMessage(this.translate.instant('Please fill in all required fields.'));
          return false;
        }
        if (isNaN(stopsCount) || isNaN(expectedCount) || isNaN(price) || isNaN(tripCountPerDay)) {
          Swal.showValidationMessage(this.translate.instant('Stops Count, Expected Count, Price, and Trip Count Per Day must be valid numbers.'));
          return false;
        }
        return { name, startDate, endDate, startTime, endTime, stopsCount, expectedCount, price, tripCountPerDay, status };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newTrip: Trip = {
          id: this.getNextId(),
          ...result.value
        };
        this.trips = [...this.trips, newTrip];
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('Trip Added'),
          text: `"${newTrip.name}" has been added successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  confirmEdit(trip: Trip) {
    Swal.fire({
      title: this.translate.instant('Edit Trip'),
      html: `
        <div style="text-align:left; display:grid; gap:8px;">
          <label>Trip Name *</label>
          <input id="swal-name" class="swal2-input" value="${trip.name}" style="margin:0">

          <label>Start Date *</label>
          <input id="swal-startDate" type="date" class="swal2-input" value="${trip.startDate}" style="margin:0">

          <label>End Date</label>
          <input id="swal-endDate" type="date" class="swal2-input" value="${trip.endDate}" style="margin:0">

          <label>Start Time *</label>
          <input id="swal-startTime" type="time" class="swal2-input" value="${trip.startTime}" style="margin:0">

          <label>End Time *</label>
          <input id="swal-endTime" type="time" class="swal2-input" value="${trip.endTime}" style="margin:0">

          <label>Stops Count *</label>
          <input id="swal-stopsCount" type="number" min="0" class="swal2-input" value="${trip.stopsCount}" style="margin:0">

          <label>Expected Count *</label>
          <input id="swal-expectedCount" type="number" min="0" class="swal2-input" value="${trip.expectedCount}" style="margin:0">

          <label>Price ($) *</label>
          <input id="swal-price" type="number" min="0" class="swal2-input" value="${trip.price}" style="margin:0">

          <label>Trip Count Per Day *</label>
          <input id="swal-tripCountPerDay" type="number" min="1" class="swal2-input" value="${trip.tripCountPerDay}" style="margin:0">

          <label>Status *</label>
          <select id="swal-status" class="swal2-input" style="margin:0; height:42px;">
            <option value="Active" ${trip.status === 'Active' ? 'selected' : ''}>Active</option>
            <option value="Not Active" ${trip.status === 'Not Active' ? 'selected' : ''}>Not Active</option>
          </select>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Save Changes'),
      cancelButtonText: this.translate.instant('Cancel'),
      preConfirm: () => {
        const name = (document.getElementById('swal-name') as HTMLInputElement).value.trim();
        const startDate = (document.getElementById('swal-startDate') as HTMLInputElement).value;
        const endDate = (document.getElementById('swal-endDate') as HTMLInputElement).value;
        const startTime = (document.getElementById('swal-startTime') as HTMLInputElement).value;
        const endTime = (document.getElementById('swal-endTime') as HTMLInputElement).value;
        const stopsCount = parseInt((document.getElementById('swal-stopsCount') as HTMLInputElement).value, 10);
        const expectedCount = parseInt((document.getElementById('swal-expectedCount') as HTMLInputElement).value, 10);
        const price = parseFloat((document.getElementById('swal-price') as HTMLInputElement).value);
        const tripCountPerDay = parseInt((document.getElementById('swal-tripCountPerDay') as HTMLInputElement).value, 10);
        const status = (document.getElementById('swal-status') as HTMLSelectElement).value as 'Active' | 'Not Active';

        if (!name || !startDate || !startTime || !endTime) {
          Swal.showValidationMessage(this.translate.instant('Please fill in all required fields.'));
          return false;
        }
        if (isNaN(stopsCount) || isNaN(expectedCount) || isNaN(price) || isNaN(tripCountPerDay)) {
          Swal.showValidationMessage(this.translate.instant('Stops Count, Expected Count, Price, and Trip Count Per Day must be valid numbers.'));
          return false;
        }
        return { name, startDate, endDate, startTime, endTime, stopsCount, expectedCount, price, tripCountPerDay, status };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const idx = this.trips.findIndex(t => t.id === trip.id);
        if (idx !== -1) {
          this.trips[idx] = { ...this.trips[idx], ...result.value };
          this.trips = [...this.trips]; // trigger change detection
        }
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('Trip Updated'),
          text: `"${result.value.name}" has been updated successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  confirmDelete(trip: Trip) {
    Swal.fire({
      title: this.translate.instant('Confirm Delete'),
      text: this.translate.instant('Are you sure you want to delete this trip?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Yes, delete it'),
      cancelButtonText: this.translate.instant('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteTrip(trip);
      }
    });
  }

  confirmUpdateStatus(trip: Trip) {
    Swal.fire({
      title: this.translate.instant('Confirm Status Update'),
      text: this.translate.instant('Are you sure you want to update the status?'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#f0ad4e',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Yes, update it'),
      cancelButtonText: this.translate.instant('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStatus(trip);
      }
    });
  }

  confirmOperate(trip: Trip) {
    Swal.fire({
      title: this.translate.instant('Confirm Operation'),
      text: this.translate.instant('Are you sure you want to operate on this trip?'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Yes, proceed'),
      cancelButtonText: this.translate.instant('Cancel')
    }).then((result) => {
      if (result.isConfirmed) {
        this.operateTrip(trip);
      }
    });
  }

  deleteTrip(trip: Trip) {
    this.trips = this.trips.filter(t => t.id !== trip.id);
    Swal.fire({
      icon: 'success',
      title: this.translate.instant('Deleted'),
      text: `Trip "${trip.name}" deleted successfully.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  updateStatus(trip: Trip) {
    trip.status = trip.status === 'Active' ? 'Not Active' : 'Active';
    this.trips = [...this.trips]; // trigger change detection
    Swal.fire({
      icon: 'info',
      title: this.translate.instant('Status Updated'),
      text: `Trip "${trip.name}" status changed to ${trip.status}.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  operateTrip(trip: Trip) {
    Swal.fire({
      icon: 'info',
      title: this.translate.instant('Operate'),
      text: `Trip "${trip.name}" operated successfully.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Active': return 'success';
      case 'Not Active': return 'danger';
      default: return 'secondary';
    }
  }

  signOut() {
    this.router.navigate(['/module-selection']);
  }
}
