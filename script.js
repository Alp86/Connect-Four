(function() {
    var currentplayer = "player1";
    var $columns = $(".column");
    var colIndex;
    var rowIndex;
    var colSelector;
    var $cursor = $("#cursor");
    var $winner = $("#winner");
    var $winningFour = [];

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

        console.log("i is: ", i);

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

    // $columns.on("click", function click(e) {
    //
    //     var $col = $(e.currentTarget);
    //
    //     var $slotsInCol = $col.children();
    //
    //     for (var i = $slotsInCol.length-1; i >= 0; i--) {
    //         if (
    //             !$slotsInCol.eq(i).hasClass("player1") &&
    //             !$slotsInCol.eq(i).hasClass("player2"))
    //         {
    //             $slotsInCol.eq(i).addClass(currentplayer);
    //             break;
    //         }
    //     }
    //
    //     // console.log("i: ", i);
    //     if (i === -1) {
    //         i = 0;
    //         return;
    //     }
    //     rowIndex = i;
    //     colIndex = $(e.currentTarget).index();
    //
    //     console.log("i is: ", i);
    //
    //     // create an array out of the slots in the row in which the last chip was placed
    //     // i = row index;
    //     var rowElements = ".row" + i;
    //     var $slotsInRow = $(rowElements);
    //     var diagonal = createDiagonal();
    //     var $diagonalPlus = diagonal[0];
    //     var $diagonalMinus = diagonal[1];
    //
    //     // check for victory
    //     checkForWinner($slotsInCol, $slotsInRow, $diagonalPlus, $diagonalMinus);
    //
    // });

    // console.log("diagonalPlus: ", $diagonalPlus);
    // console.log($diagonalMinus);
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

        var message;
        var method;

        if (checkForVictory(col) || checkForVictory(row) || checkForVictory(diaPlus) || checkForVictory(diaNeg)) {

            message = currentplayer + " wins!\n\nRestart game?";

            for (var i = 0; i < $winningFour.length; i++) {
                $winningFour[i].addClass("won")
            }

            $columns.off("click", addSlot);

            // setTimeout(function(){
            //     alert(message);
            //     location.reload();
            // }, 1500);

        } else {
            switchPlayer();
        }
    }

    function checkForVictory($slots, rc) {
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

        console.log(currentplayer, rc, " count is: ", count);
    }

    function switchPlayer() {

        if (currentplayer === "player1") {
            $cursor.removeClass(currentplayer);

            currentplayer = "player2";

            $cursor.addClass(currentplayer);

            $(colSelector).addClass("p2");

            // $(colSelector).css({
            //     borderTopColor: "yellow"
            // });

        } else {
            $cursor.removeClass(currentplayer);

            currentplayer = "player1";

            $cursor.addClass(currentplayer);

            $(colSelector).addClass("p2");

            // $(colSelector).css({
            //     borderTopColor: "red"
            // });
        }
    }


    // adding active column indicator
    $columns.on("mouseenter", function(e) {

        // $(".active").removeClass("active");
        colSelector = ".col" + $(e.currentTarget).index();

        // $(colSelector).css({
        //     borderTopColor: (currentplayer=="player1") ? "red" : "yellow"
        // });

        $(colSelector).addClass( (currentplayer=="player1") ? "p1" : "p2" );

    }).on("mouseleave", function() {

        $(".p1").removeClass("p1");
        $(".p2").removeClass("p2");
    });


    $(document).on("mousemove", function(e) {


        $cursor.css({
            left: e.clientX,
            top: e.clientY
        });

        // console.log(e.clientX, e.clientY);
        // console.log($cursor.offset().left, $cursor.offset().top);
        // console.log($cursor.offset().left-e.clientX, $cursor.offset().top-e.clientY);
    }).on("keydown", function(e) {

        // $active = $(".active");

    });

    // winner announcement animation
    // var curr = 0;
    // var frames = 45;
    // var fontsize = 200;
    // var rotation = 360;
    //
    // function winnerAnim() {
    //
    //
    //     var winnerText = "<div>" + currentplayer.toUpperCase() + " WINS!</div>";
    //
    //     $winner.html(winnerText);
    //
    //     var $winnerDiv = $("#winner div");
    //
    //     if (curr <= frames) {
    //
    //         $winnerDiv.css({
    //             fontSize: curr * fontsize/frames + "px",
    //             transform: "rotate(" + curr * rotation/frames + "deg)"
    //         });
    //         curr++;
    //         requestAnimationFrame(winnerAnim);
    //     }
    // }


})();





/*
The board has six rows and seven columns  -- done

Two players take turns selecting a column to drop their checker into -- done

When a player wins, a message appears to announce the victory -- have to implement message box

After a player wins, it should be possible to reset the game and play again -- currently automatically resets

The gameplay should involve at least one animation (for example, the checkers could fall into their slot rather than just appear instantaneously)
-- still to do

Bonus features
Here are several ideas to make the game more interesting if you have the time

After a player wins, visually indicate which four pieces on the board satisfied the victory condition

Allow players to drag their pieces across the screen and drop them into their desired column using their mouse (or finger on touch screens)

Allow players to play using only their keyboard

Allow players at the beginning of the game to increase the number of columns on the board and the number of connected pieces that are required to win

Allow a single player to play against the computer
*/
