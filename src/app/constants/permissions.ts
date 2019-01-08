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
  SEE_INVISIBLE_ITEMS = 'admin.see_invisible_items',

  /**
   * Permission to export all tickets for an events to a FNAC-compatible list
   */
  EXPORT_TICKETS = 'admin.export_tickets',

  /**
   * Permission to access the admin area
   */
  ADMIN_ACCESS = 'admin.access_dashboard',

  /**
   * Permission to modify POS configurations
   */
  ADMIN_POS_MANAGE = 'admin.change_pos_configurations',

  /**
   * Permission to modify scanning configurations
   */
  ADMIN_SCAN_MANAGE = 'admin.change_scanning_configurations',

  /**
   * Permission to remove an order
   */
  ADMIN_REMOVE_ORDER = 'admin.remove_order',

  /**
   * Permission to manage the events
   */
  ADMIN_EVENT_MANAGE = 'admin.event_manage',

  /**
   * Permission to manage the products
   */
  ADMIN_PRODUCTS_MANAGE = 'admin.products_manage',

  /**
   * Access the intranet data
   */
  INTRANET_VIEW = 'intranet.staff.view',

  /**
   * Post a new task to the intranet
   */
  INTRANET_TASK_POST = 'intranet.staff.post_task',

  /**
   * Accept tasks in the intranet
   */
  INTRANET_TASK_ACCEPT = 'intranet.admin.accept_task',

  /**
   * Assign tasks to self
   */
  INTRANET_TASK_TAKE = 'intranet.staff.self_assign',


  /**
   * Unassign tasks to self
   */
  INTRANET_TASK_LEAVE = 'intranet.staff.self_unassign',

  /**
   * Assign or unassign tasks to other
   */
  INTRANET_TASK_GIVE = 'intranet.admin.assign_other',

  /**
   * Change the state of a task
   */
  INTRANET_TASK_CHANGE_STATE = 'intranet.admin.change_task_state',

  /**
   * Edit a tasks created by someone else
   */
  INTRANET_TASK_EDIT = 'intranet.admin.task_edit',

  /**
   * Permission to sell tickets in advance on a polyjapan controlled sales point
   */
  SELL_IN_ADVANCE = 'admin.sell_in_advance',
}
