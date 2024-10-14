import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-nft-marketplace',
  templateUrl: './nft-marketplace.component.html',
  styleUrls: ['./nft-marketplace.component.css']
})
export class NFTMarketplaceComponent implements OnInit {
  nfts: any[] = [];

  constructor(
    private blockchainService: BlockchainService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadNFTs();
  }

  async loadNFTs() {
    try {
      const products = await this.productService.getProducts().toPromise();
      this.nfts = await Promise.all(products.map(async (product) => {
        try {
          const nftData = await this.blockchainService.createNFT(product._id).toPromise();
          return { ...product, tokenId: nftData.tokenId };
        } catch (error) {
          console.error(`Error creating NFT for product ${product._id}:`, error);
          return null;
        }
      }));
      this.nfts = this.nfts.filter(nft => nft !== null);
    } catch (error) {
      console.error('Error loading NFTs:', error);
    }
  }

  async buyNFT(nft: any) {
    try {
      // Aquí deberías obtener la dirección del comprador de alguna manera
      const buyerAddress = 'BUYER_ADDRESS'; // Reemplazar con la dirección real del comprador
      await this.blockchainService.transferNFT(nft.tokenId, buyerAddress).toPromise();
      console.log('NFT purchased successfully');
      // Actualizar la lista de NFTs después de la compra
      this.loadNFTs();
    } catch (error) {
      console.error('Error buying NFT:', error);
    }
  }
}