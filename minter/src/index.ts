import 'dotenv/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as mime from 'mime';
import {NFTStorage, File} from 'nft.storage';
import * as ethers from 'ethers';
import { TokenInput } from 'nft.storage/dist/src/token';
import { v4 as uuidv4 } from 'uuid';
import { createReadStream } from 'fs';
import { CarReader } from '@ipld/car';

const client = new NFTStorage({token: process.env.NFT_STORAGE_KEY!});

const BoltTokenABI = [
  'constructor()',
  'event Approval(address indexed,address indexed,uint256 indexed)',
  'event ApprovalForAll(address indexed,address indexed,bool)',
  'event OwnershipTransferred(address indexed,address indexed)',
  'event Transfer(address indexed,address indexed,uint256 indexed)',
  'function approve(address,uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function getApproved(uint256) view returns (address)',
  'function isApprovedForAll(address,address) view returns (bool)',
  'function name() view returns (string)',
  'function owner() view returns (address)',
  'function ownerOf(uint256) view returns (address)',
  'function renounceOwnership()',
  'function safeMint(address,string)',
  'function safeTransferFrom(address,address,uint256)',
  'function safeTransferFrom(address,address,uint256,bytes)',
  'function setApprovalForAll(address,bool)',
  'function supportsInterface(bytes4) view returns (bool)',
  'function symbol() view returns (string)',
  'function tokenByIndex(uint256) view returns (uint256)',
  'function tokenOfOwnerByIndex(address,uint256) view returns (uint256)',
  'function tokenURI(uint256) view returns (string)',
  'function totalSupply() view returns (uint256)',
  'function transferFrom(address,address,uint256)',
  'function transferOwnership(address)',
];

async function storeCarFile(filename: string) {
  const inStream = createReadStream(filename);
  const car = await CarReader.fromIterable(inStream);
  const cid = await client.storeCar(car);
  console.log('Stored CAR file! CID:', cid);
}

async function fileStreamFromPath(filePath: string) {
  const content = await fs.readFile(filePath);
  const type = mime.getType(filePath)!;
  console.log(type);
  return new File([content], path.basename(filePath), {type});
}

async function uploadFilewithMetadata(filename: string) {
  const filenamePath = path.join(__dirname, `../assets/${filename}`);
  const stream = await fileStreamFromPath(filenamePath);

  const metadataImage = await client.store({
    image: stream,
    name: `image - ${uuidv4()}`,
    description: `description test image - ${uuidv4()}`,
  });

  console.log(metadataImage);
  // `https://${metadataImage['ipnft']}.ipfs.nftstorage.link/`

  // Token {
  //  ipnft: 'bafyreidbvssizt7wlp7yvsswecac55agjno2udgymlowmeklaowfx2u74e',
  //   url: 'ipfs://bafyreidbvssizt7wlp7yvsswecac55agjno2udgymlowmeklaowfx2u74e/metadata.json'
  //   };

  // const meta: TokenInput = {
  //   description:
  //     'Friendly OpenSea Creature that enjoys long swims in the ocean.',
  //   external_url: 'https://myweb.com',
  //   image:
  //     'https://storage.googleapis.com/opensea-prod.appspot.com/puffs/3.png',
  //   name: 'Dave Starbelly',
  //   attributes: [
  //     {
  //       trait_type: 'Base',
  //       value: 'Starfish',
  //     },
  //     {
  //       trait_type: 'Eyes',
  //       value: 'Big',
  //     },
  //     {
  //       trait_type: 'Mouth',
  //       value: 'Surprised',
  //     },
  //     {
  //       trait_type: 'Level',
  //       value: 5,
  //     },
  //     {
  //       trait_type: 'Stamina',
  //       value: 1.4,
  //     },
  //     {
  //       trait_type: 'Personality',
  //       value: 'Sad',
  //     },
  //     {
  //       display_type: 'boost_number',
  //       trait_type: 'Aqua Power',
  //       value: 40,
  //     },
  //     {
  //       display_type: 'boost_percentage',
  //       trait_type: 'Stamina Increase',
  //       value: 10,
  //     },
  //     {
  //       display_type: 'number',
  //       trait_type: 'Generation',
  //       value: 2,
  //     },
  //   ],
  //   ...metadataImage,
  // };

  // const nftMetadata = await client.store(meta);
}

async function uploadFileNFTStorage(directoryPath: string) {
  const files = await fs.readdir(directoryPath);
  for (const i in files) {
    const filename = files[i];
    await uploadFilewithMetadata(filename);
  }
}

async function main() {
  const directoryPath = path.join(__dirname, '../assets');
  const provider = new ethers.providers.AlchemyProvider(
    'rinkeby',
    process.env.API_KEY
  );

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  await storeCarFile('../assets/img1.png');

  //const metadata = await uploadFileNFTStorage(directoryPath);
  // console.log(metadata);
  // console.log('test');
  // const BoltContract = new ethers.Contract(
  //   '0xC1dac64aAd929B523107c81F54fE6863e4Dc9192',
  //   BoltTokenABI,
  //   provider
  // );

  // const name = await BoltContract.name();
  // const symbol = await BoltContract.symbol();

  // console.log(`${symbol} (${name})`);
}
main().catch(err => console.error(err));
// TODO: more examples
