import React from 'react';
import '../styles/designSystem.css';

const Decorations3D = () => {
  return (
    <div className="decorations-container">
      {/* Floating Ring */}
      <div 
        className="decoration-3d ring-3d" 
        style={{ 
          top: '10%', 
          right: '5%',
          opacity: 0.3 
        }} 
      />
      
      {/* Floating Cube */}
      <div 
        className="decoration-3d cube-3d" 
        style={{ 
          bottom: '20%', 
          left: '8%',
          opacity: 0.4 
        }} 
      />
      
      {/* Floating Sphere */}
      <div 
        className="decoration-3d sphere-3d" 
        style={{ 
          top: '60%', 
          right: '15%',
          opacity: 0.3 
        }} 
      />
      
      {/* Secondary Ring */}
      <div 
        className="decoration-3d ring-3d" 
        style={{ 
          bottom: '10%', 
          right: '25%',
          width: '200px',
          height: '200px',
          opacity: 0.2,
          animationDuration: '30s'
        }} 
      />
      
      {/* Small Cube */}
      <div 
        className="decoration-3d cube-3d" 
        style={{ 
          top: '30%', 
          left: '3%',
          width: '40px',
          height: '40px',
          opacity: 0.3,
          animationDelay: '2s'
        }} 
      />
      
      {/* Gradient Orbs */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(41, 82, 200, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          bottom: '30%',
          right: '10%',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(201, 146, 42, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          filter: 'blur(40px)'
        }}
      />
    </div>
  );
};

export default Decorations3D;
