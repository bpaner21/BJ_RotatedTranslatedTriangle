// RotatedTranslatedTriangle.js

// Vertex shader program
// Declares a new vec4 and assigns it to gl_Position
// Because a_Position has only been declared
// a_Position and gl_Position have a default value of (0,0,0,1)
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    ' gl_Position = u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
// Sets the color of the shader to red, with full opacity
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +	// Set the color
    '}\n';

function main()
{
    // Retrieve <canvas> element 
    // Initilializes the variable 'canvas' as equal to the canvas element 'webgl' form the .html page
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // Initializes the rendering context for this program as a canvas
    // This helps the program determine whether to use 2D or 3D drawing techniques
    var gl = getWebGLContext(canvas);
    if (!gl)
    {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }               // Validates that the context was properly acquired

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
    {
        console.log('Failed to initialize shaders.');
        return;
    }

    // Set the positions of the vertices
    var n = initVertexBuffers(gl);
    if (n < 0)
    {
        console.log('Failed to set the positions of the vertices');
    }

    // Create a Matrix4 object for a model transformation
    var modelMatrix = new Matrix4();

    // Calculate a model matrix
    var ANGLE = 60.0;   // Rotation angle
    var Tx = 0.5;         // Translation distance
    modelMatrix.setRotate(ANGLE, 0, 0, 1);  // Set rotation matrix
    modelMatrix.translate(Tx, 0, 0);        // Multiply model matrix by the calculated translation matrix

    // Pass the model matrix to the vertex shader
    var u_modelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (u_modelMatrix < 0)
    {
        console.log('Failed to pass the rotation matrix to the vertex shader');
    }

    gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements);

    // Set the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw a triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);	// n is 3

}   // main()

function initVertexBuffers(gl)
{
    var vertices = new Float32Array([0.0, 0.3, -0.3, -0.3, 0.3, -0.3]);
    var n = 3;	// The number of vertices

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer)
    {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get the storage location of attribute variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0)
    {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;

}   // initVertixBuffers()