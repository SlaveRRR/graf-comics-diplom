import { fixtureData } from '../support/fixtureData';
import { mockAuthenticatedShell } from '../support/mockApi';

describe('Notifications page', () => {
  it('renders notifications and allows marking one as read', () => {
    mockAuthenticatedShell();

    cy.visitApp('/notifications', { authenticated: true });
    cy.wait(['@getCurrentUser', '@getAccount', '@getNotifications']);

    fixtureData('notifications.json').then((notifications) => {
      cy.contains('Уведомления').should('be.visible');
      cy.contains(notifications.items[0].message).should('be.visible');
    });

    cy.contains('Отметить прочитанным').first().click();
    cy.wait('@markNotificationsRead');
  });
});
