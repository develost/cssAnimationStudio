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
    
    // ========================================================================
    // Global variables
    // ========================================================================
    var nSteps = 3;
    var currentStep = 1;
    var status = [];
    
    // ========================================================================
    // Gui initialization
    // ========================================================================
    $('.piece').each(function () {
        var pieceId = $(this).attr('id');
        status[pieceId] = 0;
    });
    $('.piece').draggable();
    $('.messages').draggable();
    $('#message1').empty().append(getWelcomeMessage());
    checkConnect();
    
    // ========================================================================
    // Update UI
    // ========================================================================
    function getWelcomeMessage(){
        var welcomeMessage = "";
        welcomeMessage += "==================================\n";
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
        message += "= Rotation : " + pad("     ",status[pieceId],true) + " deg           =\n";
        message += "=                                =\n";
        message += "==================================\n";
        message += "=   Current Connections          =\n";
        message += "==================================\n";
        message += "=                                =\n";
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
                    $(currentConn).parent().offset({top: parentOffset.top-deltaTop , left:parentOffset.left-deltaLeft});
                }
            });            
        });
    }
    
    function rotate(element,event){
        var pieceId = $(element).attr('id');
        var currentStatus = status[pieceId];
        var nextStatus = 0;
        var statusInverted = 0;
        if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            nextStatus = currentStatus + 5;
            if (nextStatus >= 360) {nextStatus = 0;}
        } else {
            nextStatus = currentStatus - 5;
            if (nextStatus < 0) {nextStatus = 355;}
        }
        var currentStatusInverted = 360-currentStatus;
        var nextStatusInverted = 360-nextStatus;
        $(element).removeClass("rotate"+currentStatus).addClass("rotate"+nextStatus );
        $(element).children().removeClass("rotate"+currentStatusInverted).addClass("rotate"+nextStatusInverted );
        status[pieceId] = nextStatus;    
    }
    
    // ========================================================================
    // Event binding
    // ========================================================================
    $('body').bind( "click", function( event) {
        $('#message1').empty().append(getWelcomeMessage());
    });    
    
    $( document ).delegate( "a.lessSteps", "click", function() {
        if ( nSteps == 1 ) {return;};
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
        if (currentStep < 1 ){currentStep = nSteps;}
        $('#message1').empty().append(getWelcomeMessage());
        return false;
    });    

    $( document ).delegate( "a.nextStep", "click", function() {
        currentStep++;
        if (currentStep > nSteps ){currentStep = 1;}
        $('#message1').empty().append(getWelcomeMessage());
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
        //updateConnectionPoints();
        event.stopPropagation();
    });    
    
    $('.piece').bind('mousewheel DOMMouseScroll', function(event){
        rotate(this,event);
        updateMessageElement(this);
        checkConnect();
        event.stopPropagation();
        //updateConnectionPoints();
    });
    
} 
