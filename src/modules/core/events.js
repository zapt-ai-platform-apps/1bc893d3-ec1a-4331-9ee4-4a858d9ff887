export class EventBus {
  subscribers = {};

  subscribe(event, callback) {
    if (!this.subscribers[event]) this.subscribers[event] = [];
    this.subscribers[event].push(callback);
    return () => this.unsubscribe(event, callback);
  }

  publish(event, data) {
    if (!this.subscribers[event]) return;
    this.subscribers[event].forEach(callback => callback(data));
  }

  unsubscribe(event, callback) {
    if (!this.subscribers[event]) return;
    this.subscribers[event] = this.subscribers[event]
      .filter(cb => cb !== callback);
  }
}

export const eventBus = new EventBus();

export const events = {
  USER_SIGNED_IN: 'auth/userSignedIn',
  USER_SIGNED_OUT: 'auth/userSignedOut',
  USER_PROFILE_UPDATED: 'users/profileUpdated',
  REGISTRATION_COMPLETED: 'auth/registrationCompleted',
  HAIRDRESSER_APPROVED: 'hairdresser/approved',
  APPOINTMENT_CREATED: 'appointments/created',
  APPOINTMENT_UPDATED: 'appointments/updated',
  PAYMENT_COMPLETED: 'payments/completed'
};