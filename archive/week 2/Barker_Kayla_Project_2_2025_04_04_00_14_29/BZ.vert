  // code referenced from 

// https://editor.p5js.org/BarneyCodes/sketches/1g082U2oN

// https://itp-xstory.github.io/p5js-shaders/#/./docs/examples/basic_gradient_texcoord

// https://thebookofshaders.com/

#ifdef GL_ES

precision mediump float;

#endif

// vertex data
attribute vec3 aPosition;

// texture coord data
attribute vec2 aTexCoord;

// shared var with frag shader
varying vec2 vTexCoord;

void main() {
  
  vTexCoord = aTexCoord;
  
  // flipping y axis
  vTexCoord.y = 1.0 - vTexCoord.y;
  
  
  vec4 positionVec4 = vec4(aPosition, 1.0); // copying aPosition data with 1 as w parameter
  
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0; // scale pixel postion by 2 and then move left and down by -1
  
  gl_Position = positionVec4; // assigning position data to vector for vertex
    
}