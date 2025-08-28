import React from 'react';
import SimpleForm from '../components/SimpleForm';

export default function TestUploadPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        padding: '20px'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333',
          marginBottom: '30px'
        }}>
          Simple Image Upload Test
        </h1>
        
        <SimpleForm />
      </div>
    </div>
  );
} 