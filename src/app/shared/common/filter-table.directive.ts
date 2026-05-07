import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[appFilterTable]'
})
export class FilterTableDirective implements OnChanges {
    @Input() appFilterTable: string; // The search term
    @Input() items: any[]; // The array of items

    constructor(private elementRef: ElementRef) { }

    ngOnChanges() {
        this.filterTable();
    }

    filterTable() {
        const searchTerm = this.appFilterTable.toLowerCase();
        const tableRows = this.elementRef.nativeElement.querySelectorAll('tr');

        tableRows.forEach((row: HTMLElement , index: number ) => {
            if (index === 0) {
                return; // Skip the header row
              }
            const rowData = row.querySelectorAll('td');
            let matchFound = false;
          
            if (searchTerm == "") row.style.display = '';
            else {
                rowData.forEach((cell: HTMLElement) => {
                    const cellText = cell.innerText || cell.textContent || '';

                    if (cellText.toLowerCase().includes(searchTerm)) {
                        matchFound = true;
                    }
                });

                if (matchFound) {
                    row.style.display = ''; // Show the row if a match is found
                } else {
                    row.style.display = 'none'; // Hide the row if no match is found
                }
            }

        });
    }
}

