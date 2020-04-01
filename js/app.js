var woman = $("#woman"),
  womanHeight = woman.height(),
  ground = $("#ground"),
  road = $("#road"),
  roadWidth = road.width(),
  roadHeight = road.height(),
  plusSound = $("#plusSound")[0],
  minusSound = $("#minusSound")[0],
  womanTop = roadHeight - womanHeight,
  dropSpeed,
  score = 0,
  interval;

$("#startGame").on("click", function() {
  initGame();
});

// game start
function initGame() {
  var elemDropped = 0;
  var tll = new TimelineMax({ repeat: -1 });
  tll.to("#ground", 1, {
    backgroundPosition: "center 115px",
    ease: Linear.easeNone
  });
  dropObj();
  function dropObj() {
    TweenMax.delayedCall(2, dropObj);
    elemDropped = elemDropped + 1;
    var x = Math.floor(2 * Math.random()) + 1;

    dropSpeed = 5;
    var behave;
    if (x == 1) {
      behave = "good";
    } else {
      behave = "bad";
    }
    road.append(
      '<div id="dropElem' +
        elemDropped +
        '" data-attr="' +
        behave +
        '" data-src="' +
        x +
        '" class="dropElem"><img src="images/obj-' +
        x +
        '.png" class="objImg" ><img src="images/point-minus.png" class="pointMinus"><img src="images/point-plus.png" class="pointPlus"></div>'
    );
    var container_width = road.width() - 64;
    TweenMax.to($("#dropElem" + elemDropped), 0, {
      x: Math.random() * container_width
    });
    TweenMax.to($("#dropElem" + elemDropped), dropSpeed, {
      y: 1200,
      ease: Linear.easeOut,
      onUpdate: checkHit,
      onUpdateParams: [$("#dropElem" + elemDropped)]
    });
  }

  // move woman left and right on screen click
  $("#ground").click(function(e) {
    var pWidth = $(this).innerWidth();
    var pOffset = $(this).offset();
    var x = e.pageX - pOffset.left;
    if (x < pWidth / 2) {
      if (woman.position().left > 0) {
        TweenLite.to(woman, 0.1, { left: "-=50" });
      } else {
        TweenLite.to(woman, 0.1, { left: "-=0" });
      }
    } else {
      if (woman.position().left >= road.width() - woman.width()) {
        TweenLite.to(woman, 0.1, { left: "+=0" });
      } else {
        TweenLite.to(woman, 0.1, { left: "+=50" });
      }
    }
  });
}

// check hit
function checkHit(elem) {
  var topPosition = parseInt(elem.position().top);
  if (topPosition > roadHeight) {
    TweenLite.killTweensOf(elem);
    elem.remove();
  }
  if (collision(elem, woman)) {
    elem_top = parseInt(elem.css("top"));
    if (elem_top < womanTop) {
      TweenLite.killTweensOf(elem);
      update_score(elem);
      return true;
    }
  }
  return false;
}

function update_score(elem) {
  if (elem.attr("data-attr") == "good") {
    plusSound.play();
    clearInterval(interval);
    console.log(clearInterval(interval));
    resultTime = $(".countdown").text();
    setTimeout(function() {}, 1000);
    console.log("good hit");
    elem.find(".objImg").css("opacity", "0");
    elem.find(".pointPlus").css("opacity", "1");
    TweenMax.to(elem, 1, { top: -200, opacity: 0 });
    deleteNote(elem);
    console.log(score);
  }
  if (elem.attr("data-attr") == "bad") {
    minusSound.play();
    console.log("bad hit");
    elem.find(".objImg").css("opacity", "0");
    elem.find(".pointMinus").css("opacity", "1");
    TweenMax.to(elem, 1, { top: -200, opacity: 0 });
    TweenMax.killAll();
    deleteNote(elem);
    console.log(score);
  }
}
function deleteNote(elem) {
  setTimeout(function() {
    elem.remove();
  }, 500);
}

// check collisiton
function collision($div1, $div2) {
  var x1 = $div1.offset().left;
  var y1 = $div1.offset().top;
  var h1 = $div1.outerHeight(true);
  var w1 = $div1.outerWidth(true);
  var b1 = y1 + h1;
  var r1 = x1 + w1;
  var x2 = $div2.offset().left;
  var y2 = $div2.offset().top;
  var h2 = $div2.outerHeight(true);
  var w2 = $div2.outerWidth(true);
  var b2 = y2 + h2;
  var r2 = x2 + w2;

  if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
  return true;
}
