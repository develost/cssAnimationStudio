Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

var keyframesAnimationStudio = (function() {
    var nSteps = 4;
    var currentStep = 0;
    var mainWindowStatus = 0;
    var piceWindowStatus = 0;
    var connectionsWindowStatus = 0;
    var statuses = {};
    var connStatuses = {};
    var dragInitialTop = 0;
    var dragInitialLeft = 0;
    var clickedPieceId = "";
    var pieceCounter = 10;
    var connCounter = 10;
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Windows content
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var renderMainWindow = function(){
        var content = "";
        
        if (mainWindowStatus<0){
            content += "==<a class=\"commands switchMainWindow\">(x)</a>==============================\n";
            content += "=                                 =\n";
            content += "= Keyframes Playground            =\n";
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
            content += "= Keyframes Playground            =\n";
            content += "=                                 =\n";
        }else{
            content += "==<a class=\"commands switchMainWindow\">(-)</a>==============================\n";
            content += "=                                 =\n";
            content += "= Keyframes Playground            =\n";
            content += "=                                 =\n";
            content += "===================================\n";
            content += "=                                 =\n";
            content += "= nSteps      :" + pad("   ",nSteps,true) + "        <a class=\"commands lessSteps\">(-)</a> <a class=\"commands moreSteps\">(+)</a> =\n";
            content += "= currentStep :" + pad("   ",currentStep+1,true) + "        <a class=\"commands prevStep\">(-)</a> <a class=\"commands nextStep\">(+)</a> =\n";
            content += "=                                 =\n";
            content += "= <a class=\"commands help\">help</a> <a class=\"commands twitter popup\" href=\"http://twitter.com/share?text=%40develost_com%20";
            content += "\">tweet</a> <a class=\"commands save\" >save</a> <a class=\"commands load\">load</a>            =\n";
            content += "=                                 =\n";
        }
        content += "=== 0.6.0 by <a  target=\"_blank\" href=\"http://www.develost.com\">develost.com</a> =========";
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
                content += "= Top      :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"top\" value=\"" ;
                content += statuses[pieceId][currentStep]['top'].toFixed(2) + "\"> px         =\n";
                content += "= Left     :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"left\" value=\"" ;
                content += statuses[pieceId][currentStep]['left'].toFixed(2) + "\"> px         =\n";
                content += "= Width    :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"width\" value=\"" ;
                content += statuses[pieceId][currentStep]['width'].toFixed(2) + "\"> px         =\n";
                content += "= Height   :  <input class=\"currentPiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\"height\" value=\"";
                content += statuses[pieceId][currentStep]['height'].toFixed(2) + "\"> px         =\n";
                content += "= Rotation :  " + pad("        ",statuses[pieceId][currentStep]['rotate'].toFixed(2),true) + " deg        =\n";
                content += "=                                 =\n";
                content += "= <a class=\"commands deletePiece\">delete</a>                          =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }
        }
        $('#pieceWindow').empty().append(content);
    }
    
    
    var rerenderAllConnections = function(){
        $('.conn').each(function () {
            var connId = $(this).attr('id');
            var parentId = connStatuses[connId]['parentId'];
            var vPosType = connStatuses[connId]['vPosType'];
            var vPosValue = connStatuses[connId]['vPosValue']; 
            var oPosType =  connStatuses[connId]['oPosType'];
            var oPosValue = connStatuses[connId]['oPosValue'];
            var parent = $(this).parent();
            $(this).remove();
            
            var newConn = $("<div></div>");
            newConn.attr('id',connId);
            newConn.addClass('conn');
            var newRotationInverted = 360 - statuses[parentId][currentStep]['rotate'];
            if (vPosType === 'top'){
                newConn.css({bottom:'',top:vPosValue});
            }else{
                newConn.css({bottom:vPosValue,top:''});
            }
            if (oPosType === 'left'){
                newConn.css({right:'',left:oPosValue});
            }else{
                newConn.css({right:oPosValue,left:''});
            }
            applyRotation(newConn,newRotationInverted);
            parent.append(newConn);
        });
    
    
    }
    
    var applyRotation = function(element,rotation){
        $(element).css({"-ms-transform":"rotate("+rotation+"deg)"});
        $(element).css({"-webkit-transform":"rotate("+rotation+"deg)"});
        $(element).css({"transform":"rotate("+rotation+"deg)"});
    }

    var renderConnectionsWindow = function(element){
        var content = "";
        if ((element === null) && (clickedPieceId === "")){
            if (connectionsWindowStatus == 0) {
                content += "\n";
                content += "==<a class=\"commands switchConnectionsWindow\">(+)</a>==============================\n";
                content += "=                                 =\n";
                content += "= No connections                  =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }else{
                content += "\n";
                content += "==<a class=\"commands switchConnectionsWindow\">(-)</a>==============================\n";
                content += "=                                 =\n";
                content += "= No connections                  =\n";
                content += "=                                 =\n";
                content += "===================================\n";
                content += "=                                 =\n";
                content += "=                                 =\n";
                content += "=                                 =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }
        }else{
            var pieceId = null;
            var mouseStatus = "";
            if (element === null){
                pieceId = clickedPieceId;
            }else{
                pieceId = $(element).attr('id');
            }        
        
            if (connectionsWindowStatus == 0) {        
                content += "\n";
                content += "==<a class=\"commands switchConnectionsWindow\">(+)</a>==============================\n";
                content += "=                                 =\n";
                content += "= Connections of "+pad("             ",pieceId)  + "    =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }else{
                content += "\n";
                content += "==<a class=\"commands switchConnectionsWindow\">(-)</a>==============================\n";
                content += "=                                 =\n";
                content += "= Connections of "+pad("          ",pieceId)  + "       =\n";
                content += "=                                 =\n";
                content += "===================================\n";
                content += "=                                 =\n";
                
                $('.conn').each(function() {
                    var connId = $(this).attr('id');
                    if (connStatuses[connId]['parentId'] === pieceId) {
                        content += "= Id       : "+ pad("         ",connId,true) +" <a class=\"commands deleteConnection\" id=\"del_";
                        content += connId+"\">delete</a>     =\n";
                        content += "= <input class=\"currentConnTypePiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\""+connId;
                        content += "_vPosType\" value=\"" + capitalizeFirstLetter(connStatuses[connId]['vPosType']) ;
                        content += "\" > :  <input class=\"currentConnValuePiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\""+connId;
                        content += "_vPosValue\" value=\"" + connStatuses[connId]['vPosValue'].toFixed(2) + "\"> px         =\n";
                        content += "= <input class=\"currentConnTypePiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\""+connId;
                        content += "_oPosType\" value=\"" + capitalizeFirstLetter(connStatuses[connId]['oPosType']) ;
                        content += "\" > :  <input class=\"currentConnValuePiece\" size=\"8\" maxLenght=\"8\" type=\"text\" name=\""+connId;
                        content += "_oPosValue\" value=\"" + connStatuses[connId]['oPosValue'].toFixed(2) + "\"> px         =\n";
                        content += "=                                 =\n";
                    }
                });
                content += "= <a class=\"commands createConnection\">createNew</a>                       =\n";
                content += "=                                 =\n";
                content += "===================================\n";
            }
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
     
    var  capitalizeFirstLetter = function (string){
        return string.charAt(0).toUpperCase() + string.slice(1);
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
                deltaRotation = 1;
            }else{
                deltaRotation = -1;
            }
            var currentRotation = statuses[pieceId][currentStep]['rotate'];
            var nextRotation = currentRotation + deltaRotation;
            statuses[pieceId][currentStep]['rotate'] = nextRotation;
            rerenderPiece(element);
        }
    }

   var removeAllRotation = function(element){
        applyRotation(element,0);
    }
    
    var rerenderPiece = function(element){
        var pieceId = $(element).attr('id');
        var newTop = statuses[pieceId][currentStep]['top'];
        var newLeft = statuses[pieceId][currentStep]['left'];
        var newRotation = statuses[pieceId][currentStep]['rotate'];
        var newRotationInverted = 360 - newRotation;
        removeAllRotation(element);
        $(element).offset({top:newTop,left:newLeft});
        $(element).children().each(function () {removeAllRotation(this);});
        applyRotation(element,newRotation);
        $(element).children().each(function() {applyRotation(this,newRotationInverted);});
    }
    
    var traslatePiece = function(element,event){
        var pieceId = $(element).attr('id');
        removeAllRotation(element);
        var currentOffset = $(element).offset();
        statuses[pieceId][currentStep]['top'] = /*Math.round(*/currentOffset.top/*)*/;
        statuses[pieceId][currentStep]['left'] = /*Math.round(*/currentOffset.left/*)*/;
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
            applyRotation(this,statuses[pieceId][currentStep]['rotate']);
            $(this).width(statuses[pieceId][currentStep]['width']);
            $(this).height(statuses[pieceId][currentStep]['height']);
        });
    }
    
    var deleteAnyPiece = function(pieceId){
        // delete every child connection
        $('.conn').each(function(){
            var connId = $(this).attr('id');
            if (pieceId === connStatuses[connId]['parentId']){
                delete connStatuses[connId];
                $(this).remove();
            }
        });
        
        // delete piece
        delete statuses[pieceId];
        $('#'+pieceId).remove();
        //pieceId = "";
    }
    
    
    var deletePiece = function(){
        if (clickedPieceId === ""){
            // nothing to do, should never happen
        }else{
            deleteAnyPiece(clickedPieceId);
            clickedPieceId = "";
        }
    }
    
    var createPiece = function(){
        pieceCounter++;
        var pieceId = "piece" + (pieceCounter);
        $("#content").append("<div id=\"" + pieceId + "\" class=\"piece\"></div>");
        var pieceStatuses = {};
        for (var i=0;i<nSteps;i++){
            var currentStatus = {};
            currentStatus['top'] = 100;
            currentStatus['left'] = 100;
            currentStatus['width'] = 400;
            currentStatus['height'] = 200;
            currentStatus['rotate'] = 0;
            pieceStatuses[i] = currentStatus;
        }
        statuses[pieceId] = pieceStatuses;
        $('.piece').draggable();
        rerenderAllPieces();
    }
    
    var createConnection = function(){
        if (clickedPieceId === "") {return;}
        connCounter++;
        var connId = "conn" + (connCounter);
        connStatuses[connId] = {};
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            if (pieceId === clickedPieceId){
                var pieceId = $(this).attr("id");
                var invertedRotation = 360 - statuses[pieceId][currentStep]['rotate'];
                $(this).append("<div id=\"" + connId + "\" class=\"conn rotate"+invertedRotation+"\"></div>");
                connStatuses[connId]['parentId'] = pieceId;
                connStatuses[connId]['vPosType'] = 'top';
                connStatuses[connId]['vPosValue'] = 50;
                connStatuses[connId]['oPosType'] = 'left';
                connStatuses[connId]['oPosValue'] = 50;
            }
        });
        rerenderAllConnections();
        checkConnect();
        renderConnectionsWindow(null);
    }
    
    var deleteConnection =  function(element){
        var actionAndId = $(element).attr('id').split("_");
        var connId = actionAndId[1];
        delete connStatuses[connId];
        $('#'+connId).remove();
    }
    
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    // Functions for steps
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var createStep = function(){
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            var pieceStatuses = statuses[pieceId];
            var newStatuses = {};
            newStatuses['top'] = pieceStatuses[currentStep]['top'];
            newStatuses['left'] = pieceStatuses[currentStep]['left'];
            newStatuses['width'] = pieceStatuses[currentStep]['width'];
            newStatuses['height'] = pieceStatuses[currentStep]['height'];
            newStatuses['rotate'] = pieceStatuses[currentStep]['rotate'];
            var newPieceStatuses = {}
            
            var j=0;
            for (var i=0;i<nSteps;i++){
                if (j === currentStep){
                    newPieceStatuses[j] = newStatuses;
                    j++;
                }            
                newPieceStatuses[j] = pieceStatuses[i];
                j++;
            }
            statuses[pieceId] = newPieceStatuses;
        });
        nSteps++;
    }
    
    var deleteStep = function(){
        $('.piece').each(function () {
            var pieceId = $(this).attr('id');
            var pieceStatuses = statuses[pieceId];
            var j=0;
            for (var i=0;i<nSteps;i++){
                if (i===currentStep){
                    delete pieceStatuses[i];
                }else{
                    pieceStatuses[j] = pieceStatuses[i];
                    j++;
                }
            }
            delete pieceStatuses[nSteps-1];
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
            var pieceStatuses = {};
            for (var i=0;i<nSteps;i++){
                var currentStatus = {};
                currentStatus['top'] = 100;
                currentStatus['left'] = 100;
                currentStatus['width'] = 400;
                currentStatus['height'] = 200;
                currentStatus['rotate'] = 0;
                pieceStatuses[i] = currentStatus;
            }
            statuses[pieceId] = pieceStatuses;
        });
        connStatuses['conn0'] = {};
        connStatuses['conn0']['parentId'] = 'piece0';
        connStatuses['conn0']['vPosType'] = 'top';
        connStatuses['conn0']['vPosValue'] = 50;
        connStatuses['conn0']['oPosType'] = 'left';
        connStatuses['conn0']['oPosValue'] = 200;
        
        connStatuses['conn1'] = {};
        connStatuses['conn1']['parentId'] = 'piece0';
        connStatuses['conn1']['vPosType'] = 'top';
        connStatuses['conn1']['vPosValue'] = 50;
        connStatuses['conn1']['oPosType'] = 'left';
        connStatuses['conn1']['oPosValue'] = 50;

        connStatuses['conn2'] = {};
        connStatuses['conn2']['parentId'] = 'piece0';
        connStatuses['conn2']['vPosType'] = 'top';
        connStatuses['conn2']['vPosValue'] = 50;
        connStatuses['conn2']['oPosType'] = 'right';
        connStatuses['conn2']['oPosValue'] = 50;

        connStatuses['conn3'] = {};
        connStatuses['conn3']['parentId'] = 'piece1';
        connStatuses['conn3']['vPosType'] = 'top';
        connStatuses['conn3']['vPosValue'] = 50;
        connStatuses['conn3']['oPosType'] = 'left';
        connStatuses['conn3']['oPosValue'] = 50;

        connStatuses['conn4'] = {};
        connStatuses['conn4']['parentId'] = 'piece1';
        connStatuses['conn4']['vPosType'] = 'top';
        connStatuses['conn4']['vPosValue'] = 50;
        connStatuses['conn4']['oPosType'] = 'right';
        connStatuses['conn4']['oPosValue'] = 50;

        connStatuses['conn5'] = {};
        connStatuses['conn5']['parentId'] = 'piece2';
        connStatuses['conn5']['vPosType'] = 'top';
        connStatuses['conn5']['vPosValue'] = 100;
        connStatuses['conn5']['oPosType'] = 'left';
        connStatuses['conn5']['oPosValue'] = 100;

        connStatuses['conn6'] = {};
        connStatuses['conn6']['parentId'] = 'piece2';
        connStatuses['conn6']['vPosType'] = 'top';
        connStatuses['conn6']['vPosValue'] = 100;
        connStatuses['conn6']['oPosType'] = 'right';
        connStatuses['conn6']['oPosValue'] = 100;

        connStatuses['conn7'] = {};
        connStatuses['conn7']['parentId'] = 'piece3';
        connStatuses['conn7']['vPosType'] = 'top';
        connStatuses['conn7']['vPosValue'] = 50;
        connStatuses['conn7']['oPosType'] = 'left';
        connStatuses['conn7']['oPosValue'] = 50;

        connStatuses['conn8'] = {};
        connStatuses['conn8']['parentId'] = 'piece3';
        connStatuses['conn8']['vPosType'] = 'top';
        connStatuses['conn8']['vPosValue'] = 50;
        connStatuses['conn8']['oPosType'] = 'right';
        connStatuses['conn8']['oPosValue'] = 50;
        
        connStatuses['conn9'] = {};
        connStatuses['conn9']['parentId'] = 'piece4';
        connStatuses['conn9']['vPosType'] = 'top';
        connStatuses['conn9']['vPosValue'] = 50;
        connStatuses['conn9']['oPosType'] = 'left';
        connStatuses['conn9']['oPosValue'] = 50;

        connStatuses['conn10'] = {};
        connStatuses['conn10']['parentId'] = 'piece4';
        connStatuses['conn10']['vPosType'] = 'top';
        connStatuses['conn10']['vPosValue'] = 50;
        connStatuses['conn10']['oPosType'] = 'right';
        connStatuses['conn10']['oPosValue'] = 50;
        
    }
    
    var start = function(){
        $('.windows').draggable();
        $('.piece').draggable();
        renderMainWindow();
        renderPieceWindow(null);
        renderConnectionsWindow(null);
        initializeDemoStatuses();
        rerenderAllPieces();
        rerenderAllConnections();
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
            renderConnectionsWindow(this);
            return false;
        });

        $( document ).delegate( "div.piece", "mouseout", function(event) {
            renderPieceWindow(null);
            renderConnectionsWindow(null);
            return false;
        });          
        
        $( document ).delegate( "div.piece", "mousewheel DOMMouseScroll", function(event) {
            rotatePiece(this,event);
            checkConnect();
            renderPieceWindow(this);
            renderConnectionsWindow(this);
            return false;
        });        
        
        $( document ).delegate( "div.piece", "click", function(event) {
            clickPiece(this);
            renderPieceWindow(this);
            renderConnectionsWindow(this);
            return false;
        });        
        
        $( document ).delegate( "div.piece", "drag", function(event) {
            traslatePiece(this);
            checkConnect();
            renderPieceWindow(this);
            renderConnectionsWindow(this);
        });
        
        $( document ).delegate( "div.piece", "dragstop", function(event) {
            connectNear(this);
            rerenderPiece(this);
            checkConnect();
            renderPieceWindow(this);
            renderConnectionsWindow(this);
        });

        
        $( document ).delegate( "a.deletePiece", "click", function() {
            deletePiece();
            renderPieceWindow(null);
            renderConnectionsWindow(null);
            return false;
        });
        
        $( document ).delegate( "a.deleteConnection", "click", function() {
            deleteConnection(this);
            rerenderAllConnections();
            checkConnect();
            renderConnectionsWindow(null);
            return false;
        });        
        
        $( document ).delegate( "a.createPiece", "click", function() {
            createPiece();
            return false;
        });

        $( document ).delegate( "a.createConnection", "click", function() {
            createConnection();
            return false;
        });
        
        $( document ).delegate( "a.moreSteps", "click", function() {
            if (confirm("This will create a new step as a copy of step " + (currentStep+1) + ". \nContinue?")){
                createStep();
                currentStep++;
                if (currentStep >= nSteps ){currentStep = 0;}
                renderMainWindow();
                rerenderAllPieces();
                rerenderAllConnections();
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
                rerenderAllConnections();
                checkConnect();                
            }
            return false;
        });        

        $( document ).delegate( "a.prevStep", "click", function() {
            currentStep--;
            if (currentStep < 0 ){currentStep = nSteps-1;}
            renderMainWindow();
            rerenderAllPieces();
            rerenderAllConnections();
            checkConnect();
            return false;
        });    

        $( document ).delegate( "a.nextStep", "click", function() {
            currentStep++;
            if (currentStep >= nSteps ){currentStep = 0;}
            renderMainWindow();
            rerenderAllPieces();
            rerenderAllConnections();
            checkConnect();
            return false;
        });
    };
    
    $( document ).delegate( "a.help", "click", function() {
        mainWindowStatus = -1;
        renderMainWindow();
        return false;
    });

    $( document ).delegate( "a.load", "click", function() {
        var savedStatus = prompt("Please enter your saved status", "generated with save button");
        if (savedStatus != null){
            $.post( "./main.php", { callType: "load", callValue: savedStatus })
            .done(function( data ) {
                var key,temp;
                var maxPiece=0
                var maxConn=0;
                
                $('.piece').each(function () {
                    var pieceId = $(this).attr('id');
                    deleteAnyPiece(pieceId);
                });                
                //alert( "cancelled" );
                statuses = data['pieces'];
                connStatuses = data['connections'];
                currentStep = 0;
                clickedPieceId = "";
                for (key in statuses) {
                    if (statuses.hasOwnProperty(key)) {
                        //alert("crea piece con id"+ key);
                        $("#content").append("<div id=\"" + key + "\" class=\"piece\"></div>");
                        nSteps = Object.size(statuses[key]);
                        temp = parseInt(key.replace("piece",""));
                        if (temp > maxPiece){
                            maxPiece = temp;
                        }
                    }
                }

                for (key in connStatuses) {
                    if (connStatuses.hasOwnProperty(key)) {
                        //alert("crea connection con id"+ key + " figlia di " + connStatuses[key]['parentId']);
                        $("#"+connStatuses[key]['parentId']).append("<div id=\"" + key + "\" class=\"conn\"></div>");
                        temp = parseInt(key.replace("conn",""));
                        if (temp > maxConn){
                            maxConn = temp;
                        }
                    }
                }
                pieceCounter = maxPiece;
                connCounter = maxConn;                
                renderMainWindow();
                rerenderAllPieces();
                rerenderAllConnections();
                checkConnect();
                alert("Successfully loaded");
            });
        }
        return false;
    });       

    $( document ).delegate( "a.save", "click", function() {
        var allStatuses = {};
        allStatuses['pieces'] = statuses;
        allStatuses['connections'] = connStatuses;
        var savedStatusJson = JSON.stringify(allStatuses);
        $("input[name=callType]").val("save");
        $("input[name=callValue]").val(savedStatusJson);
        $('#call').submit();
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
                renderConnectionsWindow(null);
                checkConnect();
            }
        }
        return true;
    });
    
    $( document ).delegate( "input.currentConnValuePiece", "keypress", function(event) {
        if (clickedPieceId === ""){return false;}
        if(event.which === 13){ // enter key
            var currentValueString = $(this).val();
            if (!isNaN(currentValueString)){
                var currentValue = parseFloat(currentValueString);
                var attributeName = $(this).attr('name');
                var idAndValue = attributeName.split("_");
                var connId = idAndValue[0];
                var connValue = idAndValue[1];
                connStatuses[connId][connValue] = currentValue;
                rerenderAllConnections();
                renderPieceWindow(null);
                renderConnectionsWindow(null);
                checkConnect();
            }
        }
        return true;
    });
    
    $( document ).delegate( "input.currentConnTypePiece", "keypress", function(event) {
        return false;
    });
    
    $( document ).delegate( "input.currentConnTypePiece", "click", function(event) {
        if (clickedPieceId === ""){return false;}

        var currentValue = $(this).val();
        var attributeName = $(this).attr('name');
        var idAndType = attributeName.split("_");
        var connId = idAndType[0];
        var connType = idAndType[1];
        
        var newValue = "";
        if (currentValue === "Top"){
            newValue = "bottom";
        }else if (currentValue === "Bottom"){
            newValue = "top";
        }else if (currentValue === "Left"){
            newValue = "right";
        }else if (currentValue === "Right"){
            newValue = "left";
        }
        
        if (newValue === "") return false;
        
        connStatuses[connId][connType] = newValue;
        rerenderAllConnections();
        renderPieceWindow(null);
        renderConnectionsWindow(null);
        checkConnect();
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
