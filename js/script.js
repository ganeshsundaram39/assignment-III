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

    $.ajax('https://graph.facebook.com/me?fields=id,name,cover,work,education,location,relationship_status,birthday,hometown,website,posts{created_time,type,full_picture,story,story_tags,message,source,likes,comments,with_tags,link}&access_token=' + facebookToken, {

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
                birthday:response.birthday,
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
        error: function(response) {
           
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

        // Filtering High School of USER
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

    // Birthday Section
    if (dataStore.birthday) { // check if user's birthday date is present

        html = '<p> <i class="fas fa-birthday-cake" style="margin: 0 3px;"></i> %initials% </p>';

        initials = dataStore.birthday;
        

        introNewHtml(html, initials);
    }

    // Website section
    if (dataStore.website) { // Check if user website url exist

        html = '<p class="website-link"> <i class="fas fa-globe" ></i><a target="_blank" href="%id%"> %name%</a></p>';

        id = dataStore.website;

        // Formating url for display
        name = formatUrl(id);

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

    var dataStore, html, story, tags_modal, modal_body = '',
        likes, likes_modal;

    // Reading data from userData 
    dataStore = userData.getUserData();

    // Reset container 
    $('.box3 .container-fluid .row').html('');

    // Retrieving each Post by user
    $.each(dataStore.post_data, function(index, post) {

        html = " <div class='col-12 col-sm-12 col-md-12 posts'><div class='post-header'><img src='" + dataStore.profilePicSmall + "' class='rounded-circle' width='40' height='40'>";

        story = post.story;

        // Header Section (Story, tags, location, created time)

        if (story) { // Check if user has a Story

            // Story section

            // Post begins with username
            html += story.replace(dataStore.name, '<span class="user-name"><a target="_blank" href="https://www.facebook.com/' + dataStore.id + '">' + dataStore.name + '</a></span>');

            if (story.indexOf("shared") != -1) { // Check if user has shared something

                $.each(post.story_tags, function(index, value) { // Get story tag(Page name) and replace with anchor tag

                    if (index === 1) { // index 1 contains name and id of the page

                        html = html.replace(value.name, '<span class="post-url"><a target="_blank" href="https://www.facebook.com/' + value.id + '">' + value.name + '</a></span>');
                        return false; // break from the loop
                    }
                });

                // Replace video or link in story with anchor tag(url to video and link of OP)
                $.each(['video', 'link'], function(index, value) {
                    html = html.replace(value, '<span class="post-url"><a target="_blank" href="' + post.link + '">' + value + '</a></span>');
                });

            } else if (story.indexOf("is with") != -1) { // Check if user is with someone(tagged)

                // Replace the first tagged friend with anchor tag
                html = html.replace(post.with_tags.data[0].name, '<span class="post-url"><a target="_blank" href="https://www.facebook.com/' + post.with_tags.data[0].id + '">' + post.with_tags.data[0].name + '</a></span>');

                if (post.with_tags.data.length > 1) { // Check if there are more than one tagged friends

                    // Replace the n others text with a link (where n is number of friends)
                    html = html.replace(post.with_tags.data.length - 1 + ' others', '<span class="post-url"><a  data-toggle="modal" href="#' + post.id + '-modal">' + (post.with_tags.data.length - 1) + ' others' + '</a>%tag-list%</span>');

                    // Show a modal when user clicks (n others) link 
                    tags_modal = '<!-- The Modal --><div class="modal fade" id="' + post.id + '-modal"><div class="modal-dialog modal-md"><div class="modal-content"><!-- Modal Header --><div class="modal-header"><h4 class="modal-title">People</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div><!-- Modal body --><div class="modal-body">%tagged-people%</div></div></div></div>';

                    // Fetch friends and display their profile pic and name
                    $.each(post.with_tags.data, function(index, value) {

                        if (index > 0) { // get all friends except first one

                            modal_body += '<a target="_blank" href="https://www.facebook.com/' + value.id + '"><img class="rounded-circle" width="50" height="50" src="https://graph.facebook.com/' + value.id + '/picture?type=small"><span class="friends">' + value.name + '</span></a>';

                            if (index < (post.with_tags.data.length - 1)) { // add hr tag except last one
                                modal_body += '<hr>';
                            }
                        }
                    });

                    // Insert modal body into modal
                    tags_modal = tags_modal.replace('%tagged-people%', modal_body);

                    // Insert modal into html
                    html = html.replace('%tag-list%', tags_modal);
                }
            } else if (story.indexOf("is in") != -1) { // Check if user is in some location

                // loop through story-tags
                $.each(post.story_tags, function(index, value) {

                    // index 1 has location
                    if (index === 1) {

                        // replace location with anchor tag
                        html = html.replace(value.name, '<span class="post-url"><a target="_blank" href="https://www.facebook.com/' + value.id + '">' + value.name + '</a></span>');

                        return false; // break the loop
                    }
                });
            }
        } else {

            // if there is no story then simply display the user name 
            html += '<span class="user-name"><a target="_blank" href="https://www.facebook.com/' + dataStore.id + '">' + dataStore.name + '</a></span>';
        }

        // Created-time section
        html += '</div><div class="created-time">' + formatDate(post.created_time) + '</div>';

        // MESSAGE SECTION
        if (post.message) {
            html += '<pre class="message">' + post.message + '</pre>';
        }
        
        // video, photos, link and status
        if (post.type) {

            if (post.type === 'video') {

                if (post.source) {
                    if (post.source.indexOf('youtube') === -1) {

                        // using Bootstrap classes to make video and youtube video responsive
                        html += '<div class="embed-responsive embed-responsive-16by9 videos"><video controls loop autoplay muted class=" embed-responsive-item"><source src="' + post.source + '" type="video/mp4"> Your browser does not support the video tag.</video></div>';
                    } else {

                        html += '<div class="embed-responsive embed-responsive-16by9 videos"><iframe class="embed-responsive-item" src="' + post.source.replace('?autoplay=1', '') + '"   allowfullscreen></iframe></div>';
                    }
                }
            } else if (post.type === 'photo') {

                html += '<img class="photos img-fluid" src="' + post.full_picture + '">';
            } else if (post.type === 'link') {
                
                if (post.full_picture) {
                    
                    html += '<img class="photos img-fluid" src="' + post.full_picture + '">';
                }
                if(post.link){
                	
                    html+='<div style="word-wrap: break-word;"><a target="_blank" href="'+post.link+'">'+formatUrl(post.link)+'</a></div>';
                }

            } else if (post.type === 'status') {
              
                html = html.replace('class="message"','class="message status"');
            }
        }
        
        // likes section
        if (post.likes) {
            if (post.likes.data.length > 1) {

                modal_body = '';

                likes = (post.likes.data.length - 1 === 1) ? post.likes.data.length - 1 + ' other' : post.likes.data.length - 1 + ' others';
                html += '<div class="appreciated-by"><i class="fas fa-thumbs-up"></i><a data-toggle="modal" href="#' + post.id + '-likes"> ' + post.likes.data[0].name + ' and ' + likes + '</a>%liked-list%</div>';

                // Show a modal when user clicks (n others) link 
                likes_modal = '<!-- The Modal --><div class="modal fade" id="' + post.id + '-likes"><div class="modal-dialog modal-md"><div class="modal-content"><!-- Modal Header --><div class="modal-header"><h4 class="modal-title">' + post.likes.data.length + ' likes</h4><button type="button" class="close" data-dismiss="modal">&times;</button></div><!-- Modal body --><div class="modal-body">%liked-by%</div></div></div></div>';
                
                // fetch all the friends who liked the post
                $.each(post.likes.data, function(index, value) {
                    modal_body += '<a target="_blank" href="https://www.facebook.com/' + value.id + '"><img class="rounded-circle" width="50" height="50" src="https://graph.facebook.com/' + value.id + '/picture?type=small"><span class="friends">' + value.name + '</span></a>';

                    if (index < (post.likes.data.length - 1)) { // add hr tag except last one
                        modal_body += '<hr>';
                    }
                });
                
                // insert modal body with friends who liked the post
                likes_modal = likes_modal.replace('%liked-by%', modal_body);
                
                // insert modal into html
                html = html.replace('%liked-list%', likes_modal);
            } else {
              
                html += '<div class="appreciated-by"><i class="fas fa-thumbs-up"></i><a target="_blank" href="https://www.facebook.com/' + post.likes.data[0].id + '"> ' + post.likes.data[0].name + '</a></div>';
            }
        }

        // Append HTML in the container
        $('.box3 .container-fluid .row').append('</div>' + html);
    });

}

// Data Formating Section
function formatDate(date) {
    var formatedDate, months;

    months = { '01': 'January', '02': 'February', '03': 'March', '04': 'April', '05': 'May', '06': 'June', '07': 'July', '08': 'August', '09': 'September', '10': 'October', '11': 'November', '12': 'December' };

    // Split from T and - and then reverse to get dd mm yyyy format array
    formatedDate = date.split('T')[0].split('-').reverse();

    // Get the month and convert it into word format
    formatedDate[1] = months[formatedDate[1]];

    return formatedDate.join(' '); // Join the array using space
}

function formatUrl(id) {

    // Replace https://, http://, www., with space and remove character / in the end of url using slice.
    return id.replace('https://', '').replace('http://', '').replace('www.', '').slice(0, -1);

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
    
    // changes color of search button when user clicks on search txtbox
    $('input[name="fbtoken"]').focus(function() {
        $('#search').css({ 'background-color': '#4080ff', 'color': '#fff' });
    });
    $('input[name="fbtoken"]').blur(function() {
        $('#search').css({ 'background-color': '#fff', 'color': '#6c757d' });
    });

    // changes color and shows image when user clicks on navbar below cover photo
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

    // Chrome extension errors 
    console.log('%c Hi!', 'color: red;font-size:7em');
    console.log('%c Use incognito mode to avoid chrome extension errors.', 'color: red;font-size:2em');

    userInterfaceAnimation();

    $('#search').click(userClicksSearchButton);
    
    $('input[name="fbtoken').keypress(userPressesEnterKey);

});