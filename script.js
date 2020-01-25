(function() {
    var currentplayer = "player1";

    var $columns = $(".column");

    var colIndex;

    var rowIndex;

    var colSelector;

    var $cursor = $("#cursor");
    $cursor.addClass(currentplayer);


    $columns.on("click", function(e) {

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
        if (checkForVictory($slotsInCol, "col")) {
            console.log(currentplayer + " won!");
            location.reload();
        } else if (checkForVictory($slotsInRow, "row")) {
            console.log(currentplayer + " won!");
            location.reload();
        } else if (checkForVictory($diagonalPlus, "diaPlus")) {
            console.log(currentplayer + " won!");
            location.reload();
        } else if (checkForVictory($diagonalMinus, "diaMinus")) {
            console.log(currentplayer + " won!");
            location.reload();
        } else {
            switchPlayer();
        }
        console.log("---------------------------");

    });

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


    function checkForVictory($slots, rc) {
        // we will do some logic to check for victory
        var count = 0;

        for (var i = 0; i < $slots.length; i++) {
            // console.log(slots.eq(i).hasClass(currentplayer));

            if ($slots.eq(i).hasClass(currentplayer)) {
                count++;
                if (count == 4) {
                    return true;
                }
            } else {
                count = 0;
            }
        }

        console.log(currentplayer, rc, " count is: ", count);
    }

    function switchPlayer() {

        if (currentplayer === "player1") {
            $cursor.removeClass(currentplayer);

            currentplayer = "player2";

            $cursor.addClass(currentplayer);

            $(colSelector).css({
                borderTopColor: "yellow"
            });

        } else {
            $cursor.removeClass(currentplayer);

            currentplayer = "player1";

            $cursor.addClass(currentplayer);

            $(colSelector).css({
                borderTopColor: "red"
            });
        }
    }


    // adding active column indicator
    $columns.on("mouseenter", function(e) {

        // $(".active").removeClass("active");
        colSelector = ".col" + $(e.currentTarget).index();

        $(colSelector).css({
            borderTopColor: (currentplayer=="player1") ? "red" : "yellow"
        });

        $(colSelector).addClass("active");

    }).on("mouseleave", function() {

        $(".active").removeClass("active");
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


})();
