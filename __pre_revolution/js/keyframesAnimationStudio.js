$(init);
function init() {

    // ========================================================================
    // Utility functions
    // ========================================================================
    function pad(pad, str, padLeft) {
        if (typeof str === 'undefined') return pad;
        if (padLeft) {
            return (pad + str).slice(-pad.length);
        } else {
            return (str + pad).substring(0, pad.length);
        }
    }
    
    function removeAllRotation(element){
        for(var i=0;i<360;i=i+5){
            $(element).removeClass("rotate"+i);
        }
    }
    
    
    // ========================================================================
    // Global variables
    // ========================================================================
    var nSteps = 3;
    var currentStep = 0;
    var statuses = [];
    
    // ========================================================================
    // Gui initialization
    // ========================================================================
    $('.piece').each(function () {
        var pieceId = $(this).attr('id');
        var pieceStatuses = [];
        for (var i=0;i<nSteps;i++){
            var currentStatus = [];
            currentStatus['top'] = 100;
            currentStatus['left'] = 100;
            currentStatus['rotation'] = 0;
            pieceStatuses[i] = currentStatus;
        }
        //statuses[pieceId] = 0;
        statuses[pieceId] = pieceStatuses;
    });
    $('.piece').draggable();
    $('.messages').draggable();
    $('#message1').empty().append(getWelcomeMessage());
    updatePiecesDisposition();
    //updateConnectionPoints();
    checkConnect();
    $('#message3').empty().append(getStatusesString());

    
    // ========================================================================
    // Update UI
    // ========================================================================
    function updatePiecesDisposition(){
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            removeAllRotation(this);
            $(this).offset({top:statuses[pieceId][currentStep]['top'],left:statuses[pieceId][currentStep]['left']});
            $(this).addClass("rotate"+statuses[pieceId][currentStep]['rotation'] );
        });
     }
    
    
    
    function getWelcomeMessage(){
        var welcomeMessage = "";
        welcomeMessage += "================================== (-)\n";
        welcomeMessage += "=   Keyframes Animation Studio   =\n";
        welcomeMessage += "==================================\n";
        welcomeMessage += "=                                =\n";
        welcomeMessage += "= nSteps      :" + pad("   ",nSteps,true) + "       <a class=\"commands lessSteps\">(-)</a> <a class=\"commands moreSteps\">(+)</a> =\n";
        welcomeMessage += "= currentStep :" + pad("   ",currentStep,true) + "       <a class=\"commands prevStep\">(-)</a> <a class=\"commands nextStep\">(+)</a> =\n";
        welcomeMessage += "=                                =\n";
        welcomeMessage += "=  <a class=\"commands\" >copyprev</a> <a class=\"commands\" >deletecurr</a> <a class=\"commands\" >copynext</a>  =\n";
        welcomeMessage += "=   <a class=\"commands\" >save</a> <a class=\"commands\" >discard</a> <a class=\"commands\">export</a> <a class=\"commands\">import</a>   =\n";
        welcomeMessage += "=                                =\n";
        welcomeMessage += "==================================\n";
        welcomeMessage += "=                                =\n";
        welcomeMessage += "= Tip1: move items with mouse    =\n";
        welcomeMessage += "= Tip2: use wheel for rotation   =\n";
        welcomeMessage += "= Version 0.0.1 (in development) =\n";
        welcomeMessage += "=                                =\n";
        welcomeMessage += "=== by <a href=\"http://www.develost.com\">develost.com</a> ==============";
        return welcomeMessage;
    }

    function updateMessageElement(element){
        var pieceId = $(element).attr('id');
        var offset  = $(element).offset();
        var message = "";

        message += "==================================\n";

        message += "=   Current Piece                =\n";
        message += "==================================\n";
        message += "=                                =\n";
        message += "= PieceId  : " + pad("             ",pieceId) + "       =\n";
        message += "= Top      : " + pad("     ",Math.round(offset.top),true) + " px            =\n";
        message += "= Left     : " + pad("     ",Math.round(offset.left),true) + " px            =\n";
        message += "= Rotation : " + pad("     ",statuses[pieceId][currentStep]['rotation'],true) + " deg           =\n";
        message += "=                                =\n";
        message += "==================================\n";
        message += "=   Current Connections          =\n";
        message += "==================================\n";
        message += "=                                =\n";

        statuses[pieceId][currentStep]['top'] = offset.top
        statuses[pieceId][currentStep]['left'] = offset.left


        $(element).children('.conn').each(function () {
            var connId = $(this).attr('id');    
            var offset  = $(this).offset();
            message += "= ConnId   : " + pad("             ",connId) + "       =\n";
            message += "= Top      : " + pad("     ",Math.round(offset.top),true) + " px            =\n";
            message += "= Left     : " + pad("     ",Math.round(offset.left),true) + " px            =\n";
            message += "=                                =\n";
        });
        message += "=== by ";
        $('#message1').empty().append(message + "<a href=\"http://www.develost.com\">develost.com</a> ==============");
        $('#message3').empty().append(getStatusesString());
    }
    
    // ========================================================================
    // Methods for pieces
    // ========================================================================
    function checkConnect(){
        $('.conn').removeClass("conn-near conn-exact conn-same").addClass("conn-disconnected");    
        $('.conn').each(function () {
            var currentTop = $(this).offset().top;
            var currentLeft = $(this).offset().left;
            var currentId = $(this).attr('id');
            var currentConn = this;
            $('.conn').each(function () {
                var testTop = $(this).offset().top;
                var testLeft = $(this).offset().left;
                var testId = $(this).attr('id');
                // this is 15 - 5 - 1 pixel
                if  (( Math.abs(testTop-currentTop) < 15) &&  ( Math.abs(testLeft-currentLeft) < 15 ) && ( currentId != testId )){
                    $(currentConn).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-near");
                    $(this).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-near");
                }
                if  (( Math.abs(testTop-currentTop) < 5) &&  ( Math.abs(testLeft-currentLeft) < 5 ) && ( currentId != testId )){
                    $(currentConn).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-exact");
                    $(this).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-exact");
                }
                if  (( Math.abs(testTop-currentTop) < 1) &&  ( Math.abs(testLeft-currentLeft) < 1 ) && ( currentId != testId )){
                    $(currentConn).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-same");
                    $(this).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-same");
                }
            });
        });
    }    
   
    // debug method
    function updateConnectionPoints(){
        var message = "";
        $('.conn').each(function () {
            var connId = $(this).attr('id');    
            var offset  = $(this).offset();
            message += "ConnId: " + connId + "\n";
            message += "Top: " + offset.top + "px\n";
            message += "Left: " + offset.left + "px\n";
            message += "-----------------\n";
        });
        $('#message2').text(message);
    }

    function connectNear(element){
        var done = false // hack for multiple connections on same position
        $(element).children('.conn').each(function () {
            var currentTop = $(this).offset().top;
            var currentLeft = $(this).offset().left;
            var currentId = $(this).attr('id');
            var currentConn = this;
            $('.conn').each(function () {
                var testTop = $(this).offset().top;
                var testLeft = $(this).offset().left;
                var testId = $(this).attr('id');
                // this is 15 pixel
                if  (( Math.abs(testTop-currentTop) < 15) &&  ( Math.abs(testLeft-currentLeft) < 15 ) && ( currentId != testId )){
                    var parentOffset = $(currentConn).parent().offset();
                    var deltaTop = currentTop-testTop;
                    var deltaLeft = currentLeft-testLeft;
                    if (!done) {
                        done = true;  // hack for multiple connections on same position
                        $(currentConn).parent().offset({top: parentOffset.top-deltaTop , left:parentOffset.left-deltaLeft});
                    }
                    done = true; // hack for multiple connections on same position
                }
            });            
        });
    }
    
    function rotate(element,event){
        var pieceId = $(element).attr('id');
        //var currentRotation = statuses[pieceId];
        var currentRotation = statuses[pieceId][currentStep]['rotation'];
        var nextRotation = 0;
        var statusesInverted = 0;
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            nextRotation = currentRotation + 5;
            if (nextRotation >= 360) {nextRotation = 0;}
        } else {
            nextRotation = currentRotation - 5;
            if (nextRotation < 0) {nextRotation = 355;}
        }
        var currentRotationInverted = 360-currentRotation;
        var nextRotationInverted = 360-nextRotation;
        $(element).removeClass("rotate"+currentRotation).addClass("rotate"+nextRotation );
        $(element).children().removeClass("rotate"+currentRotationInverted).addClass("rotate"+nextRotationInverted );
        statuses[pieceId][currentStep]['rotation'] = nextRotation;    
    }
    
    function getStatusesString(){
        var statusesMsg = "";
        for (var pieceId in statuses) {
            statusesMsg += "pieceId: "  + pieceId + "\n";
            for (var step in statuses[pieceId]){
                statusesMsg += "    step: "  + step + "\n";
                for (var item in statuses[pieceId][step]){
                    statusesMsg += "        "+ item+": "  + statuses[pieceId][step][item] + "\n";
                }
            }
        }
        return statusesMsg;
    }
    
    
    
    // ========================================================================
    // Event binding
    // ========================================================================
    $('body').bind( "click", function( event) {
        $('#message1').empty().append(getWelcomeMessage());
    });    
    
    $( document ).delegate( "a.lessSteps", "click", function() {
        if ( nSteps == 3 ) {return;};
        if (confirm("This will delete permanently step number " + nSteps + ". \nContinue?")){
            nSteps--;
        }
        $('#message1').empty().append(getWelcomeMessage());
        return false;
    });

    $( document ).delegate( "a.moreSteps", "click", function() {
        nSteps++;
        $('#message1').empty().append(getWelcomeMessage());
        return false;
    });
    
    $( document ).delegate( "a.prevStep", "click", function() {
        currentStep--;
        if (currentStep < 0 ){currentStep = nSteps-1;}
        $('#message1').empty().append(getWelcomeMessage());
        updatePiecesDisposition();
        //updateConnectionPoints();
        // $('#message3').empty().append(getStatusesString());
        return false;
    });    

    $( document ).delegate( "a.nextStep", "click", function() {
        currentStep++;
        if (currentStep >= nSteps ){currentStep = 0;}
        $('#message1').empty().append(getWelcomeMessage());
        updatePiecesDisposition();
        //updateConnectionPoints();
         //$('#message3').empty().append(getStatusesString());
        return false;
    });
    
    $('.piece').bind( "dragstart drag click", function( event) {
        updateMessageElement(this);
        checkConnect();
        //updateConnectionPoints();
        event.stopPropagation();
    });
    
    $('.piece').bind( "dragstop", function( event) {
        updateMessageElement(this);
        connectNear(this);
        checkConnect();
        
        $('#message3').empty().append(getStatusesString());
        //updateConnectionPoints();
        event.stopPropagation();
    });    
    
    $('.piece').bind('mousewheel DOMMouseScroll', function(event){
        rotate(this,event);
        updateMessageElement(this);
        checkConnect();
        event.stopPropagation();
        //updateConnectionPoints();
        $('#message3').empty().append(getStatusesString());
    });
    
} 
