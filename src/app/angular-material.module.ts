import { NgModule} from '@angular/core';
import { MatInputModule} from '@angular/material/input';
import { MatCardModule} from '@angular/material/card';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule} from '@angular/material/button';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatDialogModule} from '@angular/material/dialog';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@NgModule({

  exports: [
    MatInputModule,
     MatButtonModule,
     MatCardModule,
     MatPaginatorModule,
     MatToolbarModule,
     MatExpansionModule,
     MatDialogModule,
     MatProgressSpinnerModule,
  ]
})

export class AngularMaterialModule {}
