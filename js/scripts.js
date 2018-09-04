$(document).ready(function(){

	// A little hack to get flex properties to stick.
	// start with a hidden body, then hide everything then show the body.
	$('.view').hide();
	$("#first-screen").show();
	$("body").show();

	shown = "#first-screen";

	// Events for buttons, not the most elegant way, but this is just an example.
	$("#start-order").on('click',function(){

		// Indicate we are no longer at home
		$("#home-button").removeClass("active")


		$("#first-screen").hide();
		$("#order-screen").show();
		shown = "#order-screen";
	})

	$("#home-button").on('click',function(){
		// Switch the active class around
		$(this).addClass("active");
		$("#about-us").removeClass("active");

		// Show and hide the views
		$(shown).hide();
		$("#first-screen").show();
		shown = "#first-screen";
	});
	$("#about-us").on('click',function(){

		// switch the active around		
		$(this).addClass("active");
		$("#home-button").removeClass("active")

		// show and hide the views
		$(shown).hide();
		$("#about-us-screen").show();
		shown = "#about-us-screen";

	});

	$("#classic-crust").on("click",function(){
		$(this).addClass("btn-success");
		$("#thin-crust").removeClass("btn-success");
	});

	$("#thin-crust").on("click",function(){
		$(this).addClass("btn-success");
		$("#classic-crust").removeClass("btn-success");
	});


	$("#send-order").on("click",function(){
		// Hide message about taking a while
		$("#take-a-while").hide();
		
		$(shown).hide();
		$("#wait-screen").show();
		shown = "#wait-screen"
		

		// Show this will take a while after a bit
		setTimeout(function () {
  			 $("#take-a-while").show();
		}, 3000);

	});
})
