# ERC721 deploy Project and minter script for nft.storage

This project demonstrates a basic Hardhat use case for ERC721 deploy. 

### How do I get set up? ###

You can use an Alchemy free key. This example use Rinkeby and local. You can choose what configuration fix your needs

* Backend's set up

    1. npm install
    2. .env API_KEY and PRIVATE_KEY
    3. npm run deploy  (default network rinkeby)

* Minter script set up

Idea behind this scripts is test upload files to nft.storage, generate metadata for NFT compatible with OpenSea. The script have some functions commented for diference case, you can play with them

    1. cd minter
    2. npm install
    3. env API_KEY and PRIVATE_KEY
    4. npm run start
