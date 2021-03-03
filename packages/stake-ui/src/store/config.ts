import { PublicKey } from '@solana/web3.js';

type Networks = { [label: string]: Network };

export type Network = {
  // Cluster.
  label: string;
  url: string;
  explorerClusterSuffix: string;

  // Faucets.
  srmFaucet: PublicKey | null;
  msrmFaucet: PublicKey | null;

  // Programs.
  registryProgramId: PublicKey;
  lockupProgramId: PublicKey;
  multisigProgramId: PublicKey;

  // Staking instances.
  registrars: { [token: string]: PublicKey };

  // Whitelisted token mints.
  mints: { [token: string]: PublicKey };
};

export const networks: Networks = {
  mainnet: {
    // Cluster.
    label: 'Mainnet Beta',
    url: 'https://solana-api.projectserum.com',
    //url: 'https://api.mainnet-beta.solana.com',
    explorerClusterSuffix: '',

    srmFaucet: null,
    msrmFaucet: null,

    registryProgramId: new PublicKey(
      'GrAkKfEpTKQuVHG2Y97Y2FF4i7y7Q5AHLK94JBy7Y5yv',
    ),
    lockupProgramId: new PublicKey(
      '6ebQNeTPZ1j7k3TtkCCtEPRvG7GQsucQrZ7sSEDQi9Ks',
    ),
    multisigProgramId: new PublicKey(
      '6ebQNeTPZ1j7k3TtkCCtEPRvG7GQsucQrZ7sSEDQi9Ks',
    ),
    registrars: {
      srm: new PublicKey('5vJRzKtcp4fJxqmR7qzajkaKSiAb6aT9grRsaZKXU222'),
      msrm: new PublicKey('7uURiX2DwCpRuMFebKSkFtX9v5GK1Cd8nWLL8tyoyxZY'),
      fida: new PublicKey('CJPEDnLSD6gQa94fkFmcPdqikHYMPzAL8NXmaurta2a7'),
      maps: new PublicKey('9tzkorTXKbw73hokMsq34R6ADd13eJF9X4udXQLiGAKc'),
    },
    mints: {
      srm: new PublicKey('SRMuApVNdxXokk5GT7XD5cUUgXMBCoAz2LHeuAoKWRt'),
      msrm: new PublicKey('MSRMcoVyrFxnSgo5uXwone5SKcGhT1KEJMFEkMEWf9L'),
      fida: new PublicKey('EchesyfXePKdLtoiZSL8pBe8Myagyy8ZRqsACNCFGnvp'),
      maps: new PublicKey('MAPS41MDahZ9QdKXhVa4dWB9RuyfV4XqhyAZ8XcYepb'),
    },
  },
  devnet: {
    // Cluster.
    label: 'Devnet',
    url: 'https://devnet.solana.com',
    explorerClusterSuffix: 'devnet',

    srmFaucet: null,
    msrmFaucet: null,

    registryProgramId: new PublicKey(
      'DVBFLTDaN29K69yW61AiVTcQuEmbnuodvW9qGXpQQuRc',
    ),
    lockupProgramId: new PublicKey(
      'FXef1WbmM9WHzFMDcXvsgPWzgHQz7Hrz1CoqNUq5EEi9',
    ),
    multisigProgramId: new PublicKey(
      '6ebQNeTPZ1j7k3TtkCCtEPRvG7GQsucQrZ7sSEDQi9Ks',
    ),
    registrars: {
      token1: new PublicKey('4QK3drbHCjouKbHUGP9PW8AYH6LuB5f4DQDq4ExCZD5u'),
      token2: new PublicKey('Gz6kVhoUc9mHF2bXkAQik7gXtDoWKvDkJ99fr1v2WTbi'),
    },
    mints: {
      token1: new PublicKey('2CRHQWy4LaM5pXGwfYkgQLvxRJh4vsm4FGzTpjXTFe2p'),
      token2: new PublicKey('GeRsQMtERmiEief53PDv8iTDTDZe8RPpqfcHWukR5nGt'),
    },
  },

  // Fill in with your local cluster addresses.
  localhost: {
    // Cluster.
    label: 'Localhost',
    url: 'http://localhost:8899',
    explorerClusterSuffix: 'localhost',

    srmFaucet: null,
    msrmFaucet: null,

    multisigProgramId: new PublicKey(
      '9z7Pq56To96qbVLzuBcf47Lc7u8uUWZh6k5rhcaTsDjz',
    ),
    registryProgramId: new PublicKey(
      'A3ukM9swAsTqVC6g5Zy9FsWXofe5f2JhXMEfzenNf9Q7',
    ),
    lockupProgramId: new PublicKey(
      '2z65xTKJDM4iJBVz5aXtNrWfQvKGgNJvnqY1GL2mkimu',
    ),
    registrars: {
      token1: new PublicKey('Fwi5pie2VgWTDUSRNkca1HdFCke5r3v3mY83JbxtC3CJ'),
      token2: new PublicKey('9kCGBWgHzGGChvmAsmu5jrXwEShZfLxKRTmKdxEpFUBr'),
    },
    mints: {
      token1: new PublicKey('2aE1pietadYMeDtdqKayS4SVo9W4xtC3U7SN4iGWCVcX'),
      token2: new PublicKey('Cgan7PWyBH6Z7JNA6f9kDYgwBMZBxRexpdd29PJgnqah'),
    },
  },
};
