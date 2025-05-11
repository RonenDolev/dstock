// components/Header.js

import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      padding: '4px 5% 8px 5%',
      backgroundColor: '#ffffff'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Image src="/logo.png" alt="Logo" width={130} height={60} />
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px', gap: '4px' }}>
          <Image src="/stopwatch.png" alt="Timer Icon" width={14} height={14} />
          <p style={{ fontSize: '14px', color: '#666' }}>Next update in: —s</p>
        </div>
      </div>
      <h1 style={{
        fontSize: '80px',
        marginLeft: '30px',
        fontWeight: 'lighter',
        fontFamily: 'Aptos Light, Segoe UI Light, sans-serif'
      }}>
        Stock Analysis Generator
      </h1>
    </div>
  );
};

export default Header;
