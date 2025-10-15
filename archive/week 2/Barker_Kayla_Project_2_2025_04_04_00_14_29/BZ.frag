// code referenced from: 
// https://editor.p5js.org/BarneyCodes/sketches/1g082U2oN

// https://itp-xstory.github.io/p5js-shaders/#/./docs/examples/basic_gradient_texcoord

// https://thebookofshaders.com/

#ifdef GL_ES

precision mediump float;

#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;


// set uniforms by filterShader
uniform sampler2D filter_background; // contains image being filtered
uniform vec2 filter_res; // contains image resolution in pixels

uniform float num_states;
uniform float spread_rate;
uniform float ill_weight;
uniform float infected_weight;

vec3 snap_to_state(vec3 val) {
  return (floor(val * num_states))/num_states;
}

void main() {
  
  // calucalting pixel distance
  vec2 pixelDistance = 1.0 / filter_res;
    
    
  // finding color of current pixel
  vec3 pixelColor = texture2D(filter_background, vTexCoord).rgb;
  
  
  // initializing number of infected and ill 
  vec3 num_infected = vec3(0.0);
  vec3 num_ill = vec3(0.0);
  
  
  // reading colours of neighbour pixels
  vec3 neighbours = vec3(0.0);
  for(float i = -1.; i < 2.; i++) {
    for(float j = -1.; j < 2.; j++) {
      float x = vTexCoord.x + i * pixelDistance.x;
      float y = vTexCoord.y + j * pixelDistance.y;
      
      vec3 n = texture2D(filter_background, vec2(x, y)).rgb;
      
      // 1 = ill, 0 = healthy
      vec3 ill = step(1.0, n);
      vec3 healthy = step(1.0, 1.0 - n);
      vec3 infected = (1.0-ill) * (1.0-healthy);
      
      neighbours += n;
      
      num_infected += infected;
      num_ill += ill;
    }
  }
  
  // 1 = ill, 0 = healthy
  vec3 ill = step(1.0, pixelColor);
  vec3 healthy = step(1.0, 1.0 - pixelColor);
  vec3 infected = (1.0-ill) * (1.0-healthy);
  
  // Remove current pixel from neighbour totals
  num_infected -= infected;
  num_ill -= ill;
  
  // Weight values
  vec3 w_num_infected = floor(num_infected/infected_weight);
  vec3 w_num_ill = floor(num_ill/ill_weight);
  
  // Calculate potential values
  vec3 healthy_val = (num_infected + num_ill)/num_states;
  vec3 infected_val = (neighbours/(num_infected + num_ill + 1.0)) + (spread_rate/num_states);
  
  pixelColor = (1. - ill) * ((healthy * healthy_val) + (infected * infected_val));
  pixelColor = snap_to_state(pixelColor);
  
  
  // Output the cell (white = alive, black = dead)
  // gl_FragColor = vec4(pixelColor, 1.0);
  
  // gl_FragColor = vec4(pixelColor, 1.0);
  vec2 coord = vTexCoord;
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  
  vec3 color = vec3(st.x, st.y, 1.0); // vector for color data
  
  gl_FragColor = vec4(coord.x, coord.y, (coord.x+coord.y), 0.5);
  gl_FragColor = vec4(st.x, st.y, 0.5, 0.55); // assigning color data to vector for fragment
  
  
}