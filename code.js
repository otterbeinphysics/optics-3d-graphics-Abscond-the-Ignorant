// Code put here is executed as the page is loading.
// Use this area to initialize global variables.

var gViewport = null;
var ctx = null;
var gWidth = null;
var gHeight = null;

var gT = 0; 		// This will always be set to the current time-since-page-load, in ms
var gdT = 50; 		// This will always be set to the current time-since-last frame, (but capped at something reasonable)
var g_last_frame_t = Date.now();

var gBoxSize;
var gMyCheckbox;
var gCtl2;

var gContinuousRedraw = true;


//world transform instantiation
var World = identity4();
var View = mat4();
var Projection = mat4();

//defining frustum geometry
var eye_distance = 10.0;
var screen_distance = 300.0;

var drawList = vertexBufferToList(vertexBuffer);
for(i=0; i<drawList.length;i++){
	drawList[i] = rotationX(math.pi).mult(drawList[i]);
}

function frustumView(){ //view transform based on projection matrix from "computer graphics"
	var left = 0;
	var right = gWidth;
	var top = 0;
	var bottom = gHeight;
	
	view = null;
	
}

function taggView(p){ //view transform based on tagg :)
	
	
	view = null;
}

function MoveTo3d(p)
{
	var x = p.x()/(p.z()+eye_distance)*screen_distance;
  	var y = p.y()/(p.z()+eye_distance)*screen_distance;
	ctx.moveTo(x,y);
}
function LineTo3d(p)
{
	var x = p.x()/(p.z()+eye_distance)*screen_distance;
  	var y = p.y()/(p.z()+eye_distance)*screen_distance;
	ctx.lineTo(x,y);
}


//ON LOAD CODE BLOCK ------------------------------------------------------------------------------------------------------------------------------

$(function(){
	// Code in this block is executated when the page first loads.

	// This sort of line can be put anywhere: it doesn't show up on the page, but shows up in the "Console"
	// To see your console:
	// On chrome: View / Developer / Javascript Console    (or command-option-j or control-option-j)
	// On firefox: Tools / Web Developer / Web Console
	// Tools also in other browers, but I recommend using one of the two above.
	// Note that you can also issue commands in the console, just like the code here!

	console.log("Hello there intrepid programmer!");

	// This is where you set up your controls.  The name of your control (id="myID") is controlled by attaching 
	// an event hook to #myID

	// How to use an input box:
	gBoxSize = parseInt($('#boxsize').val()); // initialize it

	$('#boxsize').change(function(){
		// This code is run when someone changes the content of the text box.
		gBoxSize = parseInt($(this).val());
		console.log("Changing text box size to",gBoxSize);
	});

	// The check box
	gMyCheckbox = $("#checkbox1").is(":checked");
	$("#checkbox1").change(function(){
		gMyCheckbox = $(this).is(":checked");
		console.log("checkbox is now",gMyCheckbox);
	});

	// The clickable box
	$("#ctl1").click(function(){
		console.log("ctl1 was clicked");
	});

	// The holdable box
	gCtl2 = false;
	$("#ctl2").mousedown(function(){
		console.log("ctl2 was pushed");
		gCtl2 = true;
	});
	$(window).mouseup(function(){ // this is on the whole window in case user's mouse moves off of button while holding it down.
		if(gCtl2){
			console.log("ctl2 was released");
			gCtl2 = false;
		}
	});


	// Set up the view
	gViewport = $('#viewport');
	ctx = gViewport.get(0).getContext('2d');
	gWidth = gViewport.get(0).width = gViewport.innerWidth();
	gHeight = gViewport.get(0).height =gViewport.innerHeight();

	// Set the canvas coordinates up so that the origin is in the center of the viewport
	ctx.translate(gWidth/2,gHeight/2);

	DummyExample();


	// This draws once.
	AnimationFrame();



});

// rendering pipeline functions------------------------------------------------------------------------------------------------------------------------------

var last_frame = Date.now();
var t0 = Date.now();


function SetTime()
{
	// this function sets the global values gT and gdT to be the time since page update
}

function AnimationFrame()
{
	// This routine gets called every time a new frame happens.

	//	Some utility code in case you want to make animations:
	const max_dt = 50;
	var now = Date.now();
	var dt = now - g_last_frame_t;
	g_last_frame_t = now;
	gdT = Math.min(dt,max_dt); // Call the callback function, give it the time delta.
	gT += gdT;
	$("#time").text(gT);
	$("#fps").text((1000/dt).toFixed(1));

	// Execute your code
	Draw();


	if(gContinuousRedraw) requestAnimationFrame(AnimationFrame);  // Ask the browser to call this function again when it's ready for another frame.
	// If you set gContinuousRedraw to false, it will stop doing this (which will save energy on your computer, but the display won't update unless you call AnimationFrame() manually)
}


function Draw()
{

	// Here's where you will draw things!
	Clear(); // Clear the viewport; code below.

	// Note that in this projection, x is RIGHT, y is DOWN (not up!) 
	DrawBox(50,50, 50);
	//DrawCube(50);
	var transformation = rollPitchYaw(0.1,0.1,0);

	for(i=0; i<drawList.length;i++){
		drawList[i] = transformation.mult(drawList[i]);
	}

	if(gMyCheckbox) drawVertexBuffer(drawList);
	//DrawBox(-100,-100,gBoxSize/2);
}


function Clear()
{
	// Clears the viewport.
	ctx.fillStyle="white"; 
	ctx.fillRect(-gWidth/2, -gHeight/2, gWidth, gHeight);  // from xy to deltax, deltay
}

//primitives manipulation and definitions -----------------------------------------------------------------------------------------------------------------------

function shapeObject() {
	this.pointList = [];
	this.drawShape = function(){
		ctx.beginPath();
		ctx.moveTo(pointList[0]);
		for(var i=0; i<pointList.length-2; i++){
			ctx.lineTo(pointList[1+i]);
		}
		ctx.stroke();
	};
	
	this.rotate = function(theta){
			for(i=0; i<pointList.length-1; i++){
				pointList[i] = rotatePoint(pointList[i][0], pointList[i][1], theta);
			}
		};
}

var square = new shapeObject();
square.pointList.push();

function rotatePoint(e1, e2, theta) 
{
	var e1p =  e1 * Math.cos(theta) + e2 * Math.sin(theta);
	var e2p = -e1 * Math.sin(theta) + e2 * Math.cos(theta);
	return [e1p, e2p];
}


function DrawCube(a)
{
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;

	// a is the half-width of the cube
	var p1 = vec3(-a,-a,-a);           
	var p2 = vec3(-a,+a,-a);           
	var p3 = vec3(+a,+a,-a);           
	var p4 = vec3(+a,-a,-a);           
	var p5 = vec3(-a,-a,+a);           
	var p6 = vec3(-a,+a,+a);           
	var p7 = vec3(+a,+a,+a);           
	var p8 = vec3(+a,-a,+a);           
	
	ctx.beginPath();
	MoveTo3d(p1);
	LineTo3d(p2);
	LineTo3d(p3);
	LineTo3d(p4);
	LineTo3d(p1);
	MoveTo3d(p5);
	LineTo3d(p6);
	LineTo3d(p7);
	LineTo3d(p8);
	LineTo3d(p5);

	MoveTo3d(p1); LineTo3d(p5);
	MoveTo3d(p2); LineTo3d(p6);
	MoveTo3d(p3); LineTo3d(p7);
	MoveTo3d(p4); LineTo3d(p8);
	ctx.stroke();

	

}




function DrawBox(x,y,size)
{
	// Sample code to show some simple draw commands in 2d
	ctx.strokeStyle = "red";  
	ctx.lineWidth = 2;  // thickish lines

	var x1 = x;
	var y1 = y;

	var x2 = x1+size;
	var y2 = y1;

	var x3 = x1+size;
	var y3 = y1+size;

	var x4 = x1;
	var y4 = y1+size;

	//var rot = mat2([Math.cos(theta),Math.sin(theta)],[-Math.sin(theta),Math.cos(theta)]);
	var p1 = vec2(x,y);
	var p2 = vec2(x+size,y);
	var p3 = vec2(x+size,y+size);
	var p4 = vec2(x,y+size);

	//var p1r = rot.mult(p1);
	//var p2r = rot.mult(p2);
	//var p3r = rot.mult(p3);
	//var p4r = rot.mult(p4);

	ctx.beginPath();  // We want to draw a line.
	ctx.moveTo(p1.x(),p1.y());  // start at a corner upper left hand cornner
	ctx.lineTo(p2.x(),p2.y());  // draw a line to the right
	ctx.lineTo(p3.x(),p3.y()); 	//  draw a line down
	ctx.lineTo(p4.x(),p4.y()); 	// draw a line left
	ctx.lineTo(p1.x(),p1.y());	// Draw a line up and back to the start corner
	ctx.stroke(); // actually draw the line on the screen as a red line of thickness 2

	// This code fills the box green if ctl2 is being held down with the mouse.
	ctx.fillStyle = "green";
	if(gCtl2) ctx.fill();
}

//traslate indexBuffer to list of vec3 vertices
function indexToVertexList(intexBuffer, vertexBuffer){
	var newList = [];
	
	for( i= 0; i<intexBuffer.length; i++){
		newList[i*3] = vec4FromIndex(indexBuffer[i][0], vertexBuffer);
		
		/*vec4(	vertexBuffer[ indexBuffer[i*3  ][0] ] [0],
								vertexBuffer[ indexBuffer[i*3  ][0] ] [1],
								vertexBuffer[ indexBuffer[i*3  ][0] ] [2]);*/

		newList[i*3+1] = vec4FromIndex(indexBuffer[i][1], vertexBuffer);
		
		/*vec4(	vertexBuffer[ indexBuffer[i*3+1][1] ] [0],
								vertexBuffer[ indexBuffer[i*3+1][1] ] [1],
								vertexBuffer[ indexBuffer[i*3+1][1] ] [2]);*/
		
		newList[i*3+2] = vec4FromIndex(indexBuffer[i][2], vertexBuffer);
		
		/*vec4(	vertexBuffer[ indexBuffer[i*3+2][0] ] [0],
								vertexBuffer[ indexBuffer[i*3+2][1] ] [1],
								vertexBuffer[ indexBuffer[i*3+2][2] ] [2]);*/
		
	}
	console.log("got indices");
	return newList
}

function drawIndexBuffer(inList){
	ctx.strokeStyle = "green"
	ctx.lineWidth = 2;


	MoveTo3d(inList[0]);
	for(i=0; i<inList.length; i++){
		LineTo3d(inList[i]);
	}
	ctx.stroke();
}

function drawVertexBuffer(inList){
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 0.5;  // thickish lines
	

	MoveTo3d(inList[0]);
	for(i=0; i<inList.length; i++){
		LineTo3d(inList[i]);
	}
	ctx.stroke();
}

function vertexBufferToList(vertexBuffer){
	var outList = [];
	for(i=0;i<vertexBuffer.length;i++){
		outList[i] = vertexVec4(vertexBuffer[i]);
	}
	return outList;
}



function vertexVec4(vertex){
	return vec4(vertex[0], vertex[1], vertex[2]);
}

function vec4FromIndex(index, vertexBuffer){
	return vertexVec4(vertexBuffer[index]);
}

function DummyExample()
{
	// Note two different libraries in use:
	// Math.sin(x)     --> buildin javascript Math library, capital M
	// math.matrix(3)  --> our 'math' library

	// This code shows how to use matrices
	var I = identity3(); // Creates a 3x3 identity matrix

	// Create a 3x3 rotation matrix that rotates about the z-axis by an angle of 45 degrees:
	var theta = Math.PI/4;  // computers use radians!
	var R = mat3(       [ Math.cos(theta),  -Math.sin(theta), 0 ],
						[ Math.sin(theta),   Math.cos(theta), 0 ],
						[ 0              ,   0              , 1 ]
						);

	console.log("R=",R);
	// make a column vector
	var v = vec3(2,2,5); // 2i + 3j + 5k

	// multiple I x R x v
	var v_rotated = R.mult(v);



	console.log("Dummy Example",v,v_rotated);
	console.log("R",R);
	console.log("identity",I.mult(R));
	console.log("identity",R.mult(I));
}
