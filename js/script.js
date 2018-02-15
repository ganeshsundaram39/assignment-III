
var userData=(function(){
	
	var dataStore=[];

	return{
		getUserData:function(){
          return dataStore;
		},
		setUserData:function(data){
          dataStore=data;
		}
	};
})();

// Fetching FACEBOOK DATA using JQuery AJAX
function getFacebookData(facebookToken) {
    
        $.ajax('https://graph.facebook.com/me?fields=id,name,cover&access_token=' + facebookToken, {
            success: function(response) {  
                userData.setUserData({
                	id:response.id,
                	name:response.name,
                	profilePic:'https://graph.facebook.com/'+response.id+'/picture?type=large',
                	coverPhoto:response.cover?response.cover.source:'img/cover-photo.png'   //Check if user has uploaded cover-photo 
                });
                assignDataToUI();
            },
            error: function(response, errorType, errorMessage) {
                console.log(response);
                alert('Incorrect or Expired Access Token Searched..!!');
            }
        });
}

// Assigning FACEBOOK DATA to USER INTERFACE
function assignDataToUI(){
	var dataStore= userData.getUserData();
	$('#full-name').text(dataStore.name);
	$('#profile-pic').attr('src',dataStore.profilePic);
	
	$('.cover-photo').attr('src',dataStore.coverPhoto);
}

// USER INTERFACE EVENTS
function  userPressesEnterKey(e) {
        
        if (e.which == 13) // the enter key code
        {
            $('#search').click();
            return false;
        }
    }

function userClicksSearchButton(){
	var facebookToken;

    facebookToken = $('input[name="fbtoken"]').val();
    
    if (facebookToken) {
    	getFacebookData(facebookToken);
    }
}

// USER INTERFACE ANIMATIONs
function userInterfaceAnimation() {
    $('input[name="fbtoken"]').focus(function() {
        $('#search').css({ 'background-color': '#4080ff', 'color': '#fff' });
    });
    $('input[name="fbtoken"]').blur(function() {
        $('#search').css({ 'background-color': '#fff', 'color': '#6c757d' });
    });

    $('#timeline').click(function() {
        $('#about img').css({ 'display': 'none' });
        $('#timeline img').css({ 'display': 'block' });
        $('#about').css({ 'color': '#365899' });
        $('#timeline').css({ 'color': '#4b4f56' });
    });

    $('#about').click(function() {
        $('#timeline img').css({ 'display': 'none' });
        $('#about img').css({ 'display': 'block' });
        $('#about').css({ 'color': '#4b4f56' });
        $('#timeline').css({ 'color': '#365899' });
    });
}

$(document).ready(function() {

    userInterfaceAnimation();
    $('#search').click(userClicksSearchButton);
    $('input[name="fbtoken').keypress(userPressesEnterKey);

});