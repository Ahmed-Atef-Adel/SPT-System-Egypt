import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

// Menu
export interface Menu {
	headTitle?: string,
	headTitle2?: string,
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	badgeClass?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService implements OnDestroy {

	private unsubscriber: Subject<any> = new Subject();
	public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

	// Search Box
	public search: boolean = false;

	// Language
	public language: boolean = false;

	// Mega Menu
	public megaMenu: boolean = false;
	public levelMenu: boolean = false;
	public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

	// Collapse Sidebar
	public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

	// For Horizontal Layout Mobile
	public horizontal: boolean = window.innerWidth < 991 ? false : true;

	// Full screen
	public fullScreen: boolean = false;

	constructor(private router: Router, private translate: TranslateService) {
		this.setScreenWidth(window.innerWidth);
		fromEvent(window, 'resize').pipe(
			debounceTime(1000),
			takeUntil(this.unsubscriber)
		).subscribe((evt: any) => {
			this.setScreenWidth(evt.target.innerWidth);
			if (evt.target.innerWidth < 991) {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			}
			if (evt.target.innerWidth < 1199) {
				this.megaMenuColapse = true;
			}
		});
		if (window.innerWidth < 991) { // Detect Route change sidebar close
			this.router.events.subscribe(event => {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			});
		}
	}

	ngOnDestroy() {
		this.unsubscriber.next;
		this.unsubscriber.complete();
	}

	private setScreenWidth(width: number): void {
		this.screenWidth.next(width);
	}

	MENUITEMS: Menu[] = [
		{
			headTitle: this.translate.instant('administration.Administration'),
		},
		{
			title: this.translate.instant('administration.Setup'), icon: 'home', type: 'sub', active: true, children: [
				{ path: '/administration/markets', title: this.translate.instant('administration.Markets'), type: 'link' },
				{ path: '/administration/currencies', title: this.translate.instant('administration.Currencies'), type: 'link' },
				{ path: '/administration/nationalities', title: this.translate.instant('administration.Nationalities'), type: 'link' },
				{ path: '/administration/symbol-types', title: this.translate.instant('administration.Symbol_Types'), type: 'link' },
				{ path: '/administration/client-types', title: this.translate.instant('administration.ClientTypes'), type: 'link' },
				{ path: '/administration/brokers', title: this.translate.instant('administration.Brokers'), type: 'link' },
				{ path: '/administration/calendar', title: this.translate.instant('administration.Calendars'), type: 'link' },
				{ path: '/administration/week-ends', title: this.translate.instant('administration.WeekEnds'), type: 'link' }
			]
		},
		{
			title: this.translate.instant('administration.Commissions'), icon: 'home', type: 'sub', active: false, children: [
				{ path: '/administration/custodians', title: this.translate.instant('administration.Custodians'), type: 'link' },
				{ path: '/administration/commissions', title: this.translate.instant('administration.Master_Commissions'), type: 'link' }
			]
		},
		{
			title: this.translate.instant('administration.Company'), icon: 'database', type: 'sub', active: false, children: [
				{ path: '/administration/general-setting', title: this.translate.instant('administration.General_Settings_Header'), type: 'link' },
				{ path: '/administration/lending-type', title: this.translate.instant('administration.LendingType'), type: 'link' },
				{ path: '/administration/market-setting', title: this.translate.instant('administration.Market_Settings_Header'), type: 'link' },
				{ path: '/administration/app-subscribes', title: this.translate.instant('administration.AppSubscribes'), type: 'link' },
				{ path: '/administration/intermediate-accounts/1', title: this.translate.instant('administration.Intermediate_Account'), type: 'link' },
				{ path: '/administration/intermediate-accounts/2', title: this.translate.instant('administration.Settlement_Account'), type: 'link' },
				{ path: '/administration/notification', title: this.translate.instant('administration.Notification'), type: 'link' }
			]
		},
		{
			title: this.translate.instant('administration.People'), icon: 'layout', type: 'sub', active: false, children: [
				{ path: '/administration/branches', title: this.translate.instant('administration.Branches'), type: 'link' },
				{ path: '/administration/departments', title: this.translate.instant('administration.Departments'), type: 'link' },
				{ path: '/administration/jobs', title: this.translate.instant('administration.Jobs'), type: 'link' },
				{ path: '/administration/roles', title: this.translate.instant('administration.Roles'), type: 'link' },
				{ path: '/administration/employees', title: this.translate.instant('administration.Employees'), type: 'link' }
			]
		},
		{
			title: this.translate.instant('administration.Financial'), icon: 'activity', type: 'sub', active: false, children: [
				{ path: '/administration/account-category', title: this.translate.instant('administration.AccountCategories'), type: 'link' },
				{ path: '/administration/lisence-management', title: this.translate.instant('administration.LisenceManagement'), type: 'link' },
			]
		},
		{
			title: this.translate.instant('administration.Log'), icon: 'activity', type: 'sub', active: false, children: [
				{ path: '/administration/sms-messages', title: this.translate.instant('administration.SMS_Messages'), type: 'link' },
				{ path: '/administration/email-messages', title: this.translate.instant('administration.Email_Messages'), type: 'link' },
			]
		},
		{
			title: this.translate.instant('administration.Report'), icon: 'shield', type: 'sub', active: false, children: [
				{ path: '/administration/client-activity-report', title: this.translate.instant('administration.Client_Activity_Report'), type: 'link' },
				{ path: '/administration/subscription-fee-report', title: this.translate.instant('administration.Subscription_Fee_Report'), type: 'link' },
				{ path: '/administration/subscription-fee-total-report', title: this.translate.instant('administration.Subscription_Fee_Total_Report'), type: 'link' }]
		},
		{
			title: this.translate.instant('administration.Website'), icon: 'menu', active: false, type: 'link', path: '/administration/website'
		}
		// {
		// 	headTitle: 'WEB APPS',
		// },
		// {
		// 	title: 'Apps', icon: 'grid', type: 'sub', active: false, children: [
		// 		{ path: '/apps/cards', title: 'Cards', type: 'link' },
		// 		{ path: '/apps/dragula-cards', title: 'Dragula Cards', type: 'link' },
		// 		{ path: '/apps/range-slider', title: 'Range Slider', type: 'link' },
		// 		{ path: '/apps/calendar', title: 'Calendar', type: 'link' },
		// 		{ path: '/apps/contacts', title: 'Contacts', type: 'link' },
		// 		{ path: '/apps/image-compare', title: 'Image Comparsion', type: 'link' },
		// 		{ path: '/apps/notifications', title: 'Notifications', type: 'link' },
		// 		{ path: '/apps/widget-notification', title: 'Widget Notifications', type: 'link' },
		// 		{ path: '/apps/treeview', title: 'Treeview', type: 'link' },
		// 		{ path: '/apps/file-manager01', title: 'File Manager01', type: 'link' },
		// 		{ path: '/apps/file-manager02', title: 'File Manager02', type: 'link' },
		// 		{ path: '/apps/file-details', title: 'File Details', type: 'link' }
		// 	]
		// },

		// {
		// 	title: 'Elements', icon: 'database', type: 'sub', active: false, children: [
		// 		{ path: '/elements/alerts', title: 'Alerts', type: 'link' },
		// 		{ path: '/elements/avatar', title: 'Avatar', type: 'link' },
		// 		{ path: '/elements/breadcrumb', title: 'Breadcrumb', type: 'link' },
		// 		{ path: '/elements/buttons', title: 'Buttons', type: 'link' },
		// 		{ path: '/elements/badges', title: 'Badges', type: 'link' },
		// 		{ path: '/elements/dropdown', title: 'Dropdown', type: 'link' },
		// 		{ path: '/elements/thumbnails', title: 'Thumbnails', type: 'link' },
		// 		{ path: '/elements/list-group', title: 'List Group', type: 'link' },
		// 		{ path: '/elements/navigation', title: 'Navigation', type: 'link' },
		// 		{ path: '/elements/images', title: 'Images', type: 'link' },
		// 		{ path: '/elements/pagination', title: 'Pagination', type: 'link' },
		// 		{ path: '/elements/popover', title: 'Popover', type: 'link' },
		// 		{ path: '/elements/progress', title: 'Progress', type: 'link' },
		// 		{ path: '/elements/spinners', title: 'Spinners', type: 'link' },
		// 		{ path: '/elements/media-object', title: 'Media Object', type: 'link' },
		// 		{ path: '/elements/typography', title: 'Typography', type: 'link' },
		// 		{ path: '/elements/tooltips', title: 'Tooltips', type: 'link' },
		// 		{ path: '/elements/toast', title: 'Toast', type: 'link' },
		// 		{ path: '/elements/tags', title: 'Tags', type: 'link' },
		// 		{ path: '/elements/tabs', title: 'Tabs', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Advanced Ui', icon: 'shield', type: 'sub', active: false, children: [
		// 		{ path: '/advanced-ui/accordion', title: 'Accordion', type: 'link' },
		// 		{ path: '/advanced-ui/carousel', title: 'Carousel', type: 'link' },
		// 		{ path: '/advanced-ui/collapse', title: 'Collapse', type: 'link' },
		// 		{ path: '/advanced-ui/modals', title: 'Modals', type: 'link' },
		// 		{ path: '/advanced-ui/timeline', title: 'Timeline', type: 'link' },
		// 		{ path: '/advanced-ui/sweet-alert', title: 'Sweet Alert', type: 'link' },
		// 		{ path: '/advanced-ui/ratings', title: 'Ratings', type: 'link' },
		// 		{ path: '/advanced-ui/counters', title: 'Counters', type: 'link' },
		// 		{ path: '/advanced-ui/search', title: 'Search', type: 'link' },
		// 		{ path: '/advanced-ui/userlist', title: 'Userlist', type: 'link' },
		// 		{ path: '/advanced-ui/blog', title: 'Blog', type: 'link' },
		// 		{ path: '/advanced-ui/blog-details', title: 'Blog Details', type: 'link' },
		// 		{ path: '/advanced-ui/edit-post', title: 'Edit Post', type: 'link' },
		// 		{ path: '/advanced-ui/file-attachments', title: 'File Attachments', type: 'link' },
		// 	]
		// },
		// {
		// 	headTitle: 'PAGES',
		// },
		// {
		// 	title: 'Pages', icon: 'layers', type: 'sub', active: false, children: [
		// 		{
		// 			title: 'Authentication', icon: 'shopping-bag', type: 'sub', active: false, children: [
		// 				{ path: '/custom-pages/sign-in', title: 'Sign In', type: 'link' },
		// 				{ path: '/custom-pages/sign-up', title: 'Sign Up', type: 'link' },
		// 				{ path: '/custom-pages/forget-password', title: 'Forget Password', type: 'link' },
		// 				{ path: '/custom-pages/reset-password', title: 'Reset Password', type: 'link' },
		// 				{ path: '/custom-pages/lock-screen', title: 'Lock Screen', type: 'link' },
		// 				{ path: '/custom-pages/under-construction', title: 'Under Construction', type: 'link' },
		// 				{ path: '/error-pages/error-404', title: 'Error 404', type: 'link' },
		// 				{ path: '/error-pages/error-500', title: 'Error 500', type: 'link' },
		// 				{ path: '/error-pages/error-501', title: 'Error 501', type: 'link' },
		// 			]
		// 		},
		// 		{
		// 			title: 'ECommerce', icon: 'shopping-bag', type: 'sub', active: false, children: [
		// 				{ path: '/eCommerce/shop', title: 'Shop', type: 'link' },
		// 				{ path: '/eCommerce/product-details', title: 'Product Details', type: 'link' },
		// 				{ path: '/eCommerce/cart', title: 'Cart', type: 'link' },
		// 				{ path: '/eCommerce/check-out', title: 'Checkout', type: 'link' },
		// 				{ path: '/eCommerce/wishlist', title: 'Wishlist', type: 'link' },
		// 			]
		// 		},
		// 		{ path: '/pages/profile', title: 'Profile', type: 'link' },
		// 		{ path: '/pages/notification-list', title: 'Notifiction List', type: 'link' },
		// 		{ path: '/pages/about-us', title: 'About us', type: 'link' },
		// 		{ path: '/pages/settings', title: 'Settings', type: 'link' },
		// 		{
		// 			title: 'Mail', icon: 'shopping-bag', type: 'sub', active: false, children: [
		// 				{ path: '/mail/mail', title: 'Mail', type: 'link' },
		// 				{ path: '/mail/mail-compose', title: 'Mail Compose', type: 'link' },
		// 				{ path: '/mail/read-mail', title: 'Read Mail', type: 'link' },
		// 				{ path: '/mail/mail-settings', title: 'Mail Settings', type: 'link' },
		// 				{ path: '/mail/chat', title: 'Chat', type: 'link' },
		// 			]
		// 		},
		// 		{ path: '/pages/invoice', title: 'Invoice', type: 'link' },
		// 		{ path: '/pages/pricing', title: 'Pricing', type: 'link' },
		// 		{ path: '/pages/gallery', title: 'Gallery', type: 'link' },
		// 		{ path: '/pages/todo-task', title: 'Todotask', type: 'link' },
		// 		{ path: '/pages/faqs', title: 'FAQS', type: 'link' },
		// 		{ path: '/pages/empty-pages', title: 'Empty Pages', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Utilities', icon: 'clock', type: 'sub', active: false, children: [
		// 		{ path: '/utilities/background', title: 'Background', type: 'link' },
		// 		{ path: '/utilities/border', title: 'Border', type: 'link' },
		// 		{ path: '/utilities/display', title: 'Display', type: 'link' },
		// 		{ path: '/utilities/flex', title: 'Flex', type: 'link' },
		// 		{ path: '/utilities/height', title: 'Height', type: 'link' },
		// 		{ path: '/utilities/margin', title: 'Margin', type: 'link' },
		// 		{ path: '/utilities/padding', title: 'Padding', type: 'link' },
		// 		{ path: '/utilities/position', title: 'Position', type: 'link' },
		// 		{ path: '/utilities/width', title: 'Width', type: 'link' },
		// 		{ path: '/utilities/extras', title: 'Extras', type: 'link' },
		// 	]
		// },

		// {
		// 	headTitle: 'GENERAL',
		// },
		// {
		// 	title: 'Icons', icon: 'activity', type: 'sub', active: false, children: [
		// 		{ path: '/icons/font-awsome', title: 'Font Awsome', type: 'link' },
		// 		{ path: '/icons/material-design-icons', title: 'Material Design Icons', type: 'link' },
		// 		{ path: '/icons/simple-line', title: 'Simple Line Icons', type: 'link' },
		// 		{ path: '/icons/feather-icons', title: 'Feather Icons', type: 'link' },
		// 		{ path: '/icons/ionic-icons', title: 'Ionic Icons', type: 'link' },
		// 		{ path: '/icons/flag-icons', title: 'Flag Icons', type: 'link' },
		// 		{ path: '/icons/pe7-icons', title: 'Pe7 Icons', type: 'link' },
		// 		{ path: '/icons/themify-icons', title: 'Themify Icons', type: 'link' },
		// 		{ path: '/icons/typicons', title: 'Typicons', type: 'link' },
		// 		{ path: '/icons/weather-icons', title: 'Weather Icons', type: 'link' },
		// 		{ path: '/icons/material-icons', title: 'Material Svgs', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Charts', icon: 'bar-chart', type: 'sub', active: false, children: [
		// 		{ path: '/charts/apex-charts', title: 'apex-charts', type: 'link' },
		// 		{ path: '/charts/chart-js', title: 'chartjs-charts', type: 'link' },
		// 		{ path: '/charts/e-charts', title: 'Echarts', type: 'link' },
		// 		{ path: '/charts/chart-list', title: 'chartlist', type: 'link' }
		// 	]
		// },

		// {
		// 	headTitle: 'COMPONENTS',
		// },
		// {
		// 	title: 'Forms', icon: 'file', type: 'sub', active: false, children: [
		// 		{ path: '/forms/form-elements', title: 'Form Elements', type: 'link' },
		// 		{ path: '/forms/advanced-forms', title: 'Advanced Forms', type: 'link' },
		// 		{ path: '/forms/form-layouts', title: 'Form Layouts', type: 'link' },
		// 		{ path: '/forms/form-validations', title: 'Form Validations', type: 'link' },
		// 		{ path: '/forms/form-wizards', title: 'Form Wizards', type: 'link' },
		// 		{ path: '/forms/form-editors', title: 'Form Editor', type: 'link' },
		// 		{ path: '/forms/form-element-sizes', title: 'Form Elements Sizes', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Tables', icon: 'layout', type: 'sub', children: [
		// 		{ path: '/tables/default-tables', title: 'Default Table', type: 'link' },
		// 		{ path: '/tables/data-tables', title: 'Data Table', type: 'link' },
		// 	]
		// },
		// { path: '/widgets/', icon: 'server', title: 'Widgets', type: 'link' },
		// {
		// 	title: 'Maps', icon: 'navigation', type: 'sub', active: false, children: [
		// 		{ path: '/maps/leaflet', title: 'Leaflet', type: 'link' },
		// 	]
		// },
		// {
		// 	title: 'Submenu', icon: 'menu', type: 'sub', active: false, children: [
		// 		{ path: '', title: 'Submenu-1', type: 'empty' },
		// 		{
		// 			title: 'Submenu-2', type: 'sub', active: false, children: [
		// 				{ path: '', title: 'Submenu-2.1', type: 'empty' },
		// 				{ path: '', title: 'Submenu-2.2', type: 'empty' },
		// 			]
		// 		},
		// 	]
		// },
	];


	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
}
