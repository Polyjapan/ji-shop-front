/**
 * @author Louis Vialar
 */
export enum Permissions {
  /**
   * Force an order to be validated
   */
  FORCE_VALIDATION = 'admin.force_validation',

  /**
   * Permission to sell tickets using a cashdesk (with order type ON_SITE)
   */
  SELL_ON_SITE = 'staff.sell_on_site',

  /**
   * Permission to import tickets from an external source (with order type RESELLER)
   */
  IMPORT_EXTERNAL = 'admin.import_external',

  /**
   * Permission to generate free orders (gifts)
   */
  GIVE_FOR_FREE = 'admin.give_for_free',

  /**
   * Permission to see all the types of orders
   */
  SEE_ALL_ORDER_TYPES = 'admin.see_all_order_types',

  /**
   * Permission to view an order that belongs to an other user
   */
  VIEW_OTHER_ORDER = 'admin.view_other_order',

  /**
   * Permission to download a ticket that belongs to an other user
   */
  VIEW_OTHER_TICKET = 'admin.view_other_ticket',

  /**
   * Permission to scan a ticket
   */
  SCAN_TICKET = 'staff.scan_ticket',

  /**
   * Permission to see items that are marked as not visible
   */
  SEE_INVISIBLE_ITEMS = 'admin.see_invisible_items'
}