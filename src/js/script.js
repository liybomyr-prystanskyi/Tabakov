// Burger script
$(function() {
  $("#hamburger").on("click", function() {
    $(this).toggleClass("is-open");
    $(this).toggleClass("is-closed");
    if ($(window).width() < 993 && $(this).hasClass("is-open")) {
      $(".header__main-nav").show(300);
    } else {
      $(".header__main-nav").hide(300);
    }
  });

  $('.burger-button').on('click', function(e) {
    e.preventDefault();
    $(this).toggleClass('clicked');
    $('.header__main-nav').fadeToggle(300);
  });

  $(window).on("resize", function() {
    if ($(window).width() > 991) {
      $(".header__main-nav").removeAttr('style');
    }
  });

  // $(".info-table").tablesorter();   
});
// Google Maps
function initMap() {
  var markerPos = {lat: 49.796177, lng: 24.055697};
  var centerPos = {lat: markerPos.lat, lng: markerPos.lng - 0.001};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: centerPos,
    disableDefaultUI: true
  });
  
  var marker = new google.maps.Marker({
    position: markerPos,
    map: map,
    icon: 'assets/img/mapID.png',
    title: 'Total art school'
  });
}



$('.testimonials_block__main__slider_testimonials').slick({
  // rtl:true,
  dots: false,
  slidesToScroll: 1,
  slidesToShow: 1,
  arrows: true,
  autoplay: true,
  autoplaySpeed: 3000,
  prevArrow: '<img class="next-arrow" src="assets/img/slider-arr-left.png">',
  nextArrow: '<img class="prew-arrow" src="assets/img/slider-arr-right.png">',
});

$(document).ready(function() { 

	(function ($) { 
		$('.tab ul.tabs').addClass('active').find('> li:eq(0)').addClass('current');
		
		$('.tab ul.tabs li a').click(function (g) { 
			var tab = $(this).closest('.tab'), 
				index = $(this).closest('li').index();
			
			tab.find('ul.tabs > li').removeClass('current');
			$(this).closest('li').addClass('current');
			
			tab.find('.tab_content').find('div.tabs_item').not('div.tabs_item:eq(' + index + ')').slideUp();
			tab.find('.tab_content').find('div.tabs_item:eq(' + index + ')').slideDown();
			
			g.preventDefault();
		} );
	})(jQuery);

});


var accordion = (function(){
  
  var $accordion = $('.js-accordion');
  var $accordion_header = $accordion.find('.js-accordion-header');
  var $accordion_item = $('.js-accordion-item');
 
  // default settings 
  var settings = {
    // animation speed
    speed: 400,
    
    // close all other accordion items if true
    oneOpen: false
  };
    
  return {
    // pass configurable object literal
    init: function($settings) {
      $accordion_header.on('click', function() {
        accordion.toggle($(this));
      });
      
      $.extend(settings, $settings); 
      
      // ensure only one accordion is active if oneOpen is true
      if(settings.oneOpen && $('.js-accordion-item.active').length > 1) {
        $('.js-accordion-item.active:not(:first)').removeClass('active');
      }
      
      // reveal the active accordion bodies
      $('.js-accordion-item.active').find('> .js-accordion-body').show();
    },
    toggle: function($this) {
            
      if(settings.oneOpen && $this[0] != $this.closest('.js-accordion').find('> .js-accordion-item.active > .js-accordion-header')[0]) {
        $this.closest('.js-accordion')
               .find('> .js-accordion-item') 
               .removeClass('active')
               .find('.js-accordion-body')
               .slideUp()
      }
      
      // show/hide the clicked accordion item
      $this.closest('.js-accordion-item').toggleClass('active');
      $this.next().stop().slideToggle(settings.speed);
    }
  }
})();

$(document).ready(function(){
  accordion.init({ speed: 300, oneOpen: true });
});