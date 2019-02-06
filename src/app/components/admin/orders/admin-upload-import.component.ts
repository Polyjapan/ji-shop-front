import {Component, OnInit} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {Item} from '../../../types/items';
import {ErrorCodes, replaceErrorsInResponse} from '../../../constants/errors';
import {ImportedItemData} from '../../../types/order';

@Component({
  selector: 'app-admin-import',
  templateUrl: './admin-upload-import.component.html'
})
export class AdminUploadImportComponent implements OnInit {
  private id: number;
  items: Item[];

  errors = null;
  componentState = ComponentState.IDLE;
  ComponentState = ComponentState;

  // User process input data
  clientCategories: ClientCategory[];
  processingOrders: ProcessingOrder[];

  // API result
  log: string;

  constructor(private backend: BackendService, private route: ActivatedRoute, private auth: AuthService) {
  }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.parent.paramMap.get('event'));
    this.backend.getProducts(this.id).subscribe(items => {
      this.items = items;
    });
  }

  private parseClientCategory(arr: string[]): ClientCategory {
    return {'name': arr[0], 'id': Number.parseInt(arr[1], 10)};
  }


  submit(field: HTMLInputElement) {
    const reader = new FileReader();
    this.componentState = ComponentState.PRE_PROCESS;
    const me = this;

    reader.readAsText(field.files[0]);
    console.log(reader.result);
    reader.onload = function () {
      console.log(reader.result);

      const lines = (reader.result as string).split('\n');

      // Extract client categories
      const clientCategories: ClientCategory[] = [];
      const categoriesMap: Map<number, ClientCategory> = new Map<number, ClientCategory>();
      const orders: ProcessingOrder[] = [];
      const composition: OrderLineComposition = {
        barcodeLocation: -1,
        categoryLocation: -1,
        priceLocation: -1,
        dateLocation: -1,
        refundLocation: -1
      };
      let state = 0;

      for (const l of lines) {
        const arr = l.split(';');

        switch (state) {
          case 0: // Nothing found yet
            if (l.startsWith('Categorie Client')) {
              state = 1;
              const cat = me.parseClientCategory([arr[1], arr[2]]);
              clientCategories.push(cat);
              categoriesMap.set(cat.id, cat);
            }
            break;
          case 1: // Finding products
            if (l.startsWith(';')) {
              const cat = me.parseClientCategory([arr[1], arr[2]]);
              clientCategories.push(cat);
              categoriesMap.set(cat.id, cat);
            } else {
              state = 2; // finished finding products
            }
            break;
          case 2: // Finished finding products
            if (l.startsWith('Mouvement')) {
              state = 3;
            }
            break;
          case 3:
            let i = 0;
            for (const key of arr) {
              const low = key.toLowerCase();
              if (low.indexOf('date mouvement') !== -1) {
                composition.dateLocation = i;
              } else if (low.indexOf('cat') !== -1 && low.indexOf('client') !== -1) {
                composition.categoryLocation = i;
              } else if (low.indexOf('prix de vente') !== -1) {
                composition.priceLocation = i;
              } else if (low.indexOf('code barre') !== -1) {
                composition.barcodeLocation = i;
              } else if (low.indexOf('remboursement') !== -1) {
                composition.refundLocation = i;
              }

              i++;
            }

            // Check good:
            if (composition.dateLocation > -1 && composition.categoryLocation > -1
              && composition.priceLocation > -1 && composition.barcodeLocation > -1
              && composition.refundLocation > -1) {
              state = 4; // it is good
            }

            console.log(composition);

            break;
          case 4:
            if (arr.length < 5) {
              continue;
            }

            const order: ProcessingOrder = {
              barcode: arr[composition.barcodeLocation],
              clientCategory: categoriesMap.get(Number.parseInt(arr[composition.categoryLocation])),
              paidPrice: Number.parseInt(arr[composition.priceLocation]),
              date: arr[composition.dateLocation],
              refunded: (arr[composition.refundLocation].toLowerCase() !== 'v')
            };

            orders.push(order);
        }
      }

      // Done.
      // Interpret last state as success or error
      let error;
      switch (state) {
        case 0:
          error = 'Aucune catégorie client trouvée.';
          break;
        case 1:
          error = 'Le fichier ne contient que des catégories (wut ?)';
          break;
        case 2:
          error = 'Aucun mouvement trouvé (mot clé Mouvement non présent)';
          break;
        case 3:
          error = 'Aucune première ligne de mouvement valide, impossible d\'interpréter le reste des données.';
          break;
      }

      // Present the data to the user
      if (error) {
        me.errors = [error];
      } else {
        me.processingOrders = orders;
        me.clientCategories = clientCategories;
      }

      me.componentState = ComponentState.USER_PROCESS;
    };
  }

  reset() {
    this.errors = null;
    this.clientCategories = undefined;
    this.processingOrders = undefined;
    this.log = undefined;
    this.componentState = ComponentState.IDLE;
  }

  finishSubmission() {
    this.componentState = ComponentState.SERVER_PROCESS;
    const itemsToAdd: ImportedItemData[] = [];

    for (const item of this.processingOrders) {
      if (!item.clientCategory.matchedCategory) {
        alert('Certaines catégories de prix n\'ont pas été associées à des items.');
        this.componentState = ComponentState.USER_PROCESS;
        return;
      }

      itemsToAdd.push({
        product: Number.parseInt(item.clientCategory.matchedCategory),
        barcode: item.barcode,
        paidPrice: item.paidPrice,
        date: item.date,
        refunded: item.refunded
      });
    }

    this.backend.importTickets(this.id, itemsToAdd).subscribe(success => {
      this.componentState = ComponentState.DONE_SUCCESS;
      this.log = success;
    }, err => {
      this.componentState = ComponentState.DONE_FAILED;
      this.errors = replaceErrorsInResponse(err, new Map<string, string>([
        [ErrorCodes.MISSING_FIELDS, 'Certains champs sont manquants dans le fichier CSV.'],
        [ErrorCodes.DATABASE, 'Erreur de base de données. Certains billets sont peut être dupliqués.']
      ]));
    });
  }
}

class ClientCategory {
  id: number;
  name: string;
  matchedCategory?: string;
}

class ProcessingOrder {
  barcode: string;
  clientCategory: ClientCategory;
  paidPrice: number;
  date: string;
  refunded: boolean;
}

class OrderLineComposition {
  barcodeLocation: number;
  categoryLocation: number;
  priceLocation: number;
  dateLocation: number;
  refundLocation: number;
}

enum ComponentState {
  IDLE, PRE_PROCESS, USER_PROCESS, SERVER_PROCESS, DONE_FAILED, DONE_SUCCESS
}
