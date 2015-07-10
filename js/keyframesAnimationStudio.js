var keyframesAnimationStudio = (function() {
    var nSteps = 3;
    var currentStep = 0;
    var mainWindowStatus = -1;
    var piceWindowStatus = 0;
    var connectionsWindowStatus = 0;
    var statuses = [];
    var dragInitialTop = 0;
    var dragInitialLeft = 0;
    var clickedPieceId = "";
    var pieceCounter = 10;
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Windows content
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var renderMainWindow = function(){
        var content = "";
        
        if (mainWindowStatus<0){
            content += "==<a class=\"commands switchMainWindow\">(x)</a>==============================\n";
            content += "=                                 =\n";
            content += "= Keyframes Animation Studio      =\n";
            content += "=                                 =\n";
            content += "===================================\n";
            content += "=                                 =\n";
            content += "= Tip1: move items with mouse     =\n";
            content += "= Tip2: use wheel for rotation    =\n";
            content += "= Tip3: drag and drop everything  =\n";
            content += "= Tip4: click on items to select  =\n";
            content += "= Load / save unimplemented yet   =\n";
            content += "=                                 =\n";
        }else if (mainWindowStatus == 0){
            content += "==<a class=\"commands switchMainWindow\">(+)</a>==============================\n";
            content += "=                                 =\n";
            content += "= Keyframes Animation Studio      =\n";
            content += "=                                 =\n";
        }else{
            content += "==<a class=\"commands switchMainWindow\">(-)</a>==============================\n";
            content += "=                                 =\n";
            content += "= Keyframes Animation Studio      =\n";
            content += "=                                 =\n";
            content += "===================================\n";
            content += "=                                 =\n";
            content += "= nSteps      :" + pad("   ",nSteps,true) + "        <a class=\"commands lessSteps\">(-)</a> <a class=\"commands moreSteps\">(+)</a> =\n";
            content += "= currentStep :" + pad("   ",currentStep+1,true) + "        <a class=\"commands prevStep\">(-)</a> <a class=\"commands nextStep\">(+)</a> =\n";
            content += "=                                 =\n";
            content += "= <a class=\"commands help\">help</a> <a class=\"commands twitter popup\" href=\"http://twitter.com/share?text=%40develost_com%20"+ encodeURI(window.location.href) +"\">tweet</a> <a class=\"commands save\" >save</a> <a class=\"commands load\" >load</a>            =\n";
            content += "=                                 =\n";
        }
        content += "=== 0.2.1 by <a  target=\"_blank\" href=\"http://www.develost.com\">develost.com</a> =========";
        $('#mainWindow').empty().append(content);
    }

    var renderPieceWindow = function(element){
        var content = "";
        if ((element === null) && (clickedPieceId === "")){
            if (piceWindowStatus == 0) {
                content += "\n";
                content += "==<a class=\"commands switchPieceWindow\">(+)</a>==============================\n";
                content += "=                                 =\n";
                content += "= No pieces selected              =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }else{
                content += "\n";
                content += "==<a class=\"commands switchPieceWindow\">(-)</a>==============================\n";
                content += "=                                 =\n";
                content += "= No pieces selected              =\n";
                content += "=                                 =\n";
                content += "===================================\n";
                content += "=                                 =\n";
                content += "= Top      :           px         =\n";
                content += "= Left     :           px         =\n";
                content += "= Width    :           px         =\n";
                content += "= Height   :           px         =\n";
                content += "= Rotation :           deg        =\n";
                content += "=                                 =\n";
                content += "= <a class=\"commands createPiece\">createNew</a>                       =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }
        } else{
            var pieceId = null;
            var mouseStatus = "";
            if (element === null){
                pieceId = clickedPieceId;
                mouseStatus = "(selected)";
            }else{
                pieceId = $(element).attr('id');
                mouseStatus = "   (hover)";
            }
            
            if (piceWindowStatus == 0) {        
                content += "\n";
                content += "==<a class=\"commands switchPieceWindow\">(+)</a>==============================\n";
                content += "=                                 =\n";
                content += "= Piece "+pad("             ",pieceId) + "  " + mouseStatus + " =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }else{
                content += "\n";
                content += "==<a class=\"commands switchPieceWindow\">(-)</a>==============================\n";
                content += "=                                 =\n";
                content += "= Piece "+pad("             ",pieceId) + "  " + mouseStatus + " =\n";
                content += "=                                 =\n";
                content += "===================================\n";
                content += "=                                 =\n";
                content += "= Top      :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"top\" value=\"" + statuses[pieceId][currentStep]['top'].toFixed(2) + "\"> px         =\n";
                content += "= Left     :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"left\" value=\"" + statuses[pieceId][currentStep]['left'].toFixed(2) + "\"> px         =\n";
                content += "= Width    :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"width\" value=\"" + statuses[pieceId][currentStep]['width'].toFixed(2) + "\"> px         =\n";
                content += "= Height   :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"height\" value=\"" + statuses[pieceId][currentStep]['height'].toFixed(2) + "\"> px         =\n";
                //content += "= Top      :  " + pad("        ",statuses[pieceId][currentStep]['top'].toFixed(2),true) + " px         =\n";
                //content += "= Left     :  " + pad("        ",statuses[pieceId][currentStep]['left'].toFixed(2),true) + " px         =\n";
                //content += "= Width    :  " + pad("        ",statuses[pieceId][currentStep]['width'].toFixed(2),true) + " px         =\n";
                //content += "= Height   :  " + pad("        ",statuses[pieceId][currentStep]['height'].toFixed(2),true) + " px         =\n";
                content += "= Rotation :  " + pad("        ",statuses[pieceId][currentStep]['rotation'].toFixed(2),true) + " deg        =\n";
                content += "=                                 =\n";
                content += "= <a class=\"commands deletePiece\">delete</a>                          =\n";
                content += "=                                 =\n";
                content += "===================================\n";
                
            }
        }
        $('#pieceWindow').empty().append(content);
    }

    var renderConnectionsWindow = function(element){
        var content = "";
        
        if (connectionsWindowStatus == 0) {
            content += "\n";
            content += "==<a class=\"commands switchConnectionsWindow\">(+)</a>==============================\n";
            content += "=                                 =\n";
            content += "= No connection on current piece  =\n";
            content += "=                                 =\n";
            content += "===================================\n";
        }else{
            content += "\n";
            content += "==<a class=\"commands switchConnectionsWindow\">(-)</a>==============================\n";
            content += "=                                 =\n";
            content += "= No connection on current piece  =\n";
            content += "=                                 =\n";
            content += "===================================\n";
            content += "=                                 =\n";
            content += "= Feature in development.         =\n";
            content += "= Check back soon.                =\n";
            content += "=                                 =\n";
            content += "===================================\n";
        }
        $('#connectionsWindow').empty().append(content);
    }
    
    
    var switchMainWindow = function(){
        mainWindowStatus = (mainWindowStatus+1)%2;
        renderMainWindow();
    }
    
    var switchPieceWindow = function(){
        piceWindowStatus = (piceWindowStatus+1)%2;
        renderPieceWindow(null);
    }    
    
    var switchConnectionsWindow = function(){
        connectionsWindowStatus = (connectionsWindowStatus+1)%2;
        renderConnectionsWindow(null);
    }    
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Utility functions
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var pad = function (pad, str, padLeft) {
        if (typeof str === 'undefined') return pad;
        if (padLeft) {
            return (pad + str).slice(-pad.length);
        } else {
            return (str + pad).substring(0, pad.length);
       }
    }
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Functions for pieces
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
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
            $(this).width(statuses[pieceId][currentStep]['width']);
            $(this).height(statuses[pieceId][currentStep]['height']);
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

    var createPiece = function(){
        pieceCounter++;
        var pieceId = "piece" + (pieceCounter);
        $("#content").append("<div id=\"" + pieceId + "\" class=\"piece\"></div>");
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
        $('.piece').draggable();
        rerenderAllPieces();
    }
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Functions for steps
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var createStep = function(){
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            var pieceStatuses = statuses[pieceId];
            var newStatuses = [];
            newStatuses['top'] = pieceStatuses[currentStep]['top'];
            newStatuses['left'] = pieceStatuses[currentStep]['left'];
            newStatuses['width'] = pieceStatuses[currentStep]['width'];
            newStatuses['height'] = pieceStatuses[currentStep]['height'];
            newStatuses['rotation'] = pieceStatuses[currentStep]['rotation'];
            pieceStatuses.splice(currentStep,0,newStatuses);
            statuses[pieceId] = pieceStatuses;
        });
        nSteps++;
    }
    
    var deleteStep = function(){
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            var pieceStatuses = statuses[pieceId];
            pieceStatuses.splice(currentStep,1);
            statuses[pieceId] = pieceStatuses;
        });
        nSteps--;
    }    
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Initialization
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var initializeDemoStatuses = function(){
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
    
    var start = function(){
        $('.windows').draggable();
        $('.piece').draggable();
        renderMainWindow();
        renderPieceWindow(null);
        renderConnectionsWindow(null);
        initializeDemoStatuses();
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
        
        $( document ).delegate( "a.switchConnectionsWindow", "click", function() {
            switchConnectionsWindow();
            return false;
        });        
        
        $( document ).delegate( "div.piece", "mouseover", function(event) {
            renderPieceWindow(this);
            return false;
        });

        $( document ).delegate( "div.piece", "mouseout", function(event) {
            renderPieceWindow(null);
            return false;
        });          
        
        $( document ).delegate( "div.piece", "mousewheel DOMMouseScroll", function(event) {
            rotatePiece(this,event);
            checkConnect();
            renderPieceWindow(this);
            return false;
        });        
        
        $( document ).delegate( "div.piece", "click", function(event) {
            clickPiece(this);
            renderPieceWindow(this);
            return false;
        });        
        
        $( document ).delegate( "div.piece", "drag", function(event) {
            traslatePiece(this);
            checkConnect();
            renderPieceWindow(this);
        });
        
        $( document ).delegate( "div.piece", "dragstop", function(event) {
            connectNear(this);
            rerenderPiece(this);
            checkConnect();
            renderPieceWindow(this);
        });

        
        $( document ).delegate( "a.deletePiece", "click", function() {
            deletePiece();
            renderPieceWindow(null);
            return false;
        });
        
        $( document ).delegate( "a.createPiece", "click", function() {
            createPiece();
            return false;
        });        
        
        $( document ).delegate( "a.moreSteps", "click", function() {
            if (confirm("This will create a new step as a copy of step " + (currentStep+1) + ". \nContinue?")){
                createStep();
                currentStep++;
                if (currentStep >= nSteps ){currentStep = 0;}
                renderMainWindow();
                rerenderAllPieces();
                checkConnect();                
            }
            return false;
        });
        
        $( document ).delegate( "a.lessSteps", "click", function() {
            if ( nSteps == 3 ) {return false;};
            if (confirm("This will delete permanently step number " + (currentStep+1) + ". \nContinue?")){
                deleteStep();
                currentStep++;
                if (currentStep >= nSteps ){currentStep = 0;}
                renderMainWindow();
                rerenderAllPieces();
                checkConnect();                
            }
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
    
    $( document ).delegate( "a.help", "click", function() {
        mainWindowStatus = -1;
        renderMainWindow();
        return false;
    });
    
    $( document ).delegate( "a.save", "click", function() {
        alert("Feature in development.\nCheck back soon.")
        return false;
    });       

    $( document ).delegate( "a.load", "click", function() {
        alert("Feature in development.\nCheck back soon.")
        return false;
    });       

    
    
    $( document ).delegate( "input.currentPiece", "keypress", function(event) {
        if (clickedPieceId === ""){return false;}
        if(event.which === 13){ // enter key
            var currentValueString = $(this).val();
            if (!isNaN(currentValueString)){
                var currentValue = parseFloat(currentValueString);
                var attributeName = $(this).attr('name');
                statuses[clickedPieceId][currentStep][attributeName] = currentValue;
                rerenderAllPieces();
                renderPieceWindow(null);
                checkConnect();
            }
        }
        return true;
    });     
    
    $( document ).delegate( "a.popup", "click", function(event) {
        var width  = 575,
            height = 400,
            left   = ($(window).width()  - width)  / 2,
            top    = ($(window).height() - height) / 2,
            url    = this.href,
            opts   = 'status=1' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
        window.open(url, 'twitter', opts);
        return false;
      });    
    
    
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Public methods
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    return {start: start};
}());

$(init);
function init() {
    keyframesAnimationStudio.start();
} 
