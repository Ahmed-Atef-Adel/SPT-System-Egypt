import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/guard/auth.service';
import { Table } from 'primeng/table';

interface ReportRow {
  id: string;
  date: string;
  tripName: string;
  driverName: string;
  driverLicenseId: string;
  vehicleName: string;
  plateNumber: string;
  passengerCount: number;
  duration: string;
  status: 'Finished' | 'Started' | 'Cancelled' | 'Pending';
  notes?: string;
}

interface Filters {
  reportType: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  globalFilter = '';

  // ── Detail modal ──────────────────────────────────────────────
  showDetailModal = false;
  selectedReport: ReportRow | null = null;

  // ── Filters ───────────────────────────────────────────────────
  filters: Filters = {
    reportType: 'all',
    status: '',
    dateFrom: '',
    dateTo: ''
  };

  // ── Raw data ──────────────────────────────────────────────────
  allReports: ReportRow[] = [
    {
      id: 'r1', date: '2026-05-01', tripName: 'Cairo → Alexandria',
      driverName: 'Ahmed Mohamed', driverLicenseId: 'LIC-001234',
      vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234',
      passengerCount: 28, duration: '2h 00m', status: 'Finished',
      notes: 'Trip completed on time. No incidents reported.'
    },
    {
      id: 'r2', date: '2026-05-02', tripName: 'Cairo → Alexandria',
      driverName: 'Ahmed Mohamed', driverLicenseId: 'LIC-001234',
      vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234',
      passengerCount: 30, duration: '2h 00m', status: 'Finished',
    },
    {
      id: 'r3', date: '2026-05-03', tripName: 'Giza → Luxor',
      driverName: 'Mohamed Ali', driverLicenseId: 'LIC-005678',
      vehicleName: 'Mercedes Sprinter', plateNumber: 'XYZ-5678',
      passengerCount: 18, duration: '8h 00m', status: 'Finished',
      notes: 'Minor delay at checkpoint — 15 minutes.'
    },
    {
      id: 'r4', date: '2026-05-04', tripName: 'Heliopolis → Maadi',
      driverName: 'Khaled Hassan', driverLicenseId: 'LIC-009999',
      vehicleName: 'Hyundai H350', plateNumber: 'DEF-9999',
      passengerCount: 0, duration: '1h 15m', status: 'Cancelled',
      notes: 'Cancelled due to vehicle breakdown.'
    },
    {
      id: 'r5', date: '2026-05-05', tripName: 'Cairo → Hurghada',
      driverName: 'Ahmed Mohamed', driverLicenseId: 'LIC-001234',
      vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234',
      passengerCount: 22, duration: '4h 00m', status: 'Finished',
    },
    {
      id: 'r6', date: '2026-05-06', tripName: 'Giza → Luxor',
      driverName: 'Mohamed Ali', driverLicenseId: 'LIC-005678',
      vehicleName: 'Mercedes Sprinter', plateNumber: 'XYZ-5678',
      passengerCount: 15, duration: '8h 00m', status: 'Finished',
    },
    {
      id: 'r7', date: '2026-05-07', tripName: 'Cairo → Alexandria',
      driverName: 'Khaled Hassan', driverLicenseId: 'LIC-009999',
      vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234',
      passengerCount: 25, duration: '2h 00m', status: 'Started',
    },
    {
      id: 'r8', date: '2026-05-08', tripName: 'Cairo → Hurghada',
      driverName: 'Mohamed Ali', driverLicenseId: 'LIC-005678',
      vehicleName: 'Hyundai H350', plateNumber: 'DEF-9999',
      passengerCount: 12, duration: '4h 00m', status: 'Pending',
    },
    {
      id: 'r9', date: '2026-05-08', tripName: 'Heliopolis → Maadi',
      driverName: 'Ahmed Mohamed', driverLicenseId: 'LIC-001234',
      vehicleName: 'Mercedes Sprinter', plateNumber: 'XYZ-5678',
      passengerCount: 8, duration: '1h 15m', status: 'Finished',
    },
    {
      id: 'r10', date: '2026-05-09', tripName: 'Cairo → Alexandria',
      driverName: 'Khaled Hassan', driverLicenseId: 'LIC-009999',
      vehicleName: 'Toyota Coaster', plateNumber: 'ABC-1234',
      passengerCount: 0, duration: '2h 00m', status: 'Cancelled',
      notes: 'Cancelled due to bad weather conditions.'
    },
  ];

  filteredReports: ReportRow[] = [];

  // ── KPI getters ───────────────────────────────────────────────
  get totalTrips(): number        { return this.allReports.length; }
  get finishedTrips(): number     { return this.allReports.filter(r => r.status === 'Finished').length; }
  get cancelledTrips(): number    { return this.allReports.filter(r => r.status === 'Cancelled').length; }
  get totalPassengers(): number   { return this.allReports.reduce((s, r) => s + r.passengerCount, 0); }

  get filteredTotalPassengers(): number {
    return this.filteredReports.reduce((s, r) => s + r.passengerCount, 0);
  }

  constructor(
    private router: Router,
    public  auth: AuthService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  // ── Filters ───────────────────────────────────────────────────

  applyFilters() {
    let result = [...this.allReports];

    if (this.filters.status) {
      result = result.filter(r => r.status === this.filters.status);
    }

    if (this.filters.dateFrom) {
      result = result.filter(r => r.date >= this.filters.dateFrom);
    }

    if (this.filters.dateTo) {
      result = result.filter(r => r.date <= this.filters.dateTo);
    }

    // reportType filter — can be expanded when real API returns typed data
    if (this.filters.reportType !== 'all') {
      // placeholder — all rows are trip-centric for now
    }

    this.filteredReports = result;
  }

  resetFilters() {
    this.filters = { reportType: 'all', status: '', dateFrom: '', dateTo: '' };
    this.globalFilter = '';
    if (this.dt) this.dt.filterGlobal('', 'contains');
    this.applyFilters();
  }

  // ── Detail modal ──────────────────────────────────────────────

  openDetailModal(report: ReportRow) {
    this.selectedReport = report;
    this.showDetailModal = true;
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('custom-modal-overlay')) {
      this.showDetailModal = false;
    }
  }

  // ── Export ────────────────────────────────────────────────────

  exportCSV() {
    const rows = this.filteredReports;
    if (!rows.length) return;

    const headers = ['Date', 'Trip Name', 'Driver', 'License ID', 'Vehicle', 'Plate', 'Passengers', 'Duration', 'Status', 'Notes'];
    const csv = [
      headers.join(','),
      ...rows.map(r => [
        r.date, `"${r.tripName}"`, `"${r.driverName}"`, r.driverLicenseId,
        `"${r.vehicleName}"`, r.plateNumber, r.passengerCount, r.duration, r.status,
        `"${r.notes ?? ''}"`
      ].join(','))
    ].join('\n');

    this.downloadFile(csv, `report_${new Date().toISOString().split('T')[0]}.csv`);
  }

  exportSingleReport(report: ReportRow) {
    const headers = ['Date', 'Trip Name', 'Driver', 'License ID', 'Vehicle', 'Plate', 'Passengers', 'Duration', 'Status', 'Notes'];
    const row = [
      report.date, `"${report.tripName}"`, `"${report.driverName}"`, report.driverLicenseId,
      `"${report.vehicleName}"`, report.plateNumber, report.passengerCount, report.duration,
      report.status, `"${report.notes ?? ''}"`
    ].join(',');
    const csv = [headers.join(','), row].join('\n');
    this.downloadFile(csv, `report_${report.id}.csv`);
  }

  private downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Badge / icon helpers ──────────────────────────────────────

  getStatusSeverity(status: string): string {
    switch (status) {
      case 'Finished':  return 'success';
      case 'Started':   return 'info';
      case 'Cancelled': return 'danger';
      case 'Pending':   return 'warning';
      default:          return 'secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Finished':  return 'pi-check-circle';
      case 'Started':   return 'pi-play-circle';
      case 'Cancelled': return 'pi-times-circle';
      case 'Pending':   return 'pi-clock';
      default:          return 'pi-info-circle';
    }
  }

  // ── Navigation ────────────────────────────────────────────────

  signOut() {
    this.router.navigate(['/module-selection']);
  }
}
