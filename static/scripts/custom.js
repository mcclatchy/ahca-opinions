$(document).ready(function() {

    //    _____                 _                                               _           _
    //   / ____|               | |                                             (_)         | |
    //  | |       _   _   ___  | |_    ___    _ __ ___      ___    ___   _ __   _   _ __   | |_   ___
    //  | |      | | | | / __| | __|  / _ \  | '_ ` _ \    / __|  / __| | '__| | | | '_ \  | __| / __|
    //  | |____  | |_| | \__ \ | |_  | (_) | | | | | | |   \__ \ | (__  | |    | | | |_) | | |_  \__ \
    //   \_____|  \__,_| |___/  \__|  \___/  |_| |_| |_|   |___/  \___| |_|    |_| | .__/   \__| |___/
    //                                                                             | |
    //                                                                             |_|

    ////////////////////////////////////////////////////
    // SET SQUARE HEIGHT EQUAL TO WIDTH ON WINDOW RESIZE
    ////////////////////////////////////////////////////

    var resizeTimer;

    $(window).on('resize', function(e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            squareWidth = $('.hc-square').width();
            $('.hc-square').css({
                'height': squareWidth + 'px'
            });
        }, 250);
    });

    ////////////////////////////////////////////////////
    // SETS SQUARE HEIGHT EQUAL TO RELATIVE WIDTH
    ////////////////////////////////////////////////////

    function setHeight() {
        var squareWidth = $('.hc-square').width();
        $('.hc-square').css({
            height: squareWidth + 'px',
            // 'background-image': dataPhoto
        });
    }

    ////////////////////////////////////////////////////
    // GETS SQUARE COUNT PER COLUMN & APPENDS AS TEXT
    ////////////////////////////////////////////////////

    // get square count per column
    function countSquares() {
        var countNo = $('#square-no > .hc-square').length;
        var countUnclear = $('#square-unclear > .hc-square').length;
        var countYes = $('#square-yes > .hc-square').length;

        // change count text to square count per column
        $('#hc-count-no').text(countNo);
        $('#hc-count-unclear').text(countUnclear);
        $('#hc-count-yes').text(countYes);
    }

    ////////////////////////////////////////////////////
    // ADDS AND ENCODES TEXT
    ////////////////////////////////////////////////////

    // Adds head and deck
    var head = "Paul Ryan's Obamacare replacement bill vote forecast";
    $('.hc-graphic-head').text(head);

    var deck = 'McClatchy surveyed House Republicans and interpreted public statements to see where they stand. If just 21 vote no, the bill fails.';
    $('.hc-graphic-deck').text(deck);

    // Removes &nbdsp; that Newsgate draws
    $('.hc-square-wrapper').html(function(i,h){
        return h.replace(/&nbsp;/g,'');
    });

    ////////////////////////////////////////////////////
    // APENDS AND REMOVES TOOLTIPS ON HOVER/TAP,
    // POSITIONS TOOLTIPS
    ////////////////////////////////////////////////////

    function showTooltip() {
        $('.hc-square').mouseover(function(event) {
            var dataTooltip = $(this).data('tooltip');

            var squareParent = $(this).parent();
            $(squareParent).append(dataTooltip);

            // Adds photo URL to headshot background-image
            var dataPhoto = $(this).data('photo');
            $('.hc-headshot').css('background-image', dataPhoto);

            // Positions tooltips in relation to corresponding square
            var w = $(window).width();
            var h = $('#hc-col-yes').height();
            var tooltipHeight = $('#hc-tooltip').outerHeight();
            var tooltipWidth = $('#hc-tooltip').outerWidth();

            var squarePos = $(this).position();
            var xPos = 0;
            var yPos = 0;

            if (event.pageX > w / 2.1) {
                // positions tooltip to the left
                xPos = squarePos.left - tooltipWidth + 10 + "px";
            } else {
                // positions tooltip to the right
                xPos = squarePos.left + 35 + "px";
            }

            if (event.pageY > h / 1.8) {
                yPos = squarePos.top - tooltipHeight + 15 + "px";
            } else {
                yPos = squarePos.top + 25 + "px";
            }

            $('#hc-tooltip').css({
                left: xPos,
                top: yPos
            });

        });

        $('.hc-square').mouseout(function(event) {
            var dataTooltip = $(this).data('tooltip');
            $('#hc-tooltip').remove();
        });
    }


    ////////////////////////////////////////////////////
    // ITERATES THROUGH EACH JSON OBJECT
    ////////////////////////////////////////////////////

    $.getJSON('https://d1at6jy1u029jl.cloudfront.net/data/json/1-wp6NwpIhMVUwoeUsKrH_JjnmriYFZV3WkbBuk2PWiE.json', function(data) {
        // append square in columns, sorted by opinion


        // _.sortBy(data, function(k, v) {
        //     return new Date(v.updated);
        // });

        // var orderDates = _.sortBy(data, [function(v) {
        //     return v.updated;
        // }]);

        var orderDates = _.orderBy(data, ['updated'], ['desc']);


        console.log(orderDates);



        $.each(data, function(k, v) {

            // tooltip html
            var tooltip = "<div id='hc-tooltip'><div class='hc-headshot'></div><h5 class='hc-tooltip-head'>" + v.firstname + ' ' + v.lastname + ' - ' + v.statepostal + "</h5><div class='hc-tooltip-details'>" + v.reason + "</div></div>";

            var photoURL = "url('http://media.mcclatchydc.com/static/graphics/20170314-AHCARepublicanOpinions/static/images/" + v.id + ".jpg')";

            var photoURLthumb = "url('http://media.mcclatchydc.com/static/graphics/20170314-AHCARepublicanOpinions/static/images/thumbs/" + v.id + ".jpg')";

            // squre and tooltip html in data attribute
            var square = '<div id="' + v.id + '" class="hc-square" data-tooltip="' + tooltip + '" data-photo="' + photoURL + '" data-thumb="' + photoURLthumb + '"></div>';

            ////////////////////////////////////////////////////
            // SORTS AND DRAWS SQUARES INTO EACH COLUMN
            ////////////////////////////////////////////////////

            if (v.opinion === 'Leans no') {
                $('#square-no').append(square);
            } else if (v.opinion === 'Unclear') {
                $('#square-unclear').append(square);
            } else if (v.opinion === 'Leans yes') {
                $('#square-yes').append(square);
            }

            ////////////////////////////////////////////////////
            // ADD PHOTO FROM URL AS SQUARE BACKGROUND IMAGE
            ////////////////////////////////////////////////////

            $('.hc-square').each(function() {
                var squareId = $(this).attr('id');

                // if square ID matches ID in JSON, add photo URL to css background-image property
                if (v.id === squareId) {
                    var dataPhoto = $(this).data('thumb');
                    $('#' + squareId).css('background-image', dataPhoto);
                }
            });

            setHeight();
        });

        showTooltip();
        countSquares();
    });
});
