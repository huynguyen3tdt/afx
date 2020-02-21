import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-manage',
    templateUrl: './manage-layout.component.html',
    styleUrls: ['./manage-layout.component.css']
})

export class ManageLayoutComponent implements OnInit {

    ngOnInit() {
        $(window).resize(() => {
            this.layout_setup();
        });
    }

    layout_setup() {
        const screenHeight = $(window).height();
        const headerHeight = $('.header-wrapper').outerHeight();
        const footerHeight = $('.footer-wrapper').outerHeight();
        const mainHeight = screenHeight - headerHeight - footerHeight;
        $('.main-wrapper').css('min-height', mainHeight);
    }
}
