import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueryService } from '../query/query.service';
import { UserDataService } from '../user/userData.service';
import { User } from '../user/user';
import { Query } from '../query/query';
import { UserService } from '../user/user.service';
import { Observable, of, BehaviorSubject, map, switchMap, forkJoin, catchError } from 'rxjs';
import * as anime from 'animejs';
import { Comment } from '../comment/comment';
import { CommentService } from '../comment/comment.service';


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
  starterComment: boolean = false;
  commentContent: string = "";
  queryTempId: number = 0;
  queryComments: Observable<Comment[]> = of([]);
  queryTemp: Query = new Query("",false,null);

  //OBSERVABLES queryDetail y comments
  private queryDetailSubject = new BehaviorSubject<any>(null);
  queryDetail$: Observable<any> = this.queryDetailSubject.asObservable();
  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$: Observable<Comment[]> = this.commentsSubject.asObservable();
  editMode: boolean = false;

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

  //METADATA

  chain: string = "";
  load_all_partitions: boolean = false;
  byDate: string = "";
  runid: string = "";  // Añadido tipo 'string'

  // SESSIONS
  id: string = "";  // Añadido tipo 'string'
  startTrace: string = "";
  startBlock: number = 0;  // Añadido valor inicial '0'
  startBlockTimestamp: string = "";
  walletAddress: string = "";
  contractAddress: string = "";

  // TOKEN TRANSFERS
  token_address: string = "";
  from_address: string = "";
  to_address: string = "";
  value: string = "";
  transaction_hash: string = "";
  log_index: number = 0;  // Añadido valor inicial '0'
  block_timestamp: string = "";  // Tipo TIMESTAMP usualmente manejado como 'string' en JS
  block_number: number = 0;  // Añadido valor inicial '0'
  block_hash: string = "";

  // TOKENS
  //address: string = "";
  // symbol: string = "";
  name: string = "";
  // decimals: string = "";  // Cambiado a 'string', aunque podría requerir un casting posterior
  total_supply: string = "";
  // block_timestamp: string = "";  // Tipo TIMESTAMP usualmente manejado como 'string' en JS
  // block_number: number = 0;  // Añadido valor inicial '0'
  // block_hash: string = "";

  // TRACES 
  // transaction_hash: string = "";
  transaction_index: number = 0;  // Añadido valor inicial '0'
  // from_address: string = "";
  // to_address: string = "";

    // TRANSACTIONS
  // to_address: string = "";
  // value: string = "";  // 'NUMERIC' generalmente se maneja como 'string'
  gas: number = 0;  // 'INTEGER', inicializado a 0
  gas_price: number = 0;  // 'INTEGER', inicializado a 0
  input: string = "";
  receipt_cumulative_gas_used: number = 0;  // 'INTEGER', inicializado a 0
  receipt_gas_used: number = 0;  // 'INTEGER', inicializado a 0
  receipt_contract_address: string = "";
  receipt_root: string = "";
  receipt_status: number = 0;  // 'INTEGER', inicializado a 0
  // block_timestamp: string = "";  // 'TIMESTAMP' usualmente manejado como 'string'
  // block_number: number = 0;  // 'INTEGER', inicializado a 0
  // block_hash: string = "";
  max_fee_per_gas: number = 0;  // 'INTEGER', inicializado a 0
  max_priority_fee_per_gas: number = 0;  // 'INTEGER', inicializado a 0
  transaction_type: number = 0;  // 'INTEGER', inicializado a 0
  receipt_effective_gas_price: number = 0;  // 'INTEGER', inicializado a 0

  constructor(
    private router: Router, 
    private userDataService: UserDataService, 
    private queryService: QueryService,
    private userService: UserService,
    private commentService: CommentService
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
    query.id = this.queryTempId;
    // Comprobar si el id del usuario es un número antes de pasarlo al servicio
    const userId = typeof query.user?.id === 'number' ? query.user?.id : undefined;
    // Llamar al servicio para guardar el query
    this.queryService.createQuery(userId, query).subscribe(
      response => {
        // Manejar la respuesta del servidor
        console.log(response);
        // Asignar el id del query después de recibir la respuesta
        query.id = response.id;
        
        // AUTHORS COMMENT
        if (this.starterComment) {
          console.log("AT LEAST WE GOT HERE");
          console.log(query);
          const comment = new Comment(this.commentContent, null, null);
          this.commentService.createComment(this.user as User, query, comment).subscribe(
            commentResponse => {
              console.log(commentResponse);
            },
            commentError => {
              console.error(commentError);
              this.errorMessage = commentError;
            }
          );
        }
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

  goLogin(){
    this.router.navigate(["/login"])
  }

  onDatasourceChange(value: string) {
    this.selectedDatasource = value;
    console.log(this.selectedDatasource)
  }

  loadUserQueries(currentUser: User) {
    this.userQueries = this.userService.getQueriesOfUser(currentUser).pipe(
      switchMap(queries => {
        return forkJoin(queries.map(query => 
          this.queryService.getQueryDetail(query).pipe(
            catchError(() => of({ ...query, comments: [] })), // En caso de error, devuelve el query con comentarios vacíos
            map(queryDetail => ({ ...query, comments: queryDetail.comments || [] }))
          )
        ));
      })
    );
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
        else{
          this.queryContent += " LIMIT 10";
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
        else{
          this.queryContent += " LIMIT 10";
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
          else{
            this.queryContent += " LIMIT 10";
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
        else{
          this.queryContent += " LIMIT 10";
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
        this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.logs`;
        if (whereClauses.length > 0) {
          this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
        }
        else{
          this.queryContent += " LIMIT 10";
        }
        console.log(this.queryContent);
        break;
      
      case "metadata":
      if (this.chain.trim()) {
        whereClauses.push(`chain = '${this.chain}'`);
      }
      if (this.load_all_partitions) { // boolean value
        whereClauses.push(`load_all_partitions = ${this.load_all_partitions}`);
      }
      if (this.byDate.trim()) {
        whereClauses.push(`byDate = '${this.byDate}'`);
      }
      if (this.runid.trim()) {
        whereClauses.push(`runid = '${this.runid}'`);
      }
      this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.load_metadata`;
      if (whereClauses.length > 0) {
        this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
      }
      else{
        this.queryContent += " LIMIT 10";
      }
      console.log(this.queryContent);
      break;

    case "sessions":
      if (this.id.trim()) {
        whereClauses.push(`id = '${this.id}'`);
      }
      if (this.startTrace.trim()) {
        whereClauses.push(`startTrace = '${this.startTrace}'`);
      }
      if (this.startBlock) { // Assuming 0 is not a valid input
        whereClauses.push(`startBlock = ${this.startBlock}`);
      }
      if (this.startBlockTimestamp.trim()) {
        whereClauses.push(`startBlockTimestamp = '${this.startBlockTimestamp}'`);
      }
      if (this.walletAddress.trim()) {
        whereClauses.push(`walletAddress = '${this.walletAddress}'`);
      }
      if (this.contractAddress.trim()) {
        whereClauses.push(`contractAddress = '${this.contractAddress}'`);
      }
      this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.sessions`;
      if (whereClauses.length > 0) {
        this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
      }
      else{
        this.queryContent += " LIMIT 10";
      }
      console.log(this.queryContent);
      break;

    case "tokenTransfers":
      if (this.token_address.trim()) {
        whereClauses.push(`token_address = '${this.token_address}'`);
      }
      if (this.from_address.trim()) {
        whereClauses.push(`from_address = '${this.from_address}'`);
      }
      if (this.to_address.trim()) {
        whereClauses.push(`to_address = '${this.to_address}'`);
      }
      if (this.value.trim()) {
        whereClauses.push(`value = '${this.value}'`);
      }
      // ... other token transfer fields ...
      this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.token_transfers`;
      if (whereClauses.length > 0) {
        this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
      }
      else{
        this.queryContent += " LIMIT 10";
      }
      console.log(this.queryContent);
      break;

    case "tokens":
      if (this.name.trim()) {
        whereClauses.push(`name = '${this.name}'`);
      }
      if (this.total_supply.trim()) {
        whereClauses.push(`total_supply = '${this.total_supply}'`);
      }
      // ... other token fields ...
      this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.tokens`;
      if (whereClauses.length > 0) {
        this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
      }
      else{
        this.queryContent += " LIMIT 10";
      }
      console.log(this.queryContent);
      break;

      case "traces":
      if (this.transaction_index) { // Assuming 0 is not a valid input
        whereClauses.push(`transaction_index = ${this.transaction_index}`);
      }
      if (this.from_address.trim()) {
        whereClauses.push(`from_address = '${this.from_address}'`);
      }
      if (this.to_address.trim()) {
        whereClauses.push(`to_address = '${this.to_address}'`);
      }
      // ... other traces fields ...
      this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.traces`;
      if (whereClauses.length > 0) {
        this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
      }
      else{
        this.queryContent += " LIMIT 10";
      }
      console.log(this.queryContent);
      break;

    case "transactions":
      if (this.gas) { // Assuming 0 is not a valid input
        whereClauses.push(`gas = ${this.gas}`);
      }
      if (this.gas_price) { // Assuming 0 is not a valid input
        whereClauses.push(`gas_price = ${this.gas_price}`);
      }
      if (this.input.trim()) {
        whereClauses.push(`input = '${this.input}'`);
      }
      if (this.receipt_cumulative_gas_used) {
        whereClauses.push(`receipt_cumulative_gas_used = ${this.receipt_cumulative_gas_used}`);
      }
      if (this.receipt_gas_used) {
        whereClauses.push(`receipt_gas_used = ${this.receipt_gas_used}`);
      }
      if (this.receipt_contract_address.trim()) {
        whereClauses.push(`receipt_contract_address = '${this.receipt_contract_address}'`);
      }
      if (this.receipt_root.trim()) {
        whereClauses.push(`receipt_root = '${this.receipt_root}'`);
      }
      if (this.receipt_status) {
        whereClauses.push(`receipt_status = ${this.receipt_status}`);
      }
      if (this.max_fee_per_gas) {
        whereClauses.push(`max_fee_per_gas = ${this.max_fee_per_gas}`);
      }
      if (this.max_priority_fee_per_gas) {
        whereClauses.push(`max_priority_fee_per_gas = ${this.max_priority_fee_per_gas}`);
      }
      if (this.transaction_type) {
        whereClauses.push(`transaction_type = ${this.transaction_type}`);
      }
      if (this.receipt_effective_gas_price) {
        whereClauses.push(`receipt_effective_gas_price = ${this.receipt_effective_gas_price}`);
      }
      // ... other transactions fields ...
      this.queryContent = `SELECT * FROM bigquery-public-data.crypto_ethereum.transactions`;
      if (whereClauses.length > 0) {
        this.queryContent += ' WHERE ' + whereClauses.join(' AND ') + " LIMIT 10";
      }
      else{
        this.queryContent += " LIMIT 10";
      }
      console.log(this.queryContent);
      break;
    }
  

  }

  editQuery(query: Query){
    this.editMode = true;
    this.queryContent = query.content;
    this.queryTemp = query;
    

  }

  updateQuery(){
    this.queryTemp.content = this.queryContent;
    this.queryTemp.state = this.isQueryPrivate;
    this.queryService.updateQuery(this.queryTemp).subscribe(
      response => {
        console.log("QUERY UPDATED",response)
      },
      error => {
        console.log(error)
      }
    );
    // AUTHORS COMMENT
    if (this.starterComment) {
      console.log("AT LEAST WE GOT HERE");
      const comment = new Comment(this.commentContent, null, null);
      this.commentService.createComment(this.user as User, this.queryTemp, comment).subscribe(
        commentResponse => {
          console.log(commentResponse);
          this.loadUserQueries(this.user as User);

        },
        commentError => {
          console.error(commentError);
          this.errorMessage = commentError;
        }
      );
    }
    this.editMode = false;
  }

  navigateToSection(sectionId: string){
    document.getElementById(sectionId)?.scrollIntoView();
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
