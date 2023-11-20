import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { QueryModule } from './query/query.module';
import { CommentModule } from './comment/comment.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HomepageComponent } from './homepage/homepage.component';
import { BrowseComponent } from './browse/browse.component';

@NgModule({
  declarations: [		
    AppComponent,
      HomepageComponent,
      BrowseComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    QueryModule,
    CommentModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
