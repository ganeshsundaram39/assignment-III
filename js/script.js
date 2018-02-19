
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

    $.ajax('https://graph.facebook.com/me?fields=id,name,cover,work,education,location,relationship_status,hometown,website,posts{created_time,type,full_picture,story,story_tags,message,source,likes,comments,with_tags,link}&access_token=' + facebookToken, {

        success: function(response) {

            // Assign response to userData
            userData.setUserData({
                id: response.id,
                name: response.name,
                profilePicLarge: 'https://graph.facebook.com/' + response.id + '/picture?type=large',
                profilePicSmall: 'https://graph.facebook.com/' + response.id + '/picture?type=small',
                coverPhoto: response.cover ? response.cover.source : 'img/cover-photo.png', //Check if user has uploaded cover-photo 
                work: response.work,
                education: response.education,
                location: response.location,
                relationship_status: response.relationship_status,
                hometown: response.hometown,
                website: response.website,
                post_data: response.posts.data
            });

            // Assigning data to Header UI
            assignDataToHeaderUI();
            // Assigning data to Intro UI
            assignDataToIntroUI();
            // Assigning data to Post UI
            assignDataToPostUI();
        },
        error: function(response, errorType, errorMessage) {
            // Error Message
            console.log(response);
            alert('Incorrect or Expired Access Token Searched..!!');
        }
    });

}

// Assigning FACEBOOK DATA to USER INTERFACES

// ASSIGN DATA TO Header SECTION(cover photo, profile-pic, name)
function assignDataToHeaderUI() {

    var dataStore;

    // Reading data from userData 
    dataStore = userData.getUserData();

    // Assigning data to Header Section
    $('#full-name').text(dataStore.name);
    $('#profile-pic').attr('src', dataStore.profilePicLarge);
    $('.cover-photo').attr('src', dataStore.coverPhoto);
}

// ASSIGN DATA TO INTRO SECTION(work, education, hometown, location, relationship-status, website)
function assignDataToIntroUI() {

    var dataStore, initials, id, name, html, newHtml;

    // Reading data from userData 
    dataStore = userData.getUserData();

    // Reset contents of intro
    $('#intro').html('<p><img src="img/earth.PNG"> Intro</p>');

    // WORK Section 
    if (dataStore.work) { // Check if User has a work experience

        html = '<p> <i class="fas fa-briefcase" style="margin : 0 2px;"></i> %initials%<a target="_blank" href="https://www.facebook.com/%id%">%name%</a></p>';

        $.each(dataStore.work, function(index, workExperience) {

            initials = (workExperience.end_data === '0000-00') ? 'Works at ' : 'Worked at ';

            initials = (workExperience.position) ? workExperience.position.name + ' at ' : initials;

            id = workExperience.employer.id;
            name = workExperience.employer.name;

            introNewHtml(html, initials, id, name);
        });
    }

    // Education Section
    if (dataStore.education) { // Check if User has a education experience

        // Filter only colleges and grad school of user
        var colleges = dataStore.education.filter(function(college) {
            return college.type === 'College' || college.type === 'Graduate School';
        });

        html = '<p> <i class="fas fa-graduation-cap"></i> %initials% <a target="_blank" href="https://www.facebook.com/%id%">%name%</a></p>';

        initials = 'Studied at';

        $.each(colleges, function(index, collegeExperience) {

            id = collegeExperience.school.id;
            name = collegeExperience.school.name;

            introNewHtml(html, initials, id, name);
        });

        // Filtering High School of user
        var highSchool = dataStore.education.filter(function(highSchool) {
            return highSchool.type === 'High School';
        });

        initials = 'Went to';

        $.each(highSchool, function(index, highschoolExperience) {

            id = highschoolExperience.school.id;
            name = highschoolExperience.school.name;

            introNewHtml(html, initials, id, name);
        });
    }

    // Location Section
    if (dataStore.location) { // Check if User has a Location

        html = '<p> <i class="fas fa-home" style="margin-right: 2px;"></i> %initials% <a target="_blank" href="https://www.facebook.com/%id%">%name%</a></p>';

        initials = 'Lives in';
        id = dataStore.location.id;
        name = dataStore.location.name;

        introNewHtml(html, initials, id, name);
    }

    // Relationship Section
    if (dataStore.relationship_status) { // Check if User has a relationship status

        html = '<p> <i class="fas fa-heart"></i> %initials%</p>';

        initials = dataStore.relationship_status;

        introNewHtml(html, initials);
    }

    // HomeTown Section
    if (dataStore.hometown) { // Check if User has a Hometown

        html = '<p> <i class="fas fa-map-marker"style="margin: 0 3px;"></i> %initials% <a target="_blank" href="https://www.facebook.com/%id%">%name%</a></p>';

        initials = 'From';
        id = dataStore.hometown.id;
        name = dataStore.hometown.name;

        introNewHtml(html, initials, id, name);
    }

    // Website section
    if (dataStore.website) { // Check if user website url exist

        html = '<p class="website-link"> <i class="fas fa-globe" ></i><a target="_blank" href="%id%"> %name%</a></p>';

        id = dataStore.website;

        // Formating url for display
        name = id.replace('https://', '');
        name = name.replace('http://', '');
        name = name.replace('www.', '');
        name = name.slice(0, -1);

        introNewHtml(html, '', id, name);
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

// Assign data to Post section
function assignDataToPostUI() {

    var dataStore, html, story;

    // Reading data from userData 
    dataStore = userData.getUserData();

    // Reset Posts 
    $('.box3 .container-fluid .row').html('');

    $.each(dataStore.post_data, function(index, post) {

        html = " <div class='col-12 col-sm-12 col-md-12 posts'><div class='post-header'><img src='" + dataStore.profilePicSmall + "' class='rounded-circle' width='40' height='40'>";

        story = post.story;
        if (story) {

            html += story.replace(dataStore.name, '<span class="user-name"><a target="_blank" href="https://www.facebook.com/' + dataStore.id + '">' + dataStore.name + '</a></span>');

            if (story.indexOf("shared") != -1) {

                $.each(post.story_tags, function(index, value) {
                    if (index === 1) {

                        html = html.replace(value.name, '<span class="post-url"><a target="_blank" href="https://www.facebook.com/' + value.id + '">' + value.name + '</a></span>');
                        return false;
                    }
                });

                $.each(['video', 'link'], function(index, value) {
                    html = html.replace(value, '<span class="post-url"><a target="_blank" href="' + post.link + '">' + value + '</a></span>');
                });
                
            } else if (story.indexOf("is with") != -1) {

            	html = html.replace(post.with_tags.data[0].name, '<span class="post-url"><a target="_blank" href="https://www.facebook.com/' + post.with_tags.data[0].id + '">' + post.with_tags.data[0].name + '</a></span>');
            }
        } else {
            html += '<span class="user-name"><a target="_blank" href="https://www.facebook.com/' + dataStore.id + '">' + dataStore.name + '</a></span>';
        }

        $('.box3 .container-fluid .row').append(html);
    });

}


// USER INTERFACE EVENTS
function userPressesEnterKey(e) {

    // When user presses enter key in search textbox
    if (e.which == 13) {
        // Click the search button 
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

    $('.videos').hover(function toggleControls() {
        if (this.hasAttribute("controls")) {
            this.removeAttribute("controls");
        } else {
            this.setAttribute("controls", "controls");
        }
    });

    // When the 'ended' event fires
    $('.videos').on('ended', function() {

        // And play again
        $('.videos').trigger('play');
        $('.videos').trigger('pause');
    });
}

$(document).ready(function() {

    userInterfaceAnimation();
    $('#search').click(userClicksSearchButton);
    $('input[name="fbtoken').keypress(userPressesEnterKey);

});