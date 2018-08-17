import {ApiError} from '../types/api_result';

export function replaceErrors(errors: ApiError[], codeMap?: Map<string, string>, fieldsNames?: Map<string, string>): string[] {
  const ret = [];
  if (!fieldsNames) {
    fieldsNames = new Map<string, string>();
  }
  if (!codeMap) {
    codeMap = new Map<string, string>();
  }


  for (const err of errors) {
    const apiErr = err as ApiError;
    const fieldName = fieldsNames.has(err.key) ? fieldsNames.get(err.key) : err.key;

    for (const msg of apiErr.messages) {
      ret.push(setFieldName(getMessage(msg, codeMap), fieldName));
    }
  }
}

function setFieldName(translatedMessage: string, fieldName: string) {
  if (translatedMessage.indexOf('{key}') !== -1) {
    return translatedMessage.replace('{key}', fieldName);
  } else if (fieldName.length > 0) {
    return fieldName + ' : ' + translatedMessage;
  } else {
    return translatedMessage;
  }
}

export enum ErrorCodes {
  DATABASE = 'error.db_error',
  UNKNOWN = 'error.exception',
  AUTH_MISSING = 'error.no_auth_token',
  PERMS_MISSING = 'error.no_permissions',
  NOT_FOUND = 'error.not_found',

  /*
  Specific errors
   */
  INSERT_FAILED = 'error.insert_failed',

  /**
   * The order was already accepted
   */
  ALREADY_ACCEPTED = 'error.already_accepted',

  /**
   * The order doesn't contain any item
   */
  NO_REQUESTED_ITEM = 'error.no_requested_item',

  /**
   * At least one item in the order is out of stock
   */
  OUT_OF_STOCK = 'error.item_out_of_stock',

  /**
   * An item in the order doesn't exist in the database
   */
  MISSING_ITEM = 'error.missing_item',

  /**
   * The product is not allowed by this scanner
   */
  PRODUCT_NOT_ALLOWED = 'error.product_not_allowed',

  /**
   * The scanner doesn't accept order tickets
   */
  PRODUCTS_ONLY = 'error.product_only_configuration',

  /**
   * The provided barcode has already been scanned
   */
  ALREADY_SCANNED = 'error.ticket_already_scanned',

  /**
   * The user can't login because it has not confirmed its email
   */
  EMAIL_NOT_CONFIRMED = 'error.email_not_confirmed',

  /**
   * This email is already used on the site
   */
  USER_EXISTS = 'error.user_exists',

  POLYBANKING = 'error.polybanking'

}

const basicCodes = new Map<string, string>([
  [ ErrorCodes.DATABASE, 'Une erreur de base de données s\'est produite.' ],
  [ ErrorCodes.UNKNOWN, 'Une erreur inconnue s\'est produite.' ],
  [ ErrorCodes.AUTH_MISSING, 'Cette fonctionnalité nécessite d\'être connecté.' ],
  [ ErrorCodes.PERMS_MISSING, 'Vous n\'avez pas les permissions requises pour faire cela.' ],
  ['error.required', 'Ce champ est requis.'],
  ['error.email', 'Le format de l\'email est incorrect.'],
  ['error.minLength', 'Trop court !'],
  ['error.maxLength', 'Trop long !'],
]);


function getMessage(errorCode: string, errorMap: Map<string, string>) {
  if (errorCode.startsWith(ErrorCodes.POLYBANKING)) {
    return 'Une erreur s\'est produite au niveau de notre prestataire de paiements. Merci de réessayer plus tard.';
  } else {
    if (errorMap.has(errorCode)) {
      return errorMap.get(errorCode);
    } else if (basicCodes.has(errorCode)) {
      return basicCodes.get(errorCode);
    } else {
      return errorCode;
    }
  }
}
