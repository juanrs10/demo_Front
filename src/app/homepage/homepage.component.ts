import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueryService } from '../query/query.service';
import { UserDataService } from '../user/userData.service';
import { User } from '../user/user';
import { Query } from '../query/query';
import { UserService } from '../user/user.service';
import { Observable, of } from 'rxjs';
import * as anime from 'animejs';


@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  queryContent: string = "";
  isQueryPrivate: boolean = false;
  user: User | null = null; 
  queryResults: any[] = [];
  errorMessage: string = "";
  selectedDatasource: string = '';
  userQueries: Observable<Query[]> = of([]);

  // AMMEND TOKES

  address: string = "";
  symbol: string = "";
  assetName: string = "";
  decimals: number = 0;

  //BALANCE 

  balanceRange: string = "";

  //BLOCKS

  dateRange: string = "";
  specificHash: string = "";
  miner: string = "";
  totalDifficulty: string = "";

  //CONTRACTS

  specificAddress: string = '';
  typeOfToken: string = '';
  blockHash: string = '';

  //LOGS

  logIndex: string = '';
  transactionHash: string = '';
  transactionIndex: string = '';
  logAddress: string = '';

  constructor(
    private router: Router, 
    private userDataService: UserDataService, 
    private queryService: QueryService,
    private userService: UserService
  ) { }

  executeQuery() {
    // Crear un objeto Query con los datos actuales
    const query = new Query(this.queryContent, this.isQueryPrivate, this.user);
    // Llamar al servicio para ejecutar el query
    this.queryService.executeQuery(query).subscribe(
      response => {
        this.queryResults = response.rows
        // Manejar la respuesta del servidor
        console.log(response);
      },
      error => {
        // Manejar posibles errores
        console.log(error);
        this.errorMessage = error.error.apierror.message;
      }
    );
  }

  saveQuery() {
    // Crear un objeto Query con los datos actuales
    const query = new Query(this.queryContent, this.isQueryPrivate, this.user);
    // Comprobar si el id del usuario es un número antes de pasarlo al servicio
    const userId = typeof query.user?.id === 'number' ? query.user?.id : undefined;
    // Llamar al servicio para guardar el query
    this.queryService.createQuery(userId, query).subscribe(
      response => {
        // Manejar la respuesta del servidor
        console.log(response);
      },
      error => {
        // Manejar posibles errores
        console.error(error);
        this.errorMessage = error;
      }
    );
  }

  goBrowse(){
    this.router.navigate(["/browse"]);
  }

  onDatasourceChange(value: string) {
    this.selectedDatasource = value;
    console.log(this.selectedDatasource)
  }

  loadUserQueries(currentUser: User){

    this.userQueries = this.userService.getQueriesOfUser(currentUser);
  }

  buildQuery(){
    let whereClauses = [];
    switch(this.selectedDatasource) {
      case 'amendedTokens':
        if (this.address.trim()) {
          whereClauses.push(`address = '${this.address}'`);
        }
        if (this.symbol.trim()) {
          whereClauses.push(`symbol = '${this.symbol}'`);
        }
        if (this.assetName.trim()) {
          whereClauses.push(`assetName = '${this.assetName}'`);
        }
        if (this.decimals) { // Assuming 0 is not a valid input, otherwise check for null or undefined
          whereClauses.push(`decimals = ${this.decimals}`);
        }
    
        this.queryContent = 'SELECT * FROM bigquery-public-data.crypto_ethereum.amended_tokens';
        if (whereClauses.length > 0) {
          this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
        }

        console.log(this.queryContent);

        break;
      case 'balances':
        if (this.address.trim()){
          whereClauses.push(`address = '${this.address}'`)
        }

        if (this.balanceRange){
          whereClauses.push(`eth_balance = ${this.balanceRange}`)
        }

        this.queryContent = 'SELECT * FROM bigquery-public-data.crypto_ethereum.balances';
        if (whereClauses.length > 0) {
          this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
        }

        console.log(this.queryContent);

        break;

      case 'blocks':
          if (this.dateRange.trim()) {
            whereClauses.push(`date_range = '${this.dateRange}'`);
          }
          if (this.specificHash.trim()) {
            whereClauses.push(`hash = '${this.specificHash}'`);
          }
          if (this.miner.trim()) {
            whereClauses.push(`miner = '${this.miner}'`);
          }
          if (this.totalDifficulty.trim()) {
            whereClauses.push(`total_difficulty = '${this.totalDifficulty}'`);
          }

          this.queryContent = 'SELECT * FROM bigquery-public-data.crypto_ethereum.blocks';
          if (whereClauses.length > 0) {
            this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
          }

          console.log(this.queryContent);
          break;

      case "contracts":
        if (this.specificAddress.trim()) {
          whereClauses.push(`address = '${this.specificAddress}'`);
        }
        if (this.typeOfToken.trim()) {
          whereClauses.push(`token_type = '${this.typeOfToken}'`);
        }
        if (this.blockHash.trim()) {
          whereClauses.push(`block_hash = '${this.blockHash}'`);
        }
        this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.contracts`;
        if (whereClauses.length > 0) {
          this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
        }
        console.log(this.queryContent);
        break;

      case "logs":
        if (this.logIndex.trim()) {
          whereClauses.push(`log_index = '${this.logIndex}'`);
        }
        if (this.transactionHash.trim()) {
          whereClauses.push(`transaction_hash = '${this.transactionHash}'`);
        }
        if (this.transactionIndex.trim()) {
          whereClauses.push(`transaction_index = '${this.transactionIndex}'`);
        }
        if (this.logAddress.trim()) {
          whereClauses.push(`address = '${this.logAddress}'`);
        }
        this.queryContent = `SELECT * FROM Logs`;
        if (whereClauses.length > 0) {
          this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
        }
        console.log(this.queryContent);
        break;
    }
  

  }

  ngOnInit() {
    this.user = this.userDataService.getCurrentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }

    else {
      this.loadUserQueries(this.user);
    }

  }
}
