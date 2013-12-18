/* -------------------------------------------------------------------------------- /
	
	Granth | Modern Business Template - scripts.js
	Created by Granth (http://themeforest.net/user/Granth)
	v1.0 - 22/04/2012
	All rights reserved.
	email: granthweb@gmail.com
	web: http://www.granthweb.com
	twitter: http://twitter.com/#!/granthweb
	
	+----------------------------------------------------+
		TABLE OF CONTENTS
	+----------------------------------------------------+
	
	[1] CUSTOM PLUGINS
	[1.1] gwLatestTweets
	[1.2] gwScrollTo
	[1.3] gwPngAnim
	[1.4] gwSlider
	[1.5] gwPreloader
	[2] COMMON FUNCTIONS
	[3] SETUP & COMMON EVENTS
	[4] NAVIGATION
	[5] POPULAR POSTS - AJAX PAGINATION
	[6] CONTENT
	[6.1] CONTENT COMMON
	[6.2] HOME / PORTFOLIO
	[6.3] BLOG / PROJECT COMMENT BUTTONS' EVENTS
	[6.4] CONTACT PAGE WITH AJAX VALIDATION
	[7] SCROLL TO TOP
	[8] CALL EXTERNAL PLUGINS
	[8.1] LAVALAMP PLUGIN
	[8.2] GOMAP PLUGIN
	
/ -------------------------------------------------------------------------------- */

/* add 'js-on' class to 'html' element */
document.documentElement.className += 'js-on';

(function($) { 

	/* ---------------------------------------------------------------------- /
		[1] CUSTOM PLUGINS
	/ ---------------------------------------------------------------------- */	
			
	/* ---------------------------------------------------------------------- /
		[1.1] gwLatestTweets - Latest tweets (v1.0)
		
		@options 
		user : twitter screen name (string)
		count : number of tweets (integer)
		showRetweets : show or not to show retweetes (boolean)
		
	/ ---------------------------------------------------------------------- */	
	
		$.fn.gwLatestTweets = function(options) {
			var defaults = {
					'user'			: 'granthweb',
					'count'			: 2,
					'showRetweets'	: true
				},
				settings = $.extend({}, defaults, options),
				$obj=this,
				url_regexp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	
			var zeroFill = function (num, digits) {
					var value='';
					for (var x=0;x<digits-num.length;x++) { value += "0"; };
					value+=num;
					return value;
				},
				formatDate = function(rawDate) {
					var d = new Date(rawDate.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/,"$1 $2 $4 $3 UTC")),
						month = new Array('January','February','March','April','May','June','July','August','September','October','November','December'),
						formattedDate=month[d.getMonth()]+' '+zeroFill(d.getDate(),2)+', '+d.getFullYear()+' - '+zeroFill(d.getHours(),2)+':'+zeroFill(d.getMinutes(),2);
					return formattedDate;
				};
			
			$.getJSON('https://api.twitter.com/1/statuses/user_timeline.json?include_rts='+settings.showRetweets+'&screen_name='+ settings.user + '&count='+settings.count+'&callback=?', function(data) {
				var items =[], 
					tweet = '';
											
				for (var x=0;x<data.length;x++) {
					tweet = data[x].text.replace(url_regexp, function(url) { return '<a href="'+url+'">'+url+'</a>'; });
					items.push('<li><div class="tweet">'+tweet+'</div><div class="tweet-date">'+formatDate(data[x].created_at)+'</div></li>');
				};
				$obj.html(items.join(''));
				$(window).triggerHandler('scroll');
			});
			return $obj;		
		};
				
	/* ---------------------------------------------------------------------- /
		[1.2] gwScrollTo - Scroll to element (v1.0)
		
		@options 
		duration : scroll duration (integer)
		easing : easing type (string / boolean)
		target : target selector (string)
		callback : callback function (function)
		
		@notes
		smaller duration value makes animataion faster,
		easing requires jQuery plugin, if not present becomes false,
	 	fake easing name also becomes false,
		callback function fires when the animation is ready	
		
	/ ---------------------------------------------------------------------- */	
	
		$.fn.gwScrollTo = function(options) {
			var defaults = {
					'duration'		: 1000,
					'easing'		: 'easeInOutCubic',
					'target'		: '#top',
					'callback' 		: ''
				},
				settings = $.extend({}, defaults, options),
				$obj=this;
					
			settings.easing = jQuery.easing[settings.easing] ? settings.easing : false;
			if ($(settings.target).length) { var offset=$(settings.target).offset(); } else { return false; };
			if($obj.is(':animated') || offset.top == $(window).scrollTop()) { return false; };
			return $obj.animate({
				scrollTop: $(settings.target).offset().top
				}, settings.duration, settings.easing, function() { 
					this.tagName==$obj[0].tagName ? $.isFunction(settings.callback) ? settings.callback.call(this) : false : false; 
				}
			);
		};							
			
	/* ---------------------------------------------------------------------- /
		[1.3] gwPngAnim - Animate png (v1.0)
		
		@options 
		duration : duration for a step (integer)
		steps : number of animation step (integer)
		startStep : start step index (integer)
		offsetX : horizontal background position offset (integer)
		offsetY : vertical background position offset (integer)
		
		@notes
		smaller duration value makes animataion faster,
		startStep index starts form 1 (not 0), if it reaches the maximum value
		animation continues from the first step
		
	/ ---------------------------------------------------------------------- */	
	
		$.fn.gwPngAnim = function(options) {
			var defaults = {
					'duration'	: 60, 
					'steps'		: 13,
					'startStep'	: 1,
					'offsetX'	: 0,
					'offsetY'	: -20
				},
				settings = $.extend({}, defaults, options);
				
			return this.each(function(index) {
				var $this=$(this),
					timer,
					bgPos=[],
					step=settings.startStep,
					/* old IEs (including IE8 does not  support "backgroundPosition" css prop, they support "backgroundPositionX(Y)" */
					IE = $this.css("backgroundPosition") == 'undefined' || $this.css("backgroundPosition") == null ? true : false;
				
				if (IE) {
					bgPos[0]=$this.css("backgroundPositionX");
					bgPos[1]=$this.css("backgroundPositionY");
				} else {
					bgPos=$this.css("backgroundPosition").split(' ');	
				};
				
				timer = setInterval(function () {
					step = step == settings.steps ? 1 : step;
					var xPos=step*settings.offsetX+parseFloat(bgPos[0]),
						yPos=step*settings.offsetY+parseFloat(bgPos[1]);
					
					if (IE) {
						$this.css('backgroundPositionX',xPos+'px');
						$this.css('backgroundPositionY',yPos+'px');
					} else {
						$this.css({"backgroundPosition":xPos+"px "+yPos+"px"});
					};
					step++;
				}, settings.duration); 
			});		
		};			

	/* ---------------------------------------------------------------------- /
		[1.4] gwSlider - Content slider (v1.0)
		
		@options
		startIndex : index of the first slide (integer)
		showControls : show or not show control arrows (boolean)
		showPagination : show or not show pagination dots (boolean)
		autoPlay : autoplay slider (boolean)
		autoPlayInt : pause time in ms between two slides when autoplay option is on (integer)	
		autoPlaypauseOnHover : pause or not pause when mouse is over slider (boolean)
		easing : easing type (string/boolen)
		animSpeed : slide animation speed in ms (integer)
		heightSpeed : height resize animation speed in ms (integer)	
		slideDelay : delay in ms between two slides (integer)
		loop : makes the slider infinite if its true (integer)
		
		@notes
		smaller animSpeed value makes animataion faster,
		easing requires jQuery plugin, if not present becomes false,
	 	fake easing name also becomes false,		
		
	/ ---------------------------------------------------------------------- */	
		
		$.fn.gwSlider = function(method) {			
			var methods = {
				init : function(options) {
					var defaults = {
							'startIndex'			: 0, 
							'showControls'			: true,
							'showPagination'		: true,
							'autoPlay'				: false,
							'autoPlayInt'			: 6000,
							'autoPlaypauseOnHover'	: true,								
							'easing'				: false,
							'animSpeed'				: 700,
							'heightSpeed'			: 400,
							'slideDelay'			: 0,
							'loop'					: false
						},
						settings = $.extend({}, defaults, options);
					
					settings.easing = jQuery.easing[settings.easing] ? settings.easing : false;							
						
					return this.each(function(index) {
						var $this=$(this),
							$slidesContainter = $this.find('.slides'),
							$slides =$slidesContainter.find('li'),
							$images = $slides.find('img'),
							currentIndex = settings.startIndex,
							sliderHeight = $slides.eq(settings.startIndex).height(),
							sliderWidth = $slides.eq(settings.startIndex).width(),
							slidesLength = $slides.length,
							targetIndex;
						
						/* put settings to data */
						$this.data("gwSlider", {
							"opts": settings,
							"sliderWidth":sliderWidth,
							"currentIndex":currentIndex,
							"slidesLength":slidesLength,
							"playDirection":'fw'
						});

						/* set default styling */
						$slidesContainter.css({'height':sliderHeight+'px','width':sliderWidth+'px'});
						$slides.css({'position':'absolute'});
						for (var x=0;x<$slides.length;x++) {
							if (x<settings.startIndex) { $slides.eq(x).css({'left':'-'+sliderWidth+'px', 'opacity':'0'}); };
							if (x==settings.startIndex) { $slides.eq(x).css({'left':'0'}); };
							if (x>settings.startIndex) { $slides.eq(x).css({'left':sliderWidth+'px','opacity':'0'}); };
						}
						
						/* add control arrows */
						if ($slides.length && settings.showControls) {	
							var $controls=$('<div class="slider-controls controls"><a href="#" class="prev-arrow">prev</a><a href="#" class="next-arrow">next</a></div>').appendTo($this),
								$cntPrev=$controls.find('.prev-arrow'),
								$cntNext=$controls.find('.next-arrow'),
								$tooltip=$('<span />', { 'class':'tooltip', 'data-id':slidesLength }).appendTo($controls);
							
							if (!settings.loop) {
								if (settings.startIndex==0) { $cntPrev.addClass('disabled'); }
								if (settings.startIndex==$slides.length-1) { $cntNext.addClass('disabled'); }
							};
						};

						/* add pagination */
						if ($slides.length && settings.showPagination) {
							var $items =[];
							for (var x=0;x<$slides.length;x++) { $items.push('<li><a href="#">'+(x+1)+'</a></li>'); };
							var $pagination=$('<ul />', { 'class':'slider-pagination', html: $items.join('') }).appendTo($this);
							$pagination.find('li').eq(settings.startIndex).addClass('current');
						};	
						
						/* slider arrow click event */					
						$this.delegate(".slider-controls a", "click", function(e){
							var $controlLink=$(this), 
								currentIndex=$this.data("gwSlider").currentIndex;

							e.preventDefault();
							if (!$controlLink.hasClass("disabled")) { 
								if ($controlLink.hasClass('prev-arrow')) {	methods.slide($this, currentIndex, currentIndex-1); };
								if ($controlLink.hasClass('next-arrow')) { methods.slide($this, currentIndex, currentIndex+1); };
							};	
						});	
						
						/* slider pagination dot click event */	
						$this.delegate(".slider-pagination li a", "click", function(e){
							var $paginationLink=$(this),
								$parent=$paginationLink.parent(),
								$paginationBullets=$pagination.find('li'),
								currentIndex=$this.data("gwSlider").currentIndex,
								targetIndex=$paginationBullets.index($parent);
							
							e.preventDefault();		
							if (!$parent.hasClass("current")) {
								if (currentIndex<targetIndex) {
									methods.slide($this, currentIndex, targetIndex);
								} else {
									methods.slide($this, currentIndex, targetIndex);
								};
							};
						});
						
						/* update tooltip data */
						updateControlTip($this, currentIndex, slidesLength); 
						
						/* fire autoplay if is set */
						if (settings.autoPlay) { autoplay ($this, 'start'); };
					});
				}, 
				
				slide : function ($elem, current, target) {
					var diff = target-current,
						$slidesContainter = $elem.find('.slides'),
						$slides = $slidesContainter.find('li'),
						$tooltip = $elem.find('.tooltip'),
						sliderWidth=$elem.data("gwSlider").sliderWidth,
						slidesLength=$elem.data("gwSlider").slidesLength,
						easing=$elem.data("gwSlider").opts.easing,
						animSpeed=$elem.data("gwSlider").opts.animSpeed,
						heightSpeed=$elem.data("gwSlider").opts.heightSpeed,
						slideDelay=$elem.data("gwSlider").opts.slideDelay,
						loop=$elem.data("gwSlider").opts.loop,
						next = current<target ? true : false,
						targetHeight,
						playDirection;

					if (next) { sliderWidth=sliderWidth*-1; };
					if (!loop) {
						if (target==slidesLength-1) { playDirection='rev'; }
						if (target==0) { playDirection='fw'; }
						$.extend($elem.data("gwSlider"), { "playDirection": playDirection });
					};
					
					if (target>=slidesLength) { target=0;};
					if (target<0) { target=slidesLength-1; };
					targetHeight=$slides.eq(target).height();
					$slidesContainter.animate({ height:targetHeight+'px' }, heightSpeed, easing);

					if (Math.abs(diff)>1) {
						for (var x=1;x<Math.abs(diff);x++) {
							if (diff>0) {
								$slides.eq(current+x).css({"left":sliderWidth+'px', "opacity":"0"});
							} else {
								$slides.eq(target+x).css({"left":sliderWidth+'px', "opacity":"0"});
							};
						};
					};
					if ($slides.is(':animated')) { return false; };
				
					$slides.each(function(index) {
						var $slide=$(this),
							opacity = current<target ? index<=target ? opacity=1 : opacity=0 : index>=target ? opacity=1 : opacity=0,
							leftpos;
						if (index==current) { leftpos=sliderWidth+'px';	};
						if (index==target) { 
							leftpos=0;
							next ? $slide.css({"left":Math.abs(sliderWidth)+"px", "opacity":"0"}) : $slide.css({"left":"-"+Math.abs(sliderWidth)+"px", "opacity":"0"});
						};
						var d = index==target ? slideDelay : 0;
						$slide.delay(d).animate({
							left:leftpos,
							opacity: opacity
						}, animSpeed, easing);
					});
					$elem.data("gwSlider", $.extend($elem.data("gwSlider"), { "currentIndex":target}));
					updateControlTip($elem, target, slidesLength); 
					updatePagination($elem, target);
					updateControls($elem, target);						
					return;
				}			
			};
			
			/* autoplay function */
			var autoplay = function ($elem, action) {
				var timer,
					currentIndex,
					targetIndex,
					playInterval=$elem.data("gwSlider").opts.autoPlayInt,
					pauseOnHover=$elem.data("gwSlider").opts.autoPlaypauseOnHover;
				
				var updateIndex = function () {
					currentIndex=$elem.data("gwSlider").currentIndex;
					if ($elem.data("gwSlider").playDirection == 'fw') { targetIndex=currentIndex+1; } else { targetIndex=currentIndex-1; };
				};
				
				var startPlay = function (checkInterval) {
					timer = setInterval(function () { 
						updateIndex();				
						methods.slide($elem, currentIndex, targetIndex);
					}, checkInterval);				
				};
				
				var stopPlay = function () { clearInterval(timer); };
				
				/* action: start or stop */
				action == 'start' ? startPlay(playInterval):  stopPlay();
				
				/* control arrow hover pause */
				$elem.delegate(".controls", "hover", function(e) {						
					e.type == 'mouseenter' ? clearInterval(timer) : startPlay(playInterval);
				});
									
				/* slide hover pause */
				if (pauseOnHover) {
					$elem.delegate(".portfolio-item", "hover", function(e) {						
						e.type == 'mouseenter' ? clearInterval(timer) : startPlay(playInterval);
					});
				};
			};
			
			/* update slider control arrow tooltip */
			var updateControlTip = function($elem, index, maxValue) {
				var $controls=$elem.find('.controls'),
					$cntPrev=$controls.find('.prev-arrow'),
					$cntNext=$controls.find('.next-arrow');
					index==0 ? $cntPrev.attr('data-id',maxValue) : $cntPrev.attr('data-id',index);
					index!=maxValue-1 ? $cntNext.attr('data-id',index+2) : $cntNext.attr('data-id','1');
					if ($cntPrev.hasClass("hover")) { $.updateTooltip($cntPrev,2); };
					if ($cntNext.hasClass("hover")) { $.updateTooltip($cntNext,2); };
			};
				
			/* update pagination function */
			var updatePagination = function ($elem, index) {
				$paginationBullets=$elem.find('.slider-pagination li');
				if ($paginationBullets.length>0) { $paginationBullets.eq(index).addClass('current').siblings().removeClass('current'); };
			};

			/* update controls function */
			var updateControls = function ($elem, index) {
				var $controls=$elem.find('.slider-controls'),
					$slides = $elem.find('.slides li');

				if ($controls.length>0) { 
					var $cntPrev=$controls.find('.prev-arrow'),
						$cntNext=$controls.find('.next-arrow'),
						loop=$elem.data("gwSlider").opts.loop;
					if (!loop) {
						$cntPrev.removeClass('disabled');
						$cntNext.removeClass('disabled');
						if (index==0) { $cntPrev.addClass('disabled'); };
						if (index==$slides.length-1) { $cntNext.addClass('disabled'); };
					};			
				};
			};

			if(methods[method]) {
				return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
			} 
			else if(typeof method === 'object' || !method) {
				return methods.init.apply(this, arguments);
			} 
			else {
				$.error("Method " +  method + " does not exist on jQuery.gwSlider");
			}    
		};
		
	/* ---------------------------------------------------------------------- /
		[1.5] gwPreloader - Images preloader effect (v1.0)
		
		@options 
		alwaysShow: show or not to show the effect (boolean)
		delay : image animation delay (integer)
		fadeInDuration : fade in effect duration (boolean)
		checkInterval : loaded status check time intarval (integer)
		
		@notes
		smaller duration value makes animataion faster,
	 	setting alwaysShow param to true forces effect for even loaded/cached images,
		setting delay makes pause in fadein effect, images with higher index show later
		
	/ ---------------------------------------------------------------------- */	

		$.fn.gwPreloader = function(options) {
			var defaults = {
					'fadeInDuration'	: 250,
					'delay'				: 0,
					'alwaysShow'		: false,
					'checkInterval' 	: 200
				},
				settings = $.extend({}, defaults, options),
				$obj=this,
				$images = $obj.filter(':not([class~=preloading])').attr('data-o', function () { return $(this).css('opacity'); }).css({'opacity':0}),
				$preloader =$('<div />', { 'class':'preloader'}),
				$spinner =$('<img />'),
				imagesLength=$images.length,
				complete=0,
				loaded=[],
				timer;
			
			$images.filter(function(index) { if (settings.alwaysShow===true) { return true; } else { if (this.complete !== true) {return true; } else { $(this).css('opacity', $(this).data('o')); return false; }; }; }).addClass('preloading')
			.wrap('<div class="preloader-wrapper" />')
			.parent().css('float',function () { return $(this).find('img').css('float'); })
			.end().after($preloader)
			.parent().find('.preloader').gwPngAnim();

			if ($preloader.css('background-image')!=null) { 
				$spinner[0].src=$preloader.css('background-image').replace(/^url\("?([^\"\))]+)"?\)$/i, '$1');
				timer = setInterval(function () { 
					if ($spinner[0].complete==true) { 
						clearInterval(timer);
						init();
					};
			 	}, 100);	
			};
						 
			var init = function() {
				$images.each(function(index) {
					var $this=$(this);
					timer = setInterval(function () { 
							if ($this[0].complete == true && !(index in loaded)) {
								loaded[index]=true;
								if ($this.hasClass('preloading')) { $this.delay(settings.delay*index).animate({opacity: $this.data('o')},settings.fadeInDuration, function() { $(this).parents('.preloader-wrapper').find('.preloader').remove().end().end().unwrap('.preloader-wrapper'); });	}
								complete++;									
							};
							if (complete==imagesLength) { $images.removeClass('preloading'); clearInterval(timer); };
					}, settings.checkInterval);
				});
			};			
		};
		
	/* ---------------------------------------------------------------------- /
		[2] COMMON FUNCTIONS
	/ ---------------------------------------------------------------------- */	

		/* show preloader */
		$.showPreloader = function($elem) {
			var $preloader=$('<div />', { 'class':'preloader'}).css("display","none");
			var $wrapper=$elem.wrap('<div class="preloader-wrapper" />').parent().append($preloader);
			$wrapper.find('.preloader').fadeIn().gwPngAnim();
		};
		
		/* hide preloader */
		$.hidePreloader = function($elem) {
			$elem.parent().find('.preloader').fadeOut(function() { $(this).remove().unwrap('.epreloader-wrapper'); });
		};	

		/* update tooltip text */
		$.updateTooltip = function ($elem, LeftCorr) {
			var $tooltip=$elem.parent().find('.tooltip'),
				tipWidth=0;
			
			$tooltip.html($elem.attr('data-id')+'/'+$tooltip.data('id'));
			$.updateTooltipPos($tooltip, LeftCorr);
		};
		
		/* update tooltip position */
		$.updateTooltipPos = function ($elem, LeftCorr) {
			var tipWidth=$elem.outerWidth();
			LeftCorr = LeftCorr ? LeftCorr : 0;
			$elem.css("marginLeft","-"+Math.floor((tipWidth/2)-LeftCorr)+"px");
		};
		
		/* show tooltip */
		$.showTooltip = function ($elem, duration, topPos) {
			if (topPos==undefined || topPos==null) { topPos=-26; }
			if ($elem.is(':hidden'))  { 
				$elem.css({"opacity":"0", "display":"block", "top":topPos+5+"px"}); 
			}
			$elem.stop(true, false).animate({
				top:topPos+'px',
				opacity:1
			}, duration, "jswing");				
		};
		
		/* hide tooltip */
		$.hideTooltip = function ($elem, duration, delay, topPos) {	
			if (topPos==undefined || topPos==null) { topPos=-21; };
			$elem.stop().animate({cursor:'default'}, delay).animate({
				top:topPos+'px',
				opacity:0
			}, duration, "jswing");
		};
		
		/* replace ajax page controls */
		$.replaceAjaxControls = function($ajaxData, $controls, $container) {
			if ($controls.length) {
				var controlClass=function() { var cName=$controls[0].className.split(' '); return '.'+cName[0]; },
					$ajaxControls=$ajaxData.find(controlClass()).remove(),
					$ajaxControlLinks=$ajaxControls.find('a');
					$controls.find('a').remove().end().append($ajaxControlLinks);
			} ;
		};	
				
})(jQuery);

jQuery.noConflict();
jQuery(document).ready(function($, undefined) {
	
	/* ---------------------------------------------------------------------- /
		[3] SETUP & COMMON EVENTS
	/ ---------------------------------------------------------------------- */	
	
		/* cache main objects */
		var $htmlbody=$('html, body'),
			$body=$('#wrapper'),
			$siteLoader=$body.find('#preloader'),
			$window=$(window);
		
		/* show preloader during iframe content is loading (e.g. Youtube, Vimeo video)*/
		var $iframe = $body.find('iframe');
		if ($iframe.length) {
			$.showPreloader($iframe);
			$iframe.load(function() {
				var $this=$(this);
				$this.css('visibility','visible');
				$.hidePreloader($this);
			});
		};
		
		/* show preload effect on images if they are not in cache - call image preloader plugin */
		if ($body.find('.image-frame img, .portfolio-items img').length) { $body.find('.image-frame img, .portfolio-items img').gwPreloader(); };
		
		/* let's roll the spinner - call pnganim plugin */
		if ($body.find('.preloader').length) { $body.find('.preloader').gwPngAnim(); };		
		
		/* call latest tweets plugin */
		var $tweets=$body.find(".tweets");
		if ($tweets.length) { $tweets.gwLatestTweets(); };
		
		/* load widget slider - call plugin */
		if ($body.find(".widget-slider").length) { $body.find(".widget-slider").gwSlider({'animSpeed':500, 'showPagination':false, 'autoPlay':true, 'loop':true}); };
		
		/* load testimonials slider - call plugin */
		if ($body.find(".testimonials-slider").length) { $body.find(".testimonials-slider").gwSlider({'animSpeed':700, 'slideDelay':80}); };
					
		/* load project & post slider - call plugin */
		if ($body.find(".post-slider, .project-slider").length) { $body.find(".post-slider, .project-slider").gwSlider({'animSpeed':700}); };
					
		/* smooth page scroll */ 
		$body.delegate('a', "click", function(e){
			var hash=this.hash;
			if (hash && this.href.indexOf(window.location.pathname) > 0) {
				e.preventDefault();
				$htmlbody.gwScrollTo({'target': hash, 'callback' : function () { window.location.hash=hash; } });	
			};
		});	

		/* ribbon hover effect */
		$body.delegate('#ribbon', "mouseenter mouseleave", function(e){
			var $this=$(this);
			if (e.type=='mouseenter') { $this.stop().animate({'top':'-30px'}, 200, "jswing"); } else { $this.stop().animate({'top':0}, 150, "jswing"); };
		});
		
		/* search box clearing, reset & submit */
		var $searchbox=$body.find('#searchbox'), searchValue=$searchbox.find('#search')[0].value;
		$searchbox.delegate('#search, #searchsubmit', "focusin focusout click", function(e){
			var $this=$(this);
			if (this.id=='search') {
				if (e.type == 'focusin') { 
					if (this.value==searchValue) { this.value=''; };
				} else if (e.type == 'focusout') {
					if (this.value=='') { this.value=searchValue; };
				}
			} else if(this.id=='searchsubmit' && e.type == 'click') {
				var $search=$this.parent().find('#search');
				if ($search[0].value==searchValue || $search[0].value.value=='') {
					e.preventDefault();
					$search.focus();
				};						
			};
		});

		/* control hover effect (showing & hiding tooltips) */
		$('#main').delegate('.controls a', "mouseover mouseleave", function(e){
			var $this=$(this),
				$tooltip=$this.parent().find('.tooltip');
			
			/* using mouseover event (not mousenter as usually) to able to 
			   remove tooltip when cursor is over and element and becomes disabled */
			if (e.type == 'mouseover') { 
				if (!$this.hasClass('disabled')) {
					if (!$this.hasClass('hover')) {
						$this.addClass("hover");
						$.showTooltip($tooltip, 150);
						$.updateTooltip($this,2);
					};
				} else {
					$.hideTooltip($tooltip, 150, 100);
				};
			} else if (e.type == 'mouseleave'){
				$this.removeClass("hover");
				$.hideTooltip($tooltip, 150, 100);				
			};
		});

	/* ---------------------------------------------------------------------- /
		[4] NAVIGATION
	/ ---------------------------------------------------------------------- */	
	
		var $navigation=$body.find("#navigation");
		$navigation.find('.current > ul').css("display","block").end()
		.delegate("li a", "click", function(e) {
			var $parent=$(this).parent(),
				$subnav=$parent.find('ul');

			if (this.href.match(/#$/gi)) { e.preventDefault(); };
			if (!$parent.hasClass('current')) { 
				$parent.addClass("current").siblings().removeClass("current")
				.find("ul").slideUp(300,'easeInOutCubic')
				.find("li").removeClass("current");	
			};
			if ($parent.hasClass('parent')) { $subnav.is(':hidden') ? $subnav.slideDown(300,'easeInOutCubic') : $subnav.slideUp(300,'easeInOutCubic'); };
		});
		
	/* ---------------------------------------------------------------------- /
		[5] POPULAR POSTS - AJAX PAGINATION
	/ ---------------------------------------------------------------------- */
					
		var $popularPosts=$body.find('.popular-posts');
		if ($popularPosts.length) {
			$popularPosts.delegate(".controls a", "click", function(e) {
				var $this=$(this),
					$controls=$this.parent(), 
					$container=$popularPosts.find('.widget-content'),
					$content=$container.find('.posts'),
					path='content/popular-posts/';

				e.preventDefault();		
				if (!$this.hasClass('disabled')) {
					$.ajax({
						url: path+'popular-posts-'+$this.data('id')+'.html',
						dataType: "html",
						beforeSend: function () {
							$content.fadeTo(300,0);
						}					
					}).done(function(data) {
						
						/* insert or replace control arrows */
						var $ajaxResponse=$('<div />', { 'class':'ajax-response', html: data });
						$.replaceAjaxControls($ajaxResponse, $controls);
						
						/* replace & fadeIn content */							
						if ($content.parent('.temp').length==0) {
							var $temp=$('<div />', { 'class':'temp' });
							$temp=$content.wrap($temp).css("height","auto").parent().css("height",$content.height()+'px');
						} else {
							$temp=$content.css("height","auto").parent().css("height",$content.height()+'px');
						};							
						$content=$temp.html($ajaxResponse.html()).children().css("display","none");					
						$temp.animate({"height":$content.height()+'px' },300, function() { 
							$content.fadeIn(300).unwrap();	
						});
					});
				};
			});
		};	
			
	/* ---------------------------------------------------------------------- /
		[6] CONTENT
	/ ---------------------------------------------------------------------- */			

	/* ---------------------------------------------------------------------- /
		[6.1] CONTENT COMMON
	/ ---------------------------------------------------------------------- */			

		/* dotted list link animation */
		$body.delegate('ul.bullet.highlight a', "mouseenter mouseleave", function(e){
			var $this=$(this);
			if (e.type=='mouseenter') {
				$this.animate({backgroundPosition: '-792px'},250).parent().animate({backgroundPosition: '4px'},250);				
			} else {
				$this.animate({backgroundPosition: '-797px'},250).parent().animate({backgroundPosition: '-1px'},250);	
			};
		});

	/* ---------------------------------------------------------------------- /
		[6.2] HOME / PORTFOLIO
	/ ---------------------------------------------------------------------- */	

		/* portfolio items hover event - in featured widget slider & home page */
		var $portfolioItems=$body.find('.portfolio-items');
		/* set values for current element */
		if ($portfolioItems.find('.portfolio-item.current').length) {
		$portfolioItems.find('.portfolio-item.current')
			.find('.portfolio-container').css({"display":"block", "opacity":"1", "top":0}).end()
			.find('.portfolio-more').css({"display":"block", "opacity":"1", "right":"-20px"}).end()
			.find('.portfolio-overlay').css({"display":"block", "opacity":"1"});
		};
		if ($portfolioItems.length) {
			$portfolioItems.delegate(".portfolio-item", "hover", function(e) {
				var $this = $(this),
					$overlay=$this.find('.portfolio-overlay'),
					$container=$this.find('.portfolio-container'),
					$more=$this.find('.portfolio-more');
				
				if (!$this.hasClass('current')) {
					if (e.type == 'mouseenter') {					
						$overlay.stop().fadeTo(100, 0.95, "jswing");											
						$container.stop(true, false).animate({cursor:'default'},50).css({"display":"block", "opacity":"0"}).animate({
								top:0,
								opacity:1
							}, 200, "jswing");
						$more.stop().css({"display":"block", "opacity":"0"}).animate({
								right:0,
								opacity:1
							}, 250, "jswing");
					} else {
						$overlay.stop().fadeTo(500, 0, "jswing");
						$container.stop(true, false).animate({cursor:'default'},100).animate({
								top:'30px',
								opacity:0
							}, 250, "jswing");
						$more.stop().animate({
								right:'-20px',
								opacity:0
						}, 350, "jswing");
					};
				};
			});	
		};

		/* portfolio general settings & functions  */
		var $portfolio=$body.find('#portfolio');
		
		if ($portfolio.length) {
			var portfolioTags=[],
				filterTags=[],
				$portfolioContent=$portfolio.find('#portfolio-content'),
				$portfolioFilter=$portfolio.find('#portfolio-filter');
		
			var getFilterTags = function () {
				$portfolioFilter.find('a').each(function(index) {
					var $this = $(this);
					if ($this.data("tag")) { filterTags.push($this.data("tag")); };	
				});
			};
			
			var getPortfolioTags = function () {
				emptyPortfolioTags();
				$portfolio.find('.portfolio-item').each(function(index) {
					var $this = $(this);
					if ($this.data("tags")) { 
						var tags = $this.data("tags").split(',');
						for (var x in tags) {
							tags[x]=$.trim(tags[x]);
							if(!(tags[x] in portfolioTags)){ portfolioTags[tags[x]]=[]; };
							portfolioTags[tags[x]].push(index);
						};
					};
				});				
			};
			
			var emptyPortfolioTags = function () {
				for (var x in filterTags) {
					if (portfolioTags[filterTags[x]]!=undefined) { portfolioTags[filterTags[x]].length=0; };
				};
			};
			getFilterTags();
			getPortfolioTags();
		
			/* portfolio filter tags click & hover events */	
			$portfolioFilter.delegate("a", "click hover", function(e) {
				var $this = $(this),
					$tooltip=$this.find('.tooltip');
	
				if (e.type=="mouseenter") {
					$.updateTooltipPos($tooltip);
					$.showTooltip($tooltip,150, -30);
				} else if (e.type=="mouseleave") {
					$.hideTooltip($tooltip,150, 100, -25);
				} else if (e.type=="click") {
					var $portfolioItems=$portfolio.find('.portfolio-item'),
						$portfolioHideables=$portfolioItems.find('img'),
						$portfolioItemLink=$portfolioItems.find('a'),
						$portfolioDisabledOverlay=$portfolioItems.find('.portfolio-disabled-overlay'),
						itemsLength=$portfolioItems.length,
						tag=$this.data('tag'),
						d=50;
						
					var showHidePortfolioItem = function (speed, opacity, index) {
						if (index!=undefined || index!=null) { 
							$portfolioHideables.eq(index).delay(d*index).animate({ opacity:opacity }, speed);
						} else {
							$portfolioItems.each(function(index) {
								$portfolioHideables.eq(index).delay(d*index).animate({ opacity:opacity }, speed);				
							});		
						};	
					};
					
					e.preventDefault();	
					$this.parent().addClass('current').siblings().removeClass('current');	
					
					if (!tag) { 
						showHidePortfolioItem(250,1);
						for (var x=0;x<itemsLength;x++) {
							$portfolioItemLink[x].style.display = "block";
							$($portfolioDisabledOverlay[x]).fadeOut(250);
						};
					} else if(!(tag in portfolioTags)) { 
						showHidePortfolioItem(250,0.1);
						for (var x=0;x<itemsLength;x++) {
							$portfolioItemLink[x].style.display = "none";
							$($portfolioDisabledOverlay[x]).fadeIn(250);
						};
					} else {
						$portfolioItems.each(function(index) {
							if (jQuery.inArray(index, portfolioTags[tag])!=-1) {
								 showHidePortfolioItem(250,1,index);
								 $portfolioItemLink[index].style.display = "block";
								 $($portfolioDisabledOverlay[index]).fadeOut(250);
							} else { 
								showHidePortfolioItem(250,0.1,index); 
								$portfolioItemLink[index].style.display = "none";
								$($portfolioDisabledOverlay[index]).fadeIn(250);
							};
						});	
					};
				};
			});

			/* portfolio - ajax load project & project pagination */
			$portfolio.delegate(".portfolio-item, .project-controls a", "click", function(e) {
				var $this=$(this),				
					$controls=$portfolio.find('.project-controls'),
					$content=$portfolio.find('.project'),
					timer,
					path='content/project/',
					currentPage=$portfolio.find('.portfolio-items').data('page');
				
				if ($this.hasClass('portfolio-item')) {
					var $itemlink=$this.find('a');
					if ($itemlink.is(':visible') && !$this.hasClass('current')) { $this.addClass('current').parent().siblings().find('.portfolio-item').removeClass('current').trigger('mouseleave'); } else { return false; };
				} else {
					if ($this.hasClass('disabled')) { return false; }
					if ($this.hasClass('close')) { 
						$content.slideUp(1000, 'easeInOutCubic');
						return false; 
					};
				};
				
				e.preventDefault();
				$siteLoader.fadeIn();
				$htmlbody.gwScrollTo({'duration' : 700, 'easing':'easeInOutCubic'});
					
				$.ajax({
					url: path+'project-'+$this.data('id')+'.html',
					dataType: "html",
					beforeSend: function () {
						if ($content.height()>0) { $content.slideUp(1000, 'easeInOutCubic'); };
						if ($controls.length) { $controls.fadeOut(); };
					}
				}).done(function(data) {
					
					var $ajaxResponse=$('<div />', { 'class':'ajax-response', html: data });				
					timer = setInterval(function () { 
						if ($content.height()==0 || $content.css('display')=='none') { 
							$content.replaceWith($ajaxResponse.children());
							$content=$portfolio.find('.project').css({'display':'none'});
							$content.find('.project-controls').css({'display':'none'});
							if ($this.data('page') != undefined && $this.data('page') != currentPage) {
								$portfolio.find('.portfolio-controls a.next-arrow').data('id',$this.data('page')).trigger('click');			
							};
							var timer2= setInterval(function () { 
								if (!$portfolio.find('#portfolio-content').hasClass('animated')) {
									$portfolio.find('.portfolio-item').each(function(index) { 
										var $item=$(this);
										if ($item.data('id')==$this.data('id')) { $item.trigger('mouseover').addClass('current').parent().siblings().find('.portfolio-item').removeClass('current').trigger('mouseleave'); }
									});
									$content.slideDown(1000, 'easeInOutCubic', function() {
										$content.find('.project-controls').fadeIn(300); 
										$siteLoader.fadeOut(); 
									});							
									clearInterval(timer2);
									
									/* preload iframes */
									var $iframe=$content.find('iframe');
									if ($iframe.length) {
										$.showPreloader($iframe);
										$iframe.load(function() {
											var $cIframe=$(this);
											$cIframe.css('visibility','visible');
											$.hidePreloader($cIframe);
										});
									};
									/* preload images */
									$content.find('.image-frame img').gwPreloader();							
									$content.find(".project-slider").gwSlider({'animSpeed':700});
								};
							}, 100);
							clearInterval(timer);
						};
					}, 100);	
				});
				return true;
			});
	
			/* portfolio ajax pagination */
			$portfolioContent.delegate(".controls a", "click", function(e) {
			var $this=$(this),
				$controls=$this.parent(),
				$content=$portfolioContent.addClass('animated').find('.portfolio-items'),
				path='content/portfolio/';

			if ($portfolioContent.find('.portfolio-item-wrapper').is(':animated')) { return false; };

			e.preventDefault();	
			if (!$this.hasClass('disabled')) {
				$siteLoader.fadeIn();
				var url=path+'portfolio-'+$this.data('id')+'.html';

				$.ajax({
					url: path+'portfolio-'+$this.data('id')+'.html',
					dataType: "html",				
				}).done(function(data) {
					var $ajaxResponse=$('<div />', { 'class':'ajax-response', html: data }),
						$items=$content.find('.portfolio-item-wrapper'),
						$newItems=$ajaxResponse.find('.portfolio-item-wrapper'),
						itemsLength=$items.length,
						newItemsLength=$newItems.length,
						d=50,
						timer;
					
					$.replaceAjaxControls($ajaxResponse, $controls);
					$portfolioContent.find('.portfolio-items').data('page',$ajaxResponse.find('.portfolio-items').data('page'));
					
					if ($content.parent('.temp').length==0) {
						var $temp=$('<div />', { 'class':'temp'});
						$temp=$content.wrap($temp).css("height","auto").parent().css("height",$content.height()+'px');
					} else {
						$temp=$content.css("height","auto").parent().css("height",$content.height()+'px');
					};
					for (var x=0;x<itemsLength;x++) {
						$items.eq(x).delay(d*x).fadeTo(250, 0, function() {
							var index=$(this).index();
							if ($newItems.eq(index).length>0) {
								$items.eq(index).replaceWith($newItems.eq(index));
								$newItems.eq(index).css("opacity",0).fadeTo(250,1).find('img').gwPreloader();
							} else {
								$items.eq(index).css("opacity",0).addClass('remove');
							}
							if (index==itemsLength-1) { 
								$items.filter('.remove').remove(); 
								$temp.animate({"height":$content.height()+'px' },550, function() { 
									if (newItemsLength<=itemsLength)	{
										if ($content.parent('.temp').length>0) { $content.unwrap(); };
										timer = setInterval(function () {
											if ($newItems.find('.preloading').length==0) { clearInterval(timer); filter(); };
										}, 100); 
										$portfolioContent.removeClass('animated');
										$siteLoader.fadeOut();
									};
								});
							};
						});
					};
					
					if (newItemsLength>itemsLength)	{
						var newHeight;
						for (var x=itemsLength;x<newItemsLength;x++) {
							$content.append($newItems[x]);
							newHeight=$content.height();
							$newItems.eq(x).addClass('hide').css('opacity',0);
							$newItems.eq(x).delay(250+(d*x)).fadeTo(250,1, function() { 
								var index=$(this).index();
								if (index==newItemsLength-1) {
									if ($content.parent('.temp').length>0) { $content.unwrap(); };
									filter(); 
								}
							}).find('img').gwPreloader();
							if (x==newItemsLength-1) {
								$temp.animate({"height":newHeight+'px' },550, 'easeOutExpo', function() { });
							};
						};
					};
					
					var filter = function() {
						getPortfolioTags();									
						$portfolioFilter.find('.current a').trigger('click');	
					};
				});
			};
			return true; 
		});		
			
		};		
			
	/* ---------------------------------------------------------------------- /
		[6.3] BLOG / PROJECT COMMENT BUTTONS' EVENTS
	/ ---------------------------------------------------------------------- */	

		/* comment reply link & cancel button event */
		$body.delegate('.comment-reply, .cancel-button', "click", function(e){
			var $this=$(this),
				$comment=$this.parents('li'),
				$comments=$comment.parent().find('li');
				$respond=$comment.parents('.post').find('#respond'),
				$postInner=$comment.parents('.post').find('.inner-content'),
				$commentParentId=$respond.find('#comment-parent-id'),
				commentsLength=$comments.length;

			e.preventDefault();
			if ($this.hasClass('comment-reply')) {
				$respond.remove().appendTo($comment);
				if ($comments.index($comment)==commentsLength-1) { $respond.css('marginBottom','20px'); } else { $respond.css('marginBottom','50px'); };
				$commentParentId[0].value=$comments.index($comment);
			} else if ($this.hasClass('cancel-button')) {
				$commentParentId[0].value="0";
				$respond.css('marginBottom','20px').remove().appendTo($postInner);
			};
		});	

	/* ---------------------------------------------------------------------- /
		[6.4] CONTACT PAGE WITH AJAX VALIDATION
	/ ---------------------------------------------------------------------- */	

		/* contact form submit */
		var $contactForm=$body.find('#contact-form');
		if ($contactForm.length) {
			$contactForm.submit(function() {
				var $this=$(this),
					$submit=$this.find('#contact-submit'),
					$inputs=$this.find('input[type=text], textarea'),
					$captcha=$this.find('#captcha-value'),
					$contactMessage=$this.parent().find('#contact-message'),
					submitValue=$submit[0].innerHTML;
				
				if ($submit.hasClass('disabled')) { return false; };
				$.ajax({
					type: "POST",
					url: $this[0].action,
					data: $this.serialize(),
					dataType: "json",
					beforeSend: function () {
						if ($contactMessage.length>0) { $contactMessage.stop().slideUp(); };
						$submit.css('opacity',0.5).addClass('disabled')[0].innerHTML='Sending...';
					}					
				}).done(function(data) {
					$submit.css('opacity',1).removeClass('disabled')[0].innerHTML=submitValue;
					$inputs.filter('#captcha')[0].value='';
					$inputs.removeClass('error');
					$tooltips=$this.find('.input-tooltip').stop().animate({cursor:'default'},200).fadeOut(function() { $tooltips.remove(); }); 
				
					if ($contactMessage.length==0) { 
						$contactMessage=$('<p />', { 'id':'contact-message'}).css('display','none');
						$this.before($contactMessage);
					 };
					if (data.result=='success') {
						$inputs.val('');
						$contactMessage.addClass('success').html(data.message.mail_sent).slideDown().delay(3000).slideUp();
					} else if (data.message.mail_sent!=undefined) {
						$contactMessage.addClass('error').html(data.message.mail_sent).slideDown().delay(3000).slideUp();
					};
						
					jQuery.each(data.message, function(key, value) {
						var $key=$this.find('#'+key),
							tooltipPos={};
							
						if ($key.length>0) { 
							var jsPos=$key.position();
							$key.addClass('error').after('<span class="input-tooltip">'+value+'</span>');
							var $tooltip=$key.next('.input-tooltip');
							tooltipPos.width=parseFloat($tooltip.css('width'));
							tooltipPos.Left=parseFloat($tooltip.css('left'));
							if ($key.hasClass('right')) { $tooltip.addClass('right'); } else { tooltipPos.width=0; };
							$tooltip.css({"display":"none","left":jsPos.left-tooltipPos.width+tooltipPos.Left+'px'}).stop().fadeIn();
						};
					});
				});
				return false;
			})

			/* remove errorstyle & tooltip from inputs on focus */
			.delegate('input[type=text], textarea', 'focusin focusout', function(e){
					var $this=$(this);
					$this.removeClass('error').next('.input-tooltip').stop().fadeOut(function() { $tooltips.remove(); }); 
			});
		};
	
	/* ---------------------------------------------------------------------- /
		[7] SCROLL TO TOP
	/ ---------------------------------------------------------------------- */
				
		var $scroll=$('#scroll-top').css('display','none'),
			$sidebar=$('#sidebar'),
			$footer=$('#footer');
			
		/* window scroll event - moving & show/hide scroll button */
		$window.scroll(function(e, triggered) {
			if ($sidebar.height()+$sidebar.offset().top+150>$footer.offset().top) { $scroll.css('display','block');  return false; };
			if ($scroll.css('position')=='absolute') { $scroll.css({'position':'fixed','bottom':'10px'}); };
			
			var $this=$(this),
				scrollTop = $scroll.height()+parseFloat($scroll.css('bottom')),	
				scrollPos=$window.height()-scrollTop,
				sidebarBottom=$sidebar.offset().top+$sidebar.height()+30,
				footerTop=$footer.offset().top,
				fixedTopPos=$this.scrollTop()-sidebarBottom+scrollPos,
				fixedBottomPos=$this.scrollTop()-footerTop+scrollPos,
				cssTop;

			if (triggered) { e.preventDefault(); }; 
			if (fixedTopPos<0) {cssTop = sidebarBottom;} else {cssTop = footerTop;}
			if (fixedTopPos>0 && fixedBottomPos<0) {
				if ($scroll.is(':hidden') && $this.scrollTop()>0) { $scroll.fadeIn(); };
				if ($scroll.is(':visible') && $this.scrollTop()==0) { $scroll.fadeOut(); };
				if ($scroll.hasClass('absolute')) { $scroll.removeClass('absolute').css({'top':'auto'}); };
			} else {	
				if ($scroll.is(':visible') && fixedTopPos<0 && fixedTopPos!=fixedBottomPos) { $scroll.fadeOut(); };
				if (fixedBottomPos>0) { $scroll.css("display","block"); };
				if (!$scroll.hasClass('absolute')) { $('#scroll-top').addClass('absolute').css({'top':cssTop-$scroll.parent().offset().top+'px'}); };
			};
			return true;
		});

		/* scroll button click event - call scroll to plugin  */
		$scroll.delegate("a", "click", function(e) {
			e.preventDefault();			
			$htmlbody.gwScrollTo({'easing':'easeInOutCubic'});
		});
				
	/* ---------------------------------------------------------------------- /
		[8] CALL EXTERNAL PLUGINS
	/ ---------------------------------------------------------------------- */	

	/* ---------------------------------------------------------------------- /
		[8.1] LAVALAMP PLUGIN
	/ ---------------------------------------------------------------------- */	
			
		if(jQuery().lavaLamp) {	
			/* add "selectedLava" class to selected item before (important!) lavaLamp init */
			$navigation.children('li.current').addClass("selectedLava").end()
			/* add "noLava" class to submenu items */
			.find('ul > li').addClass("noLava").end()
			/* calling the Plugin */
			.lavaLamp({
				fx: 'easeOutExpo',
				speed: 500
			})
			/* menu fix - setting top margin to "0" for the first menuItem  */
			.children('li:eq(1)').css({"margin":"0"}).end()
			/* ".backLava" class fix  */
			.children('li.backLava').css({"top":"-=10"});
		};

	/* ---------------------------------------------------------------------- /
		[8.2] GOMAP PLUGIN
	/ ---------------------------------------------------------------------- */	

		var $map=$body.find("#map");
		if(jQuery().goMap && $map.length) {
			 $map.goMap({ 
				markers: [{  
					address: 'New York, Usa', /* change your adress here */
					title: 'Granth', /* title information */
					icon: {
						image: 'assets/images/navigation/pin.png' /* your custom icon file */
					}	
				}], 
					zoom: 14,
					maptype: 'ROADMAP'
			}); 
		};				
});
