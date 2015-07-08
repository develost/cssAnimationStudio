var keyframesAnimationStudio = (function() {
    var nSteps = 3;
    var currentStep = 0;
    var mainWindowStatus = 0;
    var piceWindowStatus = 0;
    var statuses = [];
    var dragInitialTop = 0;
    var dragInitialLeft = 0;
    var clickedPieceId = "";
    var pieceCounter = 0;
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Windows content
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var renderMainWindow = function(){
        var content = "";
        if (mainWindowStatus == 0) {
            content += "==============================<a class=\"commands switchMainWindow\">(+)</a>==\n";
            content += "= Keyframes Animation Studio      =\n";
            content += "===================================\n";
            content += "=                                 =\n";
            content += "= Tip1: move items with mouse     =\n";
            content += "= Tip2: use wheel for rotation    =\n";
            content += "= Tip3: drag and drop everything  =\n";
            content += "= Ver : 0.2.1                     =\n";
            content += "=                                 =\n";
            content += "=== by <a target=\"_blank\" href=\"http://www.develost.com\">develost.com</a> ===============";
        }else{
            content += "==============================<a class=\"commands switchMainWindow\">(-)</a>==\n";
            content += "= Keyframes Animation Studio      =\n";
            content += "===================================\n";
            content += "=                                 =\n";
            content += "= nSteps      :" + pad("   ",nSteps,true) + "        <a class=\"commands lessSteps\">(-)</a> <a class=\"commands moreSteps\">(+)</a> =\n";
            content += "= currentStep :" + pad("   ",currentStep+1,true) + "        <a class=\"commands prevStep\">(-)</a> <a class=\"commands nextStep\">(+)</a> =\n";
            content += "=                                 =\n";
            content += "= <a class=\"commands\" >copyprev</a> <a class=\"commands\" >deletecurr</a> <a class=\"commands\" >copynext</a>    =\n";
            content += "= <a class=\"commands\" >save</a> <a class=\"commands\" >load</a>   =\n";
            content += "=                                 =\n";
            content += "===================================\n";
            content += "=                                 =\n";
            content += "= <a class=\"commands\">like</a> <a class=\"commands\">tweet</a> <a class=\"commands\">about me</a>            =\n";
            content += "=                                 =\n";
            content += "=== by <a  target=\"_blank\" href=\"http://www.develost.com\">develost.com</a> ===============";
        }
        $('#mainWindow').empty().append(content);
    }

    var renderPieceWindow = function(element){
        var content = "";
        if ((element === null) && (clickedPieceId === "")){
            if (piceWindowStatus == 0) {
                content += "\n";
                content += "==============================<a class=\"commands switchPieceWindow\">(+)</a>==\n";
                content += "= No pieces selected              =\n";
                content += "===================================\n";
            }else{
                content += "\n";
                content += "==============================<a class=\"commands switchPieceWindow\">(-)</a>==\n";
                content += "= No pieces selected              =\n";
                content += "===================================\n";
                content += "=                                 =\n";
                content += "= Top      :           px         =\n";
                content += "= Left     :           px         =\n";
                content += "= Width    :           px         =\n";
                content += "= Height   :           px         =\n";
                content += "= Rotation :           deg        =\n";
                content += "=                                 =\n";
                content += "= <a class=\"commands createNew\">createNew</a>                       =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }
        } else{
            var pieceId = null;
            if (element === null){
                pieceId = clickedPieceId;
            }else{
                pieceId = $(element).attr('id');
            }
            
            if (piceWindowStatus == 0) {        
                content += "\n";
                content += "==============================<a class=\"commands switchPieceWindow\">(+)</a>==\n";
                content += "= Piece "+pad("             ",pieceId) + "             =\n";
                content += "===================================\n";
            }else{
                content += "\n";
                content += "==============================<a class=\"commands switchPieceWindow\">(-)</a>==\n";
                content += "= Piece "+pad("             ",pieceId) + "             =\n";
                content += "===================================\n";
                content += "=                                 =\n";
                content += "= Top      :  " + pad("        ",statuses[pieceId][currentStep]['top'].toFixed(2),true) + " px         =\n";
                content += "= Left     :  " + pad("        ",statuses[pieceId][currentStep]['left'].toFixed(2),true) + " px         =\n";
                content += "= Width    :  " + pad("        ",statuses[pieceId][currentStep]['width'].toFixed(2),true) + " px         =\n";
                content += "= Height   :  " + pad("        ",statuses[pieceId][currentStep]['height'].toFixed(2),true) + " px         =\n";
                content += "= Rotation :  " + pad("        ",statuses[pieceId][currentStep]['rotation'].toFixed(2),true) + " deg        =\n";
                content += "=                                 =\n";
                content += "= <a class=\"commands deletePiece\">delete</a>                          =\n";
                content += "=                                 =\n";
                content += "===================================\n";
                
            }
        }
        $('#pieceWindow').empty().append(content);
    }

    var switchMainWindow = function(){
        mainWindowStatus = (mainWindowStatus+1)%2;
        renderMainWindow();
    }
    
    var switchPieceWindow = function(){
        piceWindowStatus = (piceWindowStatus+1)%2;
        renderPieceWindow(null);
    }    
    
    
    
    
    
    var pad = function (pad, str, padLeft) {
        if (typeof str === 'undefined') return pad;
        if (padLeft) {
            return (pad + str).slice(-pad.length);
        } else {
            return (str + pad).substring(0, pad.length);
       }
    }
    

    
    
    
    var initializeStatuses = function(){
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            var pieceStatuses = [];
            for (var i=0;i<nSteps;i++){
                var currentStatus = [];
                currentStatus['top'] = 100;
                currentStatus['left'] = 100;
                currentStatus['width'] = 400;
                currentStatus['height'] = 200;
                currentStatus['rotation'] = 0;
                pieceStatuses[i] = currentStatus;
            }
            statuses[pieceId] = pieceStatuses;
        });
    }

    
    var rotatePiece = function(element,event){
        if (element === null){
            return;
        }else{
            var pieceId = $(element).attr('id');
            var deltaRotation = 0;
            if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                deltaRotation = 5;
            }else{
                deltaRotation = -5;
            }
            var currentRotation = statuses[pieceId][currentStep]['rotation'];
            var nextRotation = currentRotation + deltaRotation;
            if (nextRotation < 0){
                nextRotation = 355;
            }
            if (nextRotation >= 360){
                nextRotation = 0;
            }
            statuses[pieceId][currentStep]['rotation'] = nextRotation;
            rerenderPiece(element);
        }
    }
    
   var removeAllRotation = function(element){
        for(var i=0;i<360;i=i+5){
            $(element).removeClass("rotate"+i);
        }
    }
    
    
    var rerenderPiece = function(element){
        var pieceId = $(element).attr('id');
        var newTop = statuses[pieceId][currentStep]['top'];
        var newLeft = statuses[pieceId][currentStep]['left'];
        var newRotation = statuses[pieceId][currentStep]['rotation'];
        var newRotationInverted = 360 - newRotation;
        removeAllRotation(element);
        $(element).offset({top:newTop,left:newLeft});
        $(element).children().each(function () {removeAllRotation(this);});
        $(element).addClass("rotate"+newRotation);
        $(element).children().addClass("rotate"+newRotationInverted );
    }
    
    var traslatePiece = function(element,event){
        var pieceId = $(element).attr('id');
        removeAllRotation(element);
        var currentOffset = $(element).offset();
        statuses[pieceId][currentStep]['top'] = /*Math.round(*/currentOffset.top/*)*/;
        statuses[pieceId][currentStep]['left'] = /*Math.round(*/currentOffset.left/*)*/;
        $(element).addClass("rotate"+statuses[pieceId][currentStep]['rotation']);
        rerenderPiece(element);
    }
    
    var clickPiece = function(element){
        $('.piece').removeClass("selectedPiece");
        if (element === null){
            clickedPieceId = "";
        }else{
            var pieceId = $(element).attr('id');
            if (clickedPieceId === pieceId){
                clickedPieceId = "";
            }else{
                clickedPieceId = pieceId;
                $(element).addClass("selectedPiece");
            }
            
        }
    }
    
    
    var checkConnect = function(){
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
                // this is 15 - 5 - 1.5 pixel
                if  (( Math.abs(testTop-currentTop) < 15) &&  ( Math.abs(testLeft-currentLeft) < 15 ) && ( currentId != testId )){
                    $(currentConn).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-near");
                    $(this).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-near");
                }
                if  (( Math.abs(testTop-currentTop) < 5) &&  ( Math.abs(testLeft-currentLeft) < 5 ) && ( currentId != testId )){
                    $(currentConn).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-exact");
                    $(this).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-exact");
                }
                if  (( Math.abs(testTop-currentTop) <= 2) &&  ( Math.abs(testLeft-currentLeft) <= 2 ) && ( currentId != testId )){
                    $(currentConn).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-same");
                    $(this).removeClass("conn-near conn-exact conn-same conn-disconnected").addClass("conn-same");
                }
            });
        });    
    }
    
    var connectNear = function(element){
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
                        var pieceId = $(element).attr('id');
                        statuses[pieceId][currentStep]['top'] = /*Math.round(*/statuses[pieceId][currentStep]['top']-deltaTop/*)*/;
                        statuses[pieceId][currentStep]['left'] = /*Math.round(*/statuses[pieceId][currentStep]['left']-deltaLeft/*)*/;
                    }
                    done = true; // hack for multiple connections on same position
                }
            });            
        });
    }
    
    var rerenderAllPieces = function(){
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            removeAllRotation(this);
            $(this).offset({top:statuses[pieceId][currentStep]['top'],left:statuses[pieceId][currentStep]['left']});
            $(this).addClass("rotate"+statuses[pieceId][currentStep]['rotation'] );
        });
    }
    
    var deletePiece = function(){
        if (clickedPieceId === ""){
            // nothing to do, should never happen
        }else{
            delete statuses[clickedPieceId];
            $('#'+clickedPieceId).remove();
            clickedPieceId = "";
        }
    }

    var start = function(){
        $('.windows').draggable();
        $('.piece').draggable();
        renderMainWindow();
        renderPieceWindow(null);
        initializeStatuses();
        rerenderAllPieces();
        checkConnect();
        
        $( document ).delegate( "a.switchMainWindow", "click", function() {
            switchMainWindow();
            return false;
        });
        $( document ).delegate( "a.switchPieceWindow", "click", function() {
            switchPieceWindow();
            return false;
        });
        
        $('.piece').bind( "mouseover", function(event) {
            renderPieceWindow(this);
            return false;
        });
        $('.piece').bind( "mouseout", function(event) {
            renderPieceWindow(null);
            return false;
        });          
        $('.piece').bind('mousewheel DOMMouseScroll', function(event){
            rotatePiece(this,event);
            checkConnect();
            renderPieceWindow(this);
            return false;
        });

        $('.piece').bind( "click", function(event) {
            clickPiece(this);
            renderPieceWindow(this);
            return false;
        });        
        
        $('.piece').bind( "drag", function(event) {
            traslatePiece(this);
            checkConnect();
            renderPieceWindow(this);
        });
        
        $('.piece').bind( "dragstop", function(event) {
            connectNear(this);
            rerenderPiece(this);
            checkConnect();
            renderPieceWindow(this);
        });

        $( document ).delegate( "a.moreSteps", "click", function() {
            nSteps++;
            renderMainWindow();
            return false;
        });
        
        $( document ).delegate( "a.deletePiece", "click", function() {
            deletePiece();
            renderPieceWindow(null);
            return false;
        });
        
        $( document ).delegate( "a.lessSteps", "click", function() {
            if ( nSteps == 3 ) {return;};
            if (confirm("This will delete permanently step number " + nSteps + ". \nContinue?")){
                nSteps--;
            }
            renderMainWindow();
            return false;
        });        

        $( document ).delegate( "a.prevStep", "click", function() {
            currentStep--;
            if (currentStep < 0 ){currentStep = nSteps-1;}
            renderMainWindow();
            rerenderAllPieces();
            checkConnect();
            return false;
        });    

        $( document ).delegate( "a.nextStep", "click", function() {
            currentStep++;
            if (currentStep >= nSteps ){currentStep = 0;}
            renderMainWindow();
            rerenderAllPieces();
            checkConnect();
            return false;
        });

    };
    return {start: start};
}());

$(init);
function init() {
    keyframesAnimationStudio.start();
} 
