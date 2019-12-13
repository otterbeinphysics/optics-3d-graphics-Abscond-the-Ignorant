
// Simple matrix math library.
// Deals only with multiplication, using native array types
// Only square matrices and vectors allowed, with dimension 2,3,4

// Vectors are simple 1-d arrays, and represent COLUMN vectors
// Matricies are listed with arrays of arrays. Each inner array is one row.  
// a = vec2(1,3)  // create a 2d-vector
// d = vec4(1,3,5,7)  // create a 4d-vector
// M = mat4([0,1,2,3],[4,5,6,7),[8,9,10,11],[12,13,14,15]
//
// out = M.mult(d) should do: 
//
	// | 0  1  2  3  |  | 1 |
	// | 4  5  6  7  |  | 3 |
	// | 8  9  10 11 |  | 5 |
	// | 12 13 14 15 |  | 7 |
//  
//
//






function multiply_scalar_times_matrix(M,s,out)
{
	var n = M.length;  
	for(var i=0;i<n;i++) {      // out column
		for(var j=0;j<n;j++) {  // out row
			out[i][j] = M[i][j] * s;
		}
	}
	return out;
}

function multiply_scalar_times_vector(V,s,out)
{
	for(var i=0;i<V.length;i++) {    
			out[i] = V[i]*s;
	}
	return out;
}

function multiply_square_matricies(a,b,out)
{
	// assume square matrices.
	var n = a.length;  

	for(var i=0;i<n;i++) {      // out column
		for(var j=0;j<n;j++) {  // out row
			var tot = 0;

			for(var ii = 0; ii<n; ii++) // in column
					tot += a[j][ii] * b[ii][i]
				
			out[j][i] = tot;
		}
	}
	return out;
}

function multiply_square_matrix_times_vector(M,v,out)
{
	var n = v.length;
	console.log("mult matrices",n)
	var tot,i,ii;
	for(i=0;i<n;i++) {
		tot =0;
		for(ii=0;ii<n;ii++) tot += M[i][ii]*v[ii];
		out[i] = tot;
	}
	return out;
}



function vec2(x,y) {
	return new vector2(x,y);
}

class vector2 extends Array {
  constructor(x,y) {
      super(x||0,y||0);
  }
  x() { return this[0]; }
  y() { return this[1]; }
  mult(b) { 
 	if(typeof(b) == "number") {
 		return multiply_scalar_times_vector(this,b,new vector2());
 	}
 	throw "Bad multiplication with matrix2";
  }
}


function vec3(x,y,z) {
	return new vector3(x,y,z);
}

	class vector3 extends Array {
	constructor(x,y,z) {
		super(x||0,y||0,z||0);
	}
	x() { return this[0]; }
	y() { return this[1]; }
	z() { return this[2]; }
	mult(b) { 
		if(typeof(b) == "number") {
			return multiply_scalar_times_vector(this,b,new vector3());
		}
		throw "Bad multiplication with matrix2";
	}
	}


function vec4(x,y,z,w) {
	return new vector4(x,y,z,w);
}

class vector4 extends Array {
  constructor(x,y,z,w) {
    super(x||0,y||0,z||0,w||0);
  }
  x() { return this[0]; }
  y() { return this[1]; }
  z() { return this[2]; }
  w() { return this[3]; }
  mult(b) { 
 	if(typeof(b) == "number") {
 		return multiply_scalar_times_vector(this,b,new vector4());
 	}
 	throw "Bad multiplication with matrix2";
  }
}



function mat2(row1,row2) {
	return new matrix2(row1||[],row2||[]);
}

function identity2() {
	return new matrix2([1,0],[0,1]);
}

class matrix2 extends Array {
  constructor(row1,row2) {
    super(vec2(...row1),vec2(...row2));
  }
  
  mult(b) {
 	if(b instanceof matrix2) {
 		return multiply_square_matricies(this,b,mat2());
 	}
 	else if(b instanceof vector2) {
		return multiply_square_matrix_times_vector(this,b, new vector2());
 	}
 	else if(typeof(b) == "number") {
 		return multiply_scalar_times_matrix(this,b,new matrix2());
 	}
 	throw "Bad multiplication with matrix2";
  }
}

function mat3(row1,row2,row3) {
	return new matrix3(row1||[],row2||[],row3||[]);
}

function identity3() {
	return new matrix3([1,0,0],[0,1,0],[0,0,1]);
}

class matrix3 extends Array {
  constructor(row1,row2,row3) {
    super(vec3(...row1),vec3(...row2),vec3(...row3));
  }
  
  mult(b) {
 	if(b instanceof matrix3) {
 		return multiply_square_matricies(this,b,mat3() );
 	}
 	else if(b instanceof vector3) {
		return multiply_square_matrix_times_vector(this,b, new vector3());
 	}
 	else if(typeof(b) == "number") {
 		return multiply_scalar_times_matrix(this,b,new matrix3());
 	}
 	throw "Bad multiplication with matrix3";
  }
}


function mat4(row1,row2,row3,row4) {
	return new matrix4(row1||[],row2||[],row3||[],row4||[]);
}

function identity4() {
	return new matrix4([1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]);
}


class matrix4 extends Array {
  constructor(row1,row2,row3,row4) {
    super(vec4(...row1),vec4(...row2),vec4(...row3),vec4(...row4));
  }
  
  mult(b) {
 	if(b instanceof matrix4) {
 		return multiply_square_matricies(this,b,mat4());
 	}
 	else if(b instanceof vector4) {
		return multiply_square_matrix_times_vector(this,b, new vector4());
 	}
 	else if(typeof(b) == "number") {
 		return multiply_scalar_times_matrix(this,b,mat4());
 	}
 	throw "Bad multiplication with matrix4";
  }
}

function rotationX(theta){
	return mat4(
		[1,		 			  0,			 		  0,	0],
		[0, 	Math.cos(theta), 	   -Math.sin(theta), 	0],
		[0,		Math.sin(theta),	    Math.cos(theta),	0],
		[0,					  0,					  0,	1]
	)
}
function rotationY(theta){
	return mat4(
		[Math.cos(theta), 		 0,		-Math.sin(theta), 	0],
		[0, 	 				 1, 				  0,	0],
		[Math.sin(theta),		 0,	  	Math.cos(theta), 	0],
		[0,					  	 0,					  0,	1]
	)
}
function rotationZ(theta){
	return mat4(
		[Math.cos(theta), 		-Math.sin(theta),	  0, 	0],
		[Math.sin(theta), 	 	 Math.cos(theta),	  0,	0],
		[0,		 								0,	  1, 	0],
		[0,					  	 				0,	  0,	1]
	)
}

function rollPitchYaw(theta, phi, delta){
	return ( rotationZ(theta).mult(rotationX(phi)) ).mult(rotationY(delta))
}

function test()
{
	var I = mat2([1,1],[1,-1])
	var v = vec2(3,4);
	console.log(I.mult(v));

	d = vec4(1,3,5,7)  // create a 4d-vector
	M = mat4([0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]);
	console.log("M",M);
	console.log("d",d);
	console.log("M times d",M.mult(d));
}