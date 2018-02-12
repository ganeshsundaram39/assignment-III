$(document).ready(function(){
	$('input[name="fbtoken"]').focus(function(){
		$('#search').css({'background-color':'#4080ff','color':'#fff'});
	});
	$('input[name="fbtoken"]').blur(function(){
		$('#search').css({'background-color': '#fff','color':'#6c757d'});
	});

});

