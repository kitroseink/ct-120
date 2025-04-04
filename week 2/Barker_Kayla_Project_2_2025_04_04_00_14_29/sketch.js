// code referenced from 

// https://itp-xstory.github.io/p5js-shaders/#/./docs/examples/shaders_to_shapes

// https://p5js.org/examples/calculating-values-clock/

// https://thebookofshaders.com/

// https://editor.p5js.org/BarneyCodes/sketches/1g082U2oN


// 3D VARS

let headSculpt;
let BZShader;
let shaderTexture;


// Clock VARS

let secRad;
let minRad;
let hrRad;
let clockDia; 

// 2D VARS

// shape vars
let cSpeed = 0.5;
let rSpeed = 0.5;

// stroke vars
let sR = 255;
let sB = 255;
let sRSpeed = 55;
let sBSpeed = 55;


function preload() {
  
  // 3D media
  headSculpt = loadModel("/media/headSculpt.obj", true);
  BZShader = loadShader("BZ.vert", "BZ.frag");
  // filterShader = loadShader("p5.filterShader.min.js");
  
  // 2D media
  clock = loadImage("/media/jon-tyson-FlHdnPO6dlw-unsplash.jpg");
  CA = loadImage("/media/CA image.png");
  openSans = loadFont("/media/OpenSans-VariableFont_wdth,wght.ttf");
  
  // sound
  tick = loadSound("/media/clock-ticking-sound-effect-240503.mp3");
}


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  // initialize the createGraphics layers
  shaderTexture = createGraphics(710, 400, WEBGL);
  circleMask = createGraphics((windowHeight + windowHeight) / 2.5, (windowHeight + windowHeight) / 2.5, WEBGL);

  // turn off the createGraphics layers stroke
  shaderTexture.noStroke();
  // filterShader.copyToContext(shaderTexture);
  
  pixelDensity(2);
  
  
  noStroke();
  angleMode(DEGREES);
  
  // set radius based on canvas dimensions
  let rad = min(windowWidth, windowHeight) / 2;
  secRad = rad * 0.71;
  minRad = rad * 0.6;
  hrRad = rad * 0.5;
  clockDia = rad * 1.7;
}

function draw() {
  background(0);

  // main code for rendering image
  push()

    image(clock, -windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight); 
    filter(INVERT);
    // tint(255, 175);
    // image(CA, -windowWidth / 2, -windowHeight / 2, windowWidth, windowHeight, 100); 

  
  pop();
  
  // main code for 2D drawing
  
  // rect vars
  let rX = -windowWidth/ 5;
  let rY = -windowHeight/ 2;
  let rXSize = (windowHeight + windowHeight) / 5;
  let rYSize = (windowHeight + windowHeight) / 20;
    
    // if ((rXSize > windowWidth / 5) || (rXSize < windowWidth / 2)){
    if (mouseIsPressed){
       rSpeed *= -1;
        }
    else{
        
        // scale animation
        rXSize += rSpeed;
        rYSize += rSpeed;
        rSpeed *= -1;
    }
  
  
  push();
    fill(0, 0, 0, 200);
    rect(rX, rY, rXSize, rYSize, 10);
  pop();
  
  // text 
  push();
    if (mouseIsPressed){
      fill(sR, 0, sB);
    }
    else{
      fill("magenta");
    }
    textFont(openSans);
    textSize(45);
    text('press space', rX + 10, rY + 50);
  pop();

  
  // circle vars
  let cX = windowWidth/ 100;
  let cY = windowHeight/ 100;
  let cSize = (windowHeight + windowHeight) / 2.5;
  
  // calculate circle distance
  let cDist = dist(cX, cY, mouseX, mouseY)
  
  // draws clock face
  push();

      // color change 
      if (cDist < (cSize /2)){
          fill("teal");
          // scale animation 
          cSize += cSpeed;
          cSpeed *= -1;
      }
      else{ 
           cSpeed *= -1;
      }
      circle (cX, cY, cSize);


  
      // color change 
      if (cDist < (cSize /2)){
        
        // image mask
        circleMask.fill("rgba(0, 0, 0, 1)");
        circleMask.circle(cX, cY, (cSize * 0.95));
        CA.mask(circleMask);
        image(CA, cX + 5, cY, (cSize * 0.95), (cSize * 0.95)); // bottom right
        
        push();
          rotate(90)
          image(CA, cX, cY - 10, (cSize * 0.95), (cSize * 0.95)); // bottom left
        pop();
        
        push();
          rotate(180)
          image(CA, cX - 10, cY - 10, (cSize * 0.95), (cSize * 0.95)); // top left
        pop();
        
        push();
          rotate(270)
          image(CA, cX - 10, cY + 5, (cSize * 0.95), (cSize * 0.95)); // top right
        pop();
      }
      else{
          // hover fill
          fill("teal");
          circle (cX, cY, (cSize * 0.95));
      }

      
      // local var print statements for debugging
      console.log("cDist " + cDist);
      console.log("cX " + cX);
      console.log("cY " + cY);
      console.log("cSize " + cSize);
      console.log("cSpeed " + cSpeed);
  
  pop();
  
  
  // calculates angle for each hand 
  let secAngle = map(second(), 0, 60, 0, 360);
  let minAngle = map(minute(), 0, 60, 0, 360);
  let hrAngle = map(hour(), 0, 12, 0, 360);
  
  
  push();
  
    // stroke color animation
    sR += sRSpeed;
    sB += sBSpeed;
  
    if ((sR < 0) && (sB < 0) || (sR > 255) && (sB > 255)){ // changes stroke color
        sRSpeed *= -1;
        sBSpeed *= -1;
      }
    
    if (mouseIsPressed){
      stroke(sR, 0, sB);
    }
    else{
      stroke("magenta");
    }

    // draws seconds hand
    push();
  
        // rotation animation
        rotate(secAngle);
        strokeWeight(1);
        line(0, 0, 0, -secRad);
    pop();
  
    // draws minute hand 
    push();
  
        // rotation animation
        rotate(minAngle);
        strokeWeight(2);
        line(0, 0, 0, -minRad);
    pop();
  
    // draws hour hand
    push();
  
        // rotation animation
        rotate(hrAngle);
        strokeWeight(2);
        line(0, 0, 0, -hrRad);
    pop();
  
  pop();
  
  
  
  // main code for creating shader
  
  // normalize resolution values
  BZShader.setUniform("u_resolution", [width, height]);
  
  // uses shader() method to set active shader with new one
  shaderTexture.shader(BZShader);
  
  
  // applies the shader as a texture
  texture(shaderTexture);
  
  // using setUniform() to send uniform values to the shader
  // BZShader.setUniform("resolution", [width, height]);
  // BZShader.setUniform("time", millis() / 1000.0);
  // BZShader.setUniform("mouse", [mouseX, map(mouseY, 0, height, height, 0)]);
  
  // initalizing uniforms of states, spread, infected & ill
  BZShader.setUniform("num_states", 200);
  BZShader.setUniform("spread_rate", 70);
  BZShader.setUniform("infected_weight", 2);
  BZShader.setUniform("ill_weight", 3);
  
  // createFilterShader(BZShader);
  // filterShader(BZShader);
  
   // passing the shaderTexture layer geometry to render on
  shaderTexture.rect(0,0,width,height);
  

  // main code for manipulating sculpt
  push();
  
  translate(0, 0, 350);
  
  // click to rotate
    if (mouseIsPressed){
      rotateX(-mouseY);
      rotateY(-mouseX);
    }
  // hover to move texture
    else if ((mouseX < width) && (mouseY < height)){
        orbitControl();
    }

    rotateX(180);
    rotateY(180);
    
    // normalMaterial();
    model(headSculpt);
  pop();
  
  
  
  // calls print statement function for debugging var
  printStatements();
}

function mousePressed(){
  tick.stop(); 
}

function keyPressed(){
  if (keyCode == 32){
   
    // tick.play();
    tick.loop(); 
  }
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function printStatements(){
  
  // window size
  console.log("windowWidth " + windowWidth);
  console.log("windowHeight " + windowHeight);
  
  // mouse coords
  console.log("mouseX " + mouseX);
  console.log("mouseY " + mouseY);
  
  // stroke color coords 
  console.log("sR " + sR);
  console.log("sB " + sB);
  console.log("sRSpeed " + sRSpeed);
  console.log("cSize " + sBSpeed);
  
}