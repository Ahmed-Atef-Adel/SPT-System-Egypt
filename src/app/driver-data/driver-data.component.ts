import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';

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

@Component({
  selector: 'app-driver-data',
  templateUrl: './driver-data.component.html',
  styleUrls: ['./driver-data.component.scss']
})
export class DriverDataComponent {
  @ViewChild('dt') dt!: Table;

  drivers: Driver[] = [
    {
      id: '1',
      driverName: 'Ahmed Mohamed',
      licenseId: 'LIC-001234',
      idNumber: '29901011234567',
      licenseExpiredDate: '2027-06-01',
      address: '12 Nile St, Cairo',
      hiringDate: '2022-03-15',
      hasChronicDisease: false,
      isBlocked: false,
    },
    {
      id: '2',
      driverName: 'Mohamed Ali',
      licenseId: 'LIC-005678',
      idNumber: '29505154567890',
      licenseExpiredDate: '2025-12-31',
      address: '45 Tahrir Square, Giza',
      hiringDate: '2021-07-20',
      hasChronicDisease: true,
      isBlocked: true,
    },
  ];

  globalFilter: string = '';

  // ── Dialog state ──────────────────────────────────────────────
  showDialog = false;
  isEditMode = false;
  editingDriverId: string | null = null;

  driverForm: Omit<Driver, 'id'> = this.emptyForm();

  constructor(
    private router: Router,
    public auth: AuthService,
    private translate: TranslateService,
  ) {}

  // ── Helpers ───────────────────────────────────────────────────

  private emptyForm(): Omit<Driver, 'id'> {
    return {
      driverName: '',
      licenseId: '',
      idNumber: '',
      licenseExpiredDate: '',
      address: '',
      hiringDate: '',
      hasChronicDisease: false,
      isBlocked: false,
    };
  }

  private generateId(): string {
    return Date.now().toString();
  }

  // ── Dialog open / close ───────────────────────────────────────

  onAddNew() {
    this.isEditMode = false;
    this.editingDriverId = null;
    this.driverForm = this.emptyForm();
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

  saveDriver() {
    if (!this.driverForm.driverName?.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation',
        text: 'Driver name is required.',
      });
      return;
    }

    if (this.isEditMode && this.editingDriverId) {
      // Update existing driver
      const index = this.drivers.findIndex(d => d.id === this.editingDriverId);
      if (index !== -1) {
        this.drivers[index] = { id: this.editingDriverId, ...this.driverForm };
        // Trigger change detection for p-table
        this.drivers = [...this.drivers];
      }
      Swal.fire({
        icon: 'success',
        title: this.translate.instant('Updated'),
        text: `Driver "${this.driverForm.driverName}" updated successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: this.generateId(),
        ...this.driverForm,
      };
      this.drivers = [...this.drivers, newDriver];
      Swal.fire({
        icon: 'success',
        title: this.translate.instant('Added'),
        text: `Driver "${newDriver.driverName}" added successfully.`,
        timer: 2000,
        showConfirmButton: false,
      });
    }

    this.closeDialog();
  }

  // ── Edit ──────────────────────────────────────────────────────

  confirmEdit(driver: Driver) {
    Swal.fire({
      title: this.translate.instant('Confirm Edit'),
      text: this.translate.instant('Are you sure you want to edit this driver?'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Yes, edit it'),
      cancelButtonText: this.translate.instant('Cancel'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.openEditDialog(driver);
      }
    });
  }

  private openEditDialog(driver: Driver) {
    this.isEditMode = true;
    this.editingDriverId = driver.id;
    this.driverForm = {
      driverName: driver.driverName,
      licenseId: driver.licenseId,
      idNumber: driver.idNumber,
      licenseExpiredDate: driver.licenseExpiredDate,
      address: driver.address,
      hiringDate: driver.hiringDate,
      hasChronicDisease: driver.hasChronicDisease,
      isBlocked: driver.isBlocked,
    };
    this.showDialog = true;
  }

  // ── Delete ────────────────────────────────────────────────────

  confirmDelete(driver: Driver) {
    Swal.fire({
      title: this.translate.instant('Confirm Delete'),
      text: this.translate.instant('Are you sure you want to delete this driver?'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant('Yes, delete it'),
      cancelButtonText: this.translate.instant('Cancel'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteDriver(driver);
      }
    });
  }

  deleteDriver(driver: Driver) {
    this.drivers = this.drivers.filter(d => d.id !== driver.id);
    Swal.fire({
      icon: 'success',
      title: this.translate.instant('Deleted'),
      text: `Driver "${driver.driverName}" deleted successfully.`,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  // ── Block / Unblock ───────────────────────────────────────────

  confirmBlock(driver: Driver) {
    const isCurrentlyBlocked = driver.isBlocked === true;
    Swal.fire({
      title: this.translate.instant(isCurrentlyBlocked ? 'Confirm Unblock' : 'Confirm Block'),
      text: this.translate.instant(
        isCurrentlyBlocked
          ? 'Are you sure you want to unblock this driver?'
          : 'Are you sure you want to block this driver?'
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isCurrentlyBlocked ? '#28a745' : '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: this.translate.instant(isCurrentlyBlocked ? 'Yes, unblock' : 'Yes, block'),
      cancelButtonText: this.translate.instant('Cancel'),
    }).then((result) => {
      if (result.isConfirmed) {
        this.toggleBlock(driver);
      }
    });
  }

  toggleBlock(driver: Driver) {
    driver.isBlocked = !driver.isBlocked;
    // Trigger change detection
    this.drivers = [...this.drivers];
    Swal.fire({
      icon: 'info',
      title: this.translate.instant('Block Status Updated'),
      text: `Driver "${driver.driverName}" is now ${driver.isBlocked ? 'blocked' : 'unblocked'}.`,
      timer: 2000,
      showConfirmButton: false,
    });
  }

  // ── Badge severity ────────────────────────────────────────────

  /**
   * Chronic disease: Yes = danger (red), No = success (green)
   */
  getChronicDiseaseSeverity(has: boolean): string {
    return has ? 'danger' : 'success';
  }

  /**
   * Blocked: Yes = danger (red), No = success (green)
   */
  getBlockedSeverity(isBlocked: boolean): string {
    return isBlocked ? 'danger' : 'success';
  }

  // ── License expiry ────────────────────────────────────────────

  isLicenseExpired(expiredDate: string): boolean {
    return new Date(expiredDate) < new Date();
  }

  // ── Navigation ────────────────────────────────────────────────

  signOut() {
    this.router.navigate(['/module-selection']);
  }
}
