import { NostrCrypto, NostrEvent } from 'nostr-crypto-utils';
import WebSocket from 'ws';

class RelayPool {
  private relays: Map<string, WebSocket> = new Map();
  private nostrCrypto: NostrCrypto;
  
  constructor(relayUrls: string[]) {
    this.nostrCrypto = new NostrCrypto();
    
    // Connect to all relays
    for (const url of relayUrls) {
      this.connectToRelay(url);
    }
  }
  
  private connectToRelay(url: string) {
    const ws = new WebSocket(url);
    
    ws.on('open', () => {
      console.log(`Connected to relay: ${url}`);
      this.relays.set(url, ws);
    });
    
    ws.on('error', (error) => {
      console.error(`Error with relay ${url}:`, error);
      this.relays.delete(url);
    });
    
    ws.on('close', () => {
      console.log(`Disconnected from relay: ${url}`);
      this.relays.delete(url);
      // Try to reconnect after 5 seconds
      setTimeout(() => this.connectToRelay(url), 5000);
    });
  }
  
  // Publish event to all connected relays
  async publishEvent(event: NostrEvent) {
    const message = JSON.stringify(['EVENT', event]);
    
    for (const [url, ws] of this.relays.entries()) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        console.log(`Published to relay: ${url}`);
      }
    }
  }
  
  // Send DM to user through all relays
  async sendDM(content: string, recipientPubkey: string, senderPrivkey: string) {
    try {
      // Encrypt DM content
      const encryptedContent = await this.nostrCrypto.encryptDM(
        content,
        senderPrivkey,
        recipientPubkey
      );
      
      // Create DM event
      const event = await this.nostrCrypto.createEvent({
        kind: 4,
        content: encryptedContent,
        tags: [['p', recipientPubkey]],
        created_at: Math.floor(Date.now() / 1000)
      });
      
      // Sign event
      const signedEvent = await this.nostrCrypto.signEvent(event, senderPrivkey);
      
      // Publish to all relays
      await this.publishEvent(signedEvent);
      
      return signedEvent;
    } catch (error) {
      console.error('Failed to send DM:', error);
      throw error;
    }
  }
  
  // Close all relay connections
  close() {
    for (const [url, ws] of this.relays.entries()) {
      console.log(`Closing connection to relay: ${url}`);
      ws.close();
    }
    this.relays.clear();
  }
}

// Example usage
async function main() {
  const relayPool = new RelayPool([
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.nostr.band'
  ]);
  
  const nostrCrypto = new NostrCrypto();
  
  // Generate keys for demo
  const servicePrivkey = nostrCrypto.generatePrivateKey();
  const servicePubkey = nostrCrypto.getPublicKey(servicePrivkey);
  
  try {
    // Send a DM through multiple relays
    const event = await relayPool.sendDM(
      'Hello from multi-relay example!',
      'recipient-pubkey-here',
      servicePrivkey
    );
    
    console.log('DM sent successfully:', event);
  } catch (error) {
    console.error('Failed to send DM:', error);
  } finally {
    // Clean up
    relayPool.close();
  }
}

if (require.main === module) {
  main().catch(console.error);
}
