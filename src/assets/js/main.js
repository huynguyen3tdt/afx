jQuery(document).ready(function() {

	//Layout Function
	function layout_setup(){
		var screen_height  = $(window).height();
		var header_height = $('.header-wrapper').outerHeight();
		var footer_height = $('.footer-wrapper').outerHeight();

		var main_height  = screen_height - header_height - footer_height;

		$('.main-wrapper').css('min-height', main_height);
	}

	layout_setup();

	//OffCanvas
    function offcanvas_subnav(){
    	$('.nav.offcanvas-nav > .nav-item.has-child > .nav-link > .toggle').click(function(event) {
    		event.preventDefault();
    		$(this).parents('.nav-item.has-child').toggleClass('opened');
    	});
    }
    offcanvas_subnav();

    function open_offcanvas(){
    	$('.offcanvas-overlay').addClass('show');
    }
    
    function close_offcanvas(){
    	TweenMax.to('.offcanvas-wrapper', 0.5, {x:-360,opacity:0});
    	setTimeout(function(){ 
    		$('.offcanvas-overlay').removeClass('show');    		
    		TweenMax.to('.offcanvas-wrapper', 0, {x:0,opacity:1});
    	}, 500);
    }

    $('.offcanvas-open').click(function(event) {
		event.preventDefault();
		open_offcanvas();
		TweenMax.from('.offcanvas-wrapper', 0.5, {x:-360,opacity:0});
	});

	$('.btn-offcanvas-close').click(function(event) {
		event.preventDefault();
		close_offcanvas();
	});

	//$('.select2').select2();

	//Resize Function
	$(window).resize(function(){
		layout_setup();
		if($(window).width() > 540){
			close_offcanvas();
		}
		//$('.select2').select2();
	});
});