# Dropp Wallet Plugin Usage Guide

This guide explains how to integrate the **Dropp Wallet Plugin** (`dropp-wallet-plugin.es.js`) into your React application.

## 1. Installation

### Option A: Local File
1.  Copy `dropp-wallet-plugin.es.js` to your project's source directory (e.g., `src/libs/dropp-wallet-plugin.es.js`).
2.  Install the required peer dependencies:

```bash
npm install @hashgraph/hedera-wallet-connect@^2.0.4 @hashgraph/sdk@^2.79.0
```

*Note: React and ReactDOM are also required but assumed to be present.*

## 2. Usage

Import the `useDroppWallet` hook from the plugin file.

```jsx
import React, { useState } from 'react';
// Adjust the path to where you placed the file
import { useDroppWallet } from '../libs/dropp-wallet-plugin.es.js'; 

const MyPaymentComponent = () => {
  const [email, setEmail] = useState('');
  
  const { 
    isConnected, 
    walletId, 
    statusMessage, 
    connectWallet, 
    loginWithEmail,
    disconnectWallet 
  } = useDroppWallet();

  const handleConnect = async () => {
    // connectWallet returns the accountId on success
    const accountId = await connectWallet(email);
    if (accountId) {
      console.log('Connected:', accountId);
    }
  };

  return (
    <div>
      <h2>Connect Dropp Wallet</h2>
      <input 
        type="email" 
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <button onClick={isConnected ? disconnectWallet : handleConnect}>
        {isConnected ? 'Disconnect' : 'Connect Wallet'}
      </button>

      {statusMessage && <p>{statusMessage}</p>}
      
      {isConnected && (
         <p>Connected Info: {walletId}</p>
      )}
    </div>
  );
};
```

## 3. Functionality

The `useDroppWallet` hook encapsulates the following logic:
1.  **User Verification**: Checks if the provided email exists in the backend.
2.  **Wallet Check**: Verifies if the user already has a linked Hedera merchant account.
3.  **Connection**: If no link exists, opens the WalletConnect modal for the user to connect their wallet.
4.  **Saving**: Automatically saves the new wallet Account ID to the user's profile in the backend.
