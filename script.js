(function() {
    var currentplayer = "player1";
    var $columns = $(".column");
    var colIndex;
    var rowIndex;
    var colSelector;
    var $activeCol;
    var $cursor = $("#cursor");
    var $winningFour = [];
    var p1Score = 0;
    var p2Score = 0;


    $cursor.addClass(currentplayer);

    $columns.on("click", addSlot);

    function addSlot(e) {

        var $col = $(e.currentTarget);

        var $slotsInCol = $col.children();

        for (var i = $slotsInCol.length-1; i >= 0; i--) {
            if (
                !$slotsInCol.eq(i).hasClass("player1") &&
                !$slotsInCol.eq(i).hasClass("player2"))
            {
                $slotsInCol.eq(i).addClass(currentplayer);
                break;
            }
        }

        // console.log("i: ", i);
        if (i === -1) {
            i = 0;
            return;
        }
        rowIndex = i;
        colIndex = $(e.currentTarget).index();


        // create an array out of the slots in the row in which the last chip was placed
        // i = row index;
        var rowElements = ".row" + i;
        var $slotsInRow = $(rowElements);
        var diagonal = createDiagonal();
        var $diagonalPlus = diagonal[0];
        var $diagonalMinus = diagonal[1];

        // check for victory
        checkForWinner($slotsInCol, $slotsInRow, $diagonalPlus, $diagonalMinus);

    }

    function createDiagonal() {

        var $diagonalPlus = $();
        var $diagonalMinus = $();
        console.log("column index: ", colIndex, ", row index: ", rowIndex);

        var plusScore = colIndex + rowIndex;
        var minusScore = colIndex - rowIndex;
        console.log("plusScore is: ", plusScore);
        console.log("minusScore is: ", minusScore);

        for (var  c = 0; c < $columns.length; c++) {
            for (var r = 0; r < $columns.eq(c).children().length; r++) {

                if (c+r === plusScore) {
                    console.log("column:", c, "row:", r, ", c+r = ", c+r);
                    $diagonalPlus = $diagonalPlus.add($columns.eq(c).children().eq(r));

                }
                if (c-r === minusScore) {
                    console.log("column:", c, "row:", r, ", c-r = ", c-r);
                    $diagonalMinus = $diagonalMinus.add($columns.eq(c).children().eq(r));

                }
            }
        }
        console.log("$diagonalPlus:", $diagonalPlus);
        console.log("$diagonalMinus:", $diagonalMinus);
        return [$diagonalPlus, $diagonalMinus];
    }

    function checkForWinner(col, row, diaPlus, diaNeg) {

        if (checkForVictory(col) || checkForVictory(row) || checkForVictory(diaPlus) || checkForVictory(diaNeg)) {

            if (currentplayer == "player1") {
                p1Score++;
                $("#winner").html("<div>P1<br>wins!</div>");
                $(".one .player-score").html(p1Score);
            } else {
                p2Score++;
                $("#winner").html("<div>P2<br>wins!</div>");
                $(".two .player-score").html(p2Score);
            }

            for (var i = 0; i < $winningFour.length; i++) {
                $winningFour[i].addClass("won");
            }

            $columns.off("click", addSlot);

            setTimeout(function(){
                // alert(message);
                // location.reload();
                resetGame();
            }, 1500);

        } else {
            switchPlayer();
        }
    }

    function checkForVictory($slots) {
        // we will do some logic to check for victory
        var count = 0;

        for (var i = 0; i < $slots.length; i++) {
            // console.log(slots.eq(i).hasClass(currentplayer));

            if ($slots.eq(i).hasClass(currentplayer)) {
                count++;
                $winningFour.push($slots.eq(i));
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
                $winningFour = [];
            }
        }

        console.log(currentplayer, " count is: ", count);
    }

    function switchPlayer() {

        if (currentplayer === "player1") {
            $cursor.removeClass(currentplayer);

            currentplayer = "player2";

            $cursor.addClass(currentplayer);

            $(colSelector).removeClass("p1");
            $(colSelector).addClass("p2");

        } else {
            $cursor.removeClass(currentplayer);

            currentplayer = "player1";

            $cursor.addClass(currentplayer);

            $(colSelector).removeClass("p2");
            $(colSelector).addClass("p1");

        }
    }


    // adding active column indicator
    $columns.on("mouseenter", function(e) {

        $activeCol = $(e.currentTarget);
        colSelector = ".col" + $(e.currentTarget).index();

        $(colSelector).addClass( (currentplayer=="player1") ? "p1" : "p2" );

    }).on("mouseleave", function() {

        $(".p1").removeClass("p1");
        $(".p2").removeClass("p2");
        $activeCol = undefined;
    });


    $(document).on("mousemove", function(e) {

        $cursor.css({
            left: e.pageX,
            top: e.pageY
        });

    }).on("keydown", function(e) {

        var keyLeft = e.keyCode == 37;
        var keyRight = e.keyCode == 39;
        var spacebar = e.keyCode == 32;


        var colIsSelected = $activeCol != undefined && $activeCol.index() != -1;

        if (keyLeft) {

            if (!colIsSelected || ($activeCol.index() == -1)) {
                $activeCol = $columns.eq($columns.length-1);
                console.log($activeCol);
                colSelector = ".col"+ $activeCol.index();
                console.log("no col is selected. changing to", colSelector);

            } else {
                $(".p1").removeClass("p1");
                $(".p2").removeClass("p2");


                $activeCol = $activeCol.prev();
                colSelector = ".col"+ $activeCol.index();
                console.log(colSelector);
            }

            $(colSelector).addClass( (currentplayer=="player1") ? "p1" : "p2" );
        }

        if (keyRight) {

            if (!colIsSelected || ($activeCol.index() == -1)) {
                $activeCol = $columns.eq(0);
                console.log($activeCol);
                colSelector = ".col"+ $activeCol.index();
                console.log("no column is selected. changing to", colSelector);

            } else {
                $(".p1").removeClass("p1");
                $(".p2").removeClass("p2");

                $activeCol = $activeCol.next();
                colSelector = ".col"+ $activeCol.index();
                console.log(colSelector);
            }

            $(colSelector).addClass( (currentplayer=="player1") ? "p1" : "p2" );
        }

        if (spacebar && colIsSelected) {



            var $slotsInCol = $activeCol.children();

            for (var i = $slotsInCol.length-1; i >= 0; i--) {
                if (
                    !$slotsInCol.eq(i).hasClass("player1") &&
                    !$slotsInCol.eq(i).hasClass("player2"))
                {
                    $slotsInCol.eq(i).addClass(currentplayer);
                    break;
                }
            }

            // console.log("i: ", i);
            if (i === -1) {
                i = 0;
                return;
            }
            rowIndex = i;
            colIndex = $activeCol.index();


            // create an array out of the slots in the row in which the last chip was placed
            // i = row index;
            var rowElements = ".row" + i;
            var $slotsInRow = $(rowElements);
            var diagonal = createDiagonal();
            var $diagonalPlus = diagonal[0];
            var $diagonalMinus = diagonal[1];

            // check for victory
            checkForWinner($slotsInCol, $slotsInRow, $diagonalPlus, $diagonalMinus);

        }

    });


    function resetGame() {

        // reset classes
        for (var  c = 0; c < $columns.length; c++) {
            for (var r = 0; r < $columns.eq(c).children().length; r++) {

                $columns.eq(c).children().eq(r).removeClass("player1 player2 won");

            }
        }


        $(colSelector).removeClass("p1 p2");
        $(colSelector).addClass("p1");
        $cursor.removeClass(currentplayer);
        $columns.on("click", addSlot);
        $("#winner").html("");
        currentplayer = "player1";
        $cursor.addClass(currentplayer);

    }



})();
