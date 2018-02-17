// DataStore For storing User Data
var userData = (function() {

    var dataStore = [];

    return {
        // Read
        getUserData: function() {
            return dataStore;
        },
        // Write
        setUserData: function(data) {
            dataStore = data;
        }
    };
})();

// Fetching FACEBOOK DATA using JQuery AJAX
function getFacebookData(facebookToken) {

    $.ajax('https://graph.facebook.com/me?fields=id,name,cover,work,education,location,relationship_status,hometown,website&access_token=' + facebookToken, {
        success: function(response) {

            // Assign response to userData
            userData.setUserData({
                id: response.id,
                name: response.name,
                profilePic: 'https://graph.facebook.com/' + response.id + '/picture?type=large',
                coverPhoto: response.cover ? response.cover.source : 'img/cover-photo.png', //Check if user has uploaded cover-photo 
                work: response.work,
                education: response.education,
                location: response.location,
                relationship_status: response.relationship_status,
                hometown: response.hometown,
                website: response.website
            });

            // Assign Data to UI
            assignDataToUI();
        },
        error: function(response, errorType, errorMessage) {
            // Error Message
            console.log(response);
            alert('Incorrect or Expired Access Token Searched..!!');
        }
    });

}

// Assigning FACEBOOK DATA to USER INTERFACE
function assignDataToUI() {

    // Reading data from userData 
    var dataStore = userData.getUserData();

    // Assigning data to Header Section
    $('#full-name').text(dataStore.name);
    $('#profile-pic').attr('src', dataStore.profilePic);
    $('.cover-photo').attr('src', dataStore.coverPhoto);

    // Assigning data to Intro Section
    introUI(dataStore);
}

// ASSIGN DATA TO INTRO SECTION
function introUI(dataStore) {

    var initials, id, name, html, newHtml;

    // Reset contents of intro
    $('#intro').html('<p><img src="img/earth.PNG"> Intro</p>');

    // WORK Section 
    if (dataStore.work) { // Check if User has a work experience

        html = '<p> <i class="fas fa-briefcase"></i> %initials% <a target="_blank" href="www.facebook.com/%id%">%name%</a></p>';

        for (var expWork in dataStore.work) {

            initials = (dataStore.work[expWork].end_data === '0000-00') ? 'Works at ' : 'Worked at ';

            initials = (dataStore.work[expWork].position) ? dataStore.work[expWork].position.name + ' at ' : initials;

            id = dataStore.work[expWork].employer.id;
            name = dataStore.work[expWork].employer.name;

            introNewHtml(html, initials, id, name);
        }
    }

    // Education Section
    if (dataStore.education) { // Check if User has a education experience

        // Filter only colleges and grad school of user
        var colleges = dataStore.education.filter(function(college) {
            return college.type === 'College' || college.type === 'Graduate School';
        });

        html = '<p> <i class="fas fa-graduation-cap"></i> %initials% <a target="_blank" href="www.facebook.com/%id%">%name%</a></p>';

        initials = 'Studied at';

        for (var expCollege in colleges) {

            id = colleges[expCollege].school.id;
            name = colleges[expCollege].school.name;

            introNewHtml(html, initials, id, name);
        }

        // Filtering High School of user
        var highSchool = dataStore.education.filter(function(highSchool) {
            return highSchool.type === 'High School';
        });

        initials = 'Went to';

        for (var expHighSchool in highSchool) {

            id = highSchool[expHighSchool].school.id;
            name = highSchool[expHighSchool].school.name;

            introNewHtml(html, initials, id, name);
        }
    }

    // Location Section
    if (dataStore.location) { // Check if User has a Location

        html = '<p> <i class="fas fa-home"></i> %initials% <a target="_blank" href="www.facebook.com/%id%">%name%</a></p>';

        initials = 'Lives in';
        id = dataStore.location.id;
        name = dataStore.location.name;

        introNewHtml(html, initials, id, name);
    }

    // HomeTown Section
    if (dataStore.hometown) { // Check if User has a Hometown
        html = '<p> <i class="fas fa-map-marker"></i> %initials% <a target="_blank" href="www.facebook.com/%id%">%name%</a></p>';

        initials = 'From';
        id = dataStore.hometown.id;
        name = dataStore.hometown.name;

        introNewHtml(html, initials, id, name);
    }
}

// Function Which Generates new HTML for INTRO Section.
function introNewHtml(html, initials, id, name) {

    var newHtml;

    newHtml = html.replace('%initials%', initials);
    newHtml = newHtml.replace('%id%', id);
    newHtml = newHtml.replace('%name%', name);

    //Insert the HTML into the DOM
    $('#intro').append(newHtml);
}

// USER INTERFACE EVENTS
function userPressesEnterKey(e) {

    if (e.which == 13) // the enter key code
    {
        $('#search').click();
        return false;
    }
}

function userClicksSearchButton() {
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