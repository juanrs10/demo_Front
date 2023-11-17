import { Component, OnInit, Query } from '@angular/core';
import { QueryService } from '../query.service';

@Component({
  selector: 'app-query-list',
  templateUrl: './query-list.component.html',
  styleUrls: ['./query-list.component.css']
})
export class QueryListComponent implements OnInit {

  queries: Array<Query> = [];

  constructor(private queryService: QueryService) { }

  getQueries(): void {
    this.queryService.getQueries().subscribe((queries) => {
      this.queries = queries;
    });
  }

  ngOnInit() {

    this.getQueries();
  }

}
