export default class MeshBasicMaterial {
  constructor() {
    this.type = "MeshBasicMaterial";
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.isVerticesColor = true;

    this.vertexShader = /*glsl*/ `
            attribute vec4 v_position;
            attribute vec4 v_color;
            uniform mat4 rotationMatrix;
            varying vec4 vColor;
    
            uniform vec4 cameraPosition;
            uniform vec4 cameraDirection;
            uniform vec4 cameraUp;
    
            uniform float aspect;
            uniform float near;
            uniform float far;
    
            uniform mat4 pMatrix;
    
    
            
    
    
            
            void main(){
              // 移动相机到原点的基向量变换矩阵
              mat4 tMatrix = mat4(
                1.0,0.0,0.0,0.0,
                0.0,1.0,0.0,0.0,
                0.0,0.0,1.0,0.0,
                -cameraPosition.x,-cameraPosition.y,-cameraPosition.z,1.0
              );
              // 旋转相机的基向量变换矩阵
              // 获取z轴的基向量
              vec3 zAxis = normalize(cameraDirection.xyz);
              // 获取y轴的基向量
              vec3 yAxis = normalize(cameraUp.xyz);
              // 获取x轴的基向量
              vec3 xAxis = normalize(cross(yAxis.xyz,zAxis.xyz));
              
    
              mat4 rMatrix = mat4(
                xAxis.x,yAxis.x,zAxis.x,0.0,
                xAxis.y,yAxis.y,zAxis.y,0.0,
                xAxis.z,yAxis.z,zAxis.z,0.0,
                0.0,0.0,0.0,1.0
              );
    
              mat4 oTranslateMatrix = mat4(
                1.0,0.0,0.0,0.0,
                0.0,1.0,0.0,0.0,
                0.0,0.0,1.0,0.0,
                0.0,0.0,-5.0,1.0
              );
              mat4 oScaleMatrix = mat4(
                1.0/(3.0*aspect),0.0,0.0,0.0,
                0.0,1.0/3.0,0.0,0.0,
                0.0,0.0,1.0/5.0,0.0,
                0.0,0.0,0.0,1.0
              );
    
             
              // vec4 pos = v_position - vec4(0.0,0.0,0.0,0.0) ;
              // gl_Position =  pos;
    
              // gl_Position =tMatrix*rotationMatrix*v_position;
              // gl_Position =rMatrix*tMatrix*rotationMatrix*v_position;
              gl_Position =pMatrix*rMatrix*tMatrix*rotationMatrix*v_position;
    
              // vec4 pos = rMatrix*tMatrix*rotationMatrix*v_position;
              // pos.z = -pos.z;
              // gl_Position =pMatrix*pos ;
              vColor = v_color;
            }
          `;

    this.fragmentShader = /*glsl*/ `precision mediump float;
    varying vec4 vColor;
    void main(){
      gl_FragColor = vec4(vColor.xyz,0.6);
    
    
    }`;
  }
}
