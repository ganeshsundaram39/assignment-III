
function userExperience() {
        $('input[name="fbtoken"]').focus(function() {
            $('#search').css({ 'background-color': '#4080ff', 'color': '#fff' });
        });
        $('input[name="fbtoken"]').blur(function() {
            $('#search').css({ 'background-color': '#fff', 'color': '#6c757d' });
        });

        $('#timeline').click(function(){
        	$('#about img').css({'display':'none'});
        	$('#timeline img').css({'display':'block'});
        	$('#about').css({'color':'#365899'});
        	$('#timeline').css({'color':'#4b4f56'});
        	
        });

        $('#about').click(function(){
        	$('#timeline img').css({'display':'none'});
        	$('#about img').css({'display':'block'});
        	$('#about').css({'color':'#4b4f56'});
        	$('#timeline').css({'color':'#365899'});
        });
    }

$(document).ready(function() {

	userExperience();

});