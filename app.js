const colors = ["red", "blue", "orange", "yellow", "green", "#4dff00", "#fb00ff", "white", "turquoise"];
var closebtns;
var distance;
var circ1 = new Circle(0, 0, 0, 0, 0);
var circ2 = new Circle(0, 0, 0, 0, 0);
var circ3 = new Circle(0, 0, 0, 0, 0);
var circ_arr = [circ1, circ2, circ3];

var CLICKS_BEGIN = [];
begin_children = [];
var CLICKS_END = [];
var values = []
var lines = false;
var move = false;
var permissionDraw = false;
var selectedCircle;

var delta_x;
var delta_y;
var str =
  '//Define three points for your triangle.\n//Enter the points as a point on the cartesian plane: {x, y}.\nfunction generateTriangle(){\nvar pointA = {, }\nvar pointB = {, }\nvar pointC = {, }\n\n//Enable the drawing feature below by making it "true".\n//Connect the dots to form a triangle.\nvar drawEnable = false;\n\n//Set the movePoints variable to "true".\n//This will illustrate how the triangle reacts to changes.\nvar movePoints = false;\n}';

var code = ".codemirror-textarea" [0];
var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
  extraKeys: {
    Tab: "autocomplete"
  },
  mode: {
    name: "javascript",
    globalVars: true
  },
  theme: "dracula",
  lineNumbers: true,
  autoCloseBrackets: true,
});
editor.setValue(str);

// ********************************************************************
// *****************************SLIDER STUFF***************************
// ********************************************************************

const input = document.querySelector("input");
const label = document.querySelector("label");

canvas.addEventListener('mousedown', dragLine);
canvas.addEventListener('mouseup', stopLine);
canvas.addEventListener('touchstart', dragLine);
canvas.addEventListener('touchend', stopLine);

document.getElementById("angles").innerHTML = "N/A";
document.getElementById("sides").innerHTML = "N/A";

input.addEventListener("input", (event) => {
  const value = Number(input.value) / 100;
  input.style.setProperty("--thumb-rotate", `${value * 720}deg`);
  label.innerHTML = Math.round(value * 50);
});

// ********************************************************************
// ********************************************************************
// ********************************************************************

// ********************************************************************
// **************************DRAWING FUNCTIONS*************************
// ********************************************************************

//clear canvas
function clear_canvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//create scene, draw etc.
function create_enviroment() {
  ctx.beginPath();
  add_axis();
  ctx.closePath();
}

//add text
function add_text(content, x, y, clr) {
  ctx.save();
  // ctx.scale(1, -1);
  ctx.fillStyle = clr;
  ctx.font = "16px Arial";
  ctx.fillText(content, x, y);
  ctx.restore();
}

//draw axes on the canvas
function add_axis() {
  ctx.save();
  ctx.moveTo((canvas.width / 2) * -1, 0);
  ctx.lineTo(canvas.height / 2, 0);
  ctx.stroke();
  ctx.moveTo(0, (canvas.width / 2) * -1);
  ctx.lineTo(0, canvas.height / 2);
  ctx.stroke();

  ctx.font = "16px Arial";
  add_text("+ x", 180, -20);
  add_text("- y", 10, 180);
  add_text("- x", -200, -20);
  add_text("+ y", 10, -180);
  ctx.restore();
}


// ********************************************************************
// ********************************************************************
// ********************************************************************

// ********************************************************************
// *******************************GAMEPLAY*****************************
// ********************************************************************

//initialize scene
function init() {
  closebtns = document.getElementsByClassName("close");
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  document.onmousemove = function (e) {
    cursorX = e.pageX - 60;
    cursorY = e.pageY - 80;
  }

  window.requestAnimationFrame(gameLoop);
}

//loop game till completion
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (lines) {
    circ1.drawLineTo(circ2);
    circ1.flag1 = true;
    circ2.flag1 = true;
    circ1.drawLineTo(circ3);
    circ1.flag2 = true;
    circ3.flag1 = true;
    circ2.drawLineTo(circ3);
    circ2.flag2 = true;
    circ3.flag2 = true;
  }
  circ1.draw(circ1.x, circ1.y, circ1.rad, circ1.sang, circ1.eang, circ1.colour);
  circ2.draw(circ2.x, circ2.y, circ2.rad, circ2.sang, circ2.eang, circ2.colour);
  circ3.draw(circ3.x, circ3.y, circ3.rad, circ3.sang, circ3.eang, circ3.colour);

  if (move) {
    aa = calculateAngle(circ1, circ2, circ3);
    ba = calculateAngle(circ2, circ1, circ3)
    ca = calculateAngle(circ3, circ2, circ1)
    add_text(String(aa), circ1.x + 5, circ1.y - 5, circ1.colour);
    add_text(String(ba), circ2.x + 5, circ2.y - 5, circ2.colour);
    add_text(String(ca), circ3.x + 5, circ3.y - 5, circ3.colour);
    identifier("angle", aa, ba, ca);
    sa = calculateLength(circ1, circ2);
    sb = calculateLength(circ1, circ3);
    sc = calculateLength(circ2, circ3);
    add_text(String(sa), (circ1.x + circ2.x) / 2, (circ1.y + circ2.y) / 2, circ1.colour);
    add_text(String(sb), (circ1.x + circ3.x) / 2, (circ1.y + circ3.y) / 2, circ2.colour);
    add_text(String(sc), (circ2.x + circ3.x) / 2, (circ2.y + circ3.y) / 2, circ3.colour);
    identifier("sides", sa, sb, sc);

    // check if cursor has been clicked within tolerance level while not having selected a circle
    if (permissionDraw == false) {
      for (let i = 0; i < circ_arr.length; i++) {
        if ((CLICKS_BEGIN[0] >= circ_arr[i].x - 10 && CLICKS_BEGIN[0] <= circ_arr[i].x + 10) && (CLICKS_BEGIN[1] >= circ_arr[i].y - 10 && CLICKS_BEGIN[1] <= circ_arr[i].y + 10)) {
          permissionDraw = true;
          begin_children = [circ_arr[i].x, circ_arr[i].y];
          selectedCircle = circ_arr[i];
          CLICKS_BEGIN = [];
        }
      }
    }

    if (permissionDraw == true) {
      selectedCircle.x = cursorX;
      selectedCircle.y = cursorY;

      if (CLICKS_END[0] != null && CLICKS_END[1] != null) {
        selectedCircle.x = CLICKS_END[0];
        selectedCircle.y = CLICKS_END[1];
        CLICKS_END = [null, null];
        selectedCircle = 0;
        permissionDraw = false;
      }
    }
  }
  window.requestAnimationFrame(gameLoop);
}

function resolveAfter1Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}

//reset scene (reset button)
function reset_list() {
  editor.setValue(str);
  console.clear();
  delete circ1.x;
  delete circ1.y;
  delete circ2.x;
  delete circ2.y;
  delete circ3.x;
  delete circ3.y;
  lines = false;
  move = false;
  CLICKS_BEGIN = [];
  CLICKS_END = [];
  clear_canvas(); //clear canvas
  error_window("close", "close");
  document.getElementById("angles").innerHTML = "N/A";
  document.getElementById("sides").innerHTML = "N/A";
  // create_enviroment();
}

//render the scene (run button)
function render() {
  reset_position();
  console.clear();
  values = generate_triangle();
  permissionDraw = false;

  // error handling
  let tracker = [0, 0, 0];
  loop1:
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < values[i].length; j++) {
        // if no values are entered
        if (values[i][j] == " " || values[i][j] == "}") {
          error_window("open", "empty");
          tracker[i]++;
          break loop1;
        }

        // if semicolons are missing
        else if (
          values[i][1][values[i][1].length - 1] != ";" &&
          values[i][1][values[i][1].length - 1] == "}"
        ) {
          error_window("open", "semicolon");
          tracker[i]++;
          break loop1;
        }

        //else
        else {
          error_window("close", "close");
          tracker[i] = 0;
        }
      }
    }

  get_truth();
  // functionality
  if (tracker[0] == 0 && tracker[1] == 0 && tracker[2] == 0) {
    for (let i = 0; i < values.length; i++) {
      values[i][1] = String(values[i][1]).slice(0, values[i][1].length - 1);
    }

    // non functional deletion
    delete circ1;
    delete circ2;
    delete circ3;
    circ1 = new Circle(parseInt(values[0][0]), parseInt(values[0][1]), 7, 0, 360, colors[Math.floor(Math.random() * 10)]);
    circ1.draw(circ1.x, circ1.y, circ1.rad, circ1.sang, circ1.eang, circ1.colour);
    circ2 = new Circle(parseInt(values[1][0]), parseInt(values[1][1]), 7, 0, 360, colors[Math.floor(Math.random() * 10)]);
    circ2.draw(circ2.x, circ2.y, circ2.rad, circ2.sang, circ2.eang, circ2.colour);
    circ3 = new Circle(parseInt(values[2][0]), parseInt(values[2][1]), 7, 0, 360, colors[Math.floor(Math.random() * 10)]);
    circ3.draw(circ3.x, circ3.y, circ3.rad, circ3.sang, circ3.eang, circ3.colour);
    circ_arr = [circ1, circ2, circ3];
  }
}


//reset points to origin
function reset_position() {
  clear_canvas();
  lines = false;
  move = false;
  CLICKS_BEGIN = [];
  CLICKS_END = [];
  // create_enviroment();
}


//!!!!!!!!!!ADJUST USING %/em!!!!!!!!!!!
function dragLine(e) {
  CLICKS_BEGIN[0] = e.pageX - 60;
  CLICKS_BEGIN[1] = e.pageY - 80;
  // console.log(CLICKS_BEGIN);
}

function stopLine(e) {
  CLICKS_END[0] = e.pageX - 60;
  CLICKS_END[1] = e.pageY - 80;
  console.log(CLICKS_END);
}

// ********************************************************************
// ********************************************************************
// ********************************************************************

// ********************************************************************
// *****************************MATH FUNCTIONS*************************
// ********************************************************************
function calculateAngle(c1, c2, c3) {
  c = calculateLength(c2, c3);
  a = calculateLength(c2, c1);
  b = calculateLength(c3, c1);
  angle = (Math.pow(c, 2) - Math.pow(a, 2) - Math.pow(b, 2)) / (-1 * 2 * a * b);
  return Math.floor(Math.acos(angle) * (180 / Math.PI));
}

function calculateLength(c1, c2) {
  return Math.floor(Math.sqrt(Math.pow(Math.abs(c1.x - c2.x), 2) + Math.pow(Math.abs(c1.y - c2.y), 2)));
}

function identifier(type, t1, t2, t3) {
  if (type == "angle") {
    //obtuse
    if (t1 > 90 || t2 > 90 || t3 > 90) {
      document.getElementById("angles").innerHTML = "Obtuse";
    }
    //right
    else if (t1 == 90 || t2 == 90 || t3 == 90) {
      document.getElementById("angles").innerHTML = "Right";
    }
    //acute
    else if (t1 < 90 || t2 < 90 || t3 < 90) {
      document.getElementById("angles").innerHTML = "Acute";
    }

  } else if (type == "sides") {
    // equilateral
    if (t1 == t2 && t2 == t3) {
      document.getElementById("sides").innerHTML = "Equilateral";
    }
    // isosceles
    else if (t1 == t2 || t2 == t3 || t3 == t1) {
      document.getElementById("sides").innerHTML = "Isosceles";
    }
    //scalene
    else {
      document.getElementById("sides").innerHTML = "Scalene";
    }
  }
}

// ********************************************************************
// ********************************************************************
// ********************************************************************

// ********************************************************************
// ***************************ERROR-HANDLING***************************
// ********************************************************************

//error pop-up window
function error_window(state, type) {
  if (state == "open" && type == "syntax") {
    document.getElementById("error_popup_id").style.display = "block";
    document.getElementById("err_msg").innerHTML = "Ensure your commands are typed correctly. Double check the spellings.";
  } else if (state == "open" && type == "semicolon") {
    document.getElementById("error_popup_id").style.display = "block";
    document.getElementById("err_msg").innerHTML = "Make sure you have placed semicolons where necessary.";
  } else if (state == "open" && type == "empty") {
    document.getElementById("error_popup_id").style.display = "block";
    document.getElementById("err_msg").innerHTML = "Ensure all values are entered to generate a triangle.";
  } else {
    document.getElementById("error_popup_id").style.display = "none";
  }
}

// ********************************************************************
// ********************************************************************
// ********************************************************************

//fetch codeMirror code
function generate_triangle() {
  var doc = editor.getDoc();
  var d1 = doc.getLine(3);
  var d2 = doc.getLine(4);
  var d3 = doc.getLine(5);

  // get point coordinates
  var d1_arr = [
    String(d1).slice(14, String(d1).indexOf(",")),
    String(d1).slice(String(d1).indexOf(",") + 2, String(d1).indexOf("}")) +
    d1[d1.length - 1],
  ];
  var d2_arr = [
    String(d2).slice(14, String(d2).indexOf(",")),
    String(d2).slice(String(d2).indexOf(",") + 2, String(d2).indexOf("}")) +
    d2[d2.length - 1],
  ];
  var d3_arr = [
    String(d3).slice(14, String(d3).indexOf(",")),
    String(d3).slice(String(d3).indexOf(",") + 2, String(d3).indexOf("}")) +
    d3[d3.length - 1],
  ];
  temp = [];
  temp.push(d1_arr);
  temp.push(d2_arr);
  temp.push(d3_arr);
  return temp;
}

// deals with boolean variables
function get_truth() {
  var doc = editor.getDoc();
  var draw = doc.getLine(9);
  var moveDot = doc.getLine(13);

  draw = String(draw).slice(17, String(draw).length);
  moveDot = String(moveDot).slice(17, String(moveDot).length);

  if (draw[draw.length - 1] != ";" || moveDot[moveDot.length - 1] != ";") {
    error_window("open", "semicolon");
  } else if (draw == "true;" && moveDot == "true;") {
    lines = true;
    move = true;
  } else if (draw == "false;" && moveDot == "true;") {
    lines = false;
    move = true;
  } else if (draw == "true;" && moveDot == "false;") {
    lines = true;
    move = false;
  } else if (draw == "false;" && moveDot == "false;") {
    lines = false;
    move = false;
  } else {
    error_window("open", "syntax");
  }
}

// Testing text

// //Define three points for your triangle.
// //Enter the points as a point on the cartesian plane: {x, y}.
// function generateTriangle(){
//   var pointA = {130, 149};
//   var pointB = {202, 482};
//   var pointC = {700, 280};

//   //Enable the drawing feature below by making it "true".
//   //Connect the dots to form a triangle.
//   var drawEnable = false;
//   //Set the movePoints variable to "true".
//   //This will illustrate how the triangle reacts to changes.
//   movePoints = false;
//   }