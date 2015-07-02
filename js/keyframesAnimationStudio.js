
$(init);

function init() {

function pad(pad, str, padLeft) {
  if (typeof str === 'undefined') 
    return pad;
  if (padLeft) {
    return (pad + str).slice(-pad.length);
  } else {
    return (str + pad).substring(0, pad.length);
  }
}


    var status = [];
    
    $('.piece').each(function () {
        var pieceId = $(this).attr('id');
        status[pieceId] = 0;
    });

    $('.piece').draggable();
    $('.messages').draggable();
    
    var welcomeMessage = "";
    welcomeMessage += "==================================\n";
    welcomeMessage += "=   Keyframes Animation Studio   =\n";
    welcomeMessage += "==================================\n";
    welcomeMessage += "=                                =\n";
    welcomeMessage += "= This is an ui demo             =\n";
    welcomeMessage += "= Software in development        =\n";
    welcomeMessage += "=                                =\n";
    welcomeMessage += "==================================\n";
    welcomeMessage += "=                                =\n";
    welcomeMessage += "= Drag and drop items with mouse =\n";
    welcomeMessage += "= Use Mousewheel for rotation    =\n";
    welcomeMessage += "=                                =\n";
    welcomeMessage += "=== by ";
    
    //$('#message1').text(welcomeMessage);
    $('#message1').empty().append(welcomeMessage + "<a href=\"http://www.develost.com\">develost.com</a> ==============");
    
    function updateMessageElement(element){
        var pieceId = $(element).attr('id');
        var offset  = $(element).offset();
        var message = "";
        message += "==================================\n";
        message += "=   Current Piece                =\n";
        message += "==================================\n";
        message += "=                                =\n";
        message += "= PieceId  : " + pad("             ",pieceId) + "       =\n";
        message += "= Top      : " + pad("     ",Math.round(offset.top)) + " px            =\n";
        message += "= Left     : " + pad("     ",Math.round(offset.left)) + " px            =\n";
        message += "= Rotation : " + pad("     ",status[pieceId]) + " deg           =\n";
        message += "=                                =\n";
        message += "==================================\n";
        message += "=   Current Connections          =\n";
        message += "==================================\n";
        message += "=                                =\n";
        $(element).children('.conn').each(function () {
            var connId = $(this).attr('id');    
            var offset  = $(this).offset();
            message += "= ConnId   : " + pad("             ",connId) + "       =\n";
            message += "= Top      : " + pad("     ",Math.round(offset.top)) + " px            =\n";
            message += "= Left     : " + pad("     ",Math.round(offset.left)) + " px            =\n";
            message += "=                                =\n";
        });
        message += "=== by ";
        //$('#message1').text(message);
        $('#message1').empty().append(message + "<a href=\"http://www.develost.com\">develost.com</a> ==============");
        
    }
    
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
    
    $('.piece').bind( "dragstart drag click", function( event) {
        updateMessageElement(this);
        checkConnect();
        //This is for debug only
        //updateConnectionPoints();
    });
    
    $('.piece').bind( "dragstop", function( event) {
        updateMessageElement(this);
        
        $(this).children('.conn').each(function () {
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
                    
                    //$(currentConn).removeClass("conn-disconnected").addClass("conn-connected");
                    //$(this).removeClass("conn-disconnected").addClass("conn-connected");
                }
            });            
        });
        checkConnect();
        //This is for debug only
        //updateConnectionPoints();
    });    
    
    $('.piece').bind('mousewheel DOMMouseScroll', function(event){
        var pieceId = $(this).attr('id');
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
        $(this).removeClass("rotate"+currentStatus).addClass("rotate"+nextStatus );
        
        $(this).children().removeClass("rotate"+currentStatusInverted).addClass("rotate"+nextStatusInverted );
        
        status[pieceId] = nextStatus;
        
        updateMessageElement(this);
        checkConnect();
        //This is for debug only
        //updateConnectionPoints();
        
    });
    
} 
