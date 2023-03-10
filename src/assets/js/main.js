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

	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	});

	var scroll = new SmoothScroll('.scroll-top-link', {
		speed: 300
	});


	var position = $(window).scrollTop(); 

	$(window).scroll(function() {
	    var scroll = $(window).scrollTop();
	    if((scroll > position) && (scroll > 480)) {
	       $('.scroll-top').css('bottom','20px');
	    } else if((scroll < position) && (scroll < 480)) {
	       $('.scroll-top').css('bottom','-100px');

	    }
	    position = scroll;
	});
	//Function Check Size
	function check_usize(){
		var usize = Cookies.get('usize');
		console.log(usize);
		
		if(usize == 'sm'){
			$('.switch-style .btn-group .btn').not('.btn-size-sm').removeClass('active');
			$('.switch-style .btn-group .btn.btn-size-sm').addClass('active');
			$('body').addClass('font-size-sm');
		}else if(usize == 'lg'){
			$('.switch-style .btn-group .btn').not('.btn-size-lg').removeClass('active');
			$('.switch-style .btn-group .btn.btn-size-lg').addClass('active');
			$('body').addClass('font-size-lg');
		}else {
			$('.switch-style .btn-group .btn').not('.btn-size-md').removeClass('active');
			$('.switch-style .btn-group .btn.btn-size-md').addClass('active');
			Cookies.set('usize','md');
		}
		
	}
	check_usize();
	//Switch Style
	$('.switch-style .btn-group .btn').click(function(e){
		e.preventDefault();
		$('.switch-style .btn-group .btn').not(this).removeClass('active');
		var size = $(this).attr('data-size');
		//console.log(size);
		switch (size) {
	        case 'sm':
	            $('body').addClass('font-size-sm');	
	            $('body').removeClass('font-size-md font-size-lg');	   
	            Cookies.set('usize','sm');           
	            break;
	        case 'lg':
	            $('body').addClass('font-size-lg');	
	            $('body').removeClass('font-size-sm font-size-md');
	            Cookies.set('usize','lg');	              
	            break;
	        default:
	            $('body').removeClass('font-size-sm font-size-lg');	    
	            Cookies.set('usize','md');        
	            break;
	    }
		$(this).addClass('active');
	});
	$('.switch-style .btn.btn-close').click(function(e){
		e.preventDefault();
		$('.switch-style').hide();
	});
});